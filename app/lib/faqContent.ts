import { formatPrice, PRICING_TIERS } from "./pricing";
import { FREE_TRIAL_DAYS } from "./trial";

export type FaqCategoryId =
  | "getting-started"
  | "pipangel"
  | "ai"
  | "automation"
  | "mt5"
  | "broker"
  | "risk"
  | "performance"
  | "pricing"
  | "support";

export type FaqItem = {
  id: string;
  category: FaqCategoryId;
  question: string;
  answer: string;
  order: number;
  featured?: boolean;
  keywords: string[];
  links?: Array<{ label: string; href: string }>;
};

export type FaqSection = {
  id: FaqCategoryId;
  navLabel: string;
  heading: string;
  description?: string;
  items: FaqItem[];
};

export const FAQ_CATEGORIES: Array<{
  id: FaqCategoryId;
  navLabel: string;
  heading: string;
  description?: string;
}> = [
  {
    id: "getting-started",
    navLabel: "Getting Started",
    heading: "Getting Started",
    description: "Everything you need to know before creating your PipAngel account.",
  },
  {
    id: "pipangel",
    navLabel: "PipAngel",
    heading: "About PipAngel",
  },
  {
    id: "ai",
    navLabel: "Trading",
    heading: "AI Market Intelligence",
    description: "Understand how PipAngel uses market intelligence as part of its trading system.",
  },
  {
    id: "automation",
    navLabel: "Automation",
    heading: "Automated Trading",
  },
  {
    id: "mt5",
    navLabel: "MT5",
    heading: "MetaTrader 5",
  },
  {
    id: "broker",
    navLabel: "Broker",
    heading: "Broker & Trading Account",
  },
  {
    id: "risk",
    navLabel: "Risk Management",
    heading: "Risk Management",
    description: "Understand how PipAngel approaches capital exposure and trading risk.",
  },
  {
    id: "performance",
    navLabel: "Performance",
    heading: "Performance & Transparency",
  },
  {
    id: "pricing",
    navLabel: "Pricing",
    heading: "Pricing & Trial",
  },
  {
    id: "support",
    navLabel: "Account & Support",
    heading: "Account & Support",
  },
];

function item(
  partial: Omit<FaqItem, "keywords"> & { keywords?: string[] }
): FaqItem {
  return {
    ...partial,
    keywords: partial.keywords ?? [],
  };
}

export function getFaqItems(): FaqItem[] {
  const basic = PRICING_TIERS.find((tier) => tier.id === "basic")!;
  const premium = PRICING_TIERS.find((tier) => tier.id === "premium")!;

  return [
    item({
      id: "what-is-pipangel",
      category: "getting-started",
      question: "What is PipAngel?",
      answer:
        "PipAngel is a forex trading platform that combines market intelligence, automated trading, risk management, performance tracking, and trader support in one platform.",
      order: 1,
      featured: true,
      keywords: ["what is", "platform", "overview"],
    }),
    item({
      id: "how-pipangel-works",
      category: "getting-started",
      question: "How does PipAngel work?",
      answer:
        "PipAngel analyzes market conditions and applies predefined trading strategies with risk controls. Users can access the platform through their dashboard and choose how they want to use the available automation features.",
      order: 2,
      keywords: ["how it works", "dashboard", "strategy"],
    }),
    item({
      id: "need-experience",
      category: "getting-started",
      question: "Do I need previous forex trading experience?",
      answer:
        "No. However, users should understand the risks involved in forex trading before using any automated trading system.",
      order: 3,
      keywords: ["beginner", "experience", "new"],
    }),
    item({
      id: "how-to-get-started",
      category: "getting-started",
      question: "How do I get started?",
      answer: `Create your account, start the ${FREE_TRIAL_DAYS}-day free trial, connect the supported trading setup, configure your preferences, and review the available controls from your dashboard.`,
      order: 4,
      keywords: ["start", "signup", "onboarding", "trial"],
    }),
    item({
      id: "is-there-a-free-trial",
      category: "getting-started",
      question: "Is there a free trial?",
      answer: `Yes. New users can access a ${FREE_TRIAL_DAYS}-day free trial.`,
      order: 5,
      keywords: ["trial", "free", "4 day", "4-day"],
    }),
    item({
      id: "what-pipangel-provides",
      category: "pipangel",
      question: "What does PipAngel provide?",
      answer:
        "PipAngel provides market intelligence, automated trading infrastructure, risk controls, performance tracking, and account support for forex traders.",
      order: 1,
      keywords: ["features", "what you get"],
    }),
    item({
      id: "forex-signals",
      category: "pipangel",
      question: "Does PipAngel provide forex signals?",
      answer:
        "PipAngel is focused on automated trading and market intelligence rather than simply sending standalone trade calls. The platform is designed to analyze market conditions and execute strategies through supported trading infrastructure.",
      order: 2,
      keywords: ["signals", "trade calls", "alerts"],
    }),
    item({
      id: "what-makes-different",
      category: "pipangel",
      question: "What makes PipAngel different?",
      answer:
        "PipAngel combines market analysis, automated execution, risk management, performance visibility, and dashboard controls into one system.",
      order: 3,
      keywords: ["difference", "unique"],
    }),
    item({
      id: "is-pipangel-a-broker",
      category: "pipangel",
      question: "Is PipAngel a broker?",
      answer:
        "No. PipAngel is not a forex broker. Users connect their supported trading account through the supported trading infrastructure.",
      order: 4,
      keywords: ["broker", "not a broker", "funds"],
    }),
    item({
      id: "what-is-ai-engine",
      category: "ai",
      question: "What is the AI Market Intelligence Engine?",
      answer:
        "The AI Market Intelligence Engine analyzes market conditions and relevant risk factors to help identify potential trading opportunities and market conditions.",
      order: 1,
      keywords: ["ai", "intelligence", "engine", "analysis", "trading"],
    }),
    item({
      id: "ai-guarantee-profits",
      category: "ai",
      question: "Does AI guarantee profitable trades?",
      answer:
        "No. AI and automated systems cannot guarantee profits. Forex markets involve substantial risk and market conditions can change quickly.",
      order: 2,
      keywords: ["guarantee", "profit", "ai", "trading"],
    }),
    item({
      id: "ai-make-trades",
      category: "ai",
      question: "Does AI make trades automatically?",
      answer:
        "The AI Market Intelligence Engine is one component of the broader PipAngel system. Automated execution depends on the user's enabled automation setup and account configuration.",
      order: 3,
      keywords: ["automatic", "execution", "ai", "trading"],
    }),
    item({
      id: "what-markets",
      category: "ai",
      question: "What markets does PipAngel analyze?",
      answer:
        "PipAngel is focused on the forex market and the currency pairs supported by the trading system.",
      order: 4,
      keywords: ["markets", "pairs", "forex", "currencies", "trading"],
    }),
    item({
      id: "what-is-automated-trading",
      category: "automation",
      question: "What is automated trading?",
      answer:
        "Automated trading allows predefined trading strategies to execute through connected trading infrastructure without requiring the user to manually place every order.",
      order: 1,
      keywords: ["bot", "auto", "orders"],
    }),
    item({
      id: "how-automation-works",
      category: "automation",
      question: "How does PipAngel automation work?",
      answer:
        "The system evaluates the configured strategy, applies risk controls, and sends the appropriate execution instructions through the connected trading setup.",
      order: 2,
      keywords: ["mt5", "execution", "risk"],
    }),
    item({
      id: "control-automation",
      category: "automation",
      question: "Can I control the automation?",
      answer:
        "Yes. Users can manage available settings, monitor trades, adjust supported risk parameters, pause automation, and disconnect their account through the dashboard.",
      order: 3,
      keywords: ["pause", "dashboard", "settings", "control"],
    }),
    item({
      id: "stop-automation",
      category: "automation",
      question: "Can I stop automation?",
      answer:
        "Yes. The dashboard provides controls to pause or disconnect the automation.",
      order: 4,
      keywords: ["stop", "pause", "disable", "disconnect"],
    }),
    item({
      id: "runs-continuously",
      category: "automation",
      question: "Does automation run continuously?",
      answer:
        "The system is designed for automated forex execution during supported market conditions and trading hours.",
      order: 5,
      keywords: ["24/7", "hours", "continuous"],
    }),
    item({
      id: "computer-running",
      category: "automation",
      question: "Do I have to keep my computer running?",
      answer:
        "This depends on the connected execution setup. PipAngel will provide the required setup instructions when automation is enabled.",
      order: 6,
      keywords: ["computer", "vps", "pc", "laptop", "running"],
    }),
    item({
      id: "what-is-mt5",
      category: "mt5",
      question: "What is MT5?",
      answer:
        "MetaTrader 5, commonly known as MT5, is a trading platform used to access markets and support automated trading strategies.",
      order: 1,
      keywords: ["metatrader", "mt5", "platform"],
    }),
    item({
      id: "support-mt5",
      category: "mt5",
      question: "Does PipAngel support MT5?",
      answer:
        "Yes. PipAngel is designed around MT5-compatible automated trading infrastructure.",
      order: 2,
      keywords: ["mt5", "metatrader", "support"],
    }),
    item({
      id: "connect-mt5",
      category: "mt5",
      question: "How do I connect MT5?",
      answer:
        "The connection process is explained inside PipAngel onboarding and the dashboard. You create an account, then connect the supported IC Markets MetaTrader 5 setup from there.",
      order: 3,
      keywords: ["connect", "mt5", "onboarding", "ic markets"],
    }),
    item({
      id: "need-to-understand-mt5",
      category: "mt5",
      question: "Do I need to understand MT5?",
      answer:
        "Basic familiarity can be helpful, but PipAngel is designed to simplify the automation process.",
      order: 4,
      keywords: ["beginner", "mt5", "learn"],
    }),
    item({
      id: "which-broker",
      category: "broker",
      question: "Which broker does PipAngel currently support?",
      answer: "PipAngel currently supports IC Markets.",
      order: 1,
      keywords: ["broker", "ic markets", "icmarkets"],
    }),
    item({
      id: "other-broker",
      category: "broker",
      question: "Can I use another broker?",
      answer:
        "IC Markets is the currently supported broker. Additional broker integrations may be introduced in the future.",
      order: 2,
      keywords: ["pepperstone", "broker", "other", "exness", "xm"],
    }),
    item({
      id: "control-of-money",
      category: "broker",
      question: "Do I give PipAngel control of my money?",
      answer:
        "No. PipAngel is not a broker and does not hold your trading funds. Your capital remains in your IC Markets trading account. Connecting the account allows PipAngel to send execution instructions through the supported MT5 setup from the dashboard.",
      order: 3,
      keywords: ["funds", "money", "custody", "wallet", "credentials"],
    }),
    item({
      id: "guarantee-profits",
      category: "risk",
      question: "Does PipAngel guarantee profits?",
      answer: "No. There are no guaranteed returns in forex trading.",
      order: 1,
      keywords: ["guarantee", "profit", "returns"],
    }),
    item({
      id: "control-risk",
      category: "risk",
      question: "Can I control my trading risk?",
      answer:
        "Yes, where supported by your selected plan and configuration. Basic uses predefined risk controls. Premium unlocks greater control over risk settings, leverage, and capital utilization.",
      order: 2,
      keywords: ["risk", "basic", "premium", "settings"],
    }),
    item({
      id: "position-sizing",
      category: "risk",
      question: "What is position sizing?",
      answer:
        "Position sizing determines how much capital is allocated to an individual trade relative to the account and configured risk parameters.",
      order: 3,
      keywords: ["lot", "size", "exposure", "capital"],
    }),
    item({
      id: "what-is-drawdown",
      category: "risk",
      question: "What is drawdown?",
      answer:
        "Drawdown measures the decline from an account's previous peak equity or balance to a subsequent low point.",
      order: 4,
      keywords: ["drawdown", "equity", "peak"],
    }),
    item({
      id: "why-risk-management",
      category: "risk",
      question: "Why is risk management important?",
      answer:
        "Because even a strategy with profitable historical results can experience losing trades and periods of drawdown.",
      order: 5,
      keywords: ["risk", "losses", "drawdown"],
    }),
    item({
      id: "automation-can-lose",
      category: "risk",
      question: "Can automated trading lose money?",
      answer:
        "Yes. Automated trading can generate losses. Automation does not eliminate market risk.",
      order: 6,
      keywords: ["lose", "loss", "risk", "automation"],
    }),
    item({
      id: "where-performance",
      category: "performance",
      question: "Where can I see PipAngel performance?",
      answer:
        "Users can review available performance information through the PipAngel Performance page.",
      order: 1,
      keywords: ["stats", "results", "track record"],
      links: [{ label: "View Performance", href: "/trading-performance" }],
    }),
    item({
      id: "results-guaranteed",
      category: "performance",
      question: "Are the results guaranteed?",
      answer:
        "No. Historical or demonstrated performance does not guarantee future results.",
      order: 2,
      keywords: ["guarantee", "past performance"],
    }),
    item({
      id: "what-to-look-at",
      category: "performance",
      question: "What information should I look at when evaluating performance?",
      answer:
        "Users should consider factors such as win rate, average pips, profit and loss, drawdown, number of trades, risk exposure, and trading period.",
      order: 3,
      keywords: ["win rate", "pips", "drawdown", "metrics"],
    }),
    item({
      id: "individual-trades",
      category: "performance",
      question: "Does PipAngel publish individual trades?",
      answer:
        "The Performance page shows recorded trades when live performance data is available. When live data is not connected, that page is labeled as demo data.",
      order: 4,
      keywords: ["trades", "history", "public", "demo"],
    }),
    item({
      id: "live-performance-report",
      category: "performance",
      question: "Can I get a live performance report?",
      answer:
        "Yes, where the live performance reporting system is connected to the active trading account.",
      order: 5,
      keywords: ["live", "report", "account"],
      links: [{ label: "View Performance", href: "/trading-performance" }],
    }),
    item({
      id: "how-much-cost",
      category: "pricing",
      question: "How much does PipAngel cost?",
      answer: `Basic is ${formatPrice(basic.price)} per ${basic.periodLabel}. Premium is ${formatPrice(premium.price)} per ${premium.periodLabel}. Review the Pricing page for the current plan comparison.`,
      order: 1,
      keywords: ["price", "cost", "basic", "premium", "$30", "$99"],
      links: [{ label: "View Pricing", href: "/pricing" }],
    }),
    item({
      id: "trial-length",
      category: "pricing",
      question: "How long is the free trial?",
      answer: `Every new account receives a ${FREE_TRIAL_DAYS}-day free trial.`,
      order: 2,
      keywords: ["trial", "4 day", "4-day", "free"],
    }),
    item({
      id: "pay-during-trial",
      category: "pricing",
      question: "Do I need to pay during the trial?",
      answer: `No payment is required to start the ${FREE_TRIAL_DAYS}-day free trial. To continue after the trial, activate Basic or Premium with PayPal from your account.`,
      order: 3,
      keywords: ["pay", "payment", "paypal", "trial", "card"],
    }),
    item({
      id: "upgrade-plan",
      category: "pricing",
      question: "Can I upgrade my plan?",
      answer:
        "Yes. You can select Basic or Premium from your account and activate the plan with PayPal.",
      order: 4,
      keywords: ["upgrade", "change plan", "premium", "basic"],
    }),
    item({
      id: "can-i-cancel",
      category: "pricing",
      question: "Can I cancel?",
      answer:
        "Plan selection and PayPal checkout are managed from your PipAngel account. For billing questions, contact support.",
      order: 5,
      keywords: ["cancel", "stop billing", "subscription"],
    }),
    item({
      id: "subscription-expires",
      category: "pricing",
      question: "What happens when my subscription expires?",
      answer:
        "When a trial or paid plan ends, automation access is paused until you activate or renew a plan from your account. Saved settings remain on file.",
      order: 6,
      keywords: ["expire", "renew", "paused", "ended"],
    }),
    item({
      id: "live-support",
      category: "support",
      question: "Do you provide live support?",
      answer:
        "Yes. PipAngel provides live support for account, dashboard, and automation-related questions.",
      order: 1,
      keywords: ["chat", "help", "live", "support"],
    }),
    item({
      id: "contact-support",
      category: "support",
      question: "How can I contact support?",
      answer:
        "Use the live support chat on the website, or send a message through the Contact page. Support can help with account, dashboard, and automation setup questions.",
      order: 2,
      keywords: ["contact", "chat", "email", "help"],
      links: [{ label: "Contact page", href: "/contact" }],
    }),
    item({
      id: "support-configure-automation",
      category: "support",
      question: "Can support help me configure automation?",
      answer: "Yes, for setup and platform-related assistance.",
      order: 3,
      keywords: ["setup", "configure", "help", "automation"],
    }),
    item({
      id: "dashboard-controls",
      category: "support",
      question: "Can I control my trades from the dashboard?",
      answer:
        "Yes. The dashboard is designed to provide visibility and available controls over the connected trading setup.",
      order: 4,
      keywords: ["dashboard", "monitor", "pause", "trades"],
    }),
  ];
}

export function getFaqSections(): FaqSection[] {
  const items = getFaqItems();
  return FAQ_CATEGORIES.map((category) => ({
    ...category,
    items: items
      .filter((faq) => faq.category === category.id)
      .sort((a, b) => a.order - b.order),
  }));
}

export function filterFaqItems(items: FaqItem[], query: string): FaqItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((item) => {
    const haystack = `${item.question} ${item.answer} ${item.keywords.join(" ")}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function filterFaqSections(sections: FaqSection[], query: string): FaqSection[] {
  const q = query.trim();
  if (!q) return sections;
  return sections
    .map((section) => ({
      ...section,
      items: filterFaqItems(section.items, q),
    }))
    .filter((section) => section.items.length > 0);
}
