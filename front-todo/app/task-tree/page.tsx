"use client";

import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { api } from "@/app/services/api";
import TaskTreeNode from "@/components/TaskTreeNode";

type TaskNode = {
  id: number;
  title: string;
  taskStatus: string;
  dependencies: number[];
};

type TaskTreeItem = TaskNode & { children: TaskTreeItem[] };

export default function TasksTreePage() {
  const [tasks, setTasks] = useState<TaskNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api("/api/tasks");

        if (!res.ok) return;

        const data = await res.json();

        const mapped: TaskNode[] = data.map((t: any) => ({
          id: t.id,
          title: t.title,
          taskStatus: t.taskStatus,
          dependencies: t.dependencies?.map((d: any) => d.dependsOnTaskId) || [],
        }));

        setTasks(mapped);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  function buildTree(): TaskTreeItem[] {
    const map = new Map<number, TaskTreeItem>();

    // Cria todos os nós
    tasks.forEach((t) => map.set(t.id, { ...t, children: [] }));

    const roots: TaskTreeItem[] = [];

    map.forEach((task) => {
      if (task.dependencies.length === 0) {
        roots.push(task);
      } else {
        task.dependencies.forEach((depId) => {
          const parent = map.get(depId);
          if (parent) {
            parent.children.push(task);
          }
        });
      }
    });

    return roots;
  }

  if (loading) return <p>Carregando tasks...</p>;

  const tree = buildTree();

  return (
    <AppShell title="Task Tree" subtitle="Árvore de tarefas">
      <div>
        {tree.map((task) => (
          <TaskTreeNode key={task.id} task={task} />
        ))}
      </div>
    </AppShell>
  );
}