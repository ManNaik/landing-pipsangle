import { NEWS_CATEGORIES, type NewsArticle, type NewsCategory } from "./newsContent";

export const NEWS_PAGE_SIZE = 12;

/** Category pages with fewer articles than this are kept out of search results as thin content. */
export const MIN_INDEXED_CATEGORY_SIZE = 3;

export const NEWS_FEED_PATH = "/news/rss.xml";

export type NewsPage<T> = {
  items: T[];
  page: number;
  totalPages: number;
};

export type CategoryCount = {
  category: NewsCategory;
  slug: string;
  count: number;
};

const CATEGORIES = NEWS_CATEGORIES.filter((item): item is NewsCategory => item !== "All");

/** Returns null when the page number is out of range, so the route can 404. */
export function paginate<T>(items: T[], page: number, size = NEWS_PAGE_SIZE): NewsPage<T> | null {
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null;
  return { items: items.slice((page - 1) * size, page * size), page, totalPages };
}

export function parsePageParam(raw: string): number | null {
  return /^[1-9]\d{0,4}$/.test(raw) ? Number(raw) : null;
}

export function categorySlug(category: NewsCategory): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categoryFromSlug(slug: string): NewsCategory | null {
  return CATEGORIES.find((category) => categorySlug(category) === slug) ?? null;
}

export function categoriesInUse(articles: NewsArticle[]): CategoryCount[] {
  return CATEGORIES.map((category) => ({
    category,
    slug: categorySlug(category),
    count: articles.filter((article) => article.category === category).length,
  })).filter((entry) => entry.count > 0);
}

export function newsListPath(page: number, category?: NewsCategory | null): string {
  const base = category ? `/news/category/${categorySlug(category)}` : "/news";
  return page <= 1 ? base : `${base}/page/${page}`;
}
