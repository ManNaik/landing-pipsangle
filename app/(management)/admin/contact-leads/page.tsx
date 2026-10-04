"use client";

import { useCallback, useEffect, useState } from "react";
import { adminGet, adminPatch } from "../../../lib/adminApi";
import type { AdminContactSubmission, AdminPaginatedResponse } from "../../../lib/types";
import { Alert } from "../_components/Alert";
import { PageHeader } from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";

export default function AdminContactLeadsPage() {
  const [items, setItems] = useState<AdminContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminPaginatedResponse<AdminContactSubmission>>("/submissions/contact/?limit=100");
      setItems(data.results);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleHandled(item: AdminContactSubmission) {
    try {
      await adminPatch(`/submissions/contact/${item.id}/`, { is_handled: !item.is_handled });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    }
  }

  const unhandled = items.filter((i) => !i.is_handled).length;

  return (
    <div>
      <PageHeader
        title="Contact Leads"
        description={`${unhandled} unhandled of ${items.length} total contact form submissions.`}
      />
      {error ? <Alert type="error" message={error} /> : null}
      {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-white">{item.name} · {item.email}</p>
                <p className="text-sm text-emerald-400/80">{item.subject}</p>
                <p className="mt-2 text-sm text-zinc-400">{item.message}</p>
                <p className="mt-2 text-xs text-zinc-500">{new Date(item.created_at).toLocaleString()}</p>
              </div>
              <StatusBadge active={!item.is_handled} label={item.is_handled ? "Handled" : "New"} />
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={item.is_handled}
                onChange={() => toggleHandled(item)}
              />
              Mark as handled
            </label>
          </div>
        ))}
        {!loading && items.length === 0 ? (
          <p className="text-sm text-zinc-500">No contact submissions yet.</p>
        ) : null}
      </div>
    </div>
  );
}
