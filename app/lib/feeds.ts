import { NEWS_FEED_PATH } from "./newsArchive";
import type { NewsArticle } from "./newsContent";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Google News reads only articles from the last two days. */
export const NEWS_SITEMAP_DAYS = 2;

export function escapeXml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS needs RFC 822 dates. Date-only values count as midnight UTC. */
function rfc822(value: string): string {
  return new Date(value).toUTCString();
}

function latestUpdate(articles: NewsArticle[], fallback: Date): string {
  const times = articles.map((article) => new Date(article.updatedAt || article.publishedAt).getTime());
  const latest = times.filter(Number.isFinite).sort((a, b) => b - a)[0];
  return new Date(latest ?? fallback.getTime()).toISOString();
}

export function buildNewsRss({
  siteUrl,
  brandName,
  articles,
  now = new Date(),
}: {
  siteUrl: string;
  brandName: string;
  articles: NewsArticle[];
  now?: Date;
}): string {
  const items = articles.map((article) => {
    const url = `${siteUrl}/news/${article.slug}`;
    const fields = [
      `<title>${escapeXml(article.title)}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `<pubDate>${rfc822(article.publishedAt)}</pubDate>`,
      `<description>${escapeXml(article.summary)}</description>`,
      `<category>${escapeXml(article.category)}</category>`,
      `<dc:creator>${escapeXml(article.authorName ?? brandName)}</dc:creator>`,
      ...(article.image ? [`<media:content url="${escapeXml(article.image)}" medium="image" />`] : []),
    ];
    return ["    <item>", ...fields.map((field) => `      ${field}`), "    </item>"].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">',
    "  <channel>",
    `    <title>${escapeXml(`${brandName} forex news`)}</title>`,
    `    <link>${escapeXml(`${siteUrl}/news`)}</link>`,
    `    <description>${escapeXml(`Forex market news and notes on the week's key economic releases from ${brandName}.`)}</description>`,
    "    <language>en</language>",
    `    <lastBuildDate>${rfc822(latestUpdate(articles, now))}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(`${siteUrl}${NEWS_FEED_PATH}`)}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

/** Articles dated within the window. Dates have no time of day, so the window counts whole UTC days. */
export function recentNews(articles: NewsArticle[], now = new Date(), days = NEWS_SITEMAP_DAYS): NewsArticle[] {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const cutoff = today - days * DAY_MS;
  return articles.filter((article) => new Date(article.publishedAt).getTime() >= cutoff);
}

export function buildNewsSitemap({
  siteUrl,
  publicationName,
  articles,
  now = new Date(),
}: {
  siteUrl: string;
  publicationName: string;
  articles: NewsArticle[];
  now?: Date;
}): string {
  const urls = recentNews(articles, now)
    .slice(0, 1000)
    .map((article) =>
      [
        "  <url>",
        `    <loc>${escapeXml(`${siteUrl}/news/${article.slug}`)}</loc>`,
        "    <news:news>",
        "      <news:publication>",
        `        <news:name>${escapeXml(publicationName)}</news:name>`,
        "        <news:language>en</news:language>",
        "      </news:publication>",
        `      <news:publication_date>${escapeXml(article.publishedAt)}</news:publication_date>`,
        `      <news:title>${escapeXml(article.title)}</news:title>`,
        "    </news:news>",
        "  </url>",
      ].join("\n")
    );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
}
