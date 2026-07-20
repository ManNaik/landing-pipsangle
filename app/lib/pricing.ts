export type PricingTier = {
  id: "basic" | "premium";
  name: string;
  tagline: string;
  originalPrice: number;
  price: number;
  discountPercent: number;
  periodDays: 7 | 28;
  periodLabel: string;
  isPopular: boolean;
  ctaLabel: string;
  features: Array<{
    label: string;
    included: boolean;
    highlight?: boolean;
  }>;
};

export function computeDiscountPercent(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

export const LIFETIME_LOCK_OFFER = {
  maxClients: 50,
  eyebrow: "Founding member offer",
  headline: "Your rate is protected for life",
  description:
    "The first 50 subscribers keep launch pricing permanently — $30 per week on Basic, $99 per 28 days on Premium — even when standard rates return.",
  seatsLabel: "50 founding seats",
  heroBadge: "First 50 clients · lifetime price lock",
  cardBadge: "First 50 · lifetime lock",
} as const;

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Signals and automation with built-in risk guardrails.",
    originalPrice: 79,
    price: 30,
    discountPercent: 62,
    periodDays: 7,
    periodLabel: "7 days",
    isPopular: false,
    ctaLabel: "Start 2-day free trial",
    features: [
      { label: "Unlimited trade signals", included: true },
      { label: "Automation access", included: true },
      { label: "Lower capital utilization", included: true, highlight: true },
      { label: "Risk percentage cannot be increased", included: true, highlight: true },
      { label: "Limited leverage options", included: true, highlight: true },
      { label: "Adjustable risk percentage", included: false },
      { label: "Full leverage control", included: false },
      { label: "Maximum capital utilization", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Full control over risk, leverage, and capital deployment.",
    originalPrice: 299,
    price: 99,
    discountPercent: 67,
    periodDays: 28,
    periodLabel: "28 days",
    isPopular: true,
    ctaLabel: "Try Premium free for 2 days",
    features: [
      { label: "Unlimited trade signals", included: true },
      { label: "Full automation access", included: true },
      { label: "Maximum capital utilization", included: true, highlight: true },
      { label: "Adjustable risk percentage", included: true, highlight: true },
      { label: "Full leverage control", included: true, highlight: true },
      { label: "Priority signal delivery", included: true },
      { label: "Advanced risk settings", included: true },
      { label: "Everything in Basic, unlocked", included: true },
    ],
  },
];

export function getSignupUrl(tier: PricingTier["id"]): string {
  const plan = PRICING_TIERS.find((t) => t.id === tier);
  const period = plan?.periodDays === 7 ? "7d" : "28d";
  return `/signup?plan=${tier}&period=${period}&trial=1`;
}

export function formatPrice(amount: number): string {
  return `$${amount}`;
}

export function getDailyPrice(amount: number, periodDays: number): string {
  const daily = amount / periodDays;
  return `$${daily.toFixed(2)}/day`;
}

export type ComparisonCell = "yes" | "no" | "limited" | string;

export type ComparisonRow = {
  feature: string;
  basic: ComparisonCell;
  premium: ComparisonCell;
};

export const PLAN_COMPARISON: ComparisonRow[] = [
  { feature: "Trade signals", basic: "Unlimited", premium: "Unlimited" },
  { feature: "Automation", basic: "Included", premium: "Full access" },
  {
    feature: "Capital utilization",
    basic: "Lower (fixed)",
    premium: "Maximum (adjustable)",
  },
  {
    feature: "Risk percentage",
    basic: "Locked — cannot increase",
    premium: "Fully adjustable",
  },
  { feature: "Leverage", basic: "Limited options", premium: "Full control" },
  { feature: "Priority signal delivery", basic: "no", premium: "yes" },
  { feature: "Advanced risk settings", basic: "no", premium: "yes" },
];

export const PRICING_VALUE_PROPS = [
  {
    title: "Instant access",
    description: "Start receiving signals and connect automation the moment you subscribe.",
  },
  {
    title: "Verified performance",
    description: "Every trade is published on our transparent performance page.",
  },
  {
    title: "Full control",
    description: "Adjust risk, pause automation, or disconnect your account anytime.",
  },
] as const;

export const PRICING_FAQ_TEASER = [
  {
    question: "What is the lifetime price lock?",
    answer:
      "The first 50 clients who subscribe lock in their discounted rate forever. Basic stays at $30 per 7 days and Premium at $99 per 28 days — even if standard pricing returns to $79 or $299 later.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes — every new account gets a 2-day free trial with full access to signals and automation.",
  },
  {
    question: "Can I upgrade from Basic to Premium?",
    answer: "Yes — upgrade anytime from your dashboard to unlock full risk and leverage controls.",
  },
  {
    question: "What happens when my plan expires?",
    answer: "Signal delivery and automation pause until you renew. Your settings are saved.",
  },
  {
    question: "Is there a performance guarantee?",
    answer: "We publish every trade publicly. Review our track record before you subscribe.",
  },
] as const;
