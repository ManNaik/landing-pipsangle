"use client";

import { useCallback, useEffect, useState } from "react";
import { adminDelete, adminGet, adminPatch, adminPost } from "../../../lib/adminApi";
import type { AdminCommunityMessage, AdminPaginatedResponse } from "../../../lib/types";
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
  username: "",
  message: "",
  created_at: new Date().toISOString().slice(0, 16),
  is_published: true,
};

export default function AdminCommunityPage() {
  const [items, setItems] = useState<AdminCommunityMessage[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminPaginatedResponse<AdminCommunityMessage>>("/community/messages/?limit=100");
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

  function startEdit(item: AdminCommunityMessage) {
    setEditingId(item.id);
    setForm({
      username: item.username,
      message: item.message,
      created_at: item.created_at.slice(0, 16),
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
      const payload = { ...form, created_at: new Date(form.created_at).toISOString() };
      if (editingId) {
        await adminPatch(`/community/messages/${editingId}/`, payload);
        setSuccess("Message updated.");
      } else {
        await adminPost("/community/messages/", payload);
        setSuccess("Message created.");
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
    if (!confirm("Delete this message?")) return;
    try {
      await adminDelete(`/community/messages/${id}/`);
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  return (
    <div>
      <PageHeader title="Community" description="Curate community chat messages." />
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h2 className="text-lg font-semibold text-white">{editingId ? "Edit message" : "New message"}</h2>
          {error ? <Alert type="error" message={error} /> : null}
          {success ? <Alert type="success" message={success} /> : null}
          <FormField label="Username"><input className={inputClass} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></FormField>
          <FormField label="Message"><textarea className={textareaClass} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></FormField>
          <FormField label="Created at"><input type="datetime-local" className={inputClass} value={form.created_at} onChange={(e) => setForm({ ...form, created_at: e.target.value })} required /></FormField>
          <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />Published</label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={btnPrimary}>{saving ? "Saving…" : editingId ? "Update" : "Create"}</button>
            {editingId ? <button type="button" onClick={resetForm} className={btnSecondary}>Cancel</button> : null}
          </div>
        </form>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">All messages</h2>
          {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-white">{item.username}</p>
                  <p className="mt-1 text-sm text-zinc-400">{item.message}</p>
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
