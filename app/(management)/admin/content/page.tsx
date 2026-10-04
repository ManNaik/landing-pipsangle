"use client";

import { useCallback, useEffect, useState } from "react";
import { adminDelete, adminGet, adminPatch, adminPost } from "../../../lib/adminApi";
import type { AdminContentBlock, AdminPaginatedResponse } from "../../../lib/types";
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

const emptyForm = { key: "", title: "", subtitle: "", body: "", metadata: "{}" };

export default function AdminContentPage() {
  const [items, setItems] = useState<AdminContentBlock[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminPaginatedResponse<AdminContentBlock>>("/content/blocks/?limit=100");
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

  function startEdit(item: AdminContentBlock) {
    setEditingKey(item.key);
    setForm({
      key: item.key,
      title: item.title,
      subtitle: item.subtitle,
      body: item.body,
      metadata: JSON.stringify(item.metadata, null, 2),
    });
    setError(null);
    setSuccess(null);
  }

  function resetForm() {
    setEditingKey(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = { ...form, metadata: JSON.parse(form.metadata) as Record<string, unknown> };
      if (editingKey) {
        await adminPatch(`/content/blocks/${editingKey}/`, payload);
        setSuccess("Block updated.");
      } else {
        await adminPost("/content/blocks/", payload);
        setSuccess("Block created.");
      }
      resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(key: string) {
    if (!confirm("Delete this content block?")) return;
    try {
      await adminDelete(`/content/blocks/${key}/`);
      if (editingKey === key) resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  return (
    <div>
      <PageHeader title="Content Blocks" description="Manage page copy keyed by identifier." />
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="text-lg font-semibold text-white">{editingKey ? "Edit block" : "New block"}</h2>
          {error ? <Alert type="error" message={error} /> : null}
          {success ? <Alert type="success" message={success} /> : null}
          <FormField label="Key" hint="e.g. home.hero, faq.page"><input className={inputClass} value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} required disabled={!!editingKey} /></FormField>
          <FormField label="Title"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Subtitle"><textarea className={textareaClass} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></FormField>
          <FormField label="Body"><textarea className={`${textareaClass} min-h-[120px]`} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></FormField>
          <FormField label="Metadata (JSON)"><textarea className={`${textareaClass} font-mono text-xs min-h-[120px]`} value={form.metadata} onChange={(e) => setForm({ ...form, metadata: e.target.value })} /></FormField>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving…" : editingKey ? "Update" : "Create"}</button>
            {editingKey ? <button type="button" onClick={resetForm} className={btnSecondary}>Cancel</button> : null}
          </div>
        </form>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">All blocks</h2>
          {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
              <p className="font-mono text-sm font-medium text-emerald-400">{item.key}</p>
              <p className="mt-1 text-sm text-zinc-400">{item.title || "(no title)"}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => startEdit(item)} className={btnSecondary}>Edit</button>
                <button type="button" onClick={() => handleDelete(item.key)} className={btnDanger}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
