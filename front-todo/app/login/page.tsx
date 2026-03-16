"use client";

import React, { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { api } from "../../app/services/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import AuthLayout from "../../components/AuthLayout";

interface LoginFormData {
  login: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    login: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ login: formData.login, password: formData.password }),
      });

      if (!response.ok) {
        throw new Error("Falha na autenticacao");
      }

      const data = (await response.json()) as LoginResponse;

      if (!data.token) {
        throw new Error("Token nao retornado pelo servidor");
      }

      localStorage.setItem("token", data.token);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Login realizado com sucesso",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      router.push("/home");
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Erro ao fazer login" });
    }
    setIsLoading(false);
  };

  return (
    <AuthLayout activeItem="login">
      {/* Cabeçalho */}
      <div style={{ marginBottom: "36px" }}>
        <p style={{ fontSize: "13px", color: "#5b9bd5", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Bem-vindo de volta
        </p>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e3a5f", margin: 0, lineHeight: 1.2 }}>
          Acesse sua conta
        </h1>
        <p style={{ fontSize: "14px", color: "#8a9ab5", marginTop: "8px" }}>
          Organize suas tarefas de forma simples e eficiente
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Campo usuário */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d5270", marginBottom: "8px" }}>
            Nome de Usuário
          </label>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#8a9ab5",
                fontSize: "15px",
                pointerEvents: "none",
              }}
            >
              <FaUser />
            </div>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleInputChange}
              placeholder="Digite seu nome de usuário"
              required
              disabled={isLoading}
              style={{
                width: "100%",
                paddingLeft: "42px",
                paddingRight: "16px",
                paddingTop: "12px",
                paddingBottom: "12px",
                border: "1.5px solid #dce4ef",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#1e3a5f",
                backgroundColor: "#f7f9fc",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#5b9bd5";
                e.target.style.boxShadow = "0 0 0 3px rgba(91,155,213,0.12)";
                e.target.style.backgroundColor = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#dce4ef";
                e.target.style.boxShadow = "none";
                e.target.style.backgroundColor = "#f7f9fc";
              }}
            />
          </div>
        </div>

        {/* Campo senha */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d5270", marginBottom: "8px" }}>
            Senha
          </label>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#8a9ab5",
                fontSize: "15px",
                pointerEvents: "none",
              }}
            >
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Digite sua senha"
              required
              disabled={isLoading}
              style={{
                width: "100%",
                paddingLeft: "42px",
                paddingRight: "16px",
                paddingTop: "12px",
                paddingBottom: "12px",
                border: "1.5px solid #dce4ef",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#1e3a5f",
                backgroundColor: "#f7f9fc",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#5b9bd5";
                e.target.style.boxShadow = "0 0 0 3px rgba(91,155,213,0.12)";
                e.target.style.backgroundColor = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#dce4ef";
                e.target.style.boxShadow = "none";
                e.target.style.backgroundColor = "#f7f9fc";
              }}
            />
          </div>
        </div>

        {/* Lembrar-me */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
            style={{ accentColor: "#1e3a5f", width: "15px", height: "15px", cursor: "pointer" }}
          />
          <label htmlFor="rememberMe" style={{ fontSize: "13px", color: "#6b7f99", cursor: "pointer" }}>
            Lembrar-me
          </label>
        </div>

        {/* Botão entrar */}
        <button
          type="submit"
          disabled={isLoading || !formData.login || !formData.password}
          style={{
            width: "100%",
            backgroundColor: isLoading || !formData.login || !formData.password ? "#8a9ab5" : "#1e3a5f",
            color: "white",
            fontWeight: 600,
            fontSize: "15px",
            padding: "13px",
            borderRadius: "8px",
            border: "none",
            cursor: isLoading || !formData.login || !formData.password ? "not-allowed" : "pointer",
            transition: "background-color 0.2s, transform 0.1s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (!isLoading && formData.login && formData.password) {
              (e.target as HTMLButtonElement).style.backgroundColor = "#2a4d7f";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && formData.login && formData.password) {
              (e.target as HTMLButtonElement).style.backgroundColor = "#1e3a5f";
            }
          }}
        >
          {isLoading ? (
            <>
              <svg
                style={{ animation: "spin 1s linear infinite", width: "18px", height: "18px" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Entrando...
            </>
          ) : (
            "Entrar no Dashboard"
          )}
        </button>
      </form>

      {/* Divisor + criar conta */}
      <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid #eef1f6", textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "#8a9ab5", marginBottom: "12px" }}>
          Não tem uma conta?
        </p>
        <button
          type="button"
          onClick={() => router.push("/cadastrar")}
          disabled={isLoading}
          style={{
            padding: "10px 24px",
            border: "1.5px solid #1e3a5f",
            borderRadius: "8px",
            color: "#1e3a5f",
            backgroundColor: "transparent",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background-color 0.2s",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f0f4fa")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
        >
          Criar conta
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;