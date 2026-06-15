import type { MetadataRoute } from "next";
import { getBlogPosts } from "./lib/blog";
import { getNewsItems } from "./lib/news";
import { getSiteUrl } from "./lib/seo";

const STATIC_ROUTES = [
  { path: "/", priority: 1 },
  { path: "/forex-signals", priority: 0.9 },
  { path: "/automated-forex-trading", priority: 0.9 },
  { path: "/pricing", priority: 0.9 },
  { path: "/trading-performance", priority: 0.8 },
  { path: "/faq", priority: 0.8 },
  { path: "/blog", priority: 0.7 },
  { path: "/news", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.5 },
  { path: "/careers", priority: 0.4 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getSiteUrl();
  const [blogPosts, newsItems] = await Promise.all([
    getBlogPosts().catch(() => []),
    getNewsItems().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.path === "/" ? "daily" : "weekly",
    priority: route.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const newsEntries: MetadataRoute.Sitemap = newsItems.map((item) => ({
    url: `${siteUrl}/news/${item.slug}`,
    lastModified: item.date ? new Date(item.date) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries, ...newsEntries];
}
