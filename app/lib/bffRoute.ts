import { NextResponse } from "next/server";
import { getServerApiBaseUrl } from "./env";
import {
  clearSessionCookieWrites,
  isTrustedMutation,
  sessionCookieWrites,
  type SessionCookieWrite,
  type TokenPair,
} from "./authSession";
import type { ProxyResult, UpstreamRequest, UpstreamResult } from "./authProxy";

export function backendUrl(path: string): string {
  const base = getServerApiBaseUrl().replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api/v1${normalized}`;
}

export function csrfBlock(request: Request): NextResponse | null {
  if (isTrustedMutation(request)) return null;
  return NextResponse.json({ detail: "Cross-site request blocked." }, { status: 403 });
}

export function applySessionCookies(
  response: NextResponse,
  writes: SessionCookieWrite[]
): NextResponse {
  for (const cookie of writes) {
    response.cookies.set(cookie.name, cookie.value, cookie.options);
  }
  return response;
}

export function jsonFromProxy(result: ProxyResult): NextResponse {
  const cookies = result.clearSession
    ? clearSessionCookieWrites()
    : result.tokens
      ? sessionCookieWrites(result.tokens)
      : [];

  if (result.status === 204) {
    return applySessionCookies(new NextResponse(null, { status: 204 }), cookies);
  }

  const contentType = result.contentType ?? "application/json";
  const response = new NextResponse(result.body, {
    status: result.status,
    headers: { "Content-Type": contentType },
  });
  return applySessionCookies(response, cookies);
}

export async function callBackend(request: UpstreamRequest): Promise<UpstreamResult> {
  const response = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    cache: "no-store",
  });
  const body = await response.text();
  return {
    status: response.status,
    body,
    contentType: response.headers.get("content-type"),
  };
}

export function cookiesForTokens(tokens: TokenPair | null, clear: boolean): SessionCookieWrite[] {
  if (clear) return clearSessionCookieWrites();
  if (!tokens) return [];
  return sessionCookieWrites(tokens);
}
