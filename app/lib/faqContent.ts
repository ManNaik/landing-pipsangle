import { dailyPrice, formatPrice, PRICING_TIERS, type PricingTier } from "./pricing";
import { FREE_TRIAL_DAYS } from "./trial";

export type FaqCategoryId =
  | "getting-started"
  | "how-it-works"
  | "account"
  | "risk"
  | "pricing"
  | "support"
  | "more";

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
  { id: "getting-started", navLabel: "Getting started", heading: "Getting started" },
  { id: "how-it-works", navLabel: "How it works", heading: "How copying works" },
  { id: "account", navLabel: "Your account", heading: "Your account and your money" },
  { id: "risk", navLabel: "Risk and results", heading: "Risk and results" },
  { id: "pricing", navLabel: "Pricing", heading: "Pricing and the free trial" },
  { id: "support", navLabel: "Support", heading: "Support" },
];

type FaqContext = {
  tiers?: PricingTier[];
  supportEmail: string;
  responseTime?: string;
  hasPublicResults?: boolean;
};

export function getFaqItems({ tiers = PRICING_TIERS, supportEmail, responseTime, hasPublicResults }: FaqContext): FaqItem[] {
  const basic = tiers.find((tier) => tier.id === "basic") ?? PRICING_TIERS[0];
  const premium = tiers.find((tier) => tier.id === "premium") ?? PRICING_TIERS[1];

  const items: Array<Omit<FaqItem, "keywords"> & { keywords?: string[] }> = [
    {
      id: "what-is-pipsangel",
      category: "getting-started",
      question: "What is PipsAngel?",
      answer:
        "PipsAngel copies trades to your own IC Markets MetaTrader 5 account. Once your account is connected, each trade we place is opened in your account automatically, sized for your balance and settings, with a stop loss.",
      order: 1,
      featured: true,
      keywords: ["copy trading", "what", "service"],
    },
    {
      id: "what-do-i-need",
      category: "getting-started",
      question: "What do I need to start?",
      answer:
        "A live IC Markets account on MetaTrader 5, and three details from it: your MT5 login number, your server name and your MT5 password. You don't need to install anything or keep a computer running.",
      order: 2,
      featured: true,
      keywords: ["requirements", "ic markets", "mt5", "login", "server"],
      links: [{ label: "How to open an IC Markets account", href: "/ic-markets-account" }],
    },
    {
      id: "other-brokers",
      category: "getting-started",
      question: "Can I use a broker other than IC Markets?",
      answer:
        "Not yet. PipsAngel only works with IC Markets accounts on MetaTrader 5. If you use another broker, you'd need to open an IC Markets account first.",
      order: 3,
      keywords: ["broker", "exness", "xm", "pepperstone", "mt4"],
    },
    {
      id: "how-long-setup",
      category: "getting-started",
      question: "How long does setup take?",
      answer:
        "Creating your PipsAngel account takes a couple of minutes. After you submit your MT5 details, we start a dedicated MT5 terminal for you and check that it logs in to your account. Your dashboard shows each step. When all our terminals are in use, you're queued and it takes longer.",
      order: 4,
      keywords: ["setup", "provisioning", "time", "queue"],
    },
    {
      id: "experience",
      category: "getting-started",
      question: "Do I need trading experience?",
      answer:
        "No, but you should understand that forex trading is risky and that you can lose money. Only trade with money you can afford to lose.",
      order: 5,
      keywords: ["beginner", "experience"],
    },
    {
      id: "how-trades-are-copied",
      category: "how-it-works",
      question: "How are trades copied to my account?",
      answer:
        "When PipsAngel opens a trade, the same trade is sent to every connected account where copying is switched on. The MT5 terminal we run for you calculates the position size for your account and places the order. You see it in MT5 and in your PipsAngel dashboard.",
      order: 1,
      featured: true,
      keywords: ["copy", "mechanism", "orders", "execution"],
    },
    {
      id: "stop-loss",
      category: "how-it-works",
      question: "Does every trade have a stop loss?",
      answer:
        "Yes. Every trade is opened with a stop loss; the system rejects a trade without one. A stop loss limits the planned loss on a trade, but in fast or gapping markets a trade can close at a worse price than the stop.",
      order: 2,
      keywords: ["stop loss", "sl", "risk"],
    },
    {
      id: "position-size",
      category: "how-it-works",
      question: "How is the position size worked out?",
      answer: `Each trade is sized from your account capital and the distance to the stop loss. Your capital utilization setting controls how much of your balance is used: it's fixed at 25% on Basic and adjustable from 10% to 100% on Premium.`,
      order: 3,
      keywords: ["lot size", "position size", "capital utilization", "risk"],
    },
    {
      id: "how-many-trades",
      category: "how-it-works",
      question: "How many trades will be opened?",
      answer:
        "It depends on market conditions. Some days have several trades and some have none. You'll see every trade in your dashboard and in MT5.",
      order: 4,
      keywords: ["frequency", "daily limit", "how many"],
    },
    {
      id: "computer-on",
      category: "how-it-works",
      question: "Do I need to keep my computer or MT5 app open?",
      answer:
        "No. Your MT5 terminal runs on our servers around the clock. You can still open MT5 on your phone or computer to watch your trades.",
      order: 5,
      keywords: ["vps", "computer", "running", "app"],
    },
    {
      id: "manual-trades",
      category: "how-it-works",
      question: "Can I trade manually on the same account?",
      answer:
        "You can, but manual trades use the same balance and margin, which changes how copied trades are sized and how much risk the account carries. We recommend using a separate account for manual trading.",
      order: 6,
      keywords: ["manual", "own trades"],
    },
    {
      id: "withdraw",
      category: "account",
      question: "Can PipsAngel withdraw or move my money?",
      answer:
        "No. Your money stays in your IC Markets account. We only get your MT5 trading login, which can open, change and close trades. Withdrawals need your IC Markets client-area login, which we never ask for.",
      order: 1,
      featured: true,
      keywords: ["withdraw", "funds", "money", "safe", "custody"],
      links: [{ label: "How account access works", href: "/security" }],
    },
    {
      id: "password",
      category: "account",
      question: "Why do you need my MT5 password, and how is it stored?",
      answer:
        "The MT5 terminal we run for you needs it to log in to your account. The password is sent once from our website to our trading servers over a signed connection, stored there encrypted, and never returned by any of our systems or written to logs. Our website doesn't keep a copy.",
      order: 2,
      featured: true,
      keywords: ["password", "credentials", "encrypted", "security"],
      links: [{ label: "Security details", href: "/security" }],
    },
    {
      id: "stop-copying",
      category: "account",
      question: "How do I stop copying or disconnect?",
      answer:
        "Switch copying off in your dashboard and no new trades are sent to your account. Trades that are already open are still closed as normal, and you can close them yourself in MT5 at any time. To cut our access completely, change your MT5 password in the IC Markets client area.",
      order: 3,
      featured: true,
      keywords: ["stop", "pause", "disconnect", "revoke"],
    },
    {
      id: "broker",
      category: "account",
      question: "Is PipsAngel a broker?",
      answer:
        "No. PipsAngel is independent of IC Markets. We don't hold client money or give personal financial advice. IC Markets holds your account and your funds.",
      order: 4,
      keywords: ["broker", "regulated", "affiliated"],
    },
    {
      id: "lose-money",
      category: "risk",
      question: "Can I lose money?",
      answer:
        "Yes. Losing trades are part of trading, and a run of losses can reduce your balance significantly. Stop losses limit the planned loss per trade but don't guarantee it. Past results don't guarantee future results.",
      order: 1,
      featured: true,
      keywords: ["loss", "risk", "safe"],
    },
    {
      id: "results",
      category: "risk",
      question: "Where can I see your results?",
      answer: hasPublicResults
        ? "On our Results page, which lists closed trades and the figures calculated from them."
        : "We only publish results from real, verified trading. Our public track record isn't live yet, so we don't show performance figures on this site.",
      order: 2,
      keywords: ["results", "performance", "track record", "win rate"],
      links: hasPublicResults ? [{ label: "View results", href: "/trading-performance" }] : undefined,
    },
    {
      id: "guarantee",
      category: "risk",
      question: "Do you guarantee profits?",
      answer: "No. Nobody can guarantee trading profits, and you should be wary of anyone who does.",
      order: 3,
      keywords: ["guarantee", "profit", "returns"],
    },
    {
      id: "trial-start",
      category: "pricing",
      question: "When does the free trial start?",
      answer: `When your MT5 account is connected and verified, not when you sign up. It lasts ${FREE_TRIAL_DAYS} days and you don't pay anything to start.`,
      order: 1,
      featured: true,
      keywords: ["trial", "free", "start"],
    },
    {
      id: "cost",
      category: "pricing",
      question: "How much does it cost?",
      answer: `Basic is ${formatPrice(basic.price)} for ${basic.periodLabel} (${dailyPrice(basic)} a day). Premium is ${formatPrice(premium.price)} for ${premium.periodLabel} (${dailyPrice(premium)} a day). Both start with the free trial.`,
      order: 2,
      keywords: ["price", "cost", "basic", "premium"],
      links: [{ label: "Compare plans", href: "/pricing" }],
    },
    {
      id: "renewal",
      category: "pricing",
      question: "Does it renew automatically? How do I cancel?",
      answer:
        "Nothing renews automatically. Each PayPal payment covers one period. To stop, don't pay for the next one and copying ends when the current period does. There's nothing to cancel.",
      order: 3,
      featured: true,
      keywords: ["cancel", "renew", "subscription", "refund"],
    },
    {
      id: "after-trial",
      category: "pricing",
      question: "What happens when the trial ends?",
      answer:
        "Copying stops until you pay for a plan from your dashboard. Your setup is kept for a short time, so you can continue without connecting again.",
      order: 4,
      keywords: ["trial end", "expired"],
    },
    {
      id: "payment",
      category: "pricing",
      question: "How do I pay?",
      answer: "With PayPal, from the subscription page in your dashboard.",
      order: 5,
      keywords: ["paypal", "payment", "card"],
    },
    {
      id: "contact",
      category: "support",
      question: "How do I contact you?",
      answer: `Email ${supportEmail} or use the contact form. We reply by email${responseTime ? `, usually ${responseTime}` : ""}.`,
      order: 1,
      keywords: ["contact", "email", "help", "support"],
      links: [{ label: "Contact us", href: "/contact" }],
    },
    {
      id: "setup-help",
      category: "support",
      question: "Can you help me connect my account?",
      answer:
        "Yes. If your MT5 details are rejected or setup stalls, contact us with your account email and we'll help. Never send us your IC Markets client-area password.",
      order: 2,
      keywords: ["help", "setup", "connect"],
    },
  ];

  return items.map((item) => ({ ...item, keywords: item.keywords ?? [] }));
}

export function getFaqSections(context: FaqContext): FaqSection[] {
  const items = getFaqItems(context);
  return FAQ_CATEGORIES.map((category) => ({
    ...category,
    items: items.filter((faq) => faq.category === category.id).sort((a, b) => a.order - b.order),
  }));
}

export function getFeaturedFaqs(context: FaqContext, limit = 6): FaqItem[] {
  return getFaqItems(context)
    .filter((item) => item.featured)
    .slice(0, limit);
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
