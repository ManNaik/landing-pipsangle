import { buildNewsSitemap } from "../lib/feeds";
import { getPublishedNews } from "../lib/news";
import { getSiteConfig, resolveSiteUrl } from "../lib/seo";

export const revalidate = 300;

export async function GET() {
  const [articles, config] = await Promise.all([getPublishedNews(), getSiteConfig()]);
  const xml = buildNewsSitemap({
    siteUrl: resolveSiteUrl(config),
    publicationName: config.brand_name,
    articles,
  });
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
