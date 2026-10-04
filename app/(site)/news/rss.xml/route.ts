import { buildNewsRss } from "../../../lib/feeds";
import { getPublishedNews } from "../../../lib/news";
import { getSiteConfig, resolveSiteUrl } from "../../../lib/seo";

export const revalidate = 300;

const FEED_SIZE = 50;

export async function GET() {
  const [articles, config] = await Promise.all([getPublishedNews(), getSiteConfig()]);
  const xml = buildNewsRss({
    siteUrl: resolveSiteUrl(config),
    brandName: config.brand_name,
    articles: articles.slice(0, FEED_SIZE),
  });
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
