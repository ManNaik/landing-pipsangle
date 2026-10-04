/** Must match NEWS_CATEGORIES in the backend pipeline endpoint and the website's category pages. */
export const CATEGORIES = [
  "Forex",
  "Central Banks",
  "Economic Data",
  "Currencies",
  "Commodities",
  "Market Analysis",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const RESERVED_SLUGS = new Set(["page", "category", "rss.xml"]);

/** Site pages articles may link to. Anything else on the site risks a 404. */
export const INTERNAL_PAGES = [
  { path: "/news", title: "Forex market news", useWhen: "pointing readers to more coverage" },
  {
    path: "/automated-forex-trading",
    title: "How PipsAngel copy trading works",
    useWhen: "the article discusses automated or copy trading, or risk on live trades",
  },
  { path: "/security", title: "How PipsAngel protects your MT5 account", useWhen: "account safety or broker access comes up" },
  { path: "/ic-markets-account", title: "Open an IC Markets MT5 account", useWhen: "the article mentions brokers or MT5 accounts" },
  { path: "/faq", title: "PipsAngel FAQ", useWhen: "readers may have questions about the service" },
] as const;

/** Publishers of the original data or decisions. At least one must back every article. */
export const PRIMARY_SOURCE_DOMAINS = [
  "federalreserve.gov",
  "newyorkfed.org",
  "ecb.europa.eu",
  "bankofengland.co.uk",
  "boj.or.jp",
  "rba.gov.au",
  "bankofcanada.ca",
  "snb.ch",
  "rbnz.govt.nz",
  "norges-bank.no",
  "riksbank.se",
  "rbi.org.in",
  "pbc.gov.cn",
  "bls.gov",
  "bea.gov",
  "census.gov",
  "dol.gov",
  "treasury.gov",
  "ons.gov.uk",
  "ec.europa.eu",
  "destatis.de",
  "insee.fr",
  "stat.go.jp",
  "esri.cao.go.jp",
  "abs.gov.au",
  "statcan.gc.ca",
  "stats.govt.nz",
  "mospi.gov.in",
  "imf.org",
  "bis.org",
  "oecd.org",
  "worldbank.org",
  "cftc.gov",
  "eia.gov",
  "opec.org",
  "ismworld.org",
  "spglobal.com",
  "cmegroup.com",
] as const;

export type InternalPage = { path: string; title: string; useWhen: string };

export type PublishedArticleSummary = { slug: string; title: string; date: string; category: string };

export type RunContext = {
  run_id: string;
  created_at: string;
  date: string;
  site_url: string;
  publish_mode: "publish" | "draft";
  categories: readonly string[];
  internal_pages: InternalPage[];
  published_articles: PublishedArticleSummary[];
};

export type BriefSource = {
  id: string;
  url: string;
  title: string;
  publisher: string;
  type: "primary" | "secondary";
  accessed: string;
  text_file: string;
};

export type BriefFact = { claim: string; source_id: string; quote: string; as_of: string };

export type TopicCandidate = {
  topic: string;
  angle: string;
  target_keyword: string;
  secondary_keywords: string[];
  search_intent: string;
  demand_evidence: string[];
  timeliness: string;
  traffic_potential: "high" | "medium" | "low";
  score: number;
};

export type Brief = {
  run_id: string;
  researched_at: string;
  candidates: TopicCandidate[];
  selected: {
    candidate_index: number;
    working_title: string;
    category: string;
    audience_questions: string[];
    outline: string[];
    content_gaps: string[];
    facts: BriefFact[];
    internal_link_suggestions: string[];
  };
  sources: BriefSource[];
};

export type Article = {
  run_id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  target_keyword: string;
  secondary_keywords: string[];
  content_html: string;
  sources: string[];
  image_url?: string;
  image_alt?: string;
  revision: number;
  changelog?: string[];
};

export const REVIEW_DIMENSIONS = ["accuracy", "originality", "helpfulness", "engagement", "seo", "compliance"] as const;
export type ReviewDimension = (typeof REVIEW_DIMENSIONS)[number];

export type FactCheck = {
  claim: string;
  status: "verified" | "incorrect" | "unverifiable";
  source_url: string;
  note?: string;
};

export type ReviewIssue = {
  severity: "blocker" | "major" | "minor";
  location: string;
  problem: string;
  fix: string;
};

export type Review = {
  run_id: string;
  article_sha256: string;
  reviewed_at: string;
  verdict: "pass" | "fail";
  scores: Record<ReviewDimension, number>;
  fact_checks: FactCheck[];
  issues: ReviewIssue[];
  summary: string;
};
