"use client";

import { useCallback, useEffect, useState } from "react";
import { adminDelete, adminGet, adminPatch, adminPost } from "../../../lib/adminApi";
import type { AdminFaqItem, AdminPaginatedResponse } from "../../../lib/types";
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

const emptyForm = { question: "", answer: "", sort_order: 0, is_published: true };

export default function AdminFaqPage() {
  const [items, setItems] = useState<AdminFaqItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminPaginatedResponse<AdminFaqItem>>("/faq/?limit=100");
      setItems(data.results.sort((a, b) => a.sort_order - b.sort_order));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function moveItem(index: number, direction: -1 | 1) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const reordered = [...items];
    const temp = reordered[index].sort_order;
    reordered[index] = { ...reordered[index], sort_order: reordered[newIndex].sort_order };
    reordered[newIndex] = { ...reordered[newIndex], sort_order: temp };
    [reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]];
    try {
      await adminPost("/faq/reorder/", {
        items: reordered.map((item, i) => ({ id: item.id, sort_order: i })),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reorder failed.");
    }
  }

  function startEdit(item: AdminFaqItem) {
    setEditingId(item.id);
    setForm({ question: item.question, answer: item.answer, sort_order: item.sort_order, is_published: item.is_published });
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
      if (editingId) {
        await adminPatch(`/faq/${editingId}/`, form);
        setSuccess("FAQ updated.");
      } else {
        await adminPost("/faq/", { ...form, sort_order: items.length });
        setSuccess("FAQ created.");
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
    if (!confirm("Delete this FAQ item?")) return;
    try {
      await adminDelete(`/faq/${id}/`);
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  return (
    <div>
      <PageHeader title="FAQ" description="Manage frequently asked questions." />
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="text-lg font-semibold text-white">{editingId ? "Edit FAQ" : "New FAQ"}</h2>
          {error ? <Alert type="error" message={error} /> : null}
          {success ? <Alert type="success" message={success} /> : null}
          <FormField label="Question"><input className={inputClass} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required /></FormField>
          <FormField label="Answer"><textarea className={textareaClass} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} required /></FormField>
          <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />Published</label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving…" : editingId ? "Update" : "Create"}</button>
            {editingId ? <button type="button" onClick={resetForm} className={btnSecondary}>Cancel</button> : null}
          </div>
        </form>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">All items</h2>
          {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
          {items.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-white">{item.question}</p>
                <StatusBadge active={item.is_published} label={item.is_published ? "Published" : "Hidden"} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} className={btnSecondary}>↑</button>
                <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} className={btnSecondary}>↓</button>
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
