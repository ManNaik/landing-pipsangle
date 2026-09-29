import type { AuthUser } from "./types";
import type { TokenPair } from "./authSession";

export type UpstreamResult = {
  status: number;
  body: string;
  contentType: string | null;
};

export type UpstreamRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
};

export type ProxyResult = {
  status: number;
  body: string;
  contentType: string | null;
  tokens: TokenPair | null;
  clearSession: boolean;
};

const SECRET_KEYS = ["access_token", "refresh_token", "access", "refresh"] as const;

const BLOCKED_PROXY_PATHS = new Set([
  "auth/login",
  "auth/signup",
  "auth/logout",
  "auth/refresh",
  "auth/token/refresh",
]);

const refreshInflight = new Map<string, Promise<TokenPair | null>>();

export function resetRefreshInflightForTests(): void {
  refreshInflight.clear();
}

function stringField(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function readTokenPair(data: unknown, previousRefresh?: string | null): TokenPair | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const record = data as Record<string, unknown>;
  const access = stringField(record, "access_token") ?? stringField(record, "access");
  const refresh =
    stringField(record, "refresh_token") ??
    stringField(record, "refresh") ??
    previousRefresh ??
    null;
  if (!access || !refresh) return null;
  return { access, refresh };
}

export function toPublicSession(data: unknown): { user: AuthUser } | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const user = (data as { user?: unknown }).user;
  if (!user || typeof user !== "object" || Array.isArray(user)) return null;
  return { user: user as AuthUser };
}

export function stripSecretFields(body: string, contentType: string | null): string {
  if (!contentType?.toLowerCase().includes("json")) return body;
  try {
    const parsed = JSON.parse(body) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return body;
    const record = { ...(parsed as Record<string, unknown>) };
    let changed = false;
    for (const key of SECRET_KEYS) {
      if (key in record) {
        delete record[key];
        changed = true;
      }
    }
    return changed ? JSON.stringify(record) : body;
  } catch {
    return body;
  }
}

export function normalizeApiPath(segments: string[]): string | null {
  if (
    segments.length === 0 ||
    segments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        segment.includes("/") ||
        segment.includes("\\")
    )
  ) {
    return null;
  }
  return `${segments.join("/")}/`;
}

export function isBlockedProxyPath(path: string): boolean {
  return BLOCKED_PROXY_PATHS.has(path.replace(/\/+$/, ""));
}

export function isLoopbackProxyTarget(targetUrl: string, requestHost: string | null): boolean {
  try {
    const target = new URL(targetUrl);
    const host = requestHost?.split(",")[0]?.trim();
    if (!host || target.host !== host) return false;
    return target.pathname === "/api/proxy" || target.pathname.startsWith("/api/proxy/");
  } catch {
    return true;
  }
}

async function refreshDeduped(
  refresh: string,
  run: () => Promise<TokenPair | null>
): Promise<TokenPair | null> {
  const existing = refreshInflight.get(refresh);
  if (existing) return existing;
  const pending = run().finally(() => {
    refreshInflight.delete(refresh);
  });
  refreshInflight.set(refresh, pending);
  return pending;
}

function parseJson(body: string): unknown {
  try {
    return JSON.parse(body) as unknown;
  } catch {
    return null;
  }
}

async function rotateRefresh(input: {
  refresh: string;
  refreshUrl: string;
  call: (request: UpstreamRequest) => Promise<UpstreamResult>;
}): Promise<TokenPair | null> {
  return refreshDeduped(input.refresh, async () => {
    const result = await input.call({
      url: input.refreshUrl,
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh_token: input.refresh }),
    });
    if (result.status < 200 || result.status >= 300) return null;
    return readTokenPair(parseJson(result.body), input.refresh);
  });
}

function unauthorized(clearSession: boolean): ProxyResult {
  return {
    status: 401,
    body: JSON.stringify({ detail: "Authentication required." }),
    contentType: "application/json",
    tokens: null,
    clearSession,
  };
}

export async function runAuthenticatedProxy(input: {
  method: string;
  url: string;
  access: string | null;
  refresh: string | null;
  refreshUrl: string;
  body?: string;
  contentType?: string | null;
  call: (request: UpstreamRequest) => Promise<UpstreamResult>;
}): Promise<ProxyResult> {
  let access = input.access;
  let refresh = input.refresh;
  let tokens: TokenPair | null = null;
  let refreshed = false;

  async function rotate(): Promise<string | null> {
    if (refreshed || !refresh) return null;
    refreshed = true;
    const next = await rotateRefresh({
      refresh,
      refreshUrl: input.refreshUrl,
      call: input.call,
    });
    if (!next) return null;
    tokens = next;
    access = next.access;
    refresh = next.refresh;
    return next.access;
  }

  if (!access) {
    access = await rotate();
  }
  if (!access) return unauthorized(true);

  const send = (token: string) => {
    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
    if (input.body !== undefined && input.contentType) {
      headers["Content-Type"] = input.contentType;
    } else if (input.body !== undefined) {
      headers["Content-Type"] = "application/json";
    }
    return input.call({
      url: input.url,
      method: input.method,
      headers,
      body: input.body,
    });
  };

  let result = await send(access);
  if (result.status === 401) {
    const next = await rotate();
    if (!next) return unauthorized(true);
    result = await send(next);
    if (result.status === 401) return unauthorized(true);
  }

  return {
    status: result.status,
    body: stripSecretFields(result.body, result.contentType),
    contentType: result.contentType,
    tokens,
    clearSession: false,
  };
}

export async function exchangeCredentials(input: {
  url: string;
  body: string;
  call: (request: UpstreamRequest) => Promise<UpstreamResult>;
}): Promise<ProxyResult> {
  const result = await input.call({
    url: input.url,
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: input.body,
  });
  const parsed = parseJson(result.body);
  if (result.status < 200 || result.status >= 300) {
    return {
      status: result.status,
      body: stripSecretFields(result.body, result.contentType ?? "application/json"),
      contentType: "application/json",
      tokens: null,
      clearSession: false,
    };
  }
  const tokens = readTokenPair(parsed);
  const session = toPublicSession(parsed);
  if (!tokens || !session) {
    return {
      status: 502,
      body: JSON.stringify({ detail: "Auth service returned an invalid session." }),
      contentType: "application/json",
      tokens: null,
      clearSession: false,
    };
  }
  return {
    status: result.status,
    body: JSON.stringify(session),
    contentType: "application/json",
    tokens,
    clearSession: false,
  };
}
