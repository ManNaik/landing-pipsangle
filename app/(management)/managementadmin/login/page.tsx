"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminLogin } from "../../../lib/auth";
import { Alert } from "../_components/Alert";
import { btnPrimary, FormField, inputClass } from "../_components/FormField";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await adminLogin(email, password);
      router.replace("/managementadmin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
          Staff only
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">Management Admin</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Sign in with your staff account to manage landing page content.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error ? <Alert type="error" message={error} /> : null}
          <FormField label="Email">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="email"
            />
          </FormField>
          <FormField label="Password">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
          </FormField>
          <button type="submit" disabled={loading} className={`${btnPrimary} w-full py-3`}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
