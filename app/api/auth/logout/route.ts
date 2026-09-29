import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE } from "../../../lib/authSession";
import {
  applySessionCookies,
  backendUrl,
  callBackend,
  cookiesForTokens,
  csrfBlock,
} from "../../../lib/bffRoute";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const blocked = csrfBlock(request);
  if (blocked) return blocked;

  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  if (access) {
    try {
      await callBackend({
        url: backendUrl("/auth/logout/"),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: "{}",
      });
    } catch {
      // Local session is cleared even when the backend is unreachable.
    }
  }

  const response = NextResponse.json({ detail: "Successfully logged out." });
  return applySessionCookies(response, cookiesForTokens(null, true));
}
