import { safeApiGet } from "./api";
import {
  DUMMY_MARKET_EVENTS,
  DUMMY_MARKET_SNAPSHOT,
  DUMMY_NEWS,
  NEWS_CATEGORIES,
  type MarketEvent,
  type MarketSnapshotItem,
  type NewsArticle,
  type NewsCategory,
  type NewsVisualId,
} from "./newsContent";
import type { NewsArticleDetail, NewsArticleListItem, PaginatedResponse } from "./types";

export type NewsItem = NewsArticleListItem;

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

function mapNews(item: ApiNews): NewsArticle {
  const dummy = DUMMY_NEWS.find((article) => article.slug === item.slug);
  return {
    id: dummy?.id ?? item.slug,
    slug: item.slug,
    title: item.title,
    summary: item.excerpt,
    content: item.content ?? dummy?.content ?? `<p>${item.excerpt}</p>`,
    category: normalizeCategory(item.category),
    source: item.source ?? dummy?.source ?? "PipAngel",
    sourceUrl: item.source_url ?? dummy?.sourceUrl ?? null,
    publishedAt: item.date,
    updatedAt: item.updated_at ?? item.date,
    readTime: item.read_time ?? dummy?.readTime ?? "4 min read",
    image: item.image ?? dummy?.image ?? null,
    visual: (item.visual as NewsVisualId | undefined) ?? dummy?.visual ?? "grid",
    tags: item.tags ?? dummy?.tags ?? [],
    featured: item.featured ?? dummy?.featured ?? false,
    status: item.published === false ? "draft" : "published",
    isDemo: item.is_demo ?? dummy?.isDemo ?? false,
  };
}

/**
 * Frontend news access layer.
 * Today this reads the PipAngel news API (or dummy fallback).
 * Later the same functions can keep their signatures while the backend
 * switches from dummy records to aggregated market news.
 */
export async function getLatestNews(): Promise<NewsArticle[]> {
  const data = await safeApiGet<PaginatedResponse<ApiNews>>("/news/", 300);
  const results = data?.results ?? [];
  if (results.length === 0) return DUMMY_NEWS;
  return results.map(mapNews);
}

export async function getFeaturedNews(): Promise<NewsArticle[]> {
  const articles = await getLatestNews();
  const featured = articles.filter((article) => article.featured);
  return (featured.length > 0 ? featured : articles).slice(0, 3);
}

export async function getNewsByCategory(category: string): Promise<NewsArticle[]> {
  const articles = await getLatestNews();
  if (category === "All") return articles;
  return articles.filter((article) => article.category === category);
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  const detail = await safeApiGet<ApiNews>(`/news/${slug}/`, 300);
  if (detail) return mapNews(detail);
  return DUMMY_NEWS.find((article) => article.slug === slug) ?? null;
}

export async function getMarketEvents(): Promise<MarketEvent[]> {
  return DUMMY_MARKET_EVENTS;
}

export async function getMarketSnapshot(): Promise<MarketSnapshotItem[]> {
  return DUMMY_MARKET_SNAPSHOT;
}

export async function getNewsItems(): Promise<NewsArticleListItem[]> {
  const articles = await getLatestNews();
  return articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.summary,
    date: article.publishedAt,
    category: article.category,
  }));
}

export async function getNewsItem(slug: string): Promise<NewsArticleDetail | null> {
  const article = await getNewsArticle(slug);
  if (!article) return null;
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.summary,
    date: article.publishedAt,
    category: article.category,
    content: article.content,
    published: article.status === "published",
    created_at: article.publishedAt,
    updated_at: article.updatedAt,
  };
}

export async function getNewsSlugs(): Promise<string[]> {
  const items = await getNewsItems();
  return items.map((item) => item.slug);
}
