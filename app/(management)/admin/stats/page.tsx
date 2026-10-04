"use client";

import { useCallback, useEffect, useState } from "react";
import { adminGet, adminPatch, adminPost } from "../../../lib/adminApi";
import type { AdminPerformanceStats, PaginatedResponse, Trade } from "../../../lib/types";
import { apiGetClient } from "../../../lib/api";
import { Alert } from "../_components/Alert";
import { btnPrimary, btnSecondary } from "../_components/FormField";
import { PageHeader } from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";

type Preview = { total: number; wins: number; netPips: number; first: string | null; last: string | null };

function summarize(trades: Trade[], total: number): Preview {
  const ordered = [...trades].sort((a, b) => a.closed_at.localeCompare(b.closed_at));
  return {
    total,
    wins: trades.filter((trade) => trade.pips > 0).length,
    netPips: trades.reduce((sum, trade) => sum + trade.pips, 0),
    first: ordered[0]?.closed_at ?? null,
    last: ordered[ordered.length - 1]?.closed_at ?? null,
  };
}

export default function AdminStatsPage() {
  const [statsList, setStatsList] = useState<AdminPerformanceStats[]>([]);
  const [selected, setSelected] = useState<AdminPerformanceStats | null>(null);
  const [published, setPublished] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, trades] = await Promise.all([
        adminGet<AdminPerformanceStats[]>("/stats/performance/"),
        apiGetClient<PaginatedResponse<Trade>>("/trades/?limit=100").catch(() => null),
      ]);
      setStatsList(data);
      const active = data.find((s) => s.is_active) ?? data[0] ?? null;
      if (active) {
        setSelected(active);
        setPublished(active.is_published);
      }
      setPreview(trades ? summarize(trades.results, trades.count) : null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await adminPatch(`/stats/${selected.id}/`, { is_published: published });
      setSuccess(published ? "Track record published on the public site." : "Track record hidden from the public site.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate(id: string) {
    try {
      await adminPost(`/stats/${id}/activate/`, {});
      setSuccess("Stats row activated.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Activate failed.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Public track record"
        description="Controls whether performance figures appear on the public site. Figures are always calculated from published trades."
      />
      {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
      {statsList.length > 1 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {statsList.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSelected(s);
                setPublished(s.is_published);
              }}
              className={`rounded-lg border px-3 py-2 text-sm ${selected?.id === s.id ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"}`}
            >
              Stats row {s.is_active ? "(active)" : ""}
            </button>
          ))}
        </div>
      ) : null}

      {preview ? (
        <div className="mb-6 max-w-xl rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 text-sm text-zinc-300">
          <h2 className="text-base font-semibold text-white">What visitors would see</h2>
          <p className="mt-2">
            {preview.total} published trades, {preview.wins} of the latest {Math.min(preview.total, 100)} won, net{" "}
            {preview.netPips} pips across the latest {Math.min(preview.total, 100)}.
            {preview.first ? ` First trade ${preview.first.slice(0, 10)}, latest ${preview.last?.slice(0, 10)}.` : ""}
          </p>
          <p className="mt-2 text-zinc-500">
            Check the trades list first. Delete or unpublish any test or sample trades before publishing.
          </p>
        </div>
      ) : null}

      {selected ? (
        <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Publishing</h2>
            <StatusBadge active={selected.is_published} label={selected.is_published ? "Published" : "Hidden"} />
          </div>
          {error ? <Alert type="error" message={error} /> : null}
          {success ? <Alert type="success" message={success} /> : null}
          <label className="flex items-start gap-3 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Show the track record on the public site. Only tick this when every published trade is a real,
              closed trade.
            </span>
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={btnPrimary}>
              {saving ? "Saving…" : "Save"}
            </button>
            {!selected.is_active ? (
              <button type="button" onClick={() => handleActivate(selected.id)} className={btnSecondary}>
                Activate
              </button>
            ) : null}
          </div>
        </form>
      ) : null}
    </div>
  );
}
