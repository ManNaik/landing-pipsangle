import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsArticleView } from "../../../components/news/NewsArticleView";
import { getRelatedNews } from "../../../lib/newsContent";
import { getLatestNews, getNewsArticle } from "../../../lib/news";
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
  try {
    const items = await getLatestNews();
    return items.map((item) => ({ slug: item.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item, config] = await Promise.all([getNewsArticle(slug), getSiteConfig()]);
  if (!item) return { title: "News Not Found" };

  return buildPageMetadata({
    title: item.title,
    description: item.summary,
    path: `/news/${slug}`,
    siteUrl: resolveSiteUrl(config),
    brandName: config?.brand_name,
    keywords: ["forex market news", item.category.toLowerCase(), "currency updates"],
    type: "article",
    publishedTime: item.publishedAt,
    modifiedTime: item.updatedAt,
    image: item.image ?? "/opengraph-image",
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const [item, all, config] = await Promise.all([
    getNewsArticle(slug),
    getLatestNews(),
    getSiteConfig(),
  ]);
  if (!item) notFound();

  const siteUrl = resolveSiteUrl(config);
  const brandName = config?.brand_name ?? "PipAngel";
  const related = getRelatedNews(all, slug);

  const newsSchema = buildNewsArticleSchema(siteUrl, brandName, {
    title: item.title,
    excerpt: item.summary,
    slug: item.slug,
    date: item.publishedAt,
    updatedAt: item.updatedAt,
  });
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: item.title, path: `/news/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([newsSchema, breadcrumbSchema]),
        }}
      />
      <NewsArticleView article={item} related={related} />
    </>
  );
}
