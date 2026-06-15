"use client";

import { useCallback, useEffect, useState } from "react";
import { adminDelete, adminGet, adminPatch, adminPost } from "../../../lib/adminApi";
import type { AdminPaginatedResponse, AdminTrade, TradeDirection, TradeResult } from "../../../lib/types";
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
  pips: 0,
  result: "profit" as TradeResult,
  closed_at: new Date().toISOString().slice(0, 16),
  is_published: true,
};

export default function AdminTradesPage() {
  const [items, setItems] = useState<AdminTrade[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminPaginatedResponse<AdminTrade>>("/trades/?limit=100");
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

  function startEdit(item: AdminTrade) {
    setEditingId(item.id);
    setForm({
      pair: item.pair,
      direction: item.direction,
      entry: item.entry,
      stop_loss: item.stop_loss,
      take_profit: item.take_profit,
      pips: item.pips,
      result: item.result,
      closed_at: item.closed_at.slice(0, 16),
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
      const payload = { ...form, closed_at: new Date(form.closed_at).toISOString() };
      if (editingId) {
        await adminPatch(`/trades/${editingId}/`, payload);
        setSuccess("Trade updated.");
      } else {
        await adminPost("/trades/", payload);
        setSuccess("Trade created.");
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
    if (!confirm("Delete this trade?")) return;
    try {
      await adminDelete(`/trades/${id}/`);
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  return (
    <div>
      <PageHeader title="Trades" description="Manage trading performance records." />
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="text-lg font-semibold text-white">{editingId ? "Edit trade" : "New trade"}</h2>
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
          <FormField label="Pips"><input type="number" className={inputClass} value={form.pips} onChange={(e) => setForm({ ...form, pips: Number(e.target.value) })} required /></FormField>
          <FormField label="Result">
            <select className={selectClass} value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value as "profit" | "loss" })}>
              <option value="profit">Profit</option>
              <option value="loss">Loss</option>
            </select>
          </FormField>
          <FormField label="Closed at"><input type="datetime-local" className={inputClass} value={form.closed_at} onChange={(e) => setForm({ ...form, closed_at: e.target.value })} required /></FormField>
          <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />Published</label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving…" : editingId ? "Update" : "Create"}</button>
            {editingId ? <button type="button" onClick={resetForm} className={btnSecondary}>Cancel</button> : null}
          </div>
        </form>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">All trades</h2>
          {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{item.pair} {item.direction}</p>
                  <p className="text-xs text-zinc-500">{item.pips} pips · {item.result}</p>
                </div>
                <StatusBadge active={item.is_published} />
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
