import { NextResponse } from "next/server";
import { exchangeCredentials } from "../../lib/authProxy";
import { backendUrl, callBackend, csrfBlock, jsonFromProxy } from "../../lib/bffRoute";

export const dynamic = "force-dynamic";

async function credentialRoute(request: Request, path: "/auth/login/" | "/auth/signup/") {
  const blocked = csrfBlock(request);
  if (blocked) return blocked;

  let payload: { email?: string; password?: string; plan_slug?: string };
  try {
    payload = (await request.json()) as {
      email?: string;
      password?: string;
      plan_slug?: string;
    };
  } catch {
    return NextResponse.json({ detail: "Invalid request body." }, { status: 400 });
  }

  const email = payload.email?.trim();
  const password = payload.password;
  if (!email || !password) {
    return NextResponse.json(
      { detail: "Email and password are required." },
      { status: 400 }
    );
  }

  const body =
    path === "/auth/signup/"
      ? { email, password, plan_slug: payload.plan_slug }
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
