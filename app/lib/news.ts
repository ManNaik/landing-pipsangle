export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
};

// Add your financial market news here. Each item helps with SEO when people search for news.
export const newsItems: NewsItem[] = [
  {
    slug: "forex-market-outlook-march-2025",
    title: "Forex Market Outlook: Key Pairs and Central Bank Moves in March 2025",
    excerpt:
      "Major currency pairs face volatility as traders weigh Fed policy, ECB signals, and risk sentiment. EUR/USD, GBP/USD, and USD/JPY levels to watch.",
    date: "2025-03-07",
    category: "Forex",
  },
  {
    slug: "usd-strength-and-emerging-market-currencies",
    title: "USD Strength and Emerging Market Currencies: What Traders Need to Know",
    excerpt:
      "The US dollar's rally is pressuring EM currencies. We break down implications for forex pairs and how to manage risk in volatile conditions.",
    date: "2025-03-05",
    category: "Markets",
  },
  {
    slug: "interest-rate-decisions-impact-on-forex",
    title: "Interest Rate Decisions and Their Impact on Forex Markets",
    excerpt:
      "Central bank meetings drive short-term moves in FX. A practical guide to trading around rate decisions and interpreting forward guidance.",
    date: "2025-03-02",
    category: "Analysis",
  },
];

export function getNewsItems(): NewsItem[] {
  return newsItems;
}

export function getNewsItem(slug: string): NewsItem | undefined {
  return newsItems.find((item) => item.slug === slug);
}
