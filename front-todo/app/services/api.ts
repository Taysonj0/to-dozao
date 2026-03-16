type LoginResponse = {
  token?: string;
};

const apiBaseUrl =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

const getStoredToken = () => {
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

export const api = async (url: string, options: RequestInit = {}) => {
  const token = getStoredToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${apiBaseUrl}${url}`, {
    ...options,
    headers,
  });

  return response;
};