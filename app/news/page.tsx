import type { Metadata } from "next";
import Link from "next/link";
import { getNewsItems } from "../lib/news";

export const metadata: Metadata = {
  title: "Financial Market News | Forex & Trading Updates",
  description:
    "Latest financial market news, forex updates, and trading analysis. Stay informed on currency markets, central banks, and global macro news for better trading decisions.",
  keywords: [
    "financial market news",
    "forex news",
    "trading news",
    "currency market updates",
    "forex market news",
    "market news today",
    "FX news",
    "forex analysis",
  ],
  openGraph: {
    title: "Financial Market News | Forex & Trading Updates | PipAngel",
    description:
      "Latest financial market news and forex updates. Currency markets, central banks, and trading analysis.",
    type: "website",
    url: "/news",
  },
  alternates: {
    canonical: "/news",
  },
  robots: {
    index: true,
    follow: true,
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function NewsPage() {
  const items = getNewsItems();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Financial Market News | Forex & Trading Updates",
    description:
      "Latest financial market news, forex updates, and trading analysis from PipAngel.",
    url: "https://pipangel.com/news",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "NewsArticle",
          headline: item.title,
          description: item.excerpt,
          datePublished: item.date,
        },
      })),
    },
  };

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Financial Market News
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            Forex updates, currency market analysis, and trading news to keep you
            ahead of the markets.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8" aria-label="News articles">
        <div className="mx-auto max-w-4xl min-w-0">
          <ul className="space-y-6 sm:space-y-8">
            {items.map((item) => (
              <li key={item.slug}>
                <article>
                  <Link
                    href={`/news/${item.slug}`}
                    className="block rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/50 sm:p-6 min-h-[3rem]"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 sm:gap-3">
                      <time dateTime={item.date}>{formatDate(item.date)}</time>
                      <span className="text-zinc-600">·</span>
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-zinc-400">
                        {item.category}
                      </span>
                    </div>
                    <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                      {item.excerpt}
                    </p>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
