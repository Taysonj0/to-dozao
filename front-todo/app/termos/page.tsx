// app/termos/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import AuthLayout from "@/components/AuthLayout";

const TermsPage: React.FC = () => {
  const router = useRouter();

  return (
    <AuthLayout activeItem="terms">
      {/* Cabeçalho com botão voltar */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #eef1f6" }}>
        <button
          onClick={() => router.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#1e3a5f",
            background: "none",
            border: "none",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            padding: "8px 12px",
            borderRadius: "6px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f4fa")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <FaArrowLeft size={14} />
          <span>Voltar</span>
        </button>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
          Termos de Uso
        </h1>
      </div>

      {/* Conteúdo dos Termos */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        <section>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e3a5f", marginBottom: "8px" }}>1. Introdução</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#4a5568" }}>
            Bem-vindo ao <strong>To-dozão</strong>! Esta é uma aplicação desenvolvida para ajudar no gerenciamento de tarefas diárias. 
            Ao utilizar nossa plataforma, você concorda com os termos e condições aqui estabelecidos.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e3a5f", marginBottom: "8px" }}>2. Objetivo da Aplicação</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#4a5568" }}>
            O <strong>To-dozão</strong> é uma ferramenta de produtividade que permite aos usuários criar, organizar e acompanhar suas tarefas diárias. 
            A aplicação oferece funcionalidades como criação de tarefas, definição de prazos, categorização e acompanhamento de progresso.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e3a5f", marginBottom: "8px" }}>3. Funcionalidades</h2>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px", fontSize: "14px", lineHeight: "1.6", color: "#4a5568" }}>
            <li>Criação de conta pessoal</li>
            <li>Login seguro com autenticação</li>
            <li>Criação e gerenciamento de tarefas</li>
            <li>Marcação de tarefas como concluídas</li>
            <li>Edição e exclusão de tarefas</li>
            <li>Categorização por projetos ou áreas</li>
            <li>Acompanhamento de progresso diário</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e3a5f", marginBottom: "8px" }}>4. Cadastro e Segurança</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#4a5568", marginBottom: "8px" }}>
            Para utilizar a aplicação, é necessário criar uma conta fornecendo:
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px", fontSize: "14px", lineHeight: "1.6", color: "#4a5568", marginBottom: "8px" }}>
            <li>Nome completo</li>
            <li>Endereço de e-mail válido</li>
            <li>Nome de usuário único</li>
            <li>Senha com mínimo de 8 caracteres</li>
          </ul>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#4a5568" }}>
            Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e3a5f", marginBottom: "8px" }}>5. Uso Aceitável</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#4a5568", marginBottom: "8px" }}>
            Ao utilizar o <strong>To-dozão</strong>, você concorda em:
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px", fontSize: "14px", lineHeight: "1.6", color: "#4a5568" }}>
            <li>Fornecer informações precisas e atualizadas</li>
            <li>Utilizar a aplicação apenas para fins legítimos</li>
            <li>Não compartilhar suas credenciais de acesso</li>
            <li>Não tentar acessar dados de outros usuários</li>
            <li>Não utilizar a plataforma para atividades maliciosas</li>
            <li>Respeitar os limites de uso do sistema</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e3a5f", marginBottom: "8px" }}>6. Privacidade e Dados</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#4a5568" }}>
            Seus dados pessoais são armazenados de forma segura e utilizados exclusivamente para o funcionamento da aplicação. 
            Não compartilhamos suas informações com terceiros. Para mais detalhes, consulte nossa Política de Privacidade.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e3a5f", marginBottom: "8px" }}>7. Responsabilidades</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#4a5568" }}>
            O <strong>To-dozão</strong> é fornecido como está, sem garantias de disponibilidade contínua ou ausência de erros. 
            Podemos realizar manutenções periódicas para melhorar a experiência do usuário. Não nos responsabilizamos por perda de dados 
            decorrente de uso inadequado da plataforma.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e3a5f", marginBottom: "8px" }}>8. Modificações dos Termos</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#4a5568" }}>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas 
            através da plataforma. O uso contínuo da aplicação após modificações constitui aceitação dos novos termos.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#1e3a5f", marginBottom: "8px" }}>9. Contato</h2>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#4a5568" }}>
            Em caso de dúvidas, sugestões ou problemas técnicos, entre em contato através do e-mail:{' '}
            <a 
              href="mailto:suporte@deverdecasa.com" 
              style={{ color: "#1e3a5f", fontWeight: 500, textDecoration: "underline" }}
            >
              suporte@deverdecasa.com
            </a>
          </p>
        </section>

        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #eef1f6", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#8a9ab5" }}>
            Versão 1.0 - Última atualização: Março de 2024
          </p>
          <p style={{ fontSize: "12px", color: "#8a9ab5", marginTop: "4px" }}>
            © 2024 To-dozão. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Botão de voltar */}
      <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => router.back()}
          style={{
            backgroundColor: "#1e3a5f",
            color: "white",
            fontWeight: 600,
            fontSize: "14px",
            padding: "12px 32px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2a4d7f")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e3a5f")}
        >
          Voltar para o cadastro
        </button>
      </div>
    </AuthLayout>
  );
};

export default TermsPage;