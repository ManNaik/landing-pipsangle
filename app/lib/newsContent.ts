export const NEWS_CATEGORIES = [
  "All",
  "Forex",
  "Central Banks",
  "Economic Data",
  "Currencies",
  "Commodities",
  "Market Analysis",
] as const;

export type NewsCategory = Exclude<(typeof NEWS_CATEGORIES)[number], "All">;

export type NewsVisualId = "dollar" | "euro" | "yen" | "gold" | "rates" | "grid";

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  source: string;
  sourceUrl: string | null;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  image: string | null;
  visual: NewsVisualId;
  tags: string[];
  featured: boolean;
  status: "published" | "draft";
  isDemo: boolean;
};

export type MarketSnapshotItem = {
  symbol: string;
  price: string;
  changePercent: number;
  isDemo: boolean;
};

export type MarketEvent = {
  id: string;
  currency: string;
  title: string;
  whenLabel: string;
  time: string;
  isDemo: boolean;
};

const hoursAgo = (n: number) =>
  new Date(Date.now() - n * 60 * 60 * 1000).toISOString();

const demoNotice =
  "<p><strong>Demo content.</strong> This article is fictional sample copy for interface preview. It is not a live market report.</p>";

export const DUMMY_NEWS: NewsArticle[] = [
  {
    id: "n1",
    slug: "dollar-strength-ahead-of-economic-data",
    title: "Dollar Strength Builds Ahead of Key Economic Data",
    summary:
      "Markets are watching upcoming economic data for clues about the direction of monetary policy and potential changes in currency positioning.",
    content: `${demoNotice}
<p>Sample market commentary: traders often review upcoming economic releases when assessing the US dollar against major currency pairs. This demo article describes that process without reporting a live event.</p>
<p>In a typical session, attention concentrates on employment, inflation, and growth indicators because those figures can influence interest rate expectations. Currency positioning then adjusts as participants update those expectations.</p>
<p>PipAngel publishes this page to preview how live forex news will appear once a real news source is connected. Treat every figure and headline on this page as interface sample data.</p>`,
    category: "Forex",
    source: "Demo Source",
    sourceUrl: null,
    publishedAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
    readTime: "5 min read",
    image: null,
    visual: "dollar",
    tags: ["USD", "economic data", "forex"],
    featured: true,
    status: "published",
    isDemo: true,
  },
  {
    id: "n2",
    slug: "central-bank-signals-rate-expectations",
    title: "Markets Watch Central Bank Signals as Rate Expectations Shift",
    summary:
      "Central bank guidance continues to influence currency positioning as traders assess the path of future interest rates.",
    content: `${demoNotice}
<p>Sample analysis: interest rate expectations are a common driver of currency demand. When policy guidance changes, major pairs often reprice as participants adjust duration and funding views.</p>
<p>This demo piece outlines that relationship. It does not describe a specific central bank meeting or policy decision.</p>
<p>When live coverage is connected, each article will show the real source, publication time, and original headline.</p>`,
    category: "Central Banks",
    source: "Demo Source",
    sourceUrl: null,
    publishedAt: hoursAgo(2),
    updatedAt: hoursAgo(2),
    readTime: "4 min read",
    image: null,
    visual: "rates",
    tags: ["rates", "policy"],
    featured: true,
    status: "published",
    isDemo: true,
  },
  {
    id: "n3",
    slug: "employment-data-currency-volatility",
    title: "Employment Data Could Influence Near-Term Currency Volatility",
    summary:
      "Upcoming employment figures may provide additional clues about economic momentum and monetary policy expectations.",
    content: `${demoNotice}
<p>Sample briefing: employment releases can change near-term volatility in currency markets because they feed into growth and policy forecasts. This article is a placeholder for that type of briefing.</p>
<p>Traders typically compare the printed figure with consensus estimates and then review how rate-sensitive pairs respond. No live print is shown here.</p>`,
    category: "Economic Data",
    source: "Demo Source",
    sourceUrl: null,
    publishedAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
    readTime: "3 min read",
    image: null,
    visual: "grid",
    tags: ["employment", "volatility"],
    featured: true,
    status: "published",
    isDemo: true,
  },
  {
    id: "n4",
    slug: "euro-trading-range-tightens",
    title: "Euro Trading Range Tightens Ahead of Key Economic Releases",
    summary:
      "EUR/USD remains in focus as traders wait for fresh economic data and changes in rate expectations.",
    content: `${demoNotice}
<p>Sample pair note: EUR/USD often compresses before scheduled data as participants reduce new risk. This demo copy describes that pattern. It does not claim a live price move.</p>
<p>Range compression can precede either a continuation or a break once new information arrives. Live coverage will attach actual timestamps and sources to notes like this.</p>`,
    category: "Currencies",
    source: "Demo Source",
    sourceUrl: null,
    publishedAt: hoursAgo(8),
    updatedAt: hoursAgo(8),
    readTime: "4 min read",
    image: null,
    visual: "euro",
    tags: ["EURUSD", "range"],
    featured: false,
    status: "published",
    isDemo: true,
  },
  {
    id: "n5",
    slug: "gold-and-dollar-remain-in-focus",
    title: "Gold and the Dollar Remain in Focus as Markets Assess Risk",
    summary:
      "Gold and the US dollar continue to attract attention as investors evaluate changing macroeconomic conditions.",
    content: `${demoNotice}
<p>Sample commodities note: gold and the US dollar are often reviewed together when risk appetite changes. This article is fictional preview copy, not a live metals report.</p>
<p>Macro conditions, real-rate expectations, and broader risk sentiment can all influence that relationship. Treat any prices on this page as demo values.</p>`,
    category: "Commodities",
    source: "Demo Source",
    sourceUrl: null,
    publishedAt: hoursAgo(26),
    updatedAt: hoursAgo(26),
    readTime: "5 min read",
    image: null,
    visual: "gold",
    tags: ["XAUUSD", "USD"],
    featured: false,
    status: "published",
    isDemo: true,
  },
  {
    id: "n6",
    slug: "rate-expectations-drive-currency-positioning",
    title: "Rate Expectations Continue to Drive Currency Positioning",
    summary:
      "Traders remain focused on changes in interest rate expectations and their effect on major currency pairs.",
    content: `${demoNotice}
<p>Sample positioning note: yield differentials and policy-path forecasts often explain shifts across G10 pairs. This demo article restates that framework without citing a live flow report.</p>
<p>When real news is connected, source names and publication times will reflect the original publisher.</p>`,
    category: "Central Banks",
    source: "Demo Source",
    sourceUrl: null,
    publishedAt: hoursAgo(30),
    updatedAt: hoursAgo(30),
    readTime: "4 min read",
    image: null,
    visual: "rates",
    tags: ["rates", "positioning"],
    featured: false,
    status: "published",
    isDemo: true,
  },
  {
    id: "n7",
    slug: "yen-and-policy-divergence-in-focus",
    title: "Policy Divergence Keeps USD/JPY on the Watchlist",
    summary:
      "Differences in policy paths remain a common lens for reviewing the yen against the US dollar in this demo briefing.",
    content: `${demoNotice}
<p>Sample analysis: USD/JPY is frequently discussed through the lens of relative policy settings. This preview article uses that framing and does not report a live move in the pair.</p>
<p>Live articles will include the originating source and an accurate timestamp once the news pipeline is connected.</p>`,
    category: "Market Analysis",
    source: "Demo Source",
    sourceUrl: null,
    publishedAt: hoursAgo(34),
    updatedAt: hoursAgo(34),
    readTime: "4 min read",
    image: null,
    visual: "yen",
    tags: ["USDJPY", "policy"],
    featured: false,
    status: "published",
    isDemo: true,
  },
];

export const DUMMY_MARKET_SNAPSHOT: MarketSnapshotItem[] = [
  { symbol: "EUR/USD", price: "1.0852", changePercent: 0.24, isDemo: true },
  { symbol: "GBP/USD", price: "1.2718", changePercent: -0.18, isDemo: true },
  { symbol: "USD/JPY", price: "149.82", changePercent: 0.31, isDemo: true },
  { symbol: "XAU/USD", price: "2,418.40", changePercent: 0.42, isDemo: true },
];

export const DUMMY_MARKET_EVENTS: MarketEvent[] = [
  {
    id: "e1",
    currency: "USD",
    title: "Employment Data",
    whenLabel: "Tomorrow",
    time: "08:30",
    isDemo: true,
  },
  {
    id: "e2",
    currency: "EUR",
    title: "Inflation Data",
    whenLabel: "Tomorrow",
    time: "10:00",
    isDemo: true,
  },
  {
    id: "e3",
    currency: "GBP",
    title: "Central Bank Decision",
    whenLabel: "Thursday",
    time: "12:00",
    isDemo: true,
  },
  {
    id: "e4",
    currency: "USD",
    title: "Interest Rate Decision",
    whenLabel: "Friday",
    time: "18:30",
    isDemo: true,
  },
];

export const NEWS_WHY_BLOCKS = [
  {
    title: "Central Bank Policy",
    description:
      "Interest rate expectations can influence currency demand and positioning.",
  },
  {
    title: "Economic Data",
    description:
      "Employment, inflation, growth, and other economic indicators can affect market expectations.",
  },
  {
    title: "Market Sentiment",
    description:
      "Changes in risk appetite can influence currency flows across global markets.",
  },
] as const;

export function formatEditorialTime(iso: string): string {
  const diffMin = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (diffMin < 60) return `${Math.max(1, diffMin)} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Yesterday";
  return `${diffDay} days ago`;
}

export function formatEditorialDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function filterNewsArticles(
  articles: NewsArticle[],
  category: string,
  query: string
): NewsArticle[] {
  const q = query.trim().toLowerCase();
  return articles.filter((article) => {
    const categoryMatch = category === "All" || article.category === category;
    if (!categoryMatch) return false;
    if (!q) return true;
    const haystack = `${article.title} ${article.summary} ${article.category} ${article.tags.join(" ")}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function getFeaturedFromList(articles: NewsArticle[]): NewsArticle[] {
  const featured = articles.filter((article) => article.featured);
  if (featured.length >= 3) return featured.slice(0, 3);
  return articles.slice(0, 3);
}

export function getRelatedNews(articles: NewsArticle[], slug: string, limit = 3): NewsArticle[] {
  const current = articles.find((article) => article.slug === slug);
  const others = articles.filter((article) => article.slug !== slug);
  const sameCategory = others.filter((article) => article.category === current?.category);
  const rest = others.filter((article) => article.category !== current?.category);
  return [...sameCategory, ...rest].slice(0, limit);
}
