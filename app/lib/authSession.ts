export const ACCESS_COOKIE = "pips_access";
export const REFRESH_COOKIE = "pips_refresh";

const ACCESS_MAX_AGE_SECONDS = 60 * 60;
const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const DASHBOARD_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/subscription",
  "/control",
  "/trades",
  "/store",
];

export type SessionCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: "/";
  maxAge: number;
};

export type SessionCookieWrite = {
  name: string;
  value: string;
  options: SessionCookieOptions;
};

export type TokenPair = {
  access: string;
  refresh: string;
};

export function isCookieSecure(): boolean {
  const flag = process.env.AUTH_COOKIE_SECURE?.trim().toLowerCase();
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;
  return process.env.NODE_ENV === "production";
}

function cookieOptions(maxAge: number): SessionCookieOptions {
  return {
    httpOnly: true,
    secure: isCookieSecure(),
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

function decodeBase64Url(segment: string): string {
  const padded =
    segment.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((segment.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function tokenMaxAgeSeconds(token: string, fallbackSeconds: number): number {
  const parts = token.split(".");
  if (parts.length < 2) return fallbackSeconds;
  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { exp?: unknown };
    if (typeof payload.exp !== "number" || !Number.isFinite(payload.exp)) {
      return fallbackSeconds;
    }
    const seconds = payload.exp - Math.floor(Date.now() / 1000);
    if (!Number.isFinite(seconds) || seconds <= 0) return 0;
    return Math.floor(seconds);
  } catch {
    return fallbackSeconds;
  }
}

export function sessionCookieWrites(tokens: TokenPair): SessionCookieWrite[] {
  return [
    {
      name: ACCESS_COOKIE,
      value: tokens.access,
      options: cookieOptions(
        tokenMaxAgeSeconds(tokens.access, ACCESS_MAX_AGE_SECONDS)
      ),
    },
    {
      name: REFRESH_COOKIE,
      value: tokens.refresh,
      options: cookieOptions(
        tokenMaxAgeSeconds(tokens.refresh, REFRESH_MAX_AGE_SECONDS)
      ),
    },
  ];
}

export function clearSessionCookieWrites(): SessionCookieWrite[] {
  const options = cookieOptions(0);
  return [
    { name: ACCESS_COOKIE, value: "", options },
    { name: REFRESH_COOKIE, value: "", options },
  ];
}

export function hasSessionCookie(access?: string | null, refresh?: string | null): boolean {
  return Boolean(access || refresh);
}

type HeaderSource = {
  method: string;
  headers: Headers;
  url: string;
};

function hostMatches(originHost: string, candidate: string | null): boolean {
  if (!candidate) return false;
  return candidate.split(",")[0]?.trim() === originHost;
}

/** Mutating requests must come from the same host as the Origin header. */
export function isTrustedMutation(request: HeaderSource): boolean {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;

  const origin = request.headers.get("origin");
  if (!origin) return false;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  if (hostMatches(originHost, request.headers.get("host"))) return true;

  try {
    return new URL(request.url).host === originHost;
  } catch {
    return false;
  }
}

export function isProtectedAppPath(pathname: string): boolean {
  return DASHBOARD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isAdminAreaPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function isAdminLoginPath(pathname: string): boolean {
  return (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/")
  );
}

/** Same-origin proxy path without a trailing slash, so Next does not 308 the request. */
export function toSameOriginProxyPath(prefix: string, path: string): string {
  const [pathname, query = ""] = path.split("?");
  const normalized = (pathname.startsWith("/") ? pathname : `/${pathname}`).replace(
    /\/+$/,
    ""
  );
  const url = `${prefix}${normalized}`;
  return query ? `${url}?${query}` : url;
}

export function safeInternalPath(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return null;
  }
  if (value.includes("://") || value.includes("\\")) return null;
  return value;
}

export function unauthenticatedRedirect(pathname: string, search = ""): string | null {
  if (isAdminLoginPath(pathname)) return null;
  if (isAdminAreaPath(pathname)) return "/admin/login";
  if (!isProtectedAppPath(pathname)) return null;
  const next = safeInternalPath(`${pathname}${search}`);
  const url = new URL("http://session.internal/");
  url.searchParams.set("login", "1");
  if (next) url.searchParams.set("next", next);
  return `/${url.search}`;
}
