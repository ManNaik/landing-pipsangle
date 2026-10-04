"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { resetPassword } from "../../lib/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get("token") ?? "";
  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token.trim()) {
      setError("Reset token is required.");
      return;
    }

    setLoading(true);
    try {
      const detail = await resetPassword(token.trim(), password);
      setMessage(detail);
      setPassword("");
      setConfirm("");
      window.setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-3xl font-bold">Reset password</h1>
      <p className="mt-3 text-sage-300">
        Paste the reset token from your email and choose a new password.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        {error && (
          <p role="alert" className="rounded-lg border border-coral-400/50 bg-forest-850 px-3 py-2 text-sm text-coral-400">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="rounded-lg border border-leaf-600 bg-forest-850 px-3 py-2 text-sm text-mint-300">
            {message}
          </p>
        )}
        <div>
          <label htmlFor="reset-token" className="block text-sm font-semibold text-sage-200">
            Reset token
          </label>
          <input
            id="reset-token"
            type="text"
            required
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-forest-600 bg-forest-850 px-4 py-3 text-base text-paper outline-none focus:border-mint-500"
          />
        </div>
        <div>
          <label htmlFor="new-password" className="block text-sm font-semibold text-sage-200">
            New password
          </label>
          <input
            id="new-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-forest-600 bg-forest-850 px-4 py-3 text-base text-paper outline-none focus:border-mint-500"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-semibold text-sage-200">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-forest-600 bg-forest-850 px-4 py-3 text-base text-paper outline-none focus:border-mint-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-lg bg-mint-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-leaf-600 disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-sage-400">
        Need a new link?{" "}
        <Link href="/forgot-password" className="font-semibold text-mint-400 underline underline-offset-4">
          Request reset
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-sage-400">
          Loading…
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
