import { NextResponse, type NextRequest } from "next/server";
import { REFRESH_COOKIE } from "../../../lib/authSession";
import { readTokenPair } from "../../../lib/authProxy";
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

  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refresh) {
    const response = NextResponse.json(
      { detail: "Authentication required." },
      { status: 401 }
    );
    return applySessionCookies(response, cookiesForTokens(null, true));
  }

  const upstream = await callBackend({
    url: backendUrl("/auth/token/refresh/"),
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (upstream.status < 200 || upstream.status >= 300) {
    const response = NextResponse.json(
      { detail: "Authentication required." },
      { status: 401 }
    );
    return applySessionCookies(response, cookiesForTokens(null, true));
  }

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(upstream.body) as unknown;
  } catch {
    parsed = null;
  }
  const tokens = readTokenPair(parsed, refresh);
  if (!tokens) {
    const response = NextResponse.json(
      { detail: "Authentication required." },
      { status: 401 }
    );
    return applySessionCookies(response, cookiesForTokens(null, true));
  }

  const response = NextResponse.json({ ok: true });
  return applySessionCookies(response, cookiesForTokens(tokens, false));
}
