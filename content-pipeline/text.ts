const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

export function decodeEntities(text: string): string {
  return text
    .replace(/&(amp|lt|gt|quot|#39|apos|nbsp);/g, (entity) => ENTITIES[entity] ?? entity)
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)));
}

/** Plain text with block boundaries kept as newlines. */
export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<\/(p|h[1-6]|li|blockquote)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*/g, "\n")
    .trim();
}

export function words(text: string): string[] {
  return text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word));
}

export function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => words(sentence).length > 0);
}

/** Lowercase, hyphens as spaces, punctuation removed: used for keyword and copy matching. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2010-\u2015-]/g, " ")
    .replace(/[^\p{L}\p{N}%.$€£¥\s]/gu, " ")
    .replace(/(?<!\d)\.|\.(?!\d)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(needle)}(?![\\p{L}\\p{N}])`, "gu");
  return haystack.match(pattern)?.length ?? 0;
}

export function nGrams(tokens: string[], size: number): Set<string> {
  const grams = new Set<string>();
  for (let index = 0; index + size <= tokens.length; index += 1) {
    grams.add(tokens.slice(index, index + size).join(" "));
  }
  return grams;
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function hostMatches(url: string, domains: readonly string[]): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return domains.some((domain) => host === domain || host.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

/** Comparable form of a URL: no fragment, no trailing slash, lowercase host. */
export function comparableUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    return `${parsed.protocol}//${parsed.host.toLowerCase()}${parsed.pathname.replace(/\/+$/, "")}${parsed.search}`;
  } catch {
    return url.trim();
  }
}
