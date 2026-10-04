export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SLUG_LENGTH = 80;

/** URL slug from a title: lowercase ASCII words joined by single hyphens, cut at a whole word. */
export function slugify(text: string): string {
  const full = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (full.length <= MAX_SLUG_LENGTH) return full;
  const cut = full.slice(0, MAX_SLUG_LENGTH + 1);
  const lastBreak = cut.lastIndexOf("-");
  return (lastBreak > 0 ? cut.slice(0, lastBreak) : cut.slice(0, MAX_SLUG_LENGTH)).replace(/-+$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length <= MAX_SLUG_LENGTH;
}
