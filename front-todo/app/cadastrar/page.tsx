"use client";

import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaCheck,
  FaUser,
  FaUserTag,
} from "react-icons/fa";
import { api } from "../../app/services/api";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import AuthLayout from "@/components/AuthLayout";

interface RegisterFormData {
  name: string;
  email: string;
  login: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    login: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "As senhas não coincidem",
        timer: 3000,
      });
      return false;
    }
    if (formData.password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "A senha deve ter pelo menos 8 caracteres",
        timer: 3000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        login: formData.login,
        password: formData.password,
        role: formData.role,
      };

      const response = await api("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Erro ao cadastrar");
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Cadastro realizado com sucesso!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error) {
      console.error("Erro no cadastro:", error);
      Swal.fire({
        icon: "error",
        title: "Erro ao cadastrar",
        text: error instanceof Error ? error.message : "Tente novamente mais tarde",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout activeItem="register">
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "13px", color: "#5b9bd5", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Comece agora
        </p>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1e3a5f", margin: 0, lineHeight: 1.2 }}>
          Criar nova conta
        </h1>
        <p style={{ fontSize: "14px", color: "#8a9ab5", marginTop: "8px" }}>
          Preencha os dados abaixo para se cadastrar
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Nome completo */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d5270", marginBottom: "6px" }}>
            Nome Completo
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
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Digite seu nome completo"
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

        {/* E-mail */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d5270", marginBottom: "6px" }}>
            E-mail
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
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Digite seu e-mail"
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

        {/* Nome de usuário */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d5270", marginBottom: "6px" }}>
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
              <FaUserTag />
            </div>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleInputChange}
              placeholder="Escolha um nome de usuário"
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

        {/* Senha e Confirmar senha lado a lado */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d5270", marginBottom: "6px" }}>
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
                placeholder="Mínimo 8 caracteres"
                required
                disabled={isLoading}
                minLength={8}
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

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#3d5270", marginBottom: "6px" }}>
              Confirmar Senha
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
                <FaCheck />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirme sua senha"
                required
                disabled={isLoading}
                minLength={8}
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
        </div>

        {/* Termos */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
          <input
            type="checkbox"
            id="terms"
            required
            style={{ accentColor: "#1e3a5f", width: "16px", height: "16px", cursor: "pointer" }}
          />
          <label htmlFor="terms" style={{ fontSize: "13px", color: "#6b7f99", cursor: "pointer" }}>
            Aceito os{" "}
            <a href="/termos" style={{ color: "#1e3a5f", fontWeight: 600, textDecoration: "none" }}>
              Termos de Uso
            </a>
          </label>
        </div>

        {/* Botão cadastrar */}
        <button
          type="submit"
          disabled={isLoading || !formData.name || !formData.email || !formData.login || !formData.password || !formData.confirmPassword}
          style={{
            width: "100%",
            backgroundColor: isLoading || !formData.name || !formData.email || !formData.login || !formData.password || !formData.confirmPassword ? "#8a9ab5" : "#1e3a5f",
            color: "white",
            fontWeight: 600,
            fontSize: "15px",
            padding: "13px",
            borderRadius: "8px",
            border: "none",
            cursor: isLoading || !formData.name || !formData.email || !formData.login || !formData.password || !formData.confirmPassword ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
            marginTop: "8px",
          }}
          onMouseEnter={(e) => {
            if (!isLoading && formData.name && formData.email && formData.login && formData.password && formData.confirmPassword) {
              (e.target as HTMLButtonElement).style.backgroundColor = "#2a4d7f";
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading && formData.name && formData.email && formData.login && formData.password && formData.confirmPassword) {
              (e.target as HTMLButtonElement).style.backgroundColor = "#1e3a5f";
            }
          }}
        >
          {isLoading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <svg
                style={{ animation: "spin 1s linear infinite", width: "18px", height: "18px" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Cadastrando...
            </span>
          ) : (
            "Criar conta"
          )}
        </button>
      </form>

      {/* Link para login */}
      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid #eef1f6", textAlign: "center" }}>
        <p style={{ fontSize: "13px", color: "#8a9ab5", marginBottom: "10px" }}>
          Já possui uma conta?
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
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
          Fazer login
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;