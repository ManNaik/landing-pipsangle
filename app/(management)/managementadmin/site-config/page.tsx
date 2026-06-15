"use client";

import { useCallback, useEffect, useState } from "react";
import { adminGet, adminPatch, adminPost } from "../../../lib/adminApi";
import type { AdminSiteConfig } from "../../../lib/types";
import { Alert } from "../_components/Alert";
import { btnPrimary, btnSecondary, FormField, inputClass, textareaClass } from "../_components/FormField";
import { PageHeader } from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";

export default function AdminSiteConfigPage() {
  const [configs, setConfigs] = useState<AdminSiteConfig[]>([]);
  const [selected, setSelected] = useState<AdminSiteConfig | null>(null);
  const [form, setForm] = useState({
    brand_name: "",
    site_url: "",
    default_title: "",
    title_template: "",
    default_description: "",
    keywords: "[]",
    risk_disclaimer: "",
    navigation: "[]",
    footer_links: "{}",
    header_cta_label: "",
    header_cta_action: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminSiteConfig[]>("/site-config/");
      setConfigs(data);
      const active = data.find((c) => c.is_active) ?? data[0] ?? null;
      if (active) selectConfig(active);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function selectConfig(config: AdminSiteConfig) {
    setSelected(config);
    setForm({
      brand_name: config.brand_name,
      site_url: config.site_url,
      default_title: config.default_title,
      title_template: config.title_template,
      default_description: config.default_description,
      keywords: JSON.stringify(config.keywords, null, 2),
      risk_disclaimer: config.risk_disclaimer,
      navigation: JSON.stringify(config.navigation, null, 2),
      footer_links: JSON.stringify(config.footer_links, null, 2),
      header_cta_label: config.header_cta_label,
      header_cta_action: config.header_cta_action,
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
      const payload = {
        ...form,
        keywords: JSON.parse(form.keywords),
        navigation: JSON.parse(form.navigation),
        footer_links: JSON.parse(form.footer_links),
      };
      await adminPatch(`/site-config/${selected.id}/`, payload);
      setSuccess("Site config updated.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate(id: string) {
    try {
      await adminPost(`/site-config/${id}/activate/`, {});
      setSuccess("Config activated.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Activate failed.");
    }
  }

  return (
    <div>
      <PageHeader title="Site Config" description="Manage navigation, SEO, and branding." />
      {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
      <div className="mb-6 flex flex-wrap gap-2">
        {configs.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectConfig(c)}
            className={`rounded-lg border px-3 py-2 text-sm ${selected?.id === c.id ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"}`}
          >
            {c.brand_name} {c.is_active ? "(active)" : ""}
          </button>
        ))}
      </div>
      {selected ? (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Edit config</h2>
            <StatusBadge active={selected.is_active} label={selected.is_active ? "Active" : "Inactive"} />
          </div>
          {error ? <Alert type="error" message={error} /> : null}
          {success ? <Alert type="success" message={success} /> : null}
          <FormField label="Brand name"><input className={inputClass} value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} /></FormField>
          <FormField label="Site URL"><input className={inputClass} value={form.site_url} onChange={(e) => setForm({ ...form, site_url: e.target.value })} /></FormField>
          <FormField label="Default title"><input className={inputClass} value={form.default_title} onChange={(e) => setForm({ ...form, default_title: e.target.value })} /></FormField>
          <FormField label="Title template"><input className={inputClass} value={form.title_template} onChange={(e) => setForm({ ...form, title_template: e.target.value })} /></FormField>
          <FormField label="Default description"><textarea className={textareaClass} value={form.default_description} onChange={(e) => setForm({ ...form, default_description: e.target.value })} /></FormField>
          <FormField label="Keywords (JSON)"><textarea className={`${textareaClass} font-mono text-xs`} value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} /></FormField>
          <FormField label="Risk disclaimer"><textarea className={textareaClass} value={form.risk_disclaimer} onChange={(e) => setForm({ ...form, risk_disclaimer: e.target.value })} /></FormField>
          <FormField label="Navigation (JSON)"><textarea className={`${textareaClass} font-mono text-xs min-h-[120px]`} value={form.navigation} onChange={(e) => setForm({ ...form, navigation: e.target.value })} /></FormField>
          <FormField label="Footer links (JSON)"><textarea className={`${textareaClass} font-mono text-xs min-h-[120px]`} value={form.footer_links} onChange={(e) => setForm({ ...form, footer_links: e.target.value })} /></FormField>
          <FormField label="Header CTA label"><input className={inputClass} value={form.header_cta_label} onChange={(e) => setForm({ ...form, header_cta_label: e.target.value })} /></FormField>
          <FormField label="Header CTA action"><input className={inputClass} value={form.header_cta_action} onChange={(e) => setForm({ ...form, header_cta_action: e.target.value })} /></FormField>
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
