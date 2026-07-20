"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoginModal } from "../components/LoginModal";
import {
  clearTokens,
  fetchCurrentUser,
  getAccessToken,
  onAuthChange,
} from "../lib/auth";
import { defaultSiteConfig } from "../lib/defaultSiteConfig";
import type { AuthUser } from "../lib/types";
import { DashboardShell } from "./_components/DashboardShell";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const token = getAccessToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        setLoginOpen(true);
        return;
      }

      try {
        const current = await fetchCurrentUser(token);
        setUser(current);
        setLoginOpen(false);
      } catch {
        clearTokens();
        setUser(null);
        setLoginOpen(true);
      } finally {
        setLoading(false);
      }
    }

    void loadUser();
    return onAuthChange(() => {
      void loadUser();
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <p className="text-sm text-zinc-400">Loading your dashboard…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
            Account required
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white">Sign in to continue</h1>
          <p className="mt-2 max-w-md text-sm text-zinc-400">
            Log in to view your profit performance, account status, and settings.
          </p>
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="mt-6 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            Log in
          </button>
        </div>
        <LoginModal
          open={loginOpen}
          onClose={() => {
            setLoginOpen(false);
            router.push("/");
          }}
          onSuccess={() => setLoginOpen(false)}
        />
      </>
    );
  }

  return (
    <DashboardShell user={user} brandName={defaultSiteConfig.brand_name}>
      {children}
    </DashboardShell>
  );
}
