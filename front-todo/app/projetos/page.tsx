"use client";

import { useEffect, useState } from "react";

type TaskStatusCode =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "OVERDUE";
export type TaskItem = {
  id: number;
  title: string;
  description: string;
  taskStatus: TaskStatusCode;
  tagId: string | null;

  parentTaskId?: number | null;
  children?: TaskItem[];       

  syncStatus: "synced" | "pending" | "error";
  origin: "remote" | "local";
};

export function buildTaskTree(tasks: TaskItem[]): TaskItem[] {
  const map = new Map<number, TaskItem>();

  tasks.forEach(task => {
    map.set(task.id, { ...task, children: [] });
  });

  const roots: TaskItem[] = [];

  map.forEach(task => {
    if (task.parentTaskId) {
      const parent = map.get(task.parentTaskId);
      parent?.children?.push(task);
    } else {
      roots.push(task);
    }
  });

  return roots;
}
