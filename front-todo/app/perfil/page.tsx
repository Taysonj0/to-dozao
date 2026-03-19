"use client";

import AppShell from "@/components/AppShell";
import {
  api,
  isInvalidAuthenticatedUserResponse,
  profileStorageKey,
  readApiErrorResponse,
  resolveApiUrl,
} from "@/app/services/api";
import { BriefcaseBusiness, Camera, CheckCircle2, LoaderCircle, Mail, MapPin, PencilLine } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type ProfileForm = {
  id: number | null;
  name: string;
  email: string;
  headline: string;
  bio: string;
  location: string;
  avatarUrl: string;
};

const defaultProfile: ProfileForm = {
  id: null,
  name: "",
  email: "",
  headline: "",
  bio: "",
  location: "",
  avatarUrl: "",
};

const MAX_BIO_LENGTH = 300;

type FeedbackTone = "neutral" | "success" | "error";

type FeedbackState = {
  text: string;
  tone: FeedbackTone;
  autoHide: boolean;
};

type RemoteProfileResponse = {
  id: number;
  name: string;
  email: string;
  login?: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("");
}

function getComparableProfile(form: ProfileForm) {
  return {
    name: form.name,
    email: form.email,
    headline: form.headline,
    bio: form.bio,
    location: form.location,
    avatarUrl: form.avatarUrl,
  };
}

function getTrimmedLength(value: string) {
  return value.trim().length;
}

export default function PerfilPage() {
  const [form, setForm] = useState<ProfileForm>(defaultProfile);
  const [initialForm, setInitialForm] = useState(() => getComparableProfile(defaultProfile));
  const [feedback, setFeedback] = useState<FeedbackState>({
    text: "Atualize seus dados pessoais para manter seu perfil sempre completo.",
    tone: "neutral",
    autoHide: false,
  });
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Omit<ProfileForm, "id">, string>>>({});
  const [avatarPreviewFailed, setAvatarPreviewFailed] = useState(false);
  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarUploadState, setAvatarUploadState] = useState<"idle" | "uploading" | "removing">("idle");

  const showFeedback = (text: string, tone: FeedbackTone = "neutral", autoHide = false) => {
    setFeedback({ text, tone, autoHide });
    setIsFeedbackVisible(true);
  };

  const applyProfileSnapshot = (data: RemoteProfileResponse) => {
    const next = {
      id: data.id,
      name: data.name,
      email: data.email,
      headline: data.headline || "",
      bio: data.bio || "",
      location: data.location || "",
      avatarUrl: data.avatarUrl || "",
    };

    setForm(next);
    setInitialForm(getComparableProfile(next));
    window.localStorage.setItem(profileStorageKey, JSON.stringify(next));

    return next;
  };

  useEffect(() => {
    if (!feedback.autoHide) {
      setIsFeedbackVisible(true);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsFeedbackVisible(false);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  useEffect(() => {
    if (saveState !== "saved") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSaveState("idle");
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [saveState]);

  useEffect(() => {
    const syncFromApi = async () => {
      try {
        const response = await api("/users/me/profile", { method: "GET" });

        if (!response.ok) {
          const errorPayload = await readApiErrorResponse(response);

          if (response.status === 401 || isInvalidAuthenticatedUserResponse(response.status, errorPayload)) {
            window.dispatchEvent(new Event("auth-expired"));
            return;
          }

          showFeedback(errorPayload?.message || "Nao foi possivel carregar seu perfil agora.", "error");
          return;
        }

        const data = (await response.json()) as RemoteProfileResponse;
        applyProfileSnapshot(data);
        showFeedback("Seus dados foram carregados com sucesso.", "success", true);
      } catch (error) {
        console.error("Falha ao carregar perfil.", error);
        showFeedback("Nao foi possivel sincronizar seu perfil agora.", "error");
      } finally {
        setLoading(false);
      }
    };

    void syncFromApi();
  }, []);

  const initials = useMemo(() => getInitials(form.name), [form.name]);
  const bioLength = useMemo(() => getTrimmedLength(form.bio), [form.bio]);
  const avatarPreviewUrl = useMemo(() => resolveApiUrl(form.avatarUrl), [form.avatarUrl]);
  const hasChanges = useMemo(() => {
    const currentForm = getComparableProfile(form);

    return Object.entries(currentForm).some(([key, value]) => value !== initialForm[key as keyof typeof initialForm]);
  }, [form, initialForm]);
  const completionItems = [form.name, form.email, form.location, form.headline, form.bio];
  const completionPercentage = Math.round(
    (completionItems.filter((value) => value && value.trim().length > 0).length / completionItems.length) * 100,
  );
  const profileSummary = [
    form.headline ? `Apresentação: ${form.headline}` : "Adicione uma apresentação curta para destacar seu perfil.",
    form.location ? `Localização informada: ${form.location}` : "Informe sua localização para completar o perfil.",
    form.bio
      ? `Bio preenchida com ${bioLength} caracteres.`
      : "Escreva uma bio curta contando um pouco sobre você.",
  ];

  useEffect(() => {
    setAvatarPreviewFailed(false);
  }, [avatarPreviewUrl]);

  useEffect(() => {
    if (!isAvatarEditorOpen) {
      setSelectedAvatarFile(null);
    }
  }, [isAvatarEditorOpen]);

  useEffect(() => {
    if (fieldErrors.avatarUrl) {
      setIsAvatarEditorOpen(true);
    }
  }, [fieldErrors.avatarUrl]);

  useEffect(() => {
    if (!isAvatarEditorOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAvatarEditorOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAvatarEditorOpen]);

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] || null;
    setSelectedAvatarFile(nextFile);

    if (fieldErrors.avatarUrl) {
      setFieldErrors((current) => ({ ...current, avatarUrl: undefined }));
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedAvatarFile) {
      setFieldErrors((current) => ({ ...current, avatarUrl: "Selecione uma imagem JPG, PNG ou WEBP." }));
      showFeedback("Selecione uma imagem antes de enviar.", "error");
      return;
    }

    setAvatarUploadState("uploading");

    try {
      const formData = new FormData();
      formData.append("file", selectedAvatarFile);

      const response = await api("/users/me/avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = (await response.json()) as RemoteProfileResponse;
        applyProfileSnapshot(data);
        setAvatarPreviewFailed(false);
        setIsAvatarEditorOpen(false);
        setSelectedAvatarFile(null);
        showFeedback("Sua foto de perfil foi atualizada com sucesso.", "success", true);
        window.dispatchEvent(new Event("profile-updated"));
        return;
      }

      const errorPayload = await readApiErrorResponse(response);

      if (response.status === 401 || isInvalidAuthenticatedUserResponse(response.status, errorPayload)) {
        window.dispatchEvent(new Event("auth-expired"));
        return;
      }

      setFieldErrors((current) => ({ ...current, avatarUrl: errorPayload?.message || "Nao foi possivel enviar a foto." }));
      showFeedback(errorPayload?.message || "Nao foi possivel enviar a foto agora.", "error");
    } catch (error) {
      console.error("Falha ao enviar foto de perfil.", error);
      setFieldErrors((current) => ({ ...current, avatarUrl: "Sem conexao com a API no momento." }));
      showFeedback("Sem conexao com a API no momento. A foto nao foi enviada.", "error");
    } finally {
      setAvatarUploadState("idle");
    }
  };

  const handleRemoveAvatar = async () => {
    if (!form.avatarUrl.trim()) {
      setIsAvatarEditorOpen(false);
      return;
    }

    setAvatarUploadState("removing");

    try {
      const response = await api("/users/me/avatar", { method: "DELETE" });

      if (response.ok) {
        const data = (await response.json()) as RemoteProfileResponse;
        applyProfileSnapshot(data);
        setAvatarPreviewFailed(false);
        setSelectedAvatarFile(null);
        setIsAvatarEditorOpen(false);
        showFeedback("Sua foto de perfil foi removida.", "success", true);
        window.dispatchEvent(new Event("profile-updated"));
        return;
      }

      const errorPayload = await readApiErrorResponse(response);

      if (response.status === 401 || isInvalidAuthenticatedUserResponse(response.status, errorPayload)) {
        window.dispatchEvent(new Event("auth-expired"));
        return;
      }

      setFieldErrors((current) => ({ ...current, avatarUrl: errorPayload?.message || "Nao foi possivel remover a foto." }));
      showFeedback(errorPayload?.message || "Nao foi possivel remover a foto agora.", "error");
    } catch (error) {
      console.error("Falha ao remover foto de perfil.", error);
      setFieldErrors((current) => ({ ...current, avatarUrl: "Sem conexao com a API no momento." }));
      showFeedback("Sem conexao com a API no momento. A foto nao foi removida.", "error");
    } finally {
      setAvatarUploadState("idle");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasChanges || saveState === "saving") {
      return;
    }

    setSaveState("saving");
    setFieldErrors({});

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
        applyProfileSnapshot(data);
        setSaveState("saved");
        showFeedback("Seu perfil foi atualizado com sucesso.", "success", true);
        window.dispatchEvent(new Event("profile-updated"));
      } else {
        const errorPayload = await readApiErrorResponse(response);

        if (response.status === 400) {
          const nextErrors = {
            ...(errorPayload?.errors as Partial<Record<keyof Omit<ProfileForm, "id">, string>> | undefined),
          };

          if (!nextErrors.email && errorPayload?.message && /email/i.test(errorPayload.message)) {
            nextErrors.email = errorPayload.message;
          }

          setFieldErrors(nextErrors);
          showFeedback(errorPayload?.message || "Revise os campos destacados e tente novamente.", "error");
        } else {
          showFeedback(errorPayload?.message || "Nao foi possivel atualizar seu perfil agora.", "error");
        }
      }
    } catch (error) {
      console.error("Falha ao atualizar perfil.", error);
      showFeedback("Sem conexao com a API no momento. Seu perfil nao foi atualizado.", "error");
    } finally {
      setSaveState((current) => (current === "saved" ? current : "idle"));
    }
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
              <button
                type="button"
                className="avatar avatar-editable large"
                aria-label="Editar foto do perfil"
                aria-expanded={isAvatarEditorOpen}
                aria-controls="profile-avatar-upload-editor"
                onClick={() => setIsAvatarEditorOpen((current) => !current)}
              >
                {avatarPreviewUrl && !avatarPreviewFailed ? (
                  <img
                    src={avatarPreviewUrl}
                    alt={`Foto de perfil de ${form.name || "usuário"}`}
                    className="avatar-image"
                    onError={() => setAvatarPreviewFailed(true)}
                  />
                ) : (
                  <span className="avatar-fallback">{initials}</span>
                )}
                <span className="profile-avatar-indicator">
                  <Camera size={14} />
                </span>
              </button>
              <div>
                <p className="eyebrow profile-eyebrow">Identidade do usuário</p>
                <h2 className="section-title">{form.name || "Usuário"}</h2>
                <p className="panel-subtitle">{form.headline || "Preencha sua apresentação para identificar melhor esta conta."}</p>
              </div>
            </div>

            <div className="profile-badge-row">
              <span className="profile-badge">{form.id ? `Perfil #${form.id}` : "Perfil ativo"}</span>
              <span className="profile-badge muted">Atualizado por você</span>
            </div>

            <div className="profile-highlight">
              <div className="subtle-list-item">
                <Mail size={16} /> {form.email || "Informe um e-mail para esta conta."}
              </div>
              <div className="subtle-list-item" style={{ marginTop: 10 }}>
                <MapPin size={16} /> {form.location || "Localização não informada."}
              </div>
            </div>

            <div className="profile-bio-block">
              <p className="eyebrow profile-eyebrow">Sobre você</p>
              <p className="profile-bio-text">{form.bio || "Adicione uma bio curta para descrever esta conta."}</p>
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
              <div className={`profile-feedback profile-feedback-${feedback.tone} ${isFeedbackVisible ? "is-visible" : "is-hidden"}`}>
                {feedback.tone === "success" ? <CheckCircle2 size={16} /> : null}
                <p className="panel-subtitle">{feedback.text}</p>
              </div>
            </div>
          </div>

          {loading ? <p className="panel-subtitle section-spacer">Carregando perfil...</p> : null}

          <form className="profile-form section-spacer" onSubmit={handleSubmit}>
            <div className="profile-form-grid">
              <label className="label">
                Nome
                <input
                  className={`input${fieldErrors.name ? " input-error" : ""}`}
                  disabled={loading || saveState === "saving"}
                  value={form.name}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, name: event.target.value }));
                    if (fieldErrors.name) {
                      setFieldErrors((current) => ({ ...current, name: undefined }));
                    }
                  }}
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name ? <span className="panel-subtitle form-error-text">{fieldErrors.name}</span> : null}
              </label>

              <label className="label">
                E-mail
                <input
                  className={`input${fieldErrors.email ? " input-error" : ""}`}
                  type="email"
                  disabled={loading || saveState === "saving"}
                  value={form.email}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, email: event.target.value }));
                    if (fieldErrors.email) {
                      setFieldErrors((current) => ({ ...current, email: undefined }));
                    }
                  }}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email ? <span className="panel-subtitle form-error-text">{fieldErrors.email}</span> : null}
              </label>

              <label className="label">
                Localização
                <input
                  className={`input${fieldErrors.location ? " input-error" : ""}`}
                  disabled={loading || saveState === "saving"}
                  value={form.location}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, location: event.target.value }));
                    if (fieldErrors.location) {
                      setFieldErrors((current) => ({ ...current, location: undefined }));
                    }
                  }}
                  aria-invalid={Boolean(fieldErrors.location)}
                />
                <div className="input-helper-row input-helper-row-compact">
                  {fieldErrors.location ? <span className="panel-subtitle form-error-text">{fieldErrors.location}</span> : <span />}
                </div>
              </label>

              <label className="label">
                Apresentação
                <input
                  className={`input${fieldErrors.headline ? " input-error" : ""}`}
                  disabled={loading || saveState === "saving"}
                  value={form.headline}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, headline: event.target.value }));
                    if (fieldErrors.headline) {
                      setFieldErrors((current) => ({ ...current, headline: undefined }));
                    }
                  }}
                  aria-invalid={Boolean(fieldErrors.headline)}
                />
                <div className="input-helper-row input-helper-row-compact">
                  {fieldErrors.headline ? <span className="panel-subtitle form-error-text">{fieldErrors.headline}</span> : <span />}
                </div>
              </label>
            </div>

            <label className="label">
              Sobre você
              <textarea
                className={`textarea${fieldErrors.bio ? " input-error" : ""}`}
                disabled={loading || saveState === "saving"}
                value={form.bio}
                maxLength={MAX_BIO_LENGTH}
                onChange={(event) => {
                  setForm((current) => ({ ...current, bio: event.target.value.slice(0, MAX_BIO_LENGTH) }));
                  if (fieldErrors.bio) {
                    setFieldErrors((current) => ({ ...current, bio: undefined }));
                  }
                }}
                aria-invalid={Boolean(fieldErrors.bio)}
              />
              <div className="input-helper-row">
                {fieldErrors.bio ? <span className="panel-subtitle form-error-text">{fieldErrors.bio}</span> : <span />}
                <span className="panel-subtitle profile-character-counter">{bioLength}/{MAX_BIO_LENGTH}</span>
              </div>
            </label>

            <div className="profile-actions">
              <div className="profile-status-chip">Perfil preenchido em {completionPercentage}%</div>
              <button
                type="submit"
                className={`primary-button profile-save-button${saveState === "saved" ? " is-saved" : ""}`}
                disabled={loading || saveState === "saving" || saveState === "saved" || !hasChanges}
                aria-busy={saveState === "saving" || saveState === "saved"}
              >
                {saveState === "saving" ? (
                  <>
                    <LoaderCircle size={16} className="button-spinner" /> Salvando...
                  </>
                ) : saveState === "saved" ? (
                  <>
                    <CheckCircle2 size={16} /> Salvo
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </button>
            </div>
          </form>
        </section>
      </div>

      {isAvatarEditorOpen ? (
        <div className="profile-avatar-modal-backdrop" onClick={() => setIsAvatarEditorOpen(false)}>
          <div
            id="profile-avatar-url-editor"
            className="profile-avatar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-avatar-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-header profile-avatar-modal-header">
              <div>
                <p className="eyebrow form-eyebrow">Foto do perfil</p>
                <h3 id="profile-avatar-modal-title" className="panel-title">Enviar nova foto</h3>
              </div>
            </div>

            <div id="profile-avatar-upload-editor" className="profile-avatar-upload-stack">
              <div className="profile-avatar-modal-preview">
                <span className="avatar large profile-avatar-modal-swatch">
                  {avatarPreviewUrl && !avatarPreviewFailed ? (
                    <img
                      src={avatarPreviewUrl}
                      alt={`Foto de perfil de ${form.name || "usuário"}`}
                      className="avatar-image"
                      onError={() => setAvatarPreviewFailed(true)}
                    />
                  ) : (
                    <span className="avatar-fallback">{initials}</span>
                  )}
                </span>
                <div>
                  <p className="panel-subtitle">Formatos aceitos: JPG, PNG e WEBP.</p>
                  <p className="panel-subtitle">Tamanho máximo: 2 MB.</p>
                </div>
              </div>

              <label className="label profile-avatar-url-label">
                Selecionar imagem
                <input
                  className={`input profile-avatar-file-input${fieldErrors.avatarUrl ? " input-error" : ""}`}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={loading || saveState === "saving" || avatarUploadState !== "idle"}
                  onChange={handleAvatarFileChange}
                  aria-invalid={Boolean(fieldErrors.avatarUrl)}
                />
              </label>

              <p className="panel-subtitle profile-avatar-file-meta">
                {selectedAvatarFile ? `Arquivo selecionado: ${selectedAvatarFile.name}` : form.avatarUrl ? "Foto atual carregada." : "Nenhuma foto selecionada."}
              </p>
            </div>

            <div className="input-helper-row profile-avatar-url-helper">
              {fieldErrors.avatarUrl ? (
                <span className="panel-subtitle form-error-text">{fieldErrors.avatarUrl}</span>
              ) : (
                <span className="panel-subtitle">A imagem será enviada ao servidor e vinculada automaticamente ao seu perfil.</span>
              )}
            </div>

            <div className="profile-avatar-modal-actions">
              <button
                type="button"
                className="danger-button profile-avatar-url-clear"
                onClick={handleRemoveAvatar}
                disabled={loading || saveState === "saving" || avatarUploadState !== "idle" || !form.avatarUrl.trim()}
              >
                {avatarUploadState === "removing" ? "Removendo..." : "Remover foto"}
              </button>
              <button
                type="button"
                className="primary-button profile-avatar-upload-button"
                onClick={handleAvatarUpload}
                disabled={loading || saveState === "saving" || avatarUploadState !== "idle" || !selectedAvatarFile}
              >
                {avatarUploadState === "uploading" ? "Enviando..." : "Enviar foto"}
              </button>
              <button
                type="button"
                className="ghost-button profile-avatar-url-close"
                onClick={() => setIsAvatarEditorOpen(false)}
                disabled={loading || saveState === "saving" || avatarUploadState !== "idle"}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}