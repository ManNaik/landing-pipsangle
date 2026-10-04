import { safeApiGet } from "./api";
import { BRAND_NAME, normalizeBrandText, safeExternalUrl } from "./brand";
import {
  DUMMY_MARKET_EVENTS,
  NEWS_CATEGORIES,
  type MarketEvent,
  type NewsArticle,
  type NewsCategory,
} from "./newsContent";
import type { NewsArticleDetail, NewsArticleListItem, PaginatedResponse } from "./types";

type ApiNews = NewsArticleListItem &
  Partial<NewsArticleDetail> & {
    source?: string;
    source_url?: string | null;
    read_time?: string;
    featured?: boolean;
    tags?: string[];
    image?: string | null;
    visual?: string;
    is_demo?: boolean;
  };

const CATEGORY_SET = new Set<string>(NEWS_CATEGORIES.filter((item) => item !== "All"));

function normalizeCategory(raw: string | undefined): NewsCategory {
  if (raw && CATEGORY_SET.has(raw)) return raw as NewsCategory;
  const lower = (raw ?? "").toLowerCase();
  if (lower.includes("bank") || lower.includes("rate")) return "Central Banks";
  if (lower.includes("data") || lower.includes("macro")) return "Economic Data";
  if (lower.includes("gold") || lower.includes("commod")) return "Commodities";
  if (lower.includes("analys")) return "Market Analysis";
  if (lower.includes("curren") || lower.includes("eur") || lower.includes("usd")) {
    return "Currencies";
  }
  return "Forex";
}

function readTime(html: string): string {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

function mapNews(item: ApiNews): NewsArticle {
  const content = item.content ?? "";
  return {
    id: item.slug,
    slug: item.slug,
    title: normalizeBrandText(item.title),
    summary: normalizeBrandText(item.excerpt),
    content,
    category: normalizeCategory(item.category),
    source: item.source ?? BRAND_NAME,
    sourceUrl: safeExternalUrl(item.source_url),
    publishedAt: item.date,
    updatedAt: item.updated_at ?? item.date,
    readTime: content ? readTime(content) : "",
    image: safeExternalUrl(item.image),
    imageAlt: item.image_alt?.trim() || "",
    authorName: item.author_name?.trim() || undefined,
    authorTitle: item.author_title?.trim() || undefined,
    authorUrl: safeExternalUrl(item.author_url),
    visual: "grid",
    tags: item.tags ?? [],
    featured: item.featured ?? false,
    status: item.published === false ? "draft" : "published",
    isDemo: item.is_demo ?? false,
  };
}

/** Articles from the original demo data. The backend cleanup command unpublishes them. */
const SEED_NEWS_SLUGS = new Set([
  "forex-market-outlook-march-2025",
  "usd-strength-and-emerging-market-currencies",
  "interest-rate-decisions-impact-on-forex",
]);

function isPublic(article: NewsArticle): boolean {
  return !article.isDemo && !SEED_NEWS_SLUGS.has(article.slug);
}

/** Every published article, newest first. Old articles stay listed so they keep earning search traffic. */
export async function getPublishedNews(): Promise<NewsArticle[]> {
  const data = await safeApiGet<PaginatedResponse<ApiNews>>("/news/", 300);
  return (data?.results ?? []).map(mapNews).filter(isPublic);
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  const detail = await safeApiGet<ApiNews>(`/news/${slug}/`, 300);
  if (!detail) return null;
  const article = mapNews(detail);
  return isPublic(article) ? article : null;
}

/** Calendar rows from the live feed only; the demo fallback is never shown. */
export async function getLiveMarketEvents(): Promise<MarketEvent[]> {
  const events = await getMarketEvents();
  return events.filter((event) => !event.isDemo);
}

type ApiCalendarEvent = {
  id: string;
  currency: string;
  title: string;
  when_label: string;
  time: string;
  actual?: string;
  previous?: string;
  consensus?: string;
  impact?: string;
  source_url?: string;
};

type ApiCalendar = {
  results?: ApiCalendarEvent[];
};

export function mapCalendarEvents(results: ApiCalendarEvent[]): MarketEvent[] {
  return results.map((event) => ({
    id: event.id,
    currency: event.currency,
    title: event.title,
    whenLabel: event.when_label,
    time: event.time,
    actual: event.actual ?? "",
    previous: event.previous ?? "",
    consensus: event.consensus ?? "",
    impact: event.impact ?? "",
    sourceUrl: event.source_url || undefined,
    isDemo: false,
  }));
}

/**
 * Forex calendar from the stored economic-calendar feed.
 * The API refreshes that store on its own interval. Dummy rows stay only
 * when the feed is missing, so the news page still has a preview.
 */
export async function getMarketEvents(): Promise<MarketEvent[]> {
  const data = await safeApiGet<ApiCalendar>("/news/calendar/", 300);
  const results = data?.results ?? [];
  if (results.length === 0) return DUMMY_MARKET_EVENTS;
  return mapCalendarEvents(results);
}
