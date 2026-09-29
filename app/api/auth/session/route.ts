import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, hasSessionCookie } from "../../../lib/authSession";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  return NextResponse.json({
    authenticated: hasSessionCookie(access, refresh),
  });
}
