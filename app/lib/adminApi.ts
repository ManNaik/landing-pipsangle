import { getAccessToken, clearTokens } from "./auth";
import { getApiBase } from "./api";

function buildAdminUrl(path: string): string {
  const base = getApiBase().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api/v1/admin${normalized}`;
}

async function handleUnauthorized(): Promise<never> {
  clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/managementadmin/login";
  }
  throw new Error("Unauthorized");
}

async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    return handleUnauthorized();
  }

  const res = await fetch(buildAdminUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    return handleUnauthorized();
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json();
  if (!res.ok) {
    const err = data as { detail?: string };
    throw new Error(err.detail ?? `API error: ${res.status}`);
  }
  return data as T;
}

export function adminGet<T>(path: string): Promise<T> {
  return adminFetch<T>(path);
}

export function adminPost<T>(path: string, body: unknown): Promise<T> {
  return adminFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function adminPatch<T>(path: string, body: unknown): Promise<T> {
  return adminFetch<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function adminDelete(path: string): Promise<void> {
  return adminFetch<void>(path, { method: "DELETE" });
}
