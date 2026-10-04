"use client";

import { useCallback, useEffect, useState } from "react";
import { adminGet } from "../../../lib/adminApi";
import { Alert } from "../_components/Alert";
import { PageHeader } from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";

type OnboardingRow = {
  id: string;
  email: string;
  phone_e164: string | null;
  status: string;
  angel_status: string;
  broker_name: string;
  mt5_login: string;
  mt5_server: string;
  mt5_password: string;
  client_secret: string | null;
  account_key: string;
  error: string;
  submitted_at: string | null;
};

function CopyValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-w-0">
      <p className="text-xs text-zinc-500">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <code className="truncate text-sm text-zinc-100">{value || "—"}</code>
        {value ? (
          <button
            type="button"
            onClick={() => void copy()}
            className="shrink-0 rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminOnboardingPage() {
  const [items, setItems] = useState<OnboardingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<{ results: OnboardingRow[] }>("/onboarding/");
      setItems(data.results);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <PageHeader
        title="Onboarding"
        description="Copy each customer's MT5 login, password, and client secret into pips-angel. The trial starts after that account connects."
      />
      {error ? <Alert type="error" message={error} /> : null}
      {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
      {!loading && items.length === 0 ? (
        <p className="text-sm text-zinc-400">No accounts are waiting.</p>
      ) : null}
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-white">{item.email}</p>
                <p className="text-xs text-zinc-500">
                  {item.phone_e164 || "No phone"} · {item.broker_name || "MT5"}
                  {item.submitted_at ? ` · Submitted ${new Date(item.submitted_at).toLocaleString()}` : ""}
                </p>
              </div>
              <StatusBadge active={item.status === "active_trial" || item.status === "paid"} label={item.status} />
            </div>
            {item.error ? <p className="mt-2 text-sm text-red-300">{item.error}</p> : null}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <CopyValue label="MT5 login" value={item.mt5_login} />
              <CopyValue label="Server" value={item.mt5_server} />
              <CopyValue label="MT5 password" value={item.mt5_password} />
              <CopyValue label="Client secret" value={item.client_secret ?? ""} />
            </div>
            {item.angel_status ? (
              <p className="mt-3 text-xs text-zinc-500">Fleet status: {item.angel_status}</p>
            ) : null}
            {item.account_key ? (
              <p className="text-xs text-zinc-500">Linked account: {item.account_key}</p>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
