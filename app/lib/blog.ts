import { safeApiGet } from "./api";
import {
  blogArticleToHtml,
  DUMMY_BLOG,
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

function normalizeCategory(raw: string | undefined): BlogCategory {
  if (raw && CATEGORY_SET.has(raw)) return raw as BlogCategory;
  const lower = (raw ?? "").toLowerCase();
  if (lower.includes("risk") || lower.includes("drawdown")) return "Risk Management";
  if (lower.includes("automat")) return "Automation";
  if (lower.includes("mt5") || lower.includes("metatrader")) return "MT5";
  if (lower.includes("pipangel") || lower.includes("guide")) return "PipAngel Guides";
  if (lower.includes("market")) return "Market Education";
  if (lower.includes("trad")) return "Trading";
  return "Forex Basics";
}

function mapBlog(item: ApiBlog): BlogArticle {
  const dummy = DUMMY_BLOG.find((article) => article.slug === item.slug);
  return {
    id: dummy?.id ?? item.slug,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    intro: item.intro ?? dummy?.intro ?? item.excerpt,
    sections: dummy?.sections ?? [],
    category: normalizeCategory(item.category ?? dummy?.category),
    author: item.author ?? dummy?.author ?? "PipAngel",
    publishedAt: item.date,
    updatedAt: item.updated_at ?? item.date,
    readTime: item.read_time ?? dummy?.readTime ?? "6 min read",
    image: item.image ?? dummy?.image ?? null,
    visual: (item.visual as BlogVisualId | undefined) ?? dummy?.visual ?? "journal",
    tags: item.tags ?? dummy?.tags ?? [],
    featured: item.featured ?? dummy?.featured ?? false,
    status: item.published === false ? "draft" : "published",
    isDemo: item.is_demo ?? dummy?.isDemo ?? false,
    showTrialCta: dummy?.showTrialCta ?? false,
  };
}

/**
 * Frontend blog access layer.
 * Dummy educational posts are used until a CMS or API provides live articles.
 * Function signatures stay stable when the source changes.
 */
export async function getBlogArticles(): Promise<BlogArticle[]> {
  const data = await safeApiGet<PaginatedResponse<ApiBlog>>("/blog/", 300);
  const results = data?.results ?? [];
  if (results.length === 0) return DUMMY_BLOG;
  return results.map(mapBlog);
}

export async function getFeaturedBlog(): Promise<BlogArticle | null> {
  const articles = await getBlogArticles();
  return articles.find((article) => article.featured) ?? articles[0] ?? null;
}

export async function getBlogByCategory(category: string): Promise<BlogArticle[]> {
  const articles = await getBlogArticles();
  if (category === "All") return articles;
  return articles.filter((article) => article.category === category);
}

export async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
  const detail = await safeApiGet<ApiBlog>(`/blog/${slug}/`, 300);
  if (detail) return mapBlog(detail);
  return DUMMY_BLOG.find((article) => article.slug === slug) ?? null;
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

export async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  const article = await getBlogArticle(slug);
  if (!article) return null;
  return {
    slug: article.slug,
    title: article.title,
    date: article.publishedAt,
    excerpt: article.excerpt,
    content: article.sections.length > 0 ? blogArticleToHtml(article) : article.intro,
    published: article.status === "published",
    created_at: article.publishedAt,
    updated_at: article.updatedAt,
  };
}

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map((post) => post.slug);
}
