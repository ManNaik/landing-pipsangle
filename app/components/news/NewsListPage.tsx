import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedNews } from "../../lib/news";
import {
  MIN_INDEXED_CATEGORY_SIZE,
  NEWS_FEED_PATH,
  categoriesInUse,
  newsListPath,
  paginate,
} from "../../lib/newsArchive";
import type { MarketEvent, NewsCategory } from "../../lib/newsContent";
import {
  buildBreadcrumbSchema,
  buildNewsListSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import { PageHero, Section } from "../site/ui";
import { MarketEvents } from "./MarketEvents";
import { NewsCategoryNav } from "./NewsCategoryNav";
import { NewsList } from "./NewsList";
import { NewsletterSignup } from "./NewsletterSignup";
import { NewsPagination } from "./NewsPagination";

export const NEWS_FEED = { url: NEWS_FEED_PATH, title: "PipsAngel forex news" };

const NEWS_COPY = {
  title: "Forex market news",
  description: "News and notes on the economic releases and central bank decisions that move currency prices.",
};

const CATEGORY_COPY: Record<NewsCategory, { title: string; description: string }> = {
  Forex: { title: "Forex news", description: "Forex market news and notes from PipsAngel." },
  "Central Banks": {
    title: "Central bank news",
    description: "Interest rate decisions, policy guidance and what they mean for currencies.",
  },
  "Economic Data": {
    title: "Economic data news",
    description: "Jobs, inflation and growth releases that move currency prices.",
  },
  Currencies: { title: "Currency news", description: "News and notes on the major currency pairs." },
  Commodities: { title: "Gold and commodities news", description: "Gold, oil and how they move with currencies." },
  "Market Analysis": {
    title: "Forex market analysis",
    description: "Longer reads on the forces behind currency moves.",
  },
};

function copyFor(category: NewsCategory | null) {
  return category ? CATEGORY_COPY[category] : NEWS_COPY;
}

function titleFor(category: NewsCategory | null, page: number): string {
  const base = copyFor(category).title;
  return page > 1 ? `${base}, page ${page}` : base;
}

export async function newsListMetadata(page: number, category: NewsCategory | null): Promise<Metadata> {
  const articles = await getPublishedNews();
  const count = category ? articles.filter((article) => article.category === category).length : articles.length;
  const copy = copyFor(category);
  return buildPageMetadataFromConfig({
    title: titleFor(category, page),
    description: copy.description,
    path: newsListPath(page, category),
    keywords: ["forex news", "currency market news", ...(category ? [copy.title.toLowerCase()] : [])],
    noIndex: category !== null && count < MIN_INDEXED_CATEGORY_SIZE,
    follow: true,
    feed: NEWS_FEED,
  });
}

export async function NewsListPage({
  page,
  category,
  events = [],
}: {
  page: number;
  category: NewsCategory | null;
  events?: MarketEvent[];
}) {
  const [articles, siteConfig] = await Promise.all([getPublishedNews(), getSiteConfig()]);
  const listed = category ? articles.filter((article) => article.category === category) : articles;
  const result = listed.length > 0 ? paginate(listed, page) : null;
  if (!result) notFound();

  const copy = copyFor(category);
  const title = titleFor(category, page);
  const path = newsListPath(page, category);
  const siteUrl = resolveSiteUrl(siteConfig);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    ...(category ? [{ name: copy.title, path: newsListPath(1, category) }] : []),
    ...(page > 1 ? [{ name: `Page ${page}`, path }] : []),
  ];
  const schema = [
    buildBreadcrumbSchema(siteUrl, crumbs),
    buildNewsListSchema(siteUrl, { name: title, description: copy.description, path }, result.items),
  ];
  const source = category ? "news_category" : page > 1 ? "news_archive" : "news_index";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }} />
      <PageHero title={title}>
        <p>{copy.description}</p>
        {events.length > 0 ? (
          <p className="mt-3 text-base">
            <a
              href="#calendar"
              className="font-semibold text-mint-400 underline decoration-mint-400/40 underline-offset-4 hover:decoration-mint-400"
            >
              Economic calendar for today and tomorrow
            </a>
          </p>
        ) : null}
      </PageHero>

      <Section className="pt-10 sm:pt-12">
        <NewsCategoryNav categories={categoriesInUse(articles)} active={category} />
        <div className="mt-8">
          <NewsList articles={result.items} />
        </div>
        <NewsPagination page={result.page} totalPages={result.totalPages} category={category} />
      </Section>

      {events.length > 0 ? (
        <div id="calendar" className="scroll-mt-20 border-t border-forest-700">
          <MarketEvents events={events} />
        </div>
      ) : null}

      <NewsletterSignup source={source} />
    </>
  );
}
