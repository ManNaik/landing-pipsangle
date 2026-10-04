import assert from "node:assert/strict";
import { test } from "node:test";
import { buildNewsRss, buildNewsSitemap, escapeXml, recentNews } from "./feeds";
import type { NewsArticle } from "./newsContent";

function article(overrides: Partial<NewsArticle>): NewsArticle {
  return {
    id: "a",
    slug: "a",
    title: "Title",
    summary: "Summary",
    content: "",
    category: "Forex",
    source: "PipsAngel",
    sourceUrl: null,
    publishedAt: "2026-10-01",
    updatedAt: "2026-10-01T09:30:00Z",
    readTime: "",
    image: null,
    visual: "grid",
    tags: [],
    featured: false,
    status: "published",
    isDemo: false,
    ...overrides,
  };
}

const SITE = "https://pipsangel.com";

test("escapeXml escapes markup and drops control characters", () => {
  assert.equal(escapeXml(`Fed & ECB <"cuts"> 'soon'\u0007`), "Fed &amp; ECB &lt;&quot;cuts&quot;&gt; &apos;soon&apos;");
});

test("RSS lists each article with escaped fields, author and image", () => {
  const xml = buildNewsRss({
    siteUrl: SITE,
    brandName: "PipsAngel",
    articles: [
      article({
        slug: "ecb-preview",
        title: "ECB & the euro",
        authorName: "Jane Doe",
        image: "https://cdn.example.com/a.jpg?w=1200&h=630",
      }),
      article({ slug: "nfp-recap", title: "NFP recap" }),
    ],
  });

  assert.match(xml, /<title>ECB &amp; the euro<\/title>/);
  assert.match(xml, /<guid isPermaLink="true">https:\/\/pipsangel.com\/news\/ecb-preview<\/guid>/);
  assert.match(xml, /<pubDate>Thu, 01 Oct 2026 00:00:00 GMT<\/pubDate>/);
  assert.match(xml, /<dc:creator>Jane Doe<\/dc:creator>/);
  assert.match(xml, /<dc:creator>PipsAngel<\/dc:creator>/);
  assert.match(xml, /<media:content url="https:\/\/cdn.example.com\/a.jpg\?w=1200&amp;h=630" medium="image" \/>/);
  assert.equal(xml.match(/<media:content/g)?.length, 1);
  assert.match(xml, /<atom:link href="https:\/\/pipsangel.com\/news\/rss.xml" rel="self"/);
  assert.match(xml, /<lastBuildDate>Thu, 01 Oct 2026 09:30:00 GMT<\/lastBuildDate>/);
});

test("an empty feed is still valid RSS", () => {
  const now = new Date("2026-10-03T08:00:00Z");
  const xml = buildNewsRss({ siteUrl: SITE, brandName: "PipsAngel", articles: [], now });
  assert.doesNotMatch(xml, /<item>/);
  assert.match(xml, /<lastBuildDate>Sat, 03 Oct 2026 08:00:00 GMT<\/lastBuildDate>/);
});

test("recentNews keeps whole UTC days inside the window", () => {
  const now = new Date("2026-10-03T23:00:00Z");
  const slugs = recentNews(
    [
      article({ slug: "today", publishedAt: "2026-10-03" }),
      article({ slug: "two-days", publishedAt: "2026-10-01" }),
      article({ slug: "three-days", publishedAt: "2026-09-30" }),
    ],
    now
  ).map((item) => item.slug);
  assert.deepEqual(slugs, ["today", "two-days"]);
});

test("Google News sitemap includes only recent articles", () => {
  const xml = buildNewsSitemap({
    siteUrl: SITE,
    publicationName: "PipsAngel",
    now: new Date("2026-10-02T12:00:00Z"),
    articles: [
      article({ slug: "fresh", title: "Fed <decision>", publishedAt: "2026-10-02" }),
      article({ slug: "stale", publishedAt: "2026-09-01" }),
    ],
  });
  assert.match(xml, /<loc>https:\/\/pipsangel.com\/news\/fresh<\/loc>/);
  assert.match(xml, /<news:title>Fed &lt;decision&gt;<\/news:title>/);
  assert.match(xml, /<news:publication_date>2026-10-02<\/news:publication_date>/);
  assert.doesNotMatch(xml, /stale/);
});
