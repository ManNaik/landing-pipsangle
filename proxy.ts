import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  hasSessionCookie,
  isAdminAreaPath,
  isAdminLoginPath,
  isProtectedAppPath,
  safeInternalPath,
} from "./app/lib/authSession";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (isAdminLoginPath(pathname)) return NextResponse.next();
  if (!isProtectedAppPath(pathname) && !isAdminAreaPath(pathname)) {
    return NextResponse.next();
  }

  const authenticated = hasSessionCookie(
    request.cookies.get(ACCESS_COOKIE)?.value,
    request.cookies.get(REFRESH_COOKIE)?.value
  );
  if (authenticated) return NextResponse.next();

  if (isAdminAreaPath(pathname)) {
    return NextResponse.redirect(new URL("/managementadmin/login", request.url));
  }

  const loginUrl = new URL("/", request.url);
  loginUrl.searchParams.set("login", "1");
  const next = safeInternalPath(`${pathname}${search}`);
  if (next) loginUrl.searchParams.set("next", next);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/onboarding",
    "/onboarding/:path*",
    "/subscription",
    "/subscription/:path*",
    "/control",
    "/control/:path*",
    "/trades",
    "/trades/:path*",
    "/store",
    "/store/:path*",
    "/managementadmin",
    "/managementadmin/:path*",
  ],
};
