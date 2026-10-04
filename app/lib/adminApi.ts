import { expireSession } from "./auth";
import { toSameOriginProxyPath } from "./authSession";

function buildAdminProxyUrl(path: string): string {
  return toSameOriginProxyPath("/api/proxy/admin", path);
}

async function handleUnauthorized(): Promise<never> {
  expireSession();
  if (typeof window !== "undefined") {
    window.location.href = "/admin/login";
  }
  throw new Error("Unauthorized");
}

async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(buildAdminProxyUrl(path), {
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
    throw new Error(errorMessage(data, res.status));
  }
  return data as T;
}

/** Prefer field errors ("slug: ...") over the generic "Validation error." detail. */
function errorMessage(data: unknown, status: number): string {
  const body = (data ?? {}) as { detail?: string; errors?: Record<string, unknown> };
  const fieldErrors =
    body.errors && typeof body.errors === "object"
      ? Object.entries(body.errors).map(([field, messages]) => {
          const text = Array.isArray(messages) ? messages.join(" ") : typeof messages === "string" ? messages : JSON.stringify(messages);
          return `${field}: ${text}`;
        })
      : [];
  return fieldErrors.length > 0 ? fieldErrors.join(" ") : body.detail ?? `API error: ${status}`;
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
