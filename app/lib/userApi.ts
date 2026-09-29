import { expireSession } from "./auth";
import { toSameOriginProxyPath } from "./authSession";

function proxyUrl(path: string): string {
  return toSameOriginProxyPath("/api/proxy", path);
}

async function handleUnauthorized(): Promise<never> {
  expireSession();
  if (typeof window !== "undefined") {
    window.location.href = "/?login=1&next=/dashboard";
  }
  throw new Error("Session expired. Please log in again.");
}

export async function userFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(proxyUrl(path), {
    ...options,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 401) {
    return handleUnauthorized();
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as { detail?: string };
    throw new Error(err.detail ?? `API error: ${res.status}`);
  }
  return data as T;
}

export async function userGet<T>(path: string): Promise<T> {
  return userFetch<T>(path);
}

export async function userPost<T>(path: string, body?: unknown): Promise<T> {
  return userFetch<T>(path, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function userPatch<T>(path: string, body: unknown): Promise<T> {
  return userFetch<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
