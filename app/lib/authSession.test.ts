import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  clearSessionCookieWrites,
  isAdminLoginPath,
  isCookieSecure,
  isProtectedAppPath,
  isTrustedMutation,
  safeInternalPath,
  sessionCookieWrites,
  toSameOriginProxyPath,
  tokenMaxAgeSeconds,
  unauthenticatedRedirect,
} from "./authSession";
import {
  exchangeCredentials,
  isBlockedProxyPath,
  isLoopbackProxyTarget,
  normalizeApiPath,
  resetRefreshInflightForTests,
  runAuthenticatedProxy,
  stripSecretFields,
  type UpstreamRequest,
  type UpstreamResult,
} from "./authProxy";

function jwt(exp: number): string {
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  return `header.${payload}.sig`;
}

function request(method: string, origin: string | null, host = "pipsangel.com"): {
  method: string;
  headers: Headers;
  url: string;
} {
  const headers = new Headers({ host });
  if (origin) headers.set("origin", origin);
  return { method, headers, url: `https://${host}/api/auth/login` };
}

describe("session cookies", () => {
  it("uses HttpOnly SameSite=Lax and follows AUTH_COOKIE_SECURE", () => {
    const previous = process.env.AUTH_COOKIE_SECURE;
    process.env.AUTH_COOKIE_SECURE = "false";
    const now = Math.floor(Date.now() / 1000);
    const writes = sessionCookieWrites({
      access: jwt(now + 3600),
      refresh: jwt(now + 86400),
    });
    assert.equal(writes[0]?.name, ACCESS_COOKIE);
    assert.equal(writes[1]?.name, REFRESH_COOKIE);
    assert.equal(writes[0]?.options.httpOnly, true);
    assert.equal(writes[0]?.options.sameSite, "lax");
    assert.equal(writes[0]?.options.path, "/");
    assert.equal(writes[0]?.options.secure, false);
    assert.ok((writes[0]?.options.maxAge ?? 0) > 0);
    assert.ok((writes[1]?.options.maxAge ?? 0) > (writes[0]?.options.maxAge ?? 0));

    process.env.AUTH_COOKIE_SECURE = "true";
    assert.equal(isCookieSecure(), true);
    assert.equal(sessionCookieWrites({
      access: "opaque-access",
      refresh: "opaque-refresh",
    })[0]?.options.secure, true);

    const cleared = clearSessionCookieWrites();
    assert.equal(cleared[0]?.options.maxAge, 0);
    assert.equal(cleared[1]?.value, "");

    if (previous === undefined) delete process.env.AUTH_COOKIE_SECURE;
    else process.env.AUTH_COOKIE_SECURE = previous;
  });

  it("derives max-age from JWT exp and drops expired tokens", () => {
    const now = Math.floor(Date.now() / 1000);
    assert.equal(tokenMaxAgeSeconds(jwt(now + 120), 10), 120);
    assert.equal(tokenMaxAgeSeconds(jwt(now - 5), 10), 0);
    assert.equal(tokenMaxAgeSeconds("not-a-jwt", 10), 10);
  });
});

describe("csrf and route protection", () => {
  it("allows mutations only when Origin host matches Host", () => {
    assert.equal(
      isTrustedMutation(request("POST", "https://pipsangel.com")),
      true
    );
    assert.equal(
      isTrustedMutation(request("POST", "https://evil.example")),
      false
    );
    assert.equal(isTrustedMutation(request("POST", null)), false);
    assert.equal(
      isTrustedMutation(request("GET", "https://evil.example")),
      true
    );
  });

  it("protects dashboard routes and leaves staff checks to the app", () => {
    assert.equal(isProtectedAppPath("/dashboard"), true);
    assert.equal(isProtectedAppPath("/onboarding/start"), true);
    assert.equal(isProtectedAppPath("/pricing"), false);
    assert.equal(isAdminLoginPath("/admin/login"), true);
    assert.equal(unauthenticatedRedirect("/dashboard"), "/?login=1&next=%2Fdashboard");
    assert.equal(
      unauthenticatedRedirect("/admin/signals"),
      "/admin/login"
    );
    assert.equal(unauthenticatedRedirect("/admin/login"), null);
    assert.equal(
      toSameOriginProxyPath("/api/proxy", "/broker/connection/?x=1"),
      "/api/proxy/broker/connection?x=1"
    );
    assert.equal(
      toSameOriginProxyPath("/api/proxy/admin", "users/?limit=100"),
      "/api/proxy/admin/users?limit=100"
    );
    assert.equal(safeInternalPath("/subscription"), "/subscription");
    assert.equal(safeInternalPath("https://evil.example"), null);
    assert.equal(safeInternalPath("//evil.example"), null);
  });
});

describe("authenticated proxy", () => {
  it("refreshes once on 401, rotates tokens, and hides them from the body", async () => {
    resetRefreshInflightForTests();
    let refreshCalls = 0;
    const call = async (req: UpstreamRequest): Promise<UpstreamResult> => {
      if (req.url.endsWith("/auth/token/refresh/")) {
        refreshCalls += 1;
        await new Promise((resolve) => setTimeout(resolve, 15));
        return {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            access_token: "next-access",
            refresh_token: "next-refresh",
          }),
        };
      }
      if (req.headers.Authorization === "Bearer next-access") {
        return {
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: "user-1",
            access_token: "should-not-leak",
            refresh_token: "should-not-leak",
          }),
        };
      }
      return {
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ detail: "expired" }),
      };
    };

    const input = {
      method: "GET",
      url: "https://api.example/api/v1/auth/me/",
      access: "old-access",
      refresh: "old-refresh",
      refreshUrl: "https://api.example/api/v1/auth/token/refresh/",
      call,
    };
    const [first, second] = await Promise.all([
      runAuthenticatedProxy(input),
      runAuthenticatedProxy(input),
    ]);

    assert.equal(refreshCalls, 1);
    assert.equal(first.status, 200);
    assert.equal(first.tokens?.access, "next-access");
    assert.equal(first.tokens?.refresh, "next-refresh");
    assert.equal(first.body.includes("refresh_token"), false);
    assert.equal(first.body.includes("should-not-leak"), false);
    assert.equal(second.tokens?.refresh, "next-refresh");
    assert.equal(first.clearSession, false);
  });

  it("clears the session when refresh fails and does not retry forever", async () => {
    resetRefreshInflightForTests();
    let refreshCalls = 0;
    const result = await runAuthenticatedProxy({
      method: "GET",
      url: "https://api.example/api/v1/broker/connection/",
      access: null,
      refresh: "dead-refresh",
      refreshUrl: "https://api.example/api/v1/auth/token/refresh/",
      call: async () => {
        refreshCalls += 1;
        return {
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ detail: "invalid" }),
        };
      },
    });
    assert.equal(refreshCalls, 1);
    assert.equal(result.status, 401);
    assert.equal(result.clearSession, true);
    assert.equal(result.tokens, null);
    assert.equal(result.body.includes("dead-refresh"), false);
  });

  it("returns only the user from login and signup exchanges", async () => {
    const result = await exchangeCredentials({
      url: "https://api.example/api/v1/auth/login/",
      body: JSON.stringify({ email: "a@b.c", password: "secret" }),
      call: async () => ({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "access",
          refresh_token: "refresh-secret",
          user: { id: "1", email: "a@b.c", is_staff: false },
        }),
      }),
    });
    assert.equal(result.status, 200);
    assert.equal(result.tokens?.refresh, "refresh-secret");
    const parsed = JSON.parse(result.body) as Record<string, unknown>;
    assert.equal("refresh_token" in parsed, false);
    assert.equal("access_token" in parsed, false);
    assert.deepEqual(parsed.user, { id: "1", email: "a@b.c", is_staff: false });
  });

  it("blocks token endpoints and path traversal", () => {
    assert.equal(normalizeApiPath(["broker", "connection"]), "broker/connection/");
    assert.equal(normalizeApiPath(["..", "auth"]), null);
    assert.equal(isBlockedProxyPath("auth/token/refresh/"), true);
    assert.equal(isBlockedProxyPath("broker/connection/"), false);
    assert.equal(
      isLoopbackProxyTarget(
        "https://pipsangel.com/api/proxy/auth/me/",
        "pipsangel.com"
      ),
      true
    );
    assert.equal(
      isLoopbackProxyTarget(
        "https://api.pipsangel.com/api/v1/auth/me/",
        "pipsangel.com"
      ),
      false
    );
    assert.equal(stripSecretFields('{"ok":true}', "application/json"), '{"ok":true}');
  });
});
