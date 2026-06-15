export function getApiBase(): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
}

function buildUrl(path: string): string {
  const base = getApiBase().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api/v1${normalized}`;
}

export async function apiGet<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(buildUrl(path), {
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function apiGetClient<T>(path: string): Promise<T> {
  const res = await fetch(buildUrl(path));
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
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
