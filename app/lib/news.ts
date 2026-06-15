import { safeApiGet } from "./api";
import type { NewsArticleDetail, NewsArticleListItem, PaginatedResponse } from "./types";

export type NewsItem = NewsArticleListItem;

export async function getNewsItems(): Promise<NewsArticleListItem[]> {
  const data = await safeApiGet<PaginatedResponse<NewsArticleListItem>>("/news/", 300);
  return data?.results ?? [];
}

export async function getNewsItem(slug: string): Promise<NewsArticleDetail | null> {
  return safeApiGet<NewsArticleDetail>(`/news/${slug}/`, 300);
}

export async function getNewsSlugs(): Promise<string[]> {
  const items = await getNewsItems();
  return items.map((i) => i.slug);
}
