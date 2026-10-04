"use client";

import { useCallback, useEffect, useState } from "react";
import { adminDelete, adminGet, adminPatch, adminPost } from "../../../lib/adminApi";
import type { AdminPaginatedResponse, PricingPlan } from "../../../lib/types";
import { Alert } from "../_components/Alert";
import {
  btnDanger,
  btnPrimary,
  btnSecondary,
  FormField,
  inputClass,
  textareaClass,
} from "../_components/FormField";
import { PageHeader } from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";

const emptyForm = {
  name: "",
  slug: "",
  price: "0",
  billing_period: "month",
  features: "[]",
  is_popular: false,
  cta_label: "Get Started",
  cta_url: "/signup",
  sort_order: 0,
  is_active: true,
};

export default function AdminPricingPage() {
  const [items, setItems] = useState<PricingPlan[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminPaginatedResponse<PricingPlan>>("/pricing/plans/?limit=100");
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

  function startEdit(item: PricingPlan) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      slug: item.slug,
      price: String(item.price),
      billing_period: item.billing_period,
      features: JSON.stringify(item.features, null, 2),
      is_popular: item.is_popular,
      cta_label: item.cta_label,
      cta_url: item.cta_url,
      sort_order: item.sort_order,
      is_active: item.is_active,
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
        price: form.price,
        sort_order: Number(form.sort_order),
        features: JSON.parse(form.features) as string[],
      };
      if (editingId) {
        await adminPatch(`/pricing/plans/${editingId}/`, payload);
        setSuccess("Plan updated.");
      } else {
        await adminPost("/pricing/plans/", payload);
        setSuccess("Plan created.");
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
    if (!confirm("Delete this plan?")) return;
    try {
      await adminDelete(`/pricing/plans/${id}/`);
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  return (
    <div>
      <PageHeader title="Pricing" description="Manage subscription pricing plans." />
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="text-lg font-semibold text-white">{editingId ? "Edit plan" : "New plan"}</h2>
          {error ? <Alert type="error" message={error} /> : null}
          {success ? <Alert type="success" message={success} /> : null}
          <FormField label="Name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
          <FormField label="Slug"><input className={inputClass} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required /></FormField>
          <FormField label="Price"><input type="number" step="0.01" className={inputClass} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></FormField>
          <FormField label="Billing period"><input className={inputClass} value={form.billing_period} onChange={(e) => setForm({ ...form, billing_period: e.target.value })} /></FormField>
          <FormField label="Features (JSON array)" hint='e.g. ["Feature 1", "Feature 2"]'>
            <textarea className={`${textareaClass} font-mono text-xs`} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
          </FormField>
          <FormField label="CTA label"><input className={inputClass} value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} /></FormField>
          <FormField label="CTA URL"><input className={inputClass} value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} /></FormField>
          <FormField label="Sort order"><input type="number" className={inputClass} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></FormField>
          <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} />Popular</label>
          <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />Active</label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving…" : editingId ? "Update" : "Create"}</button>
            {editingId ? <button type="button" onClick={resetForm} className={btnSecondary}>Cancel</button> : null}
          </div>
        </form>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">All plans</h2>
          {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-xs text-zinc-500">${item.price}/{item.billing_period}</p>
                </div>
                <StatusBadge active={item.is_active} />
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
