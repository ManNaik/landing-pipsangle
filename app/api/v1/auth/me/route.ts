import { NextResponse } from "next/server";
import { isMockAuthEnabled, mockUserFromToken } from "../../../../lib/mockAuth";

export async function GET(request: Request) {
  if (!isMockAuthEnabled()) {
    return NextResponse.json(
      { detail: "Auth API is only available in mock mode. Set NEXT_PUBLIC_BACKEND_URL to use an external backend." },
      { status: 503 }
    );
  }

  const auth = request.headers.get("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    return NextResponse.json({ detail: "Authentication required." }, { status: 401 });
  }

  const user = mockUserFromToken(token);
  if (!user) {
    return NextResponse.json({ detail: "Invalid or expired token." }, { status: 401 });
  }

  return NextResponse.json(user);
}
