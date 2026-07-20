"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { apiPost } from "../lib/api";
import { notifyAuthChange, setTokens } from "../lib/auth";
import { FREE_TRIAL_CTA } from "../lib/trial";
import type { LoginResponse } from "../lib/types";

export function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planSlug = searchParams.get("plan") ?? "";
  const isTrial = searchParams.get("trial") === "1";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const plan = (formData.get("plan_slug") as string) || planSlug;

    try {
      const result = await apiPost<LoginResponse>("/auth/signup/", {
        email,
        password,
        plan_slug: plan || undefined,
      });
      setTokens(result.access_token, result.refresh_token);
      notifyAuthChange();
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-zinc-300">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500/60"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-zinc-300">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          name="password"
          required
          minLength={8}
          placeholder="Min. 8 characters"
          className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500/60"
        />
      </div>
      {planSlug && (
        <input type="hidden" name="plan_slug" value={planSlug} />
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60 min-h-[3rem]"
      >
        {loading ? "Creating account…" : isTrial ? FREE_TRIAL_CTA : "Create Account"}
      </button>
    </form>
  );
}
