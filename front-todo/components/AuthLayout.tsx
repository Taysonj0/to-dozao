// components/AuthLayout.tsx
import React from "react";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  activeItem?: "login" | "register" | "terms"; // para destacar o item correto no menu
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, activeItem = "login" }) => {
  const router = useRouter();

  const menuItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "tasks", icon: "✓", label: "My Tasks" },
    { id: "projects", icon: "📁", label: "Projects" },
    { id: "calendar", icon: "📅", label: "Calendar" },
  ];

  // Mapeia activeItem para o índice do menu que deve ficar ativo
  const getActiveIndex = () => {
    switch (activeItem) {
      case "login": return 0; // Dashboard ativo
      case "register": return 1; // My Tasks ativo
      case "terms": return 2; // Projects ativo
      default: return 0;
    }
  };

  const activeIndex = getActiveIndex();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#e8edf4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "1100px",
          minHeight: "680px",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 25px 70px rgba(0,0,0,0.18)",
        }}
      >
        {/* Coluna esquerda fixa */}
        <div
          style={{
            width: "360px",
            flexShrink: 0,
            backgroundColor: "#1e3a5f",
            padding: "56px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <div>
            {/* Logo */}
            <div 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "14px", 
                marginBottom: "48px",
                cursor: "pointer",
              }}
              onClick={() => router.push("/")}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                }}
              >
                🏠
              </div>
              <span style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.3px" }}>
                Todo-zão
              </span>
            </div>

            {/* Menu items */}
            {menuItems.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  marginBottom: "6px",
                  backgroundColor: i === activeIndex ? "rgba(255,255,255,0.15)" : "transparent",
                  opacity: i === activeIndex ? 1 : 0.45,
                  fontSize: "16px",
                  fontWeight: i === activeIndex ? 600 : 400,
                  cursor: "default",
                  userSelect: "none",
                }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>

          {/* Stats decorativos */}
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <p style={{ fontSize: "12px", opacity: 0.6, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Resumo do Dia
            </p>
            {[
              { label: "Tarefas pendentes", value: "5" },
              { label: "Concluídas", value: "12" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", opacity: 0.75 }}>{s.label}</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "#5b9bd5" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna direita - conteúdo variável */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            padding: "48px 48px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            maxHeight: "680px",
          }}
        >
          {children}
        </div>
      </div>

      {/* Rodapé fixo */}
      <p
        style={{
          position: "fixed",
          bottom: "20px",
          fontSize: "12px",
          color: "#8a9ab5",
          textAlign: "center",
        }}
      >
        © 2024 Todo-zão. Todos os direitos reservados.
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AuthLayout;