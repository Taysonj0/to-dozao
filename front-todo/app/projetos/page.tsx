"use client";

import { useEffect, useMemo, useState } from "react";
import dagre from "dagre";
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
  Position,
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

const NODE_WIDTH = 280;
const NODE_HEIGHT = 130;

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

function getEdgeColor(sourceTaskStatus: TaskStatusCode): string {
  if (sourceTaskStatus === "COMPLETED") {
    return "#16a34a";
  }

  if (sourceTaskStatus === "CANCELLED") {
    return "#94a3b8";
  }

  return "#ea580c";
}

function getEdgeDash(sourceTaskStatus: TaskStatusCode): string | undefined {
  if (sourceTaskStatus === "CANCELLED") {
    return "7 5";
  }

  if (sourceTaskStatus === "OVERDUE") {
    return "10 6";
  }

  return undefined;
}

function buildFlow(tasks: TaskNode[]): {
  nodes: DependencyFlowNodeType[];
  edges: Edge[];
} {
  const byId = new Map<number, TaskNode>();

  tasks.forEach((task) => {
    byId.set(task.id, task);
  });

  const baseNodes: DependencyFlowNodeType[] = tasks.map((task) => {
    const blockedByTasks = task.dependencies
      .map((dependencyId) => byId.get(dependencyId))
      .filter((dependencyTask): dependencyTask is TaskNode => !!dependencyTask)
      .filter((dependencyTask) => dependencyTask.taskStatus !== "COMPLETED");

    return {
      id: String(task.id),
      type: "dependencyNode",
      position: { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
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
      .map((dependsOnId) => {
        const sourceTask = byId.get(dependsOnId);
        const edgeColor = getEdgeColor(sourceTask?.taskStatus || "PENDING");
        const dash = getEdgeDash(sourceTask?.taskStatus || "PENDING");

        return {
          id: `e-${dependsOnId}-${task.id}`,
          source: String(dependsOnId),
          target: String(task.id),
          sourceHandle: null,
          targetHandle: null,
          animated: false,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 18,
            height: 18,
            color: edgeColor,
          },
          style: {
            stroke: edgeColor,
            strokeWidth: 2.5,
            strokeDasharray: dash,
          },
        };
      }),
  );

  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: "LR",
    ranksep: 170,
    nodesep: 80,
    marginx: 40,
    marginy: 40,
    acyclicer: "greedy",
    ranker: "network-simplex",
  });

  baseNodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes: DependencyFlowNodeType[] = baseNodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: dagreNode.x - NODE_WIDTH / 2,
        y: dagreNode.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
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
      subtitle="Dependências entre tasks em formato hierárquico"
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
          <>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                  color: "#334155",
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 3,
                    background: "#16a34a",
                    borderRadius: 999,
                    display: "inline-block",
                  }}
                />
                Dependência concluída
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                  color: "#334155",
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 3,
                    background: "#ea580c",
                    borderRadius: 999,
                    display: "inline-block",
                  }}
                />
                Dependência bloqueando
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                  color: "#334155",
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 3,
                    borderTop: "3px dashed #94a3b8",
                    display: "inline-block",
                  }}
                />
                Dependência cancelada
              </div>
            </div>

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
                fitViewOptions={{ padding: 0.2 }}
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
          </>
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