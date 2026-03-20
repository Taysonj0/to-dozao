"use client";

import {
  api,
  clearSession,
  hasStoredToken,
  isInvalidAuthenticatedUserResponse,
  profileStorageKey,
  readApiErrorResponse,
  resolveApiUrl,
} from "@/app/services/api";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CircleUserRound,
  LogOut,
  ListTodo,
  UserRound,
} from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";

type ShellNavItem = {
  href: string;
  label: string;
  icon: typeof UserRound;
};

type AppShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  sectionLabel?: string;
  currentPageLabel?: string;
  navItems?: ShellNavItem[];
  notificationItems?: string[];
};

type ProfileData = {
  name: string;
  email: string;
  headline: string;
  avatarUrl: string;
};

type RemoteTask = {
  id?: number;
  title?: string | null;
  name?: string | null;
  taskStatus?: string | null;
  status?: string | null;
};

const defaultNavItems = [
  { href: "/tasks", label: "Minhas tarefas", icon: ListTodo },
  { href: "/projetos", label: "Projetos", icon: ListTodo },
  { href: "/perfil", label: "Meu Perfil", icon: UserRound },
];

const defaultProfile: ProfileData = {
  name: "Usuário",
  email: "",
  headline: "Mantenha seus dados atualizados para navegar pelas áreas autenticadas.",
  avatarUrl: "",
};

type RemoteProfileResponse = {
  id: number;
  name: string;
  email: string;
  headline?: string | null;
  avatarUrl?: string | null;
};

function normalizeTaskStatus(status?: string | null) {
  const value = (status || "").trim().toUpperCase();

  if (value === "COMPLETED" || value === "CONCLUIDA" || value === "CONCLUÍDA") {
    return "COMPLETED";
  }

  if (value === "CANCELLED" || value === "CANCELADA") {
    return "CANCELLED";
  }

  if (value === "IN_PROGRESS" || value === "EM_ANDAMENTO" || value === "EM ANDAMENTO") {
    return "IN_PROGRESS";
  }

  if (value === "OVERDUE" || value === "ATRASADA") {
    return "OVERDUE";
  }

  return "PENDING";
}

function buildPendingTaskNotifications(tasks: RemoteTask[]) {
  const pendingTasks = tasks.filter((task) => {
    const status = normalizeTaskStatus(task.taskStatus || task.status);
    return status !== "COMPLETED" && status !== "CANCELLED";
  });

  return pendingTasks.map((task) => {
    const title = task.title || task.name || "Task sem título";
    return `Task pendente: ${title}`;
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AppShell({
  title,
  subtitle,
  children,
  sectionLabel = "Conta",
  currentPageLabel = "Perfil",
  navItems = defaultNavItems,
}: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [taskNotifications, setTaskNotifications] = useState<string[]>([]);
  const [profile, setProfile] = useState<ProfileData>(() => {
    if (typeof window === "undefined") {
      return defaultProfile;
    }

    const savedProfile = window.localStorage.getItem(profileStorageKey);

    if (!savedProfile) {
      return defaultProfile;
    }

    try {
      const parsed = JSON.parse(savedProfile) as Partial<ProfileData>;
      return {
        name: parsed.name || defaultProfile.name,
        email: parsed.email || defaultProfile.email,
        headline: parsed.headline || defaultProfile.headline,
        avatarUrl: parsed.avatarUrl || defaultProfile.avatarUrl,
      };
    } catch {
      return defaultProfile;
    }
  });
  const [avatarImageFailed, setAvatarImageFailed] = useState(false);

  useEffect(() => {
    const redirectToLogin = () => {
      clearSession();
      setProfile(defaultProfile);
      setProfileOpen(false);
      setNotificationOpen(false);
      setAuthReady(true);
      router.replace("/login");
    };

    const syncProfile = async () => {
      if (!hasStoredToken()) {
        redirectToLogin();
        return;
      }

      try {
        const [profileResponse, tasksResponse] = await Promise.all([
          api("/users/me/profile", { method: "GET" }),
          api("/api/tasks", { method: "GET" }),
        ]);

        if (!profileResponse.ok) {
          const errorPayload = await readApiErrorResponse(profileResponse);

          if (profileResponse.status === 401 || isInvalidAuthenticatedUserResponse(profileResponse.status, errorPayload)) {
            redirectToLogin();
            return;
          }

          setAuthReady(true);
          return;
        }

        if (!tasksResponse.ok) {
          const errorPayload = await readApiErrorResponse(tasksResponse);

          if (tasksResponse.status === 401 || isInvalidAuthenticatedUserResponse(tasksResponse.status, errorPayload)) {
            redirectToLogin();
            return;
          }

          setTaskNotifications([]);
        } else {
          const parsedTasks = (await tasksResponse.json()) as RemoteTask[];
          setTaskNotifications(buildPendingTaskNotifications(parsedTasks));
        }

        const parsed = (await profileResponse.json()) as RemoteProfileResponse;
        const nextProfile = {
          name: parsed.name || defaultProfile.name,
          email: parsed.email || defaultProfile.email,
          headline: parsed.headline || defaultProfile.headline,
          avatarUrl: parsed.avatarUrl || defaultProfile.avatarUrl,
        };

        setProfile(nextProfile);
        window.localStorage.setItem(profileStorageKey, JSON.stringify(nextProfile));
      } catch {
        setProfile(defaultProfile);
      } finally {
        setAuthReady(true);
      }
    };

    const handleProfileUpdated = () => {
      void syncProfile();
    };

    const handleAuthExpired = () => {
      redirectToLogin();
    };

    void syncProfile();

    window.addEventListener("profile-updated", handleProfileUpdated);
    window.addEventListener("auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, [router]);

  const initials = useMemo(() => getInitials(profile.name), [profile.name]);
  const avatarUrl = useMemo(() => resolveApiUrl(profile.avatarUrl), [profile.avatarUrl]);
  useEffect(() => {
    setAvatarImageFailed(false);
  }, [avatarUrl]);

  const handleLogout = () => {
    clearSession();
    setProfileOpen(false);
    router.replace("/login");
  };

  if (!authReady) {
    return (
      <div className="app-stage">
        <div className="app-shell" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
          <p className="panel-subtitle">Validando sua sessão...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-stage">
      <div className="app-shell">
        <aside className="app-sidebar">
          <div className="app-sidebar-inner">
            <div>
              <div className="brand-row">
                <div className="brand-mark">🏠</div>
                <div className="brand-copy compact">
                  <h2 className="brand-title brand-title-small">Todo-zão</h2>
                  <p className="brand-subtitle brand-subtitle-small">Perfil e conta</p>
                </div>
              </div>

              <nav className="nav-group" aria-label="Navegação principal">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link href={item.href} key={item.href} className={`nav-item${isActive ? " active" : ""}`}>
                      <span className="nav-icon">
                        <Icon size={18} />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="sidebar-footer">
              <div className="sidebar-profile sidebar-profile-static">
                <span className="sidebar-avatar">
                  {avatarUrl && !avatarImageFailed ? (
                    <img
                      src={avatarUrl}
                      alt={`Foto de perfil de ${profile.name || "usuário"}`}
                      className="avatar-image"
                      onError={() => setAvatarImageFailed(true)}
                    />
                  ) : (
                    <span className="avatar-fallback">{initials}</span>
                  )}
                </span>
                <span className="sidebar-profile-copy">
                  <strong>{profile.name}</strong>
                  <small>Perfil ativo</small>
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="app-main">
          <header className="topbar chrome">
            <div className="topbar-title-row">
              <span className="topbar-leading">☰</span>
              <div className="topbar-breadcrumb">
                <span>{sectionLabel}</span>
                <span className="topbar-separator">/</span>
                <strong>{currentPageLabel}</strong>
              </div>
            </div>

            <div className="topbar-actions">
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="topbar-icon"
                  onClick={() => {
                    setNotificationOpen((current) => !current);
                    setProfileOpen(false);
                  }}
                  aria-label="Abrir notificações"
                >
                  <Bell size={16} />
                </button>

                {notificationOpen ? (
                  <div className="dropdown topbar-dropdown">
                    <h3>Notificações</h3>
                    <p className="panel-subtitle">Tasks pendentes que precisam da sua atenção.</p>
                    <div className="dropdown-list">
                      {taskNotifications.length > 0 ? (
                        taskNotifications.map((item) => (
                          <div key={item} className="dropdown-item" role="status">
                            <span>{item}</span>
                          </div>
                        ))
                      ) : (
                        <div className="dropdown-item" role="status">
                          <span>Nenhuma task pendente no momento.</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  className="topbar-avatar-button"
                  onClick={() => {
                    setProfileOpen((current) => !current);
                    setNotificationOpen(false);
                  }}
                  aria-label="Abrir menu do perfil"
                >
                  <span className="avatar tiny">
                    {avatarUrl && !avatarImageFailed ? (
                      <img
                        src={avatarUrl}
                        alt={`Foto de perfil de ${profile.name || "usuário"}`}
                        className="avatar-image"
                        onError={() => setAvatarImageFailed(true)}
                      />
                    ) : (
                      <span className="avatar-fallback">{initials}</span>
                    )}
                  </span>
                </button>

                {profileOpen ? (
                  <div className="dropdown topbar-dropdown profile-dropdown">
                    <div className="inline-group" style={{ marginBottom: 12 }}>
                      <span className="avatar">
                        {avatarUrl && !avatarImageFailed ? (
                          <img
                            src={avatarUrl}
                            alt={`Foto de perfil de ${profile.name || "usuário"}`}
                            className="avatar-image"
                            onError={() => setAvatarImageFailed(true)}
                          />
                        ) : (
                          <span className="avatar-fallback">{initials}</span>
                        )}
                      </span>
                      <div>
                        <h3>{profile.name}</h3>
                        <p>{profile.email}</p>
                      </div>
                    </div>

                    <div className="dropdown-list">
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/perfil");
                        }}
                      >
                        <span>Meu perfil</span>
                        <CircleUserRound size={18} />
                      </button>
                      <button type="button" className="dropdown-item" onClick={handleLogout}>
                        <span>Sair</span>
                        <LogOut size={18} />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <section className="content-wrap">
            <div className="page-heading">
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>

            {children}
          </section>
        </main>
      </div>
    </div>
  );
}