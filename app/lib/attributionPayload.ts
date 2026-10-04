const ATTRIBUTION_KEYS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
  "ttclid",
  "landing_page",
  "referrer",
  "first_seen_at",
]);

/** Only known string fields, trimmed, so the backend never receives arbitrary objects. */
export function cleanAttribution(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const clean: Record<string, string> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!ATTRIBUTION_KEYS.has(key) || typeof raw !== "string") continue;
    const trimmed = raw.trim().slice(0, 300);
    if (trimmed) clean[key] = trimmed;
  }
  return clean;
}
