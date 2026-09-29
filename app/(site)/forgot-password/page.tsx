"use client";

import Link from "next/link";
import { useState } from "react";
import { requestPasswordReset } from "../../lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const detail = await requestPasswordReset(email.trim());
      setMessage(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
        Account recovery
      </p>
      <h1 className="mt-2 text-3xl font-bold text-white">Forgot password</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Enter your email and we&apos;ll send reset instructions if an account exists.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {message}
          </p>
        )}
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Remembered it?{" "}
        <Link href="/signup" className="text-emerald-400 hover:text-emerald-300">
          Create account
        </Link>{" "}
        or return home to log in.
      </p>
    </div>
  );
}
