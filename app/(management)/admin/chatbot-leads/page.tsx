"use client";

import { useCallback, useEffect, useState } from "react";
import { adminGet, adminPatch } from "../../../lib/adminApi";
import type { AdminLeadSubmission, AdminPaginatedResponse } from "../../../lib/types";
import { Alert } from "../_components/Alert";
import { PageHeader } from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";

export default function AdminChatbotLeadsPage() {
  const [items, setItems] = useState<AdminLeadSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminPaginatedResponse<AdminLeadSubmission>>("/submissions/leads/?limit=100");
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

  async function toggleContacted(item: AdminLeadSubmission) {
    try {
      await adminPatch(`/submissions/leads/${item.id}/`, { is_contacted: !item.is_contacted });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    }
  }

  const uncontacted = items.filter((i) => !i.is_contacted).length;

  return (
    <div>
      <PageHeader
        title="Chatbot Leads"
        description={`${uncontacted} uncontacted of ${items.length} total chatbot lead submissions.`}
      />
      {error ? <Alert type="error" message={error} /> : null}
      {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-white">{item.name} · {item.email}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span>Interest: {item.interest}</span>
                  <span>Experience: {item.experience}</span>
                  <span>Plan: {item.plan_interest}</span>
                  <span>Source: {item.source}</span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">{new Date(item.created_at).toLocaleString()}</p>
              </div>
              <StatusBadge active={!item.is_contacted} label={item.is_contacted ? "Contacted" : "New"} />
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={item.is_contacted}
                onChange={() => toggleContacted(item)}
              />
              Mark as contacted
            </label>
          </div>
        ))}
        {!loading && items.length === 0 ? (
          <p className="text-sm text-zinc-500">No chatbot leads yet.</p>
        ) : null}
      </div>
    </div>
  );
}
