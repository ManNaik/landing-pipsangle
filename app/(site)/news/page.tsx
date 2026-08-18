import { MarketEvents } from "../../components/news/MarketEvents";
import { MarketSnapshot } from "../../components/news/MarketSnapshot";
import { NewsCTA } from "../../components/news/NewsCTA";
import { NewsExplorer } from "../../components/news/NewsExplorer";
import { NewsHero } from "../../components/news/NewsHero";
import { NewsWhy } from "../../components/news/NewsWhy";
import {
  getLatestNews,
  getMarketEvents,
  getMarketSnapshot,
} from "../../lib/news";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Forex Market News",
    description:
      "Daily forex market news, currency updates, economic events, and central bank developments from PipAngel.",
    path: "/news",
    keywords: [
      "forex market news",
      "currency market updates",
      "central bank news",
      "economic calendar",
      "FX news",
    ],
  });
}

export default async function NewsPage() {
  const [articles, snapshot, events, siteConfig] = await Promise.all([
    getLatestNews(),
    getMarketSnapshot(),
    getMarketEvents(),
    getSiteConfig(),
  ]);

  const siteUrl = resolveSiteUrl(siteConfig);
  const brandName = siteConfig?.brand_name ?? "PipAngel";
  const newest = articles[0]?.updatedAt;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Forex Market News",
    description:
      "Daily forex market news, currency updates, economic events, and central bank developments from PipAngel.",
    url: `${siteUrl}/news`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "NewsArticle",
          headline: item.title,
          description: item.summary,
          datePublished: item.publishedAt,
          url: `${siteUrl}/news/${item.slug}`,
          publisher: { "@type": "Organization", name: brandName },
        },
      })),
    },
  };
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
  ]);

  return (
    <div className="min-w-0 bg-[#050505]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([jsonLd, breadcrumbSchema]),
        }}
      />
      <NewsHero updatedAt={newest} />
      <MarketSnapshot items={snapshot} />
      <NewsExplorer articles={articles} />
      <MarketEvents events={events} />
      <NewsWhy />
      <NewsCTA />
    </div>
  );
}
