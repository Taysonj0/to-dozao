"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/app/services/api";
import DependencyFlowNode, {
  type DependencyFlowNodeType,
} from "@/components/DependencyFlowNode";
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type TaskStatusCode =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "OVERDUE";

type RemoteTask = {
  id?: number;
  title?: string | null;
  name?: string | null;
  taskStatus?: string | null;
  status?: string | null;
};

type RemoteDependency = {
  id?: number;
  taskId?: number;
  dependsOnId?: number;
};

type TaskNode = {
  id: number;
  title: string;
  taskStatus: TaskStatusCode;
  dependencies: number[];
};

const nodeTypes: NodeTypes = {
  dependencyNode: DependencyFlowNode,
};

function normalizeStatus(status?: string | null): TaskStatusCode {
  const value = (status || "").trim().toUpperCase();

  if (
    value === "IN_PROGRESS" ||
    value === "EM_ANDAMENTO" ||
    value === "EM ANDAMENTO"
  ) {
    return "IN_PROGRESS";
  }

  if (
    value === "COMPLETED" ||
    value === "CONCLUIDA" ||
    value === "CONCLUÍDA"
  ) {
    return "COMPLETED";
  }

  if (value === "CANCELLED" || value === "CANCELADA") {
    return "CANCELLED";
  }

  if (value === "OVERDUE" || value === "ATRASADA") {
    return "OVERDUE";
  }

  return "PENDING";
}

function getStatusLabel(status: TaskStatusCode): string {
  switch (status) {
    case "IN_PROGRESS":
      return "Em andamento";
    case "COMPLETED":
      return "Concluída";
    case "CANCELLED":
      return "Cancelada";
    case "OVERDUE":
      return "Atrasada";
    default:
      return "Pendente";
  }
}

function normalizeTask(task: RemoteTask): TaskNode | null {
  if (typeof task.id !== "number") {
    return null;
  }

  return {
    id: task.id,
    title: task.title || task.name || `Task ${task.id}`,
    taskStatus: normalizeStatus(task.taskStatus || task.status),
    dependencies: [],
  };
}

function buildFlow(tasks: TaskNode[]): {
  nodes: DependencyFlowNodeType[];
  edges: Edge[];
} {
  const byId = new Map<number, TaskNode>();
  const dependentsMap = new Map<number, number[]>();

  tasks.forEach((task) => {
    byId.set(task.id, task);
    dependentsMap.set(task.id, []);
  });

  tasks.forEach((task) => {
    task.dependencies.forEach((dependsOnId) => {
      if (!dependentsMap.has(dependsOnId)) {
        dependentsMap.set(dependsOnId, []);
      }

      dependentsMap.get(dependsOnId)?.push(task.id);
    });
  });

  const levelCache = new Map<number, number>();

  function getLevel(taskId: number, visiting = new Set<number>()): number {
    if (levelCache.has(taskId)) {
      return levelCache.get(taskId)!;
    }

    if (visiting.has(taskId)) {
      return 0;
    }

    visiting.add(taskId);

    const task = byId.get(taskId);

    if (!task || task.dependencies.length === 0) {
      levelCache.set(taskId, 0);
      visiting.delete(taskId);
      return 0;
    }

    const level =
      Math.max(
        ...task.dependencies.map((dependencyId) =>
          getLevel(dependencyId, new Set(visiting)),
        ),
      ) + 1;

    levelCache.set(taskId, level);
    visiting.delete(taskId);
    return level;
  }

  const taskLevels = tasks.map((task) => ({
    task,
    level: getLevel(task.id),
  }));

  const columns = new Map<number, TaskNode[]>();

  taskLevels.forEach(({ task, level }) => {
    if (!columns.has(level)) {
      columns.set(level, []);
    }

    columns.get(level)!.push(task);
  });

  columns.forEach((columnTasks) => {
    columnTasks.sort((a, b) => {
      const dependentsDiff =
        (dependentsMap.get(b.id)?.length || 0) -
        (dependentsMap.get(a.id)?.length || 0);

      if (dependentsDiff !== 0) {
        return dependentsDiff;
      }

      return a.title.localeCompare(b.title, "pt-BR");
    });
  });

  const HORIZONTAL_GAP = 380;
  const VERTICAL_GAP = 170;

  const nodes: DependencyFlowNodeType[] = taskLevels.map(({ task, level }) => {
    const columnTasks = columns.get(level) || [];
    const rowIndex = columnTasks.findIndex((item) => item.id === task.id);

    const blockedByTasks = task.dependencies
      .map((dependencyId) => byId.get(dependencyId))
      .filter((dependencyTask): dependencyTask is TaskNode => !!dependencyTask)
      .filter((dependencyTask) => dependencyTask.taskStatus !== "COMPLETED");

    return {
      id: String(task.id),
      type: "dependencyNode",
      position: {
        x: level * HORIZONTAL_GAP,
        y: rowIndex * VERTICAL_GAP,
      },
      data: {
        title: task.title,
        statusLabel: getStatusLabel(task.taskStatus),
        blocked: blockedByTasks.length > 0,
        blockedByTitles: blockedByTasks.map(
          (dependencyTask) => dependencyTask.title,
        ),
      },
      draggable: false,
      selectable: true,
    };
  });

  const edges: Edge[] = tasks.flatMap((task) =>
    task.dependencies
      .filter((dependsOnId) => byId.has(dependsOnId))
      .map((dependsOnId) => ({
        id: `e-${dependsOnId}-${task.id}`,
        source: String(dependsOnId),
        target: String(task.id),
        sourceHandle: null,
        targetHandle: null,
        animated: false,
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#334155",
        },
        style: {
          stroke: "#334155",
          strokeWidth: 2.5,
        },
      })),
  );

  return { nodes, edges };
}

function ProjetosFlow() {
  const [tasks, setTasks] = useState<TaskNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasksAndDependencies = async () => {
      try {
        setLoading(true);
        setError(null);

        const tasksResponse = await api("/api/tasks", {
          method: "GET",
        });

        if (!tasksResponse.ok) {
          throw new Error("Falha ao carregar tasks.");
        }

        const tasksData = await tasksResponse.json();

        const rawTasks = Array.isArray(tasksData)
          ? tasksData
          : Array.isArray(tasksData?.content)
            ? tasksData.content
            : Array.isArray(tasksData?.data)
              ? tasksData.data
              : [];

        const normalizedTasks: TaskNode[] = rawTasks
          .map((task: RemoteTask) => normalizeTask(task))
          .filter((task: TaskNode | null): task is TaskNode => task !== null);

        const tasksWithDependencies: TaskNode[] = await Promise.all(
          normalizedTasks.map(async (task: TaskNode) => {
            try {
              const dependencyResponse = await api(
                `/api/task-dependencies/task/${task.id}`,
                {
                  method: "GET",
                },
              );

              if (!dependencyResponse.ok) {
                return task;
              }

              const rawDependencies =
                (await dependencyResponse.json()) as RemoteDependency[];

              return {
                ...task,
                dependencies: rawDependencies
                  .map((dependency) => dependency.dependsOnId)
                  .filter((value): value is number => typeof value === "number"),
              };
            } catch {
              return task;
            }
          }),
        );

        setTasks(tasksWithDependencies);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o grafo de dependências.");
      } finally {
        setLoading(false);
      }
    };

    void loadTasksAndDependencies();
  }, []);

  const { nodes, edges } = useMemo(() => buildFlow(tasks), [tasks]);

  return (
    <AppShell
      title="Projetos"
      subtitle="Dependências entre tasks, da esquerda para a direita"
      currentPageLabel="Projetos"
    >
      <div style={{ padding: 20 }}>
        {loading && <p>Carregando dependências...</p>}

        {!loading && error && (
          <p style={{ color: "#b91c1c", fontWeight: 600 }}>{error}</p>
        )}

        {!loading && !error && tasks.length === 0 && (
          <p>Nenhuma task encontrada.</p>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div
            style={{
              height: "72vh",
              minHeight: 520,
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.25 }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable
              proOptions={{ hideAttribution: true }}
              defaultEdgeOptions={{
                type: "smoothstep",
              }}
            >
              <Background gap={20} size={1} />
              <Controls />
            </ReactFlow>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function ProjetosPage() {
  return (
    <ReactFlowProvider>
      <ProjetosFlow />
    </ReactFlowProvider>
  );
}