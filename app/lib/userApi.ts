import { getAccessToken, clearTokens } from "./auth";
import { buildApiUrl } from "./api";

async function handleUnauthorized(): Promise<never> {
  clearTokens();
  if (typeof window !== "undefined") {
    window.location.href = "/dashboard";
  }
  throw new Error("Unauthorized");
}

export async function userFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    return handleUnauthorized();
  }

  const res = await fetch(buildApiUrl(path), {
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
