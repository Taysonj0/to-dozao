"use client";

type TaskTreeItem = {
  id: number;
  title: string;
  taskStatus: string;
  children?: TaskTreeItem[];
};

type Props = {
  task: TaskTreeItem;
};

function getStatusLabel(status: string) {
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

export default function TaskTreeNode({ task }: Props) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "14px 16px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: "16px" }}>{task.title}</div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
              ID: {task.id}
            </div>
          </div>

          <span
            style={{
              fontSize: "12px",
              padding: "6px 10px",
              borderRadius: "999px",
              background: "#f3f4f6",
              color: "#374151",
              whiteSpace: "nowrap",
            }}
          >
            {getStatusLabel(task.taskStatus)}
          </span>
        </div>

        {task.children && task.children.length > 0 && (
          <div style={{ marginTop: "14px" }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Desbloqueia:
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              {task.children.map((child) => (
                <div
                  key={child.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "10px 12px",
                    background: "#f9fafb",
                    marginLeft: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{child.title}</span>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      {getStatusLabel(child.taskStatus)}
                    </span>
                  </div>

                  {child.children && child.children.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <TaskTreeNode task={child} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}