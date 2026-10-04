type DemoCredentials = {
  user: { email: string; password: string };
  admin: { email: string; password: string } | null;
};

/**
 * Local-only login hints, read from env at build time. Nothing is hard-coded so
 * production bundles never contain credentials.
 */
export function getDemoCredentials(): DemoCredentials | null {
  if (process.env.NODE_ENV === "production") return null;
  if (process.env.NEXT_PUBLIC_ENABLE_DEMO_CREDENTIALS !== "true") return null;

  const email = process.env.NEXT_PUBLIC_DEMO_USER_EMAIL?.trim();
  const password = process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD?.trim();
  if (!email || !password) return null;

  const adminEmail = process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL?.trim();
  const adminPassword = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD?.trim();

  return {
    user: { email, password },
    admin: adminEmail && adminPassword ? { email: adminEmail, password: adminPassword } : null,
  };
}
