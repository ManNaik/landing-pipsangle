import type { AuthUser, LoginResponse } from "./types";
import { apiPost, getApiBase } from "./api";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isStaffUser(user: AuthUser): boolean {
  return user.is_staff === true;
}

export async function fetchCurrentUser(token: string): Promise<AuthUser> {
  const base = getApiBase().replace(/\/$/, "");
  const res = await fetch(`${base}/api/v1/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error("Session expired.");
  }
  return res.json() as Promise<AuthUser>;
}

export async function adminLogin(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await apiPost<LoginResponse>("/auth/login/", {
    email,
    password,
  });
  if (!response.user.is_staff) {
    clearTokens();
    throw new Error("Access denied. Staff credentials required.");
  }
  setTokens(response.access_token, response.refresh_token);
  return response;
}
