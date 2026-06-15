"use client";

import { useCallback, useEffect, useState } from "react";
import { adminGet, adminPatch, adminPost } from "../../../lib/adminApi";
import type { AdminPerformanceStats } from "../../../lib/types";
import { Alert } from "../_components/Alert";
import { btnPrimary, btnSecondary, FormField, inputClass } from "../_components/FormField";
import { PageHeader } from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";

export default function AdminStatsPage() {
  const [statsList, setStatsList] = useState<AdminPerformanceStats[]>([]);
  const [selected, setSelected] = useState<AdminPerformanceStats | null>(null);
  const [form, setForm] = useState({
    trades_executed: 0,
    trades_executed_display: "0",
    win_rate_percent: 0,
    average_pips: 0,
    max_drawdown_percent: 0,
    years_tested: 0,
    years_tested_display: "0",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminPerformanceStats[]>("/stats/performance/");
      setStatsList(data);
      const active = data.find((s) => s.is_active) ?? data[0] ?? null;
      if (active) selectStats(active);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function selectStats(stats: AdminPerformanceStats) {
    setSelected(stats);
    setForm({
      trades_executed: stats.trades_executed,
      trades_executed_display: stats.trades_executed_display,
      win_rate_percent: stats.win_rate_percent,
      average_pips: stats.average_pips,
      max_drawdown_percent: stats.max_drawdown_percent,
      years_tested: stats.years_tested,
      years_tested_display: stats.years_tested_display,
    });
    setError(null);
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await adminPatch(`/stats/${selected.id}/`, form);
      setSuccess("Performance stats updated.");
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
      setSuccess("Stats activated.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Activate failed.");
    }
  }

  return (
    <div>
      <PageHeader title="Performance Stats" description="Manage homepage performance metrics." />
      {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
      <div className="mb-6 flex flex-wrap gap-2">
        {statsList.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => selectStats(s)}
            className={`rounded-lg border px-3 py-2 text-sm ${selected?.id === s.id ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"}`}
          >
            Win rate {s.win_rate_percent}% {s.is_active ? "(active)" : ""}
          </button>
        ))}
      </div>
      {selected ? (
        <form onSubmit={handleSubmit} className="max-w-md space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Edit stats</h2>
            <StatusBadge active={selected.is_active} />
          </div>
          {error ? <Alert type="error" message={error} /> : null}
          {success ? <Alert type="success" message={success} /> : null}
          <FormField label="Trades executed"><input type="number" className={inputClass} value={form.trades_executed} onChange={(e) => setForm({ ...form, trades_executed: Number(e.target.value) })} /></FormField>
          <FormField label="Trades executed display"><input className={inputClass} value={form.trades_executed_display} onChange={(e) => setForm({ ...form, trades_executed_display: e.target.value })} /></FormField>
          <FormField label="Win rate %"><input type="number" className={inputClass} value={form.win_rate_percent} onChange={(e) => setForm({ ...form, win_rate_percent: Number(e.target.value) })} /></FormField>
          <FormField label="Average pips"><input type="number" className={inputClass} value={form.average_pips} onChange={(e) => setForm({ ...form, average_pips: Number(e.target.value) })} /></FormField>
          <FormField label="Max drawdown %"><input type="number" className={inputClass} value={form.max_drawdown_percent} onChange={(e) => setForm({ ...form, max_drawdown_percent: Number(e.target.value) })} /></FormField>
          <FormField label="Years tested"><input type="number" className={inputClass} value={form.years_tested} onChange={(e) => setForm({ ...form, years_tested: Number(e.target.value) })} /></FormField>
          <FormField label="Years tested display"><input className={inputClass} value={form.years_tested_display} onChange={(e) => setForm({ ...form, years_tested_display: e.target.value })} /></FormField>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving…" : "Save"}</button>
            {!selected.is_active ? (
              <button type="button" onClick={() => handleActivate(selected.id)} className={btnSecondary}>Activate</button>
            ) : null}
          </div>
        </form>
      ) : null}
    </div>
  );
}
