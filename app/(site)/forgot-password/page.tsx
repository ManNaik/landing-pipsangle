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
      <h1 className="text-3xl font-bold">Forgot password</h1>
      <p className="mt-3 text-sage-300">
        Enter your email and we&apos;ll send reset instructions if an account exists.
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
          <label htmlFor="reset-email" className="block text-sm font-semibold text-sage-200">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-forest-600 bg-forest-850 px-4 py-3 text-base text-paper outline-none focus:border-mint-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-lg bg-mint-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-leaf-600 disabled:opacity-60"
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-sage-400">
        Remembered it?{" "}
        <Link href="/?login=1" className="font-semibold text-mint-400 underline underline-offset-4">
          Log in
        </Link>
      </p>
    </div>
  );
}
