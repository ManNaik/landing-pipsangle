"use client";

import { useCallback, useEffect, useState } from "react";
import { adminDelete, adminGet } from "../../../lib/adminApi";
import type { AdminNewsletterSubscriber, AdminPaginatedResponse } from "../../../lib/types";
import { Alert } from "../_components/Alert";
import { btnDanger, btnPrimary } from "../_components/FormField";
import { PageHeader } from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";

const PAGE_SIZE = 100;
const MAX_PAGES = 200;

async function loadAllSubscribers(): Promise<AdminNewsletterSubscriber[]> {
  const all: AdminNewsletterSubscriber[] = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const data = await adminGet<AdminPaginatedResponse<AdminNewsletterSubscriber>>(
      `/newsletter/subscribers/?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`
    );
    all.push(...data.results);
    if (data.results.length === 0 || all.length >= data.count) break;
  }
  return all;
}

/** Quotes the cell and stops spreadsheet apps from running it as a formula. */
function csvCell(value: string): string {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function downloadCsv(subscribers: AdminNewsletterSubscriber[]) {
  const rows = [
    ["email", "confirmed_at", "source", "signed_up_at"],
    ...subscribers.map((item) => [item.email, item.confirmed_at ?? "", item.source, item.created_at]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `pipsangel-weekly-brief-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminNewsletterPage() {
  const [items, setItems] = useState<AdminNewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await loadAllSubscribers());
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

  async function remove(item: AdminNewsletterSubscriber) {
    if (!confirm(`Remove ${item.email}? They won't get the brief unless they sign up again.`)) return;
    try {
      await adminDelete(`/newsletter/subscribers/${item.id}/`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remove failed.");
    }
  }

  const confirmed = items.filter((item) => item.confirmed_at);

  return (
    <div>
      <PageHeader
        title="Newsletter"
        description={`${confirmed.length} confirmed, ${items.length - confirmed.length} waiting to confirm. Only send the weekly brief to confirmed addresses.`}
      />
      {error ? <Alert type="error" message={error} /> : null}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={btnPrimary}
          disabled={confirmed.length === 0}
          onClick={() => downloadCsv(confirmed)}
        >
          Download confirmed (CSV)
        </button>
        <p className="text-sm text-zinc-500">Import the file into your email tool to send the brief.</p>
      </div>
      {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-zinc-900/60 text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Signed up from</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-zinc-800">
                <td className="px-4 py-3 text-white">{item.email}</td>
                <td className="px-4 py-3">
                  <StatusBadge active={Boolean(item.confirmed_at)} label={item.confirmed_at ? "Confirmed" : "Pending"} />
                </td>
                <td className="px-4 py-3 text-zinc-400">{item.source}</td>
                <td className="px-4 py-3 text-zinc-400">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" className={btnDanger} onClick={() => remove(item)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && items.length === 0 ? <p className="px-4 py-6 text-sm text-zinc-500">No signups yet.</p> : null}
      </div>
    </div>
  );
}
