import React from "react";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  activeItem?: "login" | "register" | "terms";
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, activeItem = "login" }) => {
  const router = useRouter();
  const heroCopy = {
    login: {
      eyebrow: "Bem-vindo de volta!",
      title: "Entre para continuar sua jornada.",
      description: "Acesse sua conta para gerenciar suas tarefas, acompanhar seus projetos e manter sua rotina em dia. Tudo está exatamente como você deixou.",
    },
    register: {
      eyebrow: "Comece sua organização agora.",
      title: "Crie seu espaço personalizado.",
      description: "Cadastre-se para transformar sua produtividade. Tenha um painel exclusivo para suas tarefas reais, sem distrações e totalmente moldado ao seu jeito.",
    },
    terms: {
      eyebrow: "Informações legais",
      title: "Leia as condições antes de usar.",
      description: "Os termos ficam acessíveis nesta área pública, separados do ambiente autenticado do sistema.",
    },
  }[activeItem];

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
          </div>

          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "20px",
            }}
          >
            <p style={{ fontSize: "12px", opacity: 0.6, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.8px" }}>
              {heroCopy.eyebrow}
            </p>
            <h2 style={{ fontSize: "30px", lineHeight: 1.12, margin: "0 0 14px", maxWidth: "260px" }}>
              {heroCopy.title}
            </h2>
            <p style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.8, margin: 0, maxWidth: "270px" }}>
              {heroCopy.description}
            </p>
          </div>
        </div>

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