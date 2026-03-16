"use client";

import AppShell from "@/components/AppShell";
import { api } from "@/app/services/api";
import { BriefcaseBusiness, CheckCircle2, Mail, MapPin, PencilLine } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type ProfileForm = {
  id: number | null;
  name: string;
  email: string;
  headline: string;
  bio: string;
  location: string;
};

const defaultProfile: ProfileForm = {
  id: null,
  name: "João Moura",
  email: "joao@todozao.app",
  headline: "Responsável pela experiência de perfil e identidade visual da plataforma.",
  bio: "Atuo na camada de apresentação do usuário, alinhando layout, informações pessoais e consistência visual com o fluxo de autenticação.",
  location: "Garanhuns, PE",
};

const profileStorageKey = "todozao-profile";

type RemoteProfileResponse = {
  id: number;
  name: string;
  email: string;
  login?: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

export default function PerfilPage() {
  const [form, setForm] = useState<ProfileForm>(() => {
    if (typeof window === "undefined") {
      return defaultProfile;
    }

    const saved = window.localStorage.getItem(profileStorageKey);
    if (!saved) {
      return defaultProfile;
    }

    try {
      const parsed = JSON.parse(saved) as Partial<ProfileForm>;
      return { ...defaultProfile, ...parsed };
    } catch {
      return defaultProfile;
    }
  });
  const [message, setMessage] = useState("Atualize seus dados pessoais para manter seu perfil sempre completo.");
  const [saveState, setSaveState] = useState<"idle" | "saving">("idle");

  useEffect(() => {
    const syncFromApi = async () => {
      try {
        const response = await api("/users/me/profile", { method: "GET" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as RemoteProfileResponse;
        setForm((current) => {
          const next = {
            ...current,
            id: data.id,
            name: data.name,
            email: data.email,
            headline: data.headline || current.headline,
            bio: data.bio || current.bio,
            location: data.location || current.location,
          };
          window.localStorage.setItem(profileStorageKey, JSON.stringify(next));
          return next;
        });
        setMessage("Seus dados foram carregados com sucesso.");
      } catch {
        setMessage("Não foi possível sincronizar agora. Você ainda pode editar seu perfil normalmente.");
      }
    };

    void syncFromApi();
  }, []);

  const initials = useMemo(() => getInitials(form.name), [form.name]);
  const completionItems = [form.name, form.email, form.location, form.headline, form.bio];
  const completionPercentage = Math.round(
    (completionItems.filter((value) => value && value.trim().length > 0).length / completionItems.length) * 100,
  );
  const profileSummary = [
    form.headline ? `Apresentação: ${form.headline}` : "Adicione uma apresentação curta para destacar seu perfil.",
    form.location ? `Localização informada: ${form.location}` : "Informe sua localização para completar o perfil.",
    form.bio
      ? `Bio preenchida com ${form.bio.trim().length} caracteres.`
      : "Escreva uma bio curta contando um pouco sobre você.",
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveState("saving");
    window.localStorage.setItem(profileStorageKey, JSON.stringify(form));

    try {
      const response = await api("/users/me/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          headline: form.headline,
          bio: form.bio,
          location: form.location,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as RemoteProfileResponse;
        const next = {
          ...form,
          id: data.id,
          name: data.name,
          email: data.email,
          headline: data.headline || form.headline,
          bio: data.bio || form.bio,
          location: data.location || form.location,
        };
        setForm(next);
        window.localStorage.setItem(profileStorageKey, JSON.stringify(next));
        setMessage("Seu perfil foi atualizado com sucesso.");
      } else {
        setMessage("Suas alterações foram salvas neste navegador, mas não puderam ser sincronizadas agora.");
      }
    } catch {
      setMessage("Suas alterações foram salvas neste navegador. Tente sincronizar novamente em instantes.");
    }

    window.dispatchEvent(new Event("profile-updated"));
    setSaveState("idle");
  };

  return (
    <AppShell
      title="Meu perfil"
      subtitle="Centralize sua apresentação, ajuste dados pessoais e mantenha o cabeçalho sincronizado com essas informações."
      sectionLabel="Conta"
      currentPageLabel="Perfil"
      notificationItems={[
        "Confira seus dados pessoais sempre que precisar.",
        "Mantenha sua apresentação atualizada para facilitar sua identificação.",
        "Uma headline curta ajuda a resumir melhor o seu perfil.",
      ]}
    >
      <div className="profile-grid profile-dashboard-grid">
        <div className="profile-sidebar-stack">
          <section className="surface-panel profile-card emphasis-card">
            <div className="profile-hero-row">
              <span className="avatar large">{initials}</span>
              <div>
                <p className="eyebrow profile-eyebrow">Identidade do usuário</p>
                <h2 className="section-title">{form.name}</h2>
                <p className="panel-subtitle">{form.headline}</p>
              </div>
            </div>

            <div className="profile-badge-row">
              <span className="profile-badge">{form.id ? `Perfil #${form.id}` : "Perfil ativo"}</span>
              <span className="profile-badge muted">Atualizado por você</span>
            </div>

            <div className="profile-highlight">
              <div className="subtle-list-item">
                <Mail size={16} /> {form.email}
              </div>
              <div className="subtle-list-item" style={{ marginTop: 10 }}>
                <MapPin size={16} /> {form.location}
              </div>
            </div>

            <div className="profile-bio-block">
              <p className="eyebrow profile-eyebrow">Sobre você</p>
              <p className="profile-bio-text">{form.bio}</p>
            </div>
          </section>

          <section className="surface-panel profile-mini-panel">
            <div className="panel-header compact-header">
              <h3 className="panel-title">Resumo do perfil</h3>
            </div>

            <div className="subtle-list">
              <div className="subtle-list-item">
                <CheckCircle2 size={16} /> {completionPercentage >= 100 ? "Seu perfil está completo." : `Seu perfil está ${completionPercentage}% preenchido.`}
              </div>
              <div className="subtle-list-item">
                <BriefcaseBusiness size={16} /> {profileSummary[0]}
              </div>
              <div className="subtle-list-item">
                <MapPin size={16} /> {profileSummary[1]}
              </div>
              <div className="subtle-list-item">
                <PencilLine size={16} /> {profileSummary[2]}
              </div>
            </div>
          </section>
        </div>

        <section className="surface-panel profile-form-panel">
          <div className="panel-header profile-form-header">
            <div>
              <p className="eyebrow form-eyebrow">Configurações do perfil</p>
              <h2 className="section-title">Editar perfil</h2>
              <p className="panel-subtitle">{message}</p>
            </div>
          </div>

          <form className="profile-form section-spacer" onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              <label className="label">
                Nome
                <input
                  className="input"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
              </label>

              <label className="label">
                E-mail
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </label>

              <label className="label">
                Localização
                <input
                  className="input"
                  value={form.location}
                  onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                />
              </label>

              <label className="label">
                Apresentação
                <input
                  className="input"
                  value={form.headline}
                  onChange={(event) => setForm((current) => ({ ...current, headline: event.target.value }))}
                />
              </label>
            </div>

            <label className="label">
              Sobre você
              <textarea
                className="textarea"
                value={form.bio}
                onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
              />
            </label>

            <div className="profile-actions">
              <div className="profile-status-chip">Perfil preenchido em {completionPercentage}%</div>
              <button type="submit" className="primary-button">
                {saveState === "saving" ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </AppShell>
  );
}