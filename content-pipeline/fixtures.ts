import type { Article, Brief, Review, RunContext } from "./types";

export const SOURCE_TEXTS: Record<string, string> = {
  s1: "The Employment Situation report is published by the Bureau of Labor Statistics on the first Friday of each month. Total nonfarm payroll employment changed by an amount reported in thousands, and the unemployment rate was reported alongside revisions to the prior two months.",
  s2: "Currency markets often move sharply in the minutes after major United States labour data, with dealers adjusting expectations for the path of policy rates set by the Federal Open Market Committee.",
  s3: "Analysts at several banks publish forecasts before each release, and the median of those forecasts is commonly described as the consensus estimate in market coverage.",
};

export const CONTEXT: RunContext = {
  run_id: "test-run",
  created_at: "2026-10-03T00:00:00.000Z",
  date: "2026-10-03",
  site_url: "https://pipsangel.com",
  publish_mode: "publish",
  categories: ["Forex", "Central Banks", "Economic Data", "Currencies", "Commodities", "Market Analysis"],
  internal_pages: [],
  published_articles: [{ slug: "older-article", title: "An older article", date: "2026-09-01", category: "Forex" }],
};

export const BRIEF: Brief = {
  run_id: "test-run",
  researched_at: "2026-10-03T00:00:00.000Z",
  candidates: [],
  selected: {
    candidate_index: 0,
    working_title: "Nonfarm payrolls",
    category: "Economic Data",
    audience_questions: [],
    outline: [],
    content_gaps: [],
    facts: [],
    internal_link_suggestions: [],
  },
  sources: [
    {
      id: "s1",
      url: "https://www.bls.gov/news.release/empsit.toc.htm",
      title: "The Employment Situation",
      publisher: "U.S. Bureau of Labor Statistics",
      type: "primary",
      accessed: "2026-10-03",
      text_file: "sources/s1.md",
    },
    {
      id: "s2",
      url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
      title: "FOMC meeting calendars & statements",
      publisher: "Federal Reserve",
      type: "primary",
      accessed: "2026-10-03",
      text_file: "sources/s2.md",
    },
    {
      id: "s3",
      url: "https://www.example-news.com/nfp-consensus",
      title: "What economists expect",
      publisher: "Example News",
      type: "secondary",
      accessed: "2026-10-03",
      text_file: "sources/s3.md",
    },
  ],
};

const SECTION_TOPICS = ["the headline number", "the unemployment rate", "wage growth", "revisions", "the dollar", "risk"];

function filler(section: number): string {
  return Array.from({ length: 5 }, (_, index) => {
    const topic = SECTION_TOPICS[(section + index) % SECTION_TOPICS.length];
    return `<p>Point ${section}.${index} looks at ${topic} from a fresh angle, with example ${section * 10 + index} showing how a reader might weigh it against the forecast. Keep notes simple, compare the figure with the prior month, and remember that one release rarely settles the bigger picture for currency ${index + section} traders.</p>`;
  }).join("");
}

export function goodArticle(overrides: Partial<Article> = {}): Article {
  const content = [
    `<p>The monthly nonfarm payrolls figure from the <a href="https://www.bls.gov/news.release/empsit.toc.htm">Bureau of Labor Statistics</a> is one of the most watched releases in currency trading, and this guide explains what it measures and why the dollar often moves when it lands on 2 October 2026.</p>`,
    `<h2>What the release measures</h2>`,
    filler(1),
    `<h2>Why the dollar reacts</h2>`,
    `<p>Rate expectations sit at the centre of the reaction, and the <a href="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm">Federal Reserve calendar</a> shows when policymakers next meet. Readers who trade through <a href="/automated-forex-trading">copy trading</a> should expect wider spreads around the release.</p>`,
    filler(2),
    `<h2>How to read the numbers</h2>`,
    filler(3),
    `<h2>What to watch next</h2>`,
    filler(4),
  ].join("");
  return {
    run_id: "test-run",
    slug: "nonfarm-payrolls-explained",
    title: "Nonfarm payrolls explained for forex traders",
    category: "Economic Data",
    excerpt:
      "What the monthly nonfarm payrolls report measures, why the US dollar moves when it is released, and how forex traders can read the numbers calmly.",
    target_keyword: "nonfarm payrolls",
    secondary_keywords: ["unemployment rate", "dollar"],
    content_html: content,
    sources: ["s1", "s2", "s3"],
    revision: 1,
    ...overrides,
  };
}

export function passingReview(hash: string, overrides: Partial<Review> = {}): Review {
  return {
    run_id: "test-run",
    article_sha256: hash,
    reviewed_at: "2026-10-03T01:00:00.000Z",
    verdict: "pass",
    scores: { accuracy: 5, originality: 5, helpfulness: 4, engagement: 4, seo: 5, compliance: 5 },
    fact_checks: Array.from({ length: 5 }, (_, index) => ({
      claim: `Claim ${index}`,
      status: "verified" as const,
      source_url: "https://www.bls.gov/news.release/empsit.toc.htm",
    })),
    issues: [{ severity: "minor", location: "intro", problem: "Could be tighter", fix: "Trim a clause" }],
    summary: "Accurate and useful.",
    ...overrides,
  };
}
