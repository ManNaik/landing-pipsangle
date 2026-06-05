import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsItem, getNewsItems } from "../../lib/news";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const items = getNewsItems();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) return { title: "News Not Found" };
  return {
    title: item.title,
    description: item.excerpt,
    keywords: [
      "financial market news",
      "forex news",
      item.category.toLowerCase(),
      "trading news",
    ],
    openGraph: {
      title: `${item.title} | PipAngel News`,
      description: item.excerpt,
      type: "article",
      publishedTime: item.date,
    },
    alternates: {
      canonical: `/news/${slug}`,
    },
  };
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
  const item = getNewsItem(slug);
  if (!item) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.excerpt,
    datePublished: item.date,
  };

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
        <div className="space-y-4 text-sm text-zinc-400 [&_p]:leading-relaxed sm:text-base">
          <p>{item.excerpt}</p>
          <p>
            This is a placeholder for the full article. Add your financial
            market news content here—each article will be indexed by search
            engines so your site can rank when people search for forex and
            market news.
          </p>
        </div>
      </article>
    </div>
  );
}
