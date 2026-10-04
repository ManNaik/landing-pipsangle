"use client";

import { useCallback, useEffect, useState } from "react";
import { adminGet, adminPatch, adminPost } from "../../../lib/adminApi";
import type { AdminSiteConfig } from "../../../lib/types";
import { Alert } from "../_components/Alert";
import { btnPrimary, btnSecondary, FormField, inputClass, textareaClass } from "../_components/FormField";
import { PageHeader } from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";

type TextField = {
  key: keyof AdminSiteConfig;
  label: string;
  hint?: string;
  multiline?: boolean;
};

type JsonField = {
  key: "keywords" | "social_links" | "team_members";
  label: string;
  hint: string;
};

const GROUPS: Array<{ title: string; fields: TextField[] }> = [
  {
    title: "Brand and SEO",
    fields: [
      { key: "brand_name", label: "Brand name" },
      { key: "site_url", label: "Site URL", hint: "https://pipsangel.com" },
      { key: "default_title", label: "Default title" },
      { key: "title_template", label: "Title template", hint: "%s | PipsAngel" },
      { key: "default_description", label: "Default description", multiline: true },
      { key: "risk_disclaimer", label: "Risk disclaimer (footer)", multiline: true },
    ],
  },
  {
    title: "Support",
    fields: [
      { key: "support_email", label: "Support email", hint: "Must be a working mailbox on pipsangel.com." },
      { key: "support_hours", label: "Support hours", hint: "e.g. Mon to Fri, 9:00 to 18:00 IST. Blank hides it." },
      { key: "support_response_time", label: "Usual reply time", hint: "e.g. within one business day. Blank hides it." },
      { key: "whatsapp_url", label: "WhatsApp link", hint: "https://wa.me/... Blank hides it." },
      { key: "telegram_url", label: "Telegram link", hint: "https://t.me/... Blank hides it." },
    ],
  },
  {
    title: "Company identity",
    fields: [
      { key: "legal_name", label: "Legal company name" },
      { key: "registration_number", label: "Registration number" },
      { key: "registered_address", label: "Registered address", multiline: true },
      { key: "governing_law", label: "Governing law", hint: "Jurisdiction named in the terms, e.g. India." },
    ],
  },
  {
    title: "Proof and broker",
    fields: [
      { key: "track_record_url", label: "Verified track record URL", hint: "Myfxbook, FX Blue or MQL5 page. Blank hides it." },
      { key: "track_record_provider", label: "Track record provider name", hint: "e.g. Myfxbook" },
      { key: "broker_signup_url", label: "IC Markets account link", hint: "Blank uses the IC Markets home page." },
      {
        key: "broker_affiliate_disclosure",
        label: "Referral disclosure",
        hint: "Required if the IC Markets link pays you a referral fee.",
      },
    ],
  },
];

const JSON_FIELDS: JsonField[] = [
  { key: "keywords", label: "SEO keywords (JSON list)", hint: '["forex copy trading", "IC Markets MT5"]' },
  { key: "social_links", label: "Social links (JSON list)", hint: '[{"name": "YouTube", "url": "https://..."}]' },
  {
    key: "team_members",
    label: "Team (JSON list)",
    hint: '[{"name": "", "role": "", "bio": "", "photo_url": "", "linkedin_url": ""}]',
  },
];

type FormState = Record<string, string>;

function toForm(config: AdminSiteConfig): FormState {
  const form: FormState = {};
  for (const group of GROUPS) {
    for (const field of group.fields) form[field.key] = String(config[field.key] ?? "");
  }
  for (const field of JSON_FIELDS) form[field.key] = JSON.stringify(config[field.key] ?? [], null, 2);
  return form;
}

export default function AdminSiteConfigPage() {
  const [configs, setConfigs] = useState<AdminSiteConfig[]>([]);
  const [selected, setSelected] = useState<AdminSiteConfig | null>(null);
  const [form, setForm] = useState<FormState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function selectConfig(config: AdminSiteConfig) {
    setSelected(config);
    setForm(toForm(config));
    setError(null);
    setSuccess(null);
  }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: Record<string, unknown> = { ...form };
      for (const field of JSON_FIELDS) {
        try {
          payload[field.key] = JSON.parse(form[field.key] || "[]");
        } catch {
          throw new Error(`${field.label} is not valid JSON.`);
        }
      }
      await adminPatch(`/site-config/${selected.id}/`, payload);
      setSuccess("Site config updated. The public site refreshes within an hour.");
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
      <PageHeader title="Site Config" description="Brand, support channels, company details and proof links." />
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
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Edit config</h2>
            <StatusBadge active={selected.is_active} label={selected.is_active ? "Active" : "Inactive"} />
          </div>
          {error ? <Alert type="error" message={error} /> : null}
          {success ? <Alert type="success" message={success} /> : null}

          {GROUPS.map((group) => (
            <fieldset key={group.title} className="space-y-4">
              <legend className="text-sm font-semibold text-zinc-200">{group.title}</legend>
              {group.fields.map((field) => (
                <FormField key={field.key} label={field.label}>
                  {field.multiline ? (
                    <textarea
                      className={textareaClass}
                      value={form[field.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      className={inputClass}
                      value={form[field.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  )}
                  {field.hint ? <p className="mt-1 text-xs text-zinc-500">{field.hint}</p> : null}
                </FormField>
              ))}
            </fieldset>
          ))}

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-zinc-200">Lists</legend>
            {JSON_FIELDS.map((field) => (
              <FormField key={field.key} label={field.label}>
                <textarea
                  className={`${textareaClass} min-h-[110px] font-mono text-xs`}
                  value={form[field.key] ?? "[]"}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
                <p className="mt-1 text-xs text-zinc-500">{field.hint}</p>
              </FormField>
            ))}
          </fieldset>

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
