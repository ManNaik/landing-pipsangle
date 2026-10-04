import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticleView } from "../../../components/news/NewsArticleView";
import { NEWS_FEED } from "../../../components/news/NewsListPage";
import { getNewsArticle, getPublishedNews } from "../../../lib/news";
import { newsListPath } from "../../../lib/newsArchive";
import { getRelatedNews } from "../../../lib/newsContent";
import {
  buildBreadcrumbSchema,
  buildNewsArticleSchema,
  buildPageMetadata,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../../lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  const items = await getPublishedNews();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item, config] = await Promise.all([getNewsArticle(slug), getSiteConfig()]);
  if (!item) return { title: "Article not found", robots: { index: false, follow: true } };

  return buildPageMetadata({
    title: item.title,
    description: item.summary,
    path: `/news/${slug}`,
    siteUrl: resolveSiteUrl(config),
    brandName: config.brand_name,
    keywords: ["forex market news", item.category.toLowerCase()],
    type: "article",
    publishedTime: item.publishedAt,
    modifiedTime: item.updatedAt,
    image: item.image ?? "/opengraph-image",
    authors: item.authorName ? [item.authorName] : undefined,
    feed: NEWS_FEED,
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const [item, all, config] = await Promise.all([getNewsArticle(slug), getPublishedNews(), getSiteConfig()]);
  if (!item) notFound();

  const siteUrl = resolveSiteUrl(config);
  const newsSchema = buildNewsArticleSchema(siteUrl, config.brand_name, {
    title: item.title,
    excerpt: item.summary,
    slug: item.slug,
    date: item.publishedAt,
    updatedAt: item.updatedAt,
    category: item.category,
    image: item.image,
    author: item.authorName ? { name: item.authorName, title: item.authorTitle, url: item.authorUrl } : undefined,
  });
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: item.category, path: newsListPath(1, item.category) },
    { name: item.title, path: `/news/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript([newsSchema, breadcrumbSchema]) }}
      />
      <NewsArticleView article={item} related={getRelatedNews(all, slug)} />
    </>
  );
}
