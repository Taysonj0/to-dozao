"use client";

import { api, clearSession, hasStoredToken, profileStorageKey } from "@/app/services/api";
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
};

const defaultNavItems = [
  { href: "/perfil", label: "Meu Perfil", icon: UserRound },
  { href: "/tasks", label: "My Tasks", icon: ListTodo },
];

const defaultProfile: ProfileData = {
  name: "Usuário",
  email: "",
  headline: "Mantenha seus dados atualizados para navegar pelas áreas autenticadas.",
};

type RemoteProfileResponse = {
  id: number;
  name: string;
  email: string;
  headline?: string | null;
};

const defaultNotifications = [
  "Seu perfil pode ser atualizado a qualquer momento por esta tela.",
  "As alterações salvas aqui refletem no menu superior.",
  "Use uma headline curta para resumir sua função no projeto.",
];

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
  notificationItems = defaultNotifications,
}: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);
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
      };
    } catch {
      return defaultProfile;
    }
  });

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
        const response = await api("/users/me/profile", { method: "GET" });

        if (!response.ok) {
          if (response.status === 401) {
            return;
          }

          setAuthReady(true);
          return;
        }

        const parsed = (await response.json()) as RemoteProfileResponse;
        const nextProfile = {
          name: parsed.name || defaultProfile.name,
          email: parsed.email || defaultProfile.email,
          headline: parsed.headline || defaultProfile.headline,
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
              <span className="sidebar-avatar">{initials}</span>
              <span className="sidebar-profile-copy">
                <strong>{profile.name}</strong>
                <small>Perfil ativo</small>
              </span>
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
                    <p className="panel-subtitle">Atualizações rápidas sobre o seu perfil.</p>
                    <div className="dropdown-list">
                      {notificationItems.map((item) => (
                        <div key={item} className="dropdown-item" role="status">
                          <span>{item}</span>
                        </div>
                      ))}
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
                  <span className="avatar tiny">{initials}</span>
                </button>

                {profileOpen ? (
                  <div className="dropdown topbar-dropdown profile-dropdown">
                    <div className="inline-group" style={{ marginBottom: 12 }}>
                      <span className="avatar">{initials}</span>
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