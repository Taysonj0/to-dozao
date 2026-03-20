"use client";

import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";

export type DependencyNodeData = {
  title: string;
  statusLabel: string;
  blocked: boolean;
  blockedByTitles: string[];
};

export type DependencyFlowNodeType = Node<
  DependencyNodeData,
  "dependencyNode"
>;

export default function DependencyFlowNode({
  data,
}: NodeProps<DependencyFlowNodeType>) {
  return (
    <div
      style={{
        position: "relative",
        minWidth: 240,
        maxWidth: 280,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 14,
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
        overflow: "visible",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          left: -6,
          width: 12,
          height: 12,
          borderRadius: "999px",
          border: "2px solid #475569",
          background: "#ffffff",
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        style={{
          right: -6,
          width: 12,
          height: 12,
          borderRadius: "999px",
          border: "2px solid #475569",
          background: "#ffffff",
        }}
      />

      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: 8,
          lineHeight: 1.25,
        }}
      >
        {data.title}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            padding: "4px 10px",
            fontSize: 12,
            color: "#475569",
          }}
        >
          {data.statusLabel}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: 999,
            padding: "4px 10px",
            fontSize: 12,
            border: data.blocked
              ? "1px solid #fdba74"
              : "1px solid #86efac",
            background: data.blocked ? "#fff7ed" : "#f0fdf4",
            color: data.blocked ? "#b45309" : "#166534",
            fontWeight: 600,
          }}
        >
          {data.blocked ? "Bloqueada" : "Liberada"}
        </div>
      </div>

      {data.blocked && data.blockedByTitles.length > 0 && (
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "#92400e",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 8,
            padding: "8px 10px",
            lineHeight: 1.4,
          }}
        >
          Bloqueada por: {data.blockedByTitles.join(", ")}
        </div>
      )}
    </div>
  );
}