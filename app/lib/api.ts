import { getApiBaseUrl } from "./env";

/** @deprecated Prefer getApiBase() — kept for existing imports. */
export const API_BASE_URL = getApiBaseUrl();

export function getApiBase(): string {
  return getApiBaseUrl();
}

export function buildApiUrl(path: string): string {
  const base = getApiBaseUrl();
  const [pathname, query = ""] = path.split("?");
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`;
  const url = `${base}/api/v1${withSlash}`;
  return query ? `${url}?${query}` : url;
}

function buildUrl(path: string): string {
  return buildApiUrl(path);
}

async function parseError(res: Response, path: string): Promise<never> {
  let detail = `API error: ${res.status} ${path}`;
  try {
    const data = (await res.json()) as { detail?: string };
    if (data.detail) detail = data.detail;
  } catch {
    // ignore non-JSON
  }
  throw new Error(detail);
}

/** Public SSR/browser content fetch. Stays on the environment API base, without session cookies. */
export async function apiGet<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(buildUrl(path), {
    next: { revalidate },
  });
  if (!res.ok) {
    await parseError(res, path);
  }
  return res.json() as Promise<T>;
}

export async function apiGetClient<T>(path: string): Promise<T> {
  const res = await fetch(buildUrl(path));
  if (!res.ok) {
    await parseError(res, path);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as { detail?: string };
    throw new Error(err.detail ?? `API error: ${res.status}`);
  }
  return data as T;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as { detail?: string };
    throw new Error(err.detail ?? `API error: ${res.status}`);
  }
  return data as T;
}

export async function safeApiGet<T>(
  path: string,
  revalidate = 60
): Promise<T | null> {
  try {
    return await apiGet<T>(path, revalidate);
  } catch {
    return null;
  }
}
