import { safeApiGet } from "./api";
import { BRAND_NAME, normalizeBrandText } from "./brand";
import {
  BLOG_CATEGORIES,
  type BlogArticle,
  type BlogCategory,
  type BlogVisualId,
} from "./blogContent";
import type { BlogPostDetail, BlogPostListItem, PaginatedResponse } from "./types";

export type BlogPost = BlogPostListItem;

type ApiBlog = BlogPostListItem &
  Partial<BlogPostDetail> & {
    category?: string;
    author?: string;
    read_time?: string;
    featured?: boolean;
    tags?: string[];
    image?: string | null;
    visual?: string;
    is_demo?: boolean;
    intro?: string;
  };

const CATEGORY_SET = new Set<string>(BLOG_CATEGORIES.filter((item) => item !== "All"));

/** Links to pages that no longer exist, rewritten so published posts don't dead-end. */
const RETIRED_LINKS: Array<[RegExp, string]> = [
  [/href="\/forex-signals\/?"/g, 'href="/automated-forex-trading"'],
  [/href="\/careers\/?"/g, 'href="/about"'],
];

function normalizeCategory(raw: string | undefined): BlogCategory {
  if (raw && CATEGORY_SET.has(raw)) return raw as BlogCategory;
  const lower = (raw ?? "").toLowerCase();
  if (lower.includes("risk") || lower.includes("drawdown")) return "Risk Management";
  if (lower.includes("automat")) return "Automation";
  if (lower.includes("mt5") || lower.includes("metatrader")) return "MT5";
  if (lower.includes("pipangel") || lower.includes("pipsangel") || lower.includes("guide")) {
    return "PipsAngel Guides";
  }
  if (lower.includes("market")) return "Market Education";
  if (lower.includes("trad")) return "Trading";
  return "Forex Basics";
}

function cleanHtml(html: string): string {
  return RETIRED_LINKS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    normalizeBrandText(html)
  );
}

function readTime(html: string): string {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

function mapBlog(item: ApiBlog): BlogArticle {
  const contentHtml = cleanHtml(item.content ?? "");
  return {
    id: item.slug,
    slug: item.slug,
    title: normalizeBrandText(item.title),
    excerpt: normalizeBrandText(item.excerpt),
    intro: normalizeBrandText(item.intro ?? item.excerpt),
    sections: [],
    contentHtml,
    category: normalizeCategory(item.category),
    author: item.author ? normalizeBrandText(item.author) : BRAND_NAME,
    publishedAt: item.date,
    updatedAt: item.updated_at ?? item.date,
    readTime: contentHtml ? readTime(contentHtml) : item.read_time ?? "",
    image: item.image ?? null,
    visual: (item.visual as BlogVisualId | undefined) ?? "journal",
    tags: item.tags ?? [],
    featured: item.featured ?? false,
    status: item.published === false ? "draft" : "published",
    isDemo: item.is_demo ?? false,
    showTrialCta: false,
  };
}

/**
 * Posts from the original seed data describe the retired signals product. Each stays hidden
 * while it still carries that copy, so a rewrite in the CMS brings it back without a deploy.
 */
const SEED_POST_SLUGS = new Set([
  "best-forex-signals",
  "how-forex-automation-works",
  "forex-trading-performance",
]);
const OUTDATED_SEED_COPY = /signal|\bmt4\b|metatrader 4/i;

async function isOutdatedSeed(item: ApiBlog): Promise<boolean> {
  if (!SEED_POST_SLUGS.has(item.slug)) return false;
  const post =
    item.content === undefined ? await safeApiGet<ApiBlog>(`/blog/${item.slug}/`, 300) : item;
  return !post || OUTDATED_SEED_COPY.test(`${post.title} ${post.excerpt} ${post.content ?? ""}`);
}

/** Published CMS posts only. Placeholder and outdated seed articles are never shown to visitors. */
export async function getBlogArticles(): Promise<BlogArticle[]> {
  const data = await safeApiGet<PaginatedResponse<ApiBlog>>("/blog/", 300);
  const items = data?.results ?? [];
  const outdated = await Promise.all(items.map(isOutdatedSeed));
  return items
    .filter((_, index) => !outdated[index])
    .map(mapBlog)
    .filter((article) => !article.isDemo);
}

export async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
  const detail = await safeApiGet<ApiBlog>(`/blog/${slug}/`, 300);
  if (!detail || (await isOutdatedSeed(detail))) return null;
  const article = mapBlog(detail);
  return article.isDemo ? null : article;
}

export async function getBlogPosts(): Promise<BlogPostListItem[]> {
  const articles = await getBlogArticles();
  return articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    date: article.publishedAt,
    excerpt: article.excerpt,
  }));
}
