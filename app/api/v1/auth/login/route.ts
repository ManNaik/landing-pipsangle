import { NextResponse } from "next/server";
import { isMockAuthEnabled, mockLogin } from "../../../../lib/mockAuth";

export async function POST(request: Request) {
  if (!isMockAuthEnabled()) {
    return NextResponse.json(
      { detail: "Auth API is only available in mock mode. Set NEXT_PUBLIC_BACKEND_URL to use an external backend." },
      { status: 503 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password;
  if (!email || !password) {
    return NextResponse.json({ detail: "Email and password are required." }, { status: 400 });
  }

  const result = mockLogin(email, password);
  if (!result) {
    return NextResponse.json({ detail: "Invalid email or password." }, { status: 401 });
  }

  return NextResponse.json(result);
}
