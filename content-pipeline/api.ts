import type { PublishedArticleSummary } from "./types";

type NewsList = { results?: Array<{ slug: string; title: string; date: string; category: string }> };

export async function fetchPublishedArticles(apiBase: string): Promise<PublishedArticleSummary[]> {
  const response = await fetch(`${apiBase}/api/v1/news/`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`News API returned ${response.status}`);
  const data = (await response.json()) as NewsList;
  return (data.results ?? []).map(({ slug, title, date, category }) => ({ slug, title, date, category }));
}

export type PublishPayload = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
  published_at: string;
  author_name: string;
  author_title: string;
  author_url: string;
  image_url: string;
  image_alt: string;
};

export async function postArticle(apiBase: string, token: string, payload: PublishPayload) {
  const response = await fetch(`${apiBase}/api/v1/content-pipeline/news/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: response.status, body };
}
