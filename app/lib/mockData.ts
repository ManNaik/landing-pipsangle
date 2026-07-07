import { defaultSiteConfig } from "./defaultSiteConfig";
import type {
  AiIntelligence,
  BlogPostDetail,
  BlogPostListItem,
  CommunityMessage,
  ContentBlock,
  FaqItem,
  ListResponse,
  NewsArticleDetail,
  NewsArticleListItem,
  PaginatedResponse,
  PerformanceStats,
  Signal,
  SiteConfig,
  Trade,
  TradeAccuracy,
  ExecutedTrade,
} from "./types";

const now = new Date();
const daysAgo = (n: number) =>
  new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();
const hoursAgo = (n: number) =>
  new Date(now.getTime() - n * 60 * 60 * 1000).toISOString();

export function getMockSiteConfig(): SiteConfig {
  return defaultSiteConfig;
}

export const mockPerformanceStats: PerformanceStats = {
  trades_executed: 1247,
  trades_executed_display: "1,247+",
  win_rate_percent: 72,
  average_pips: 18.4,
  max_drawdown_percent: 8.2,
  years_tested: 3,
  years_tested_display: "3+",
  updated_at: daysAgo(1),
};

export const mockTrades: Trade[] = [
  {
    id: "t1",
    pair: "EUR/USD",
    direction: "BUY",
    entry: "1.0842",
    stop_loss: "1.0810",
    take_profit: "1.0895",
    pips: 42,
    result: "profit",
    closed_at: daysAgo(1),
  },
  {
    id: "t2",
    pair: "GBP/JPY",
    direction: "SELL",
    entry: "188.45",
    stop_loss: "189.10",
    take_profit: "187.20",
    pips: 68,
    result: "profit",
    closed_at: daysAgo(2),
  },
  {
    id: "t3",
    pair: "USD/CAD",
    direction: "BUY",
    entry: "1.3620",
    stop_loss: "1.3585",
    take_profit: "1.3675",
    pips: -28,
    result: "loss",
    closed_at: daysAgo(3),
  },
  {
    id: "t4",
    pair: "AUD/USD",
    direction: "SELL",
    entry: "0.6580",
    stop_loss: "0.6615",
    take_profit: "0.6520",
    pips: 35,
    result: "profit",
    closed_at: daysAgo(4),
  },
  {
    id: "t5",
    pair: "XAU/USD",
    direction: "BUY",
    entry: "2342.50",
    stop_loss: "2328.00",
    take_profit: "2368.00",
    pips: 51,
    result: "profit",
    closed_at: daysAgo(5),
  },
];

export const mockTradeAccuracy: TradeAccuracy = {
  percent: 72,
  last_n: 10,
  wins: 7,
  losses: 3,
  message: "Accuracy (last 10 trades): 72%",
  calculated_at: hoursAgo(2),
};

export const mockSignals: Signal[] = [
  {
    id: "s1",
    pair: "EUR/USD",
    direction: "BUY",
    entry: "1.0865",
    stop_loss: "1.0835",
    take_profit: "1.0915",
    risk_reward: "1:1.7",
    status: "active",
    issued_at: hoursAgo(1),
    closed_at: null,
  },
  {
    id: "s2",
    pair: "GBP/USD",
    direction: "SELL",
    entry: "1.2680",
    stop_loss: "1.2720",
    take_profit: "1.2610",
    risk_reward: "1:1.8",
    status: "hit_tp",
    issued_at: hoursAgo(6),
    closed_at: hoursAgo(3),
  },
  {
    id: "s3",
    pair: "USD/JPY",
    direction: "BUY",
    entry: "149.85",
    stop_loss: "149.40",
    take_profit: "150.55",
    risk_reward: "1:1.6",
    status: "active",
    issued_at: hoursAgo(4),
    closed_at: null,
  },
  {
    id: "s4",
    pair: "AUD/USD",
    direction: "SELL",
    entry: "0.6612",
    stop_loss: "0.6645",
    take_profit: "0.6550",
    risk_reward: "1:1.9",
    status: "hit_tp",
    issued_at: daysAgo(1),
    closed_at: hoursAgo(18),
  },
  {
    id: "s5",
    pair: "USD/CAD",
    direction: "BUY",
    entry: "1.3588",
    stop_loss: "1.3550",
    take_profit: "1.3645",
    risk_reward: "1:1.5",
    status: "hit_sl",
    issued_at: daysAgo(2),
    closed_at: daysAgo(1),
  },
  {
    id: "s6",
    pair: "GBP/JPY",
    direction: "SELL",
    entry: "189.42",
    stop_loss: "190.05",
    take_profit: "188.10",
    risk_reward: "1:2.0",
    status: "hit_tp",
    issued_at: daysAgo(3),
    closed_at: daysAgo(2),
  },
  {
    id: "s7",
    pair: "XAU/USD",
    direction: "BUY",
    entry: "2358.20",
    stop_loss: "2342.00",
    take_profit: "2385.00",
    risk_reward: "1:1.7",
    status: "active",
    issued_at: hoursAgo(8),
    closed_at: null,
  },
  {
    id: "s8",
    pair: "EUR/GBP",
    direction: "BUY",
    entry: "0.8562",
    stop_loss: "0.8535",
    take_profit: "0.8605",
    risk_reward: "1:1.6",
    status: "expired",
    issued_at: daysAgo(5),
    closed_at: daysAgo(4),
  },
  {
    id: "s9",
    pair: "NZD/USD",
    direction: "SELL",
    entry: "0.6125",
    stop_loss: "0.6158",
    take_profit: "0.6070",
    risk_reward: "1:1.7",
    status: "cancelled",
    issued_at: daysAgo(6),
    closed_at: daysAgo(6),
  },
  {
    id: "s10",
    pair: "EUR/JPY",
    direction: "BUY",
    entry: "162.45",
    stop_loss: "161.90",
    take_profit: "163.35",
    risk_reward: "1:1.6",
    status: "hit_tp",
    issued_at: daysAgo(7),
    closed_at: daysAgo(6),
  },
];

export const mockExecutedTrades: ExecutedTrade[] = [
  {
    id: "et1",
    pair: "EUR/USD",
    direction: "BUY",
    entry: "1.0842",
    exit: "1.0895",
    profit_loss: 186.4,
    status: "closed",
    executed_at: daysAgo(1),
  },
  {
    id: "et2",
    pair: "GBP/JPY",
    direction: "SELL",
    entry: "188.45",
    exit: "187.20",
    profit_loss: 312.8,
    status: "closed",
    executed_at: daysAgo(2),
  },
  {
    id: "et3",
    pair: "USD/CAD",
    direction: "BUY",
    entry: "1.3620",
    exit: "1.3585",
    profit_loss: -94.2,
    status: "closed",
    executed_at: daysAgo(3),
  },
  {
    id: "et4",
    pair: "AUD/USD",
    direction: "SELL",
    entry: "0.6580",
    exit: "0.6520",
    profit_loss: 142.5,
    status: "closed",
    executed_at: daysAgo(4),
  },
  {
    id: "et5",
    pair: "XAU/USD",
    direction: "BUY",
    entry: "2342.50",
    exit: "2368.00",
    profit_loss: 255.0,
    status: "closed",
    executed_at: daysAgo(5),
  },
  {
    id: "et6",
    pair: "GBP/USD",
    direction: "SELL",
    entry: "1.2680",
    exit: "1.2610",
    profit_loss: 168.75,
    status: "closed",
    executed_at: hoursAgo(3),
  },
  {
    id: "et7",
    pair: "USD/JPY",
    direction: "BUY",
    entry: "149.85",
    exit: null,
    current_price: "150.12",
    profit_loss: 42.3,
    status: "open",
    executed_at: hoursAgo(4),
  },
  {
    id: "et8",
    pair: "EUR/USD",
    direction: "BUY",
    entry: "1.0865",
    exit: null,
    current_price: "1.0882",
    profit_loss: 18.6,
    status: "open",
    executed_at: hoursAgo(1),
  },
  {
    id: "et11",
    pair: "XAU/USD",
    direction: "BUY",
    entry: "2358.20",
    exit: null,
    current_price: "2351.40",
    profit_loss: -34.0,
    status: "open",
    executed_at: hoursAgo(8),
  },
  {
    id: "et9",
    pair: "EUR/GBP",
    direction: "BUY",
    entry: "0.8562",
    exit: "0.8562",
    profit_loss: 0,
    status: "cancelled",
    executed_at: daysAgo(5),
  },
  {
    id: "et10",
    pair: "NZD/USD",
    direction: "SELL",
    entry: "0.6048",
    exit: "0.5995",
    profit_loss: 127.4,
    status: "closed",
    executed_at: daysAgo(8),
  },
];

export const mockAiIntelligence: AiIntelligence = {
  title: "AI Market Intelligence Engine",
  description:
    "Our AI analyzes market conditions and risk factors to identify better trading opportunities.",
  modules: [
    {
      name: "Market Researcher",
      description: "Scans price action, sentiment, and macro drivers across major pairs.",
      features: ["Bias detection", "Multi-timeframe", "News impact"],
      example_insight: {
        pair: "EUR/USD",
        bias: "Bullish",
        confidence: "High",
        timeframe: "H4 · Updated 12 min ago",
      },
    },
    {
      name: "Risk Sentinel",
      description: "Monitors volatility and drawdown to recommend position sizing.",
      features: ["Volatility scan", "Drawdown guard", "Risk % sizing"],
      example_risk_report: {
        risk_level: "Moderate",
        recommended_risk: "1.0%",
        volatility: "Elevated",
      },
    },
  ],
  updated_at: daysAgo(1),
};

const homeBlocks: ContentBlock[] = [
  {
    key: "home.hero",
    title: "Forex Signals & Automated Trading",
    subtitle: "",
    body: "Daily forex signals with clear entry, stop loss, and take profit levels. Connect MetaTrader for optional hands-free execution with built-in risk controls.",
    metadata: {
      eyebrow: "Professional Forex Trading",
      cta_primary_label: "View Signals",
      cta_primary_url: "#forex-signals",
      cta_secondary_label: "Automate Trading",
      cta_secondary_url: "#automation",
    },
    updated_at: daysAgo(7),
  },
  {
    key: "home.forex_signals",
    title: "Forex Signals",
    subtitle: "Done-for-you trade ideas, delivered in real time.",
    body: "Get institutional-grade forex signals with clear entry, stop loss and take profit levels so you never second-guess a trade again.",
    metadata: {
      benefits: [
        "Clear entry, SL and TP on every signal",
        "Risk-reward ratio shown upfront",
        "Delivered via app, email, or Telegram",
        "Suitable for manual or copy trading",
      ],
      how_it_works_steps: [
        "Subscribe to Basic or Premium",
        "Receive signals in real time",
        "Execute manually or enable automation",
      ],
    },
    updated_at: daysAgo(7),
  },
  {
    key: "home.automation",
    title: "Automation",
    subtitle: "Let the system execute the signals for you.",
    body: "Connect your trading account once and let the automation engine mirror the same risk-managed strategies 24/5 without you watching every tick.",
    metadata: {
      flow_steps: [
        { label: "Signal received", body: "AI + traders validate a setup in real time." },
        { label: "Risk calculated", body: "Position size adjusted to your configured risk %." },
        { label: "Trade executed", body: "Order placed automatically on your connected broker." },
      ],
      risk_controls: [
        "Max daily drawdown limit",
        "Per-trade risk percentage cap",
        "Pause automation anytime from dashboard",
        "Compatible with MT4/MT5 and cTrader",
      ],
    },
    updated_at: daysAgo(7),
  },
  {
    key: "home.sections",
    title: "Explore",
    subtitle: "",
    body: "",
    metadata: {
      cards: [
        { title: "Forex Signals", description: "Live trade setups with full risk plan.", url: "/forex-signals" },
        { title: "Automation", description: "Hands-free execution with risk controls.", url: "/automated-forex-trading" },
        { title: "Performance", description: "Transparent track record and stats.", url: "/trading-performance" },
      ],
    },
    updated_at: daysAgo(7),
  },
  {
    key: "home.cta",
    title: "Start Trading Smarter Today",
    subtitle: "Join traders using our signals and automation platform.",
    body: "",
    metadata: {
      cta_buttons: [
        { label: "View Signals", url: "#forex-signals" },
        { label: "Automate Trading", url: "#automation" },
      ],
    },
    updated_at: daysAgo(7),
  },
];

const pageBlocks: Record<string, ContentBlock> = {
  "forex_signals.page": {
    key: "forex_signals.page",
    title: "Professional Forex Trading Signals",
    subtitle: "Daily trade setups with clear entry, stop loss and take profit.",
    body: "Receive high-probability forex signals backed by technical and fundamental analysis.",
    metadata: {
      features: [
        "Real-time signal delivery",
        "Full trade plan on every setup",
        "Risk-reward ratios included",
        "Works with any broker",
      ],
    },
    updated_at: daysAgo(14),
  },
  "automation.page": {
    key: "automation.page",
    title: "Automated Forex Trading",
    subtitle: "Connect once, trade automatically 24/5.",
    body: "Mirror our signals on your broker account with built-in risk management.",
    metadata: {},
    updated_at: daysAgo(14),
  },
  "trading_performance.page": {
    key: "trading_performance.page",
    title: "Trading Performance",
    subtitle: "Transparent results you can verify.",
    body: "Our track record is updated regularly with real trade outcomes.",
    metadata: {},
    updated_at: daysAgo(14),
  },
  "faq.page": {
    key: "faq.page",
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about PipAngel.",
    body: "",
    metadata: {},
    updated_at: daysAgo(30),
  },
  "contact.page": {
    key: "contact.page",
    title: "Contact Us",
    subtitle: "We're here to help.",
    body: "Reach out with questions about signals, automation, or your account.",
    metadata: {},
    updated_at: daysAgo(30),
  },
  "about.page": {
    key: "about.page",
    title: "About PipAngel",
    subtitle: "Professional forex signals and automation.",
    body: "PipAngel helps traders access institutional-quality signals and optional automation.",
    metadata: {},
    updated_at: daysAgo(30),
  },
  "careers.page": {
    key: "careers.page",
    title: "Careers",
    subtitle: "Join our team.",
    body: "We're building the future of accessible forex trading tools.",
    metadata: {},
    updated_at: daysAgo(30),
  },
  "terms.page": {
    key: "terms.page",
    title: "Terms of Service",
    subtitle: "",
    body: "By using PipAngel you agree to our terms of service. Trading involves risk.",
    metadata: {},
    updated_at: daysAgo(60),
  },
  "privacy.page": {
    key: "privacy.page",
    title: "Privacy Policy",
    subtitle: "",
    body: "We respect your privacy and handle your data responsibly.",
    metadata: {},
    updated_at: daysAgo(60),
  },
};

export const mockFaqItems: FaqItem[] = [
  {
    id: "faq1",
    question: "How do I receive signals?",
    answer: "Signals are delivered via the dashboard, email, and optional Telegram alerts.",
  },
  {
    id: "faq2",
    question: "Can I automate trades?",
    answer: "Yes — connect your IC Markets MetaTrader 5 account to mirror signals automatically.",
  },
  {
    id: "faq3",
    question: "Is there a free trial?",
    answer: "New accounts get a 2-day free trial to explore signals and automation.",
  },
];

export const mockCommunityMessages: CommunityMessage[] = [
  {
    id: "cm1",
    username: "Alex T.",
    message: "EUR/USD signal hit TP — great setup today!",
    created_at: hoursAgo(1),
  },
  {
    id: "cm2",
    username: "Sarah M.",
    message: "Just connected automation on MT5. Smooth so far.",
    created_at: hoursAgo(3),
  },
  {
    id: "cm3",
    username: "James K.",
    message: "Anyone else running Premium with 1% risk per trade?",
    created_at: hoursAgo(5),
  },
];

export const mockBlogPosts: BlogPostListItem[] = [
  {
    slug: "how-to-read-forex-signals",
    title: "How to Read Forex Signals Like a Pro",
    date: daysAgo(5),
    excerpt: "Learn to interpret entry, stop loss, and take profit levels on every signal.",
  },
  {
    slug: "automation-risk-management",
    title: "Risk Management for Automated Trading",
    date: daysAgo(12),
    excerpt: "Set position sizing and drawdown limits before enabling automation.",
  },
];

export const mockBlogDetails: Record<string, BlogPostDetail> = {
  "how-to-read-forex-signals": {
    ...mockBlogPosts[0],
    content:
      "<p>Every PipAngel signal includes a clear trade plan: entry price, stop loss, take profit, and risk-reward ratio.</p>",
    published: true,
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  "automation-risk-management": {
    ...mockBlogPosts[1],
    content:
      "<p>Before enabling automation, configure your max risk per trade and daily drawdown limit in the dashboard.</p>",
    published: true,
    created_at: daysAgo(12),
    updated_at: daysAgo(12),
  },
};

export const mockNewsArticles: NewsArticleListItem[] = [
  {
    slug: "fed-rate-decision-impact",
    title: "Fed Rate Decision: What It Means for Forex",
    excerpt: "How the latest FOMC meeting could affect major currency pairs this week.",
    date: daysAgo(2),
    category: "Macro",
  },
  {
    slug: "eur-usd-weekly-outlook",
    title: "EUR/USD Weekly Outlook",
    excerpt: "Key levels and bias for the week ahead on the most traded pair.",
    date: daysAgo(6),
    category: "Analysis",
  },
];

export const mockNewsDetails: Record<string, NewsArticleDetail> = {
  "fed-rate-decision-impact": {
    ...mockNewsArticles[0],
    content: "<p>The Federal Reserve's latest decision has shifted rate expectations for Q2.</p>",
    published: true,
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
  },
  "eur-usd-weekly-outlook": {
    ...mockNewsArticles[1],
    content: "<p>EUR/USD remains range-bound with support at 1.0820 and resistance at 1.0920.</p>",
    published: true,
    created_at: daysAgo(6),
    updated_at: daysAgo(6),
  },
};

export function getMockContentBlock(key: string): ContentBlock | null {
  return pageBlocks[key] ?? null;
}

export function getMockHomeBlocks(prefix?: string): PaginatedResponse<ContentBlock> {
  const results = prefix
    ? homeBlocks.filter((b) => b.key.startsWith(prefix))
    : homeBlocks;
  return { count: results.length, results };
}

export function getMockTrades(limit?: number): PaginatedResponse<Trade> {
  const results = limit ? mockTrades.slice(0, limit) : mockTrades;
  return { count: mockTrades.length, results };
}

export function getMockSignals(limit?: number): ListResponse<Signal> {
  const results = limit ? mockSignals.slice(0, limit) : mockSignals;
  return { results };
}

export function getMockExecutedTrades(limit?: number): ListResponse<ExecutedTrade> {
  const results = limit ? mockExecutedTrades.slice(0, limit) : mockExecutedTrades;
  return { results };
}

export function isMockApiEnabled(): boolean {
  return !process.env.NEXT_PUBLIC_BACKEND_URL;
}
