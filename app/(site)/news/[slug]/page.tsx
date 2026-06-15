import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsItem, getNewsItems } from "../../../lib/news";
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
    const items = await getNewsItems();
    return items.map((item) => ({ slug: item.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item, config] = await Promise.all([getNewsItem(slug), getSiteConfig()]);
  if (!item) return { title: "News Not Found" };

  return buildPageMetadata({
    title: item.title,
    description: item.excerpt,
    path: `/news/${slug}`,
    siteUrl: resolveSiteUrl(config),
    brandName: config?.brand_name,
    keywords: [
      "financial market news",
      "forex news",
      item.category.toLowerCase(),
      "trading news",
    ],
    type: "article",
    publishedTime: item.date,
    modifiedTime: item.updated_at,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const [item, config] = await Promise.all([getNewsItem(slug), getSiteConfig()]);
  if (!item) notFound();

  const siteUrl = resolveSiteUrl(config);
  const brandName = config?.brand_name ?? "PipAngel";

  const newsSchema = buildNewsArticleSchema(siteUrl, brandName, {
    title: item.title,
    excerpt: item.excerpt,
    slug: item.slug,
    date: item.date,
    updatedAt: item.updated_at,
  });
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: item.title, path: `/news/${slug}` },
  ]);

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([newsSchema, breadcrumbSchema]),
        }}
      />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href="/news"
          className="mb-6 inline-block min-h-[2.5rem] text-sm text-zinc-500 hover:text-white sm:mb-8"
        >
          ← Back to News
        </Link>
        <header className="mb-8 sm:mb-10">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 sm:gap-3">
            <time dateTime={item.date}>{formatDate(item.date)}</time>
            <span className="text-zinc-600">·</span>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-400">
              {item.category}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {item.title}
          </h1>
        </header>
        <div
          className="space-y-4 text-sm text-zinc-400 [&_p]:leading-relaxed [&_ul]:list-inside [&_ul]:list-disc [&_ol]:list-inside [&_ol]:list-decimal [&_li]:mt-1 [&_strong]:text-white sm:text-base"
          dangerouslySetInnerHTML={{ __html: item.content.trim() }}
        />
      </article>
    </div>
  );
}
