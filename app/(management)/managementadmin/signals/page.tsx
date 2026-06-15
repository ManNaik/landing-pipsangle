"use client";

import { useCallback, useEffect, useState } from "react";
import { adminDelete, adminGet, adminPatch, adminPost } from "../../../lib/adminApi";
import type { AdminPaginatedResponse, AdminSignal, SignalStatus, TradeDirection } from "../../../lib/types";
import { Alert } from "../_components/Alert";
import {
  btnDanger,
  btnPrimary,
  btnSecondary,
  FormField,
  inputClass,
  selectClass,
} from "../_components/FormField";
import { PageHeader } from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";

const emptyForm = {
  pair: "EURUSD",
  direction: "BUY" as TradeDirection,
  entry: "1.00000",
  stop_loss: "0.99000",
  take_profit: "1.01000",
  risk_reward: "1:2",
  status: "active" as SignalStatus,
  issued_at: new Date().toISOString().slice(0, 16),
  closed_at: "",
  is_published: true,
};

export default function AdminSignalsPage() {
  const [items, setItems] = useState<AdminSignal[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminPaginatedResponse<AdminSignal>>("/signals/?limit=100");
      setItems(data.results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(item: AdminSignal) {
    setEditingId(item.id);
    setForm({
      pair: item.pair,
      direction: item.direction,
      entry: item.entry,
      stop_loss: item.stop_loss,
      take_profit: item.take_profit,
      risk_reward: item.risk_reward,
      status: item.status,
      issued_at: item.issued_at.slice(0, 16),
      closed_at: item.closed_at ? item.closed_at.slice(0, 16) : "",
      is_published: item.is_published,
    });
    setError(null);
    setSuccess(null);
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...form,
        issued_at: new Date(form.issued_at).toISOString(),
        closed_at: form.closed_at ? new Date(form.closed_at).toISOString() : null,
      };
      if (editingId) {
        await adminPatch(`/signals/${editingId}/`, payload);
        setSuccess("Signal updated.");
      } else {
        await adminPost("/signals/", payload);
        setSuccess("Signal created.");
      }
      resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this signal?")) return;
    try {
      await adminDelete(`/signals/${id}/`);
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  return (
    <div>
      <PageHeader title="Signals" description="Manage forex trading signals." />
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="text-lg font-semibold text-white">{editingId ? "Edit signal" : "New signal"}</h2>
          {error ? <Alert type="error" message={error} /> : null}
          {success ? <Alert type="success" message={success} /> : null}
          <FormField label="Pair"><input className={inputClass} value={form.pair} onChange={(e) => setForm({ ...form, pair: e.target.value })} required /></FormField>
          <FormField label="Direction">
            <select className={selectClass} value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value as "BUY" | "SELL" })}>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </FormField>
          <FormField label="Entry"><input className={inputClass} value={form.entry} onChange={(e) => setForm({ ...form, entry: e.target.value })} required /></FormField>
          <FormField label="Stop loss"><input className={inputClass} value={form.stop_loss} onChange={(e) => setForm({ ...form, stop_loss: e.target.value })} required /></FormField>
          <FormField label="Take profit"><input className={inputClass} value={form.take_profit} onChange={(e) => setForm({ ...form, take_profit: e.target.value })} required /></FormField>
          <FormField label="Risk/reward"><input className={inputClass} value={form.risk_reward} onChange={(e) => setForm({ ...form, risk_reward: e.target.value })} required /></FormField>
          <FormField label="Status">
            <select className={selectClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as SignalStatus })}>
              <option value="active">Active</option>
              <option value="hit_tp">Hit TP</option>
              <option value="hit_sl">Hit SL</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
            </select>
          </FormField>
          <FormField label="Issued at"><input type="datetime-local" className={inputClass} value={form.issued_at} onChange={(e) => setForm({ ...form, issued_at: e.target.value })} required /></FormField>
          <FormField label="Closed at (optional)"><input type="datetime-local" className={inputClass} value={form.closed_at} onChange={(e) => setForm({ ...form, closed_at: e.target.value })} /></FormField>
          <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />Published</label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving…" : editingId ? "Update" : "Create"}</button>
            {editingId ? <button type="button" onClick={resetForm} className={btnSecondary}>Cancel</button> : null}
          </div>
        </form>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">All signals</h2>
          {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{item.pair} {item.direction}</p>
                  <p className="text-xs text-zinc-500">{item.status} · {item.risk_reward}</p>
                </div>
                <StatusBadge active={item.status === "active"} label={item.status} />
              </div>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => startEdit(item)} className={btnSecondary}>Edit</button>
                <button type="button" onClick={() => handleDelete(item.id)} className={btnDanger}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
