import { hasAnalyticsConsent } from "./consent";

const CAMPAIGN_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
  "ttclid",
] as const;

type CampaignKey = (typeof CAMPAIGN_KEYS)[number];

export type Attribution = Partial<Record<CampaignKey | "landing_page" | "referrer" | "first_seen_at", string>>;

const STORAGE_KEY = "pipsangel_attribution";
const PERSIST_DAYS = 30;

type StoredAttribution = Attribution & { expires_at?: string };

function readStore(storage: Storage | undefined): StoredAttribution | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (parsed.expires_at && new Date(parsed.expires_at).getTime() < Date.now()) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStore(storage: Storage | undefined, value: StoredAttribution): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked; attribution is best-effort.
  }
}

function safeStorage(kind: "local" | "session"): Storage | undefined {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return undefined;
  }
}

export function readAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  const stored = readStore(safeStorage("session")) ?? readStore(safeStorage("local"));
  if (!stored) return null;
  const { expires_at: _expires, ...attribution } = stored;
  void _expires;
  return attribution;
}

/**
 * Keep the first touch of the visit, and replace it only when a new campaign
 * arrives. Stored for the session, and for 30 days once analytics consent is given.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const campaign: Attribution = {};
  for (const key of CAMPAIGN_KEYS) {
    const value = params.get(key);
    if (value) campaign[key] = value.slice(0, 200);
  }

  const existing = readAttribution();
  const hasCampaign = Object.keys(campaign).length > 0;
  let record: Attribution | null = existing;

  if (!existing || hasCampaign) {
    const referrer =
      document.referrer && !document.referrer.startsWith(window.location.origin)
        ? document.referrer.slice(0, 300)
        : "";
    record = {
      ...campaign,
      landing_page: `${window.location.pathname}${window.location.search}`.slice(0, 300),
      ...(referrer ? { referrer } : {}),
      first_seen_at: new Date().toISOString(),
    };
    writeStore(safeStorage("session"), record);
  }

  if (record && hasAnalyticsConsent()) {
    const expires = new Date(Date.now() + PERSIST_DAYS * 24 * 60 * 60 * 1000).toISOString();
    writeStore(safeStorage("local"), { ...record, expires_at: expires });
  }
}
