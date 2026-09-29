import { isDevDemoEnabled } from "./env";

const DEV_DEMO = {
  user: { email: "demo@pipangel.com", password: "demo12345" },
  admin: { email: "admin@pipsangel.com", password: "admin12345" },
} as const;

/**
 * Demo credentials are only available when explicitly enabled in non-production.
 * Production builds always receive null.
 */
export function getDemoCredentials(): typeof DEV_DEMO | null {
  if (!isDevDemoEnabled()) return null;
  return DEV_DEMO;
}

/** @deprecated Use getDemoCredentials() — empty in production. */
export const DEMO_CREDENTIALS = DEV_DEMO;
