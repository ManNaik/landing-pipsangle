/** True when mock API localStorage paths are explicitly enabled. */
export function isMockApiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
}

/**
 * Dev-only demo credentials / simulation helpers.
 * Never enabled in production builds, even if the env flag is set.
 */
export function isDevDemoEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.NEXT_PUBLIC_ENABLE_DEMO_CREDENTIALS === "true";
}

export function getApiBaseUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  return "https://api.pipsangel.com";
}

/**
 * Server-side origin for the auth BFF. Public SSR keeps using getApiBaseUrl().
 */
export function getServerApiBaseUrl(): string {
  const server = process.env.API_BASE_URL?.trim();
  if (server) return server.replace(/\/$/, "");
  return getApiBaseUrl();
}
