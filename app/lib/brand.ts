export const BRAND_NAME = "PipsAngel";
export const SITE_URL = "https://pipsangel.com";
export const SUPPORT_EMAIL = "support@pipsangel.com";
export const IC_MARKETS_URL = "https://www.icmarkets.com/";

const LEGACY_BRAND = /\bPipAngel\b/g;
const LEGACY_DOMAIN = /\bpipangel\.com\b/gi;
const LEGACY_HOSTS = new Set(["pipangel.com", "www.pipangel.com"]);

/** The CMS still carries the old spelling and the unregistered pipangel.com domain. */
export function normalizeBrandText(text: string): string {
  return text.replace(LEGACY_BRAND, BRAND_NAME).replace(LEGACY_DOMAIN, "pipsangel.com");
}

export function normalizeBrandName(value?: string | null): string {
  const name = (value ?? "").trim();
  if (!name) return BRAND_NAME;
  return normalizeBrandText(name);
}

export function normalizeSiteUrl(value?: string | null): string {
  const raw = (value ?? "").trim();
  if (!raw) return SITE_URL;
  try {
    const url = new URL(raw);
    if (LEGACY_HOSTS.has(url.hostname.toLowerCase())) return SITE_URL;
    return url.origin;
  } catch {
    return SITE_URL;
  }
}

export function normalizeEmail(value?: string | null): string {
  const raw = (value ?? "").trim();
  if (!raw || !raw.includes("@")) return SUPPORT_EMAIL;
  return raw.replace(/@pipangel\.com$/i, "@pipsangel.com");
}

/** Accept only absolute http(s) URLs from the CMS; anything else is ignored. */
export function safeExternalUrl(value?: string | null): string | null {
  const raw = (value ?? "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
