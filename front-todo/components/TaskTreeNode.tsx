"use client";

import { TaskItem } from "../app/projetos/page";

type TaskTreeItem = TaskItem & {
  children?: TaskTreeItem[];
};

type Props = {
  task: TaskTreeItem;
};

export default function TaskTreeNode({ task }: Props) {
  return (
    <div
      style={{
        marginLeft: "20px",
        borderLeft: "2px solid #e5e7eb",
        paddingLeft: "12px",
        marginTop: "10px",
      }}
    >
      <div
        style={{
          background: "#f9fafb",
          padding: "10px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <strong>{task.title}</strong>
        <span style={{ fontSize: "12px", opacity: 0.7 }}>
          {task.taskStatus}
        </span>
      </div>

      {task.children && task.children.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          {task.children.map(child => (
            <TaskTreeNode key={child.id} task={child} />
          ))}
        </div>
      )}
    </div>
  );
}