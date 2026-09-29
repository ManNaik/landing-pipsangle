import type { AuthUser } from "./types";
import { apiPost } from "./api";

const AUTH_CHANGE_EVENT = "pipangel-auth-change";
const LEGACY_TOKEN_KEYS = ["access_token", "refresh_token"];

export type AuthSession = {
  user: AuthUser;
};

function authUrl(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

async function readDetail(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { detail?: string };
    if (data.detail) return data.detail;
  } catch {
    // ignore non-JSON
  }
  return fallback;
}

export function notifyAuthChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

export function onAuthChange(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(AUTH_CHANGE_EVENT, listener);
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, listener);
}

export function isStaffUser(user: AuthUser): boolean {
  return user.is_staff === true;
}

/** Drop leftover bearer tokens from the previous localStorage session. */
export function clearLegacyTokenStorage(): void {
  if (typeof window === "undefined") return;
  for (const key of LEGACY_TOKEN_KEYS) {
    localStorage.removeItem(key);
  }
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await fetch(authUrl("/api/auth/me"), {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await readDetail(response, "Session expired."));
  }
  return response.json() as Promise<AuthUser>;
}

async function postSession(
  path: string,
  body: Record<string, string | undefined>
): Promise<AuthSession> {
  const response = await fetch(authUrl(path), {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as {
    detail?: string;
    user?: AuthUser;
  };
  if (!response.ok || !data.user) {
    throw new Error(data.detail ?? `Request failed (${response.status})`);
  }
  clearLegacyTokenStorage();
  notifyAuthChange();
  return { user: data.user };
}

export async function userLogin(email: string, password: string): Promise<AuthSession> {
  return postSession("/api/auth/login", { email, password });
}

export async function signup(
  email: string,
  password: string,
  planSlug?: string
): Promise<AuthSession> {
  return postSession("/api/auth/signup", {
    email,
    password,
    plan_slug: planSlug,
  });
}

export async function adminLogin(email: string, password: string): Promise<AuthSession> {
  const response = await userLogin(email, password);
  if (!response.user.is_staff) {
    await logout();
    throw new Error("Access denied. Staff credentials required.");
  }
  return response;
}

export async function requestPasswordReset(email: string): Promise<string> {
  const data = await apiPost<{ detail?: string }>("/auth/forgot-password/", {
    email,
  });
  return data.detail ?? "If an account exists with this email, a reset link has been sent.";
}

export async function resetPassword(token: string, password: string): Promise<string> {
  const data = await apiPost<{ detail?: string }>("/auth/reset-password/", {
    token,
    password,
  });
  return data.detail ?? "Password updated. You can log in with your new password.";
}

export async function logout(): Promise<void> {
  try {
    await fetch(authUrl("/api/auth/logout"), {
      method: "POST",
      credentials: "same-origin",
    });
  } catch {
    // Local logout still proceeds on network failure.
  }
  clearLegacyTokenStorage();
  notifyAuthChange();
}

export function expireSession(): void {
  notifyAuthChange();
}
