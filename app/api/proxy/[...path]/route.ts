import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "../../../lib/authSession";
import {
  isBlockedProxyPath,
  isLoopbackProxyTarget,
  normalizeApiPath,
  runAuthenticatedProxy,
} from "../../../lib/authProxy";
import { backendUrl, callBackend, csrfBlock, jsonFromProxy } from "../../../lib/bffRoute";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, context: RouteContext) {
  const blocked = csrfBlock(request);
  if (blocked) return blocked;

  const { path } = await context.params;
  const normalized = normalizeApiPath(path);
  if (!normalized || isBlockedProxyPath(normalized)) {
    return NextResponse.json({ detail: "Not found." }, { status: 404 });
  }

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await request.text() : undefined;
  const url = `${backendUrl(`/${normalized}`)}${request.nextUrl.search}`;
  if (isLoopbackProxyTarget(url, request.headers.get("host"))) {
    return NextResponse.json(
      { detail: "API base URL is not configured." },
      { status: 502 }
    );
  }

  const result = await runAuthenticatedProxy({
    method,
    url,
    access: request.cookies.get(ACCESS_COOKIE)?.value ?? null,
    refresh: request.cookies.get(REFRESH_COOKIE)?.value ?? null,
    refreshUrl: backendUrl("/auth/token/refresh/"),
    body,
    contentType: request.headers.get("content-type"),
    call: callBackend,
  });
  return jsonFromProxy(result);
}

export function GET(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export function PUT(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}
