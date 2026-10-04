import type { MetadataRoute } from "next";
import { getBlogArticles } from "./lib/blog";
import { getPublishedNews } from "./lib/news";
import { MIN_INDEXED_CATEGORY_SIZE, categoriesInUse, newsListPath } from "./lib/newsArchive";
import { getSiteConfig, resolveSiteUrl } from "./lib/seo";
import { getSiteChrome } from "./lib/siteChrome";

const STATIC_ROUTES: Array<{ path: string; priority: number }> = [
  { path: "/", priority: 1 },
  { path: "/automated-forex-trading", priority: 0.9 },
  { path: "/pricing", priority: 0.9 },
  { path: "/security", priority: 0.8 },
  { path: "/faq", priority: 0.8 },
  { path: "/ic-markets-account", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

/** Lists only pages with real content; empty results, blog or news pages are left out. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = await getSiteConfig();
  const siteUrl = resolveSiteUrl(config);
  const [chrome, posts, news] = await Promise.all([getSiteChrome(config), getBlogArticles(), getPublishedNews()]);

  const categoryRoutes = categoriesInUse(news)
    .filter((entry) => entry.count >= MIN_INDEXED_CATEGORY_SIZE)
    .map((entry) => ({ path: newsListPath(1, entry.category), priority: 0.5 }));

  const routes = [
    ...STATIC_ROUTES,
    ...(chrome.showResults ? [{ path: "/trading-performance", priority: 0.8 }] : []),
    ...(chrome.showBlog ? [{ path: "/blog", priority: 0.6 }] : []),
    ...(chrome.showNews ? [{ path: "/news", priority: 0.6 }] : []),
    ...categoryRoutes,
  ];

  return [
    ...routes.map((route) => ({
      url: `${siteUrl}${route.path}`,
      changeFrequency: route.path === "/" || route.path.startsWith("/news") ? ("weekly" as const) : ("monthly" as const),
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...news.map((item) => ({
      url: `${siteUrl}/news/${item.slug}`,
      lastModified: new Date(item.updatedAt || item.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      ...(item.image ? { images: [item.image] } : {}),
    })),
  ];
}
