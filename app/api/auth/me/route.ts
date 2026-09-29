import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "../../../lib/authSession";
import { runAuthenticatedProxy } from "../../../lib/authProxy";
import { backendUrl, callBackend, jsonFromProxy } from "../../../lib/bffRoute";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const result = await runAuthenticatedProxy({
    method: "GET",
    url: backendUrl("/auth/me/"),
    access: request.cookies.get(ACCESS_COOKIE)?.value ?? null,
    refresh: request.cookies.get(REFRESH_COOKIE)?.value ?? null,
    refreshUrl: backendUrl("/auth/token/refresh/"),
    call: callBackend,
  });
  return jsonFromProxy(result);
}
