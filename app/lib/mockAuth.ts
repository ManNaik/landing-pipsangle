import { createHmac, timingSafeEqual } from "crypto";
import { DEMO_CREDENTIALS } from "./demoCredentials";
import { FREE_TRIAL_DAYS } from "./trial";
import type { AuthUser, LoginResponse } from "./types";

const MOCK_PREFIX = "mock.";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

type MockTokenPayload = {
  sub: string;
  email: string;
  plan: string | null;
  is_staff: boolean;
  trial_active?: boolean;
  trial_ends_at?: string | null;
  exp: number;
};

type DemoAccount = {
  id: string;
  password: string;
  plan: string | null;
  is_staff: boolean;
  trial_active?: boolean;
  trial_ends_at?: string | null;
};

const DEMO_ACCOUNTS: Record<string, DemoAccount> = {
  [DEMO_CREDENTIALS.user.email]: {
    id: "demo-user-001",
    password: DEMO_CREDENTIALS.user.password,
    plan: "Premium",
    is_staff: false,
    trial_active: true,
    trial_ends_at: new Date(
      Date.now() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000
    ).toISOString(),
  },
  [DEMO_CREDENTIALS.admin.email]: {
    id: "admin-user-001",
    password: DEMO_CREDENTIALS.admin.password,
    plan: null,
    is_staff: true,
  },
};

function getSecret(): string {
  return process.env.MOCK_AUTH_SECRET ?? "pipangel-dev-mock-secret";
}

function toAuthUser(account: DemoAccount, email: string): AuthUser {
  return {
    id: account.id,
    email,
    plan: account.plan,
    is_staff: account.is_staff,
    trial_active: account.trial_active,
    trial_ends_at: account.trial_ends_at ?? null,
  };
}

function signPayload(payload: MockTokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", getSecret()).update(body).digest("base64url");
  return `${MOCK_PREFIX}${body}.${sig}`;
}

function verifyToken(token: string): MockTokenPayload | null {
  if (!token.startsWith(MOCK_PREFIX)) return null;
  const rest = token.slice(MOCK_PREFIX.length);
  const dot = rest.lastIndexOf(".");
  if (dot === -1) return null;

  const body = rest.slice(0, dot);
  const sig = rest.slice(dot + 1);
  const expected = createHmac("sha256", getSecret()).update(body).digest("base64url");

  try {
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expected);
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as MockTokenPayload;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function createTokensForAccount(account: DemoAccount, email: string): LoginResponse {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload: MockTokenPayload = {
    sub: account.id,
    email,
    plan: account.plan,
    is_staff: account.is_staff,
    trial_active: account.trial_active,
    trial_ends_at: account.trial_ends_at ?? null,
    exp,
  };
  const access = signPayload(payload);
  const refresh = signPayload({ ...payload, exp: exp + TOKEN_TTL_MS });

  return {
    access_token: access,
    refresh_token: refresh,
    user: toAuthUser(account, email),
  };
}

function planFromSlug(slug?: string): string | null {
  if (!slug) return "Basic";
  const normalized = slug.toLowerCase();
  if (normalized === "premium") return "Premium";
  if (normalized === "basic") return "Basic";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function mockLogin(email: string, password: string): LoginResponse | null {
  const account = DEMO_ACCOUNTS[email.toLowerCase()];
  if (!account || account.password !== password) return null;
  return createTokensForAccount(account, email.toLowerCase());
}

export function mockSignup(
  email: string,
  password: string,
  planSlug?: string
): LoginResponse | { error: string } {
  const normalizedEmail = email.toLowerCase();
  if (DEMO_ACCOUNTS[normalizedEmail]) {
    return { error: "A user with this email already exists." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const trialEnds = new Date(
    Date.now() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();
  const account: DemoAccount = {
    id: `user-${Buffer.from(normalizedEmail).toString("hex").slice(0, 12)}`,
    password,
    plan: planFromSlug(planSlug),
    is_staff: false,
    trial_active: true,
    trial_ends_at: trialEnds,
  };

  DEMO_ACCOUNTS[normalizedEmail] = account;
  // Broker connection defaults to "none" in localStorage (see brokerConnection.ts).
  return createTokensForAccount(account, normalizedEmail);
}

export function mockUserFromToken(token: string): AuthUser | null {
  const payload = verifyToken(token);
  if (!payload) return null;
  return {
    id: payload.sub,
    email: payload.email,
    plan: payload.plan,
    is_staff: payload.is_staff,
    trial_active: payload.trial_active,
    trial_ends_at: payload.trial_ends_at ?? null,
  };
}

export function isMockAuthEnabled(): boolean {
  return !process.env.NEXT_PUBLIC_BACKEND_URL;
}
