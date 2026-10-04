import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketEvents } from "../../components/news/MarketEvents";
import { NEWS_FEED, NewsListPage, newsListMetadata } from "../../components/news/NewsListPage";
import { NewsletterSignup } from "../../components/news/NewsletterSignup";
import { PageHero } from "../../components/site/ui";
import { getLiveMarketEvents, getPublishedNews } from "../../lib/news";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";

const CALENDAR_COPY = {
  title: "Forex economic calendar",
  description: "Major forex economic releases for today and tomorrow, with forecasts and previous figures.",
};

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getPublishedNews();
  if (articles.length > 0) return newsListMetadata(1, null);
  return buildPageMetadataFromConfig({
    title: CALENDAR_COPY.title,
    description: CALENDAR_COPY.description,
    path: "/news",
    keywords: ["forex economic calendar", "economic events", "central bank decisions"],
    feed: NEWS_FEED,
  });
}

/** Articles first, with the calendar below. With no articles the page is just the calendar; with neither, there's no page. */
export default async function NewsPage() {
  const [articles, events] = await Promise.all([getPublishedNews(), getLiveMarketEvents()]);
  if (articles.length > 0) return <NewsListPage page={1} category={null} events={events} />;
  if (events.length === 0) notFound();

  const siteUrl = resolveSiteUrl(await getSiteConfig());
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Economic calendar", path: "/news" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }} />
      <PageHero title={CALENDAR_COPY.title}>
        <p>
          Scheduled releases that tend to move currency prices. Big releases can widen spreads and cause fast
          moves, including in copied trades.
        </p>
      </PageHero>
      <MarketEvents events={events} />
      <NewsletterSignup source="news_calendar" />
    </>
  );
}
