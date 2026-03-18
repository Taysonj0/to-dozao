type LoginResponse = {
  token?: string;
};

export type ApiErrorResponse = {
  status?: number;
  error?: string;
  message?: string;
  errors?: Record<string, string>;
  timestamp?: string;
};

const authenticatedUserMissingPattern = /usu[aá]rio autenticado n[aã]o encontrado/i;

export const profileStorageKey = "todozao-profile";

const apiBaseUrl =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

export const resolveApiUrl = (url?: string | null) => {
  const normalized = url?.trim();

  if (!normalized) {
    return "";
  }

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  if (normalized.startsWith("/")) {
    return `${apiBaseUrl}${normalized}`;
  }

  return `${apiBaseUrl}/${normalized.replace(/^\/+/, "")}`;
};

export const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawToken = window.localStorage.getItem("token");

  if (!rawToken) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawToken) as LoginResponse | string;

    if (typeof parsed === "string") {
      return parsed;
    }

    if (parsed && typeof parsed.token === "string") {
      window.localStorage.setItem("token", parsed.token);
      return parsed.token;
    }
  } catch {
    return rawToken;
  }

  return null;
};

export const hasStoredToken = () => Boolean(getStoredToken());

export const clearSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("token");
  window.localStorage.removeItem(profileStorageKey);
};

export const api = async (url: string, options: RequestInit = {}) => {
  const token = getStoredToken();
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (isFormData) {
    delete headers["Content-Type"];
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${url}`, {
    ...options,
    cache: "no-store",
    headers,
  });

  if (response.status === 401 && typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth-expired"));
  }

  return response;
};

export const readApiErrorResponse = async (response: Response): Promise<ApiErrorResponse | null> => {
  try {
    const text = await response.text();

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text) as ApiErrorResponse;
    } catch {
      return {
        status: response.status,
        message: text,
      };
    }
  } catch {
    return null;
  }
};

export const isInvalidAuthenticatedUserResponse = (
  responseStatus: number,
  errorPayload?: ApiErrorResponse | null,
) => responseStatus === 400 && authenticatedUserMissingPattern.test(errorPayload?.message || "");