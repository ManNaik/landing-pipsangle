export const BLOG_CATEGORIES = [
  "All",
  "Forex Basics",
  "Trading",
  "Risk Management",
  "Automation",
  "MT5",
  "PipAngel Guides",
  "Market Education",
] as const;

export type BlogCategory = Exclude<(typeof BLOG_CATEGORIES)[number], "All">;

export type BlogVisualId =
  | "pairs"
  | "chart"
  | "risk"
  | "automation"
  | "mt5"
  | "journal"
  | "psychology"
  | "drawdown";

export type BlogSection = {
  id: string;
  heading: string;
  body: string;
};

export type BlogArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  intro: string;
  sections: BlogSection[];
  category: BlogCategory;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  image: string | null;
  visual: BlogVisualId;
  tags: string[];
  featured: boolean;
  status: "published" | "draft";
  isDemo: boolean;
  showTrialCta: boolean;
};

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

export const DUMMY_BLOG: BlogArticle[] = [
  {
    id: "b1",
    slug: "understanding-how-the-forex-market-works",
    title: "Understanding How the Forex Market Works",
    excerpt:
      "Learn how currency pairs are priced, what moves exchange rates, and why global economic conditions influence forex markets.",
    intro:
      "This demo guide explains the basic structure of the forex market: how pairs are quoted, who participates, and why economic conditions matter. It is educational sample content, not live market advice.",
    sections: [
      {
        id: "what-forex-is",
        heading: "What the forex market is",
        body: "<p>Foreign exchange is the market where currencies are traded against each other. Prices are quoted as pairs, such as EUR/USD, so one currency is expressed in units of another.</p>",
      },
      {
        id: "what-moves-rates",
        heading: "What moves exchange rates",
        body: "<p>Interest rate expectations, inflation, growth data, and risk sentiment can all influence demand for a currency. No single factor determines price on every session.</p>",
      },
      {
        id: "why-structure-matters",
        heading: "Why market structure matters",
        body: "<p>Understanding spreads, liquidity, and session hours helps you read execution quality. PipAngel uses this context when discussing automation on IC Markets MetaTrader 5.</p>",
      },
    ],
    category: "Forex Basics",
    author: "PipAngel",
    publishedAt: daysAgo(3),
    updatedAt: daysAgo(3),
    readTime: "8 min read",
    image: null,
    visual: "pairs",
    tags: ["forex", "education"],
    featured: true,
    status: "published",
    isDemo: true,
    showTrialCta: false,
  },
  {
    id: "b2",
    slug: "how-currency-pairs-work",
    title: "How Currency Pairs Work",
    excerpt:
      "Understand base currency, quote currency, spreads, and how forex pairs are priced.",
    intro:
      "A currency pair shows how much of the quote currency is needed to buy one unit of the base currency. This demo article walks through that quoting convention.",
    sections: [
      {
        id: "base-and-quote",
        heading: "Base and quote",
        body: "<p>In EUR/USD, EUR is the base and USD is the quote. A rise in the pair means the euro buys more dollars. A fall means it buys fewer dollars.</p>",
      },
      {
        id: "spreads",
        heading: "Spreads",
        body: "<p>The spread is the difference between bid and ask. It is a transaction cost. Tighter spreads usually appear in highly traded pairs during active sessions.</p>",
      },
    ],
    category: "Forex Basics",
    author: "PipAngel",
    publishedAt: daysAgo(5),
    updatedAt: daysAgo(5),
    readTime: "6 min read",
    image: null,
    visual: "pairs",
    tags: ["pairs", "spreads"],
    featured: false,
    status: "published",
    isDemo: true,
    showTrialCta: false,
  },
  {
    id: "b3",
    slug: "why-risk-management-matters",
    title: "Why Risk Management Matters in Automated Trading",
    excerpt:
      "Understand position sizing, exposure, stop loss planning, and capital preservation.",
    intro:
      "Automation does not remove market risk. This demo guide covers why position size, exposure caps, and predefined exits still matter when trades are executed automatically.",
    sections: [
      {
        id: "position-sizing",
        heading: "Position sizing",
        body: "<p>Position size determines how much capital is exposed to a single trade. Predefined limits help keep that exposure consistent as conditions change.</p>",
      },
      {
        id: "capital-preservation",
        heading: "Capital preservation",
        body: "<p>Risk is managed, not eliminated. Drawdowns can still occur. The goal of controls is to keep losses bounded, not to promise a particular outcome.</p>",
      },
    ],
    category: "Risk Management",
    author: "PipAngel",
    publishedAt: daysAgo(8),
    updatedAt: daysAgo(8),
    readTime: "8 min read",
    image: null,
    visual: "risk",
    tags: ["risk", "automation"],
    featured: false,
    status: "published",
    isDemo: true,
    showTrialCta: false,
  },
  {
    id: "b4",
    slug: "what-is-forex-trading-automation",
    title: "What Is Forex Trading Automation?",
    excerpt:
      "A practical explanation of how automated trading systems process strategies and execute trades.",
    intro:
      "Automated execution sends trade instructions to a connected brokerage platform according to predefined rules. This demo article describes that workflow in plain language.",
    sections: [
      {
        id: "the-workflow",
        heading: "The workflow",
        body: "<p>A system identifies a setup, applies risk rules, then sends an order through the connected account. The trader still chooses whether automation is enabled and which limits apply.</p>",
      },
      {
        id: "what-it-is-not",
        heading: "What it is not",
        body: "<p>Automation is not a guarantee of profit. It is a method of executing a process with less manual delay. Market risk remains.</p>",
      },
    ],
    category: "Automation",
    author: "PipAngel",
    publishedAt: daysAgo(10),
    updatedAt: daysAgo(10),
    readTime: "7 min read",
    image: null,
    visual: "automation",
    tags: ["automation", "execution"],
    featured: false,
    status: "published",
    isDemo: true,
    showTrialCta: false,
  },
  {
    id: "b5",
    slug: "understanding-metatrader-5",
    title: "Understanding MetaTrader 5 for Automated Trading",
    excerpt:
      "Learn how MT5 connects traders with execution infrastructure and automated strategies.",
    intro:
      "PipAngel automation is built for IC Markets MetaTrader 5. This demo guide explains what MT5 is and why a connected account is required for execution.",
    sections: [
      {
        id: "what-mt5-does",
        heading: "What MT5 does",
        body: "<p>MetaTrader 5 is a trading platform used to view markets, place orders, and run automated routines on a brokerage account.</p>",
      },
      {
        id: "pipangel-connection",
        heading: "How PipAngel uses MT5",
        body: "<p>When an IC Markets MT5 account is connected, PipAngel can send execution instructions according to the controls set in the dashboard. Without that connection, automation cannot place trades.</p>",
      },
    ],
    category: "MT5",
    author: "PipAngel",
    publishedAt: daysAgo(12),
    updatedAt: daysAgo(12),
    readTime: "6 min read",
    image: null,
    visual: "mt5",
    tags: ["MT5", "IC Markets"],
    featured: false,
    status: "published",
    isDemo: true,
    showTrialCta: true,
  },
  {
    id: "b6",
    slug: "what-moves-the-forex-market",
    title: "What Moves the Forex Market?",
    excerpt:
      "Explore interest rates, inflation, employment data, economic growth, and market sentiment.",
    intro:
      "Currency prices respond to a mix of policy expectations, economic data, and risk appetite. This demo article outlines those drivers without claiming a specific live outcome.",
    sections: [
      {
        id: "policy-and-data",
        heading: "Policy and data",
        body: "<p>Interest rate paths, inflation prints, and employment figures can change how participants value a currency relative to another.</p>",
      },
      {
        id: "sentiment",
        heading: "Sentiment",
        body: "<p>When risk appetite shifts, funding currencies and reserve currencies can see flow changes even if local data is unchanged.</p>",
      },
    ],
    category: "Trading",
    author: "PipAngel",
    publishedAt: daysAgo(14),
    updatedAt: daysAgo(14),
    readTime: "8 min read",
    image: null,
    visual: "chart",
    tags: ["macro", "education"],
    featured: false,
    status: "published",
    isDemo: true,
    showTrialCta: false,
  },
  {
    id: "b7",
    slug: "why-trading-discipline-matters",
    title: "Why Trading Discipline Matters",
    excerpt:
      "Understand how consistent rules can help reduce emotional decision-making.",
    intro:
      "Discipline in trading means applying the same rules when conditions feel uncomfortable. This demo article explains why process consistency matters more than a single result.",
    sections: [
      {
        id: "rules-before-emotion",
        heading: "Rules before emotion",
        body: "<p>Predefined risk limits and execution rules reduce the need to improvise during volatile sessions. They do not remove uncertainty.</p>",
      },
      {
        id: "automation-and-discipline",
        heading: "Automation and discipline",
        body: "<p>Automated execution can follow a plan more consistently than manual clicking. The plan still has to be sound, and the trader still chooses the controls.</p>",
      },
    ],
    category: "Trading",
    author: "PipAngel",
    publishedAt: daysAgo(16),
    updatedAt: daysAgo(16),
    readTime: "5 min read",
    image: null,
    visual: "psychology",
    tags: ["discipline", "process"],
    featured: false,
    status: "published",
    isDemo: true,
    showTrialCta: false,
  },
  {
    id: "b8",
    slug: "getting-started-with-pipangel",
    title: "Getting Started With PipAngel",
    excerpt:
      "A beginner's guide to the PipAngel dashboard, automation controls, and account setup.",
    intro:
      "This demo walkthrough covers the first steps: create an account, review the dashboard, and connect IC Markets MT5 if you want automated execution.",
    sections: [
      {
        id: "start-with-a-trial",
        heading: "Start with a trial",
        body: "<p>New accounts receive a 4-day free trial. Use that time to inspect the dashboard, performance pages, and available automation controls.</p>",
      },
      {
        id: "connect-mt5",
        heading: "Connect MT5 when you are ready",
        body: "<p>Automated execution requires an IC Markets MetaTrader 5 account. You can explore the platform first and connect later.</p>",
      },
    ],
    category: "PipAngel Guides",
    author: "PipAngel",
    publishedAt: daysAgo(18),
    updatedAt: daysAgo(18),
    readTime: "6 min read",
    image: null,
    visual: "journal",
    tags: ["pipangel", "setup"],
    featured: false,
    status: "published",
    isDemo: true,
    showTrialCta: true,
  },
  {
    id: "b9",
    slug: "understanding-drawdown-in-trading",
    title: "Understanding Drawdown in Trading",
    excerpt:
      "Learn what drawdown means and why it matters when evaluating trading performance.",
    intro:
      "Drawdown measures the decline from a peak in account equity to a subsequent low. This demo article explains why that statistic matters when you review performance.",
    sections: [
      {
        id: "what-drawdown-is",
        heading: "What drawdown is",
        body: "<p>If equity rises to a high and then falls, the distance between that high and the later low is the drawdown. It describes path risk, not a single trade result.</p>",
      },
      {
        id: "why-it-matters",
        heading: "Why it matters",
        body: "<p>Two strategies with similar returns can have very different drawdowns. Reviewing that path helps you judge whether the risk profile fits your capital and plan.</p>",
      },
    ],
    category: "Risk Management",
    author: "PipAngel",
    publishedAt: daysAgo(20),
    updatedAt: daysAgo(20),
    readTime: "6 min read",
    image: null,
    visual: "drawdown",
    tags: ["drawdown", "performance"],
    featured: false,
    status: "published",
    isDemo: true,
    showTrialCta: false,
  },
  {
    id: "b10",
    slug: "manual-trading-vs-automated-execution",
    title: "Manual Trading vs Automated Execution",
    excerpt:
      "Understand the practical differences between discretionary trading and automated execution.",
    intro:
      "Manual trading relies on the trader to place each order. Automated execution follows predefined rules through a connected platform. This demo article compares those approaches without ranking them as universally better.",
    sections: [
      {
        id: "discretionary-trading",
        heading: "Discretionary trading",
        body: "<p>The trader interprets the market and clicks the order. Flexibility is high. Consistency depends on the person following their own rules under pressure.</p>",
      },
      {
        id: "automated-execution",
        heading: "Automated execution",
        body: "<p>Rules are set in advance. The system sends orders when conditions match. The trader still chooses risk limits, whether automation is on, and which account is connected.</p>",
      },
    ],
    category: "Automation",
    author: "PipAngel",
    publishedAt: daysAgo(22),
    updatedAt: daysAgo(22),
    readTime: "7 min read",
    image: null,
    visual: "automation",
    tags: ["manual", "automation"],
    featured: false,
    status: "published",
    isDemo: true,
    showTrialCta: false,
  },
];

export function filterBlogArticles(
  articles: BlogArticle[],
  category: string,
  query: string
): BlogArticle[] {
  const q = query.trim().toLowerCase();
  return articles.filter((article) => {
    const categoryMatch = category === "All" || article.category === category;
    if (!categoryMatch) return false;
    if (!q) return true;
    const haystack = `${article.title} ${article.excerpt} ${article.category} ${article.tags.join(" ")}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function getRelatedBlog(articles: BlogArticle[], slug: string, limit = 3): BlogArticle[] {
  const current = articles.find((article) => article.slug === slug);
  const others = articles.filter((article) => article.slug !== slug);
  const sameCategory = others.filter((article) => article.category === current?.category);
  const rest = others.filter((article) => article.category !== current?.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function blogArticleToHtml(article: BlogArticle): string {
  const sections = article.sections
    .map(
      (section) =>
        `<h2 id="${section.id}">${section.heading}</h2>${section.body}`
    )
    .join("");
  return `<p>${article.intro}</p>${sections}`;
}
