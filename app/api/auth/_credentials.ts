import { NextResponse } from "next/server";
import { cleanAttribution } from "../../lib/attributionPayload";
import { exchangeCredentials } from "../../lib/authProxy";
import { backendUrl, callBackend, csrfBlock, jsonFromProxy } from "../../lib/bffRoute";

export const dynamic = "force-dynamic";

type CredentialPayload = {
  email?: string;
  password?: string;
  plan_slug?: string;
  accepted_terms?: boolean;
  attribution?: unknown;
};

async function credentialRoute(request: Request, path: "/auth/login/" | "/auth/signup/") {
  const blocked = csrfBlock(request);
  if (blocked) return blocked;

  let payload: CredentialPayload;
  try {
    payload = (await request.json()) as CredentialPayload;
  } catch {
    return NextResponse.json({ detail: "Invalid request body." }, { status: 400 });
  }

  const email = payload.email?.trim();
  const password = payload.password;
  if (!email || !password) {
    return NextResponse.json({ detail: "Email and password are required." }, { status: 400 });
  }

  const body =
    path === "/auth/signup/"
      ? {
          email,
          password,
          plan_slug: payload.plan_slug,
          ...(typeof payload.accepted_terms === "boolean" ? { accepted_terms: payload.accepted_terms } : {}),
          attribution: cleanAttribution(payload.attribution),
        }
      : { email, password };

  const result = await exchangeCredentials({
    url: backendUrl(path),
    body: JSON.stringify(body),
    call: callBackend,
  });
  return jsonFromProxy(result);
}

export function postLogin(request: Request) {
  return credentialRoute(request, "/auth/login/");
}

export function postSignup(request: Request) {
  return credentialRoute(request, "/auth/signup/");
}
