import type { PostType } from "../../../../lib/adminPreview";
import { NEWS_CATEGORIES } from "../../../../lib/newsContent";

export type { PostType };

export type PostTypeConfig = {
  type: PostType;
  singular: string;
  plural: string;
  apiPath: string;
  adminPath: string;
  publicPath: (slug: string) => string;
  categories: string[] | null;
  hasAuthor: boolean;
  hasImage: boolean;
  hasSource: boolean;
};

export const POST_TYPES: Record<PostType, PostTypeConfig> = {
  news: {
    type: "news",
    singular: "News article",
    plural: "News",
    apiPath: "/news/",
    adminPath: "/admin/news",
    publicPath: (slug) => `/news/${slug}`,
    categories: NEWS_CATEGORIES.filter((category) => category !== "All"),
    hasAuthor: true,
    hasImage: true,
    hasSource: true,
  },
  blog: {
    type: "blog",
    singular: "Blog post",
    plural: "Blog posts",
    apiPath: "/blog/",
    adminPath: "/admin/blog",
    publicPath: (slug) => `/blog/${slug}`,
    categories: null,
    hasAuthor: false,
    hasImage: false,
    hasSource: false,
  },
};

/** Lengths that fit Google's results, matching the content pipeline's benchmark. */
export const SEO_LIMITS = {
  title: [30, 65] as const,
  excerpt: [120, 170] as const,
};

export function formatAdminDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
