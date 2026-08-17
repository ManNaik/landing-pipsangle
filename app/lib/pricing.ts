export type PricingTier = {
  id: "basic" | "premium";
  name: string;
  tagline: string;
  price: number;
  periodDays: 7 | 28;
  periodLabel: string;
  isPopular: boolean;
  ctaLabel: string;
  features: Array<{
    label: string;
    included: boolean;
  }>;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    tagline:
      "A simple way to access PipAngel trading intelligence and automated execution with predefined risk controls.",
    price: 30,
    periodDays: 7,
    periodLabel: "7 days",
    isPopular: false,
    ctaLabel: "Start Basic Free Trial",
    features: [
      { label: "Trading system access", included: true },
      { label: "Automated trade execution", included: true },
      { label: "Predefined risk settings", included: true },
      { label: "MT5 integration", included: true },
      { label: "IC Markets support", included: true },
      { label: "Trading dashboard", included: true },
      { label: "Trade monitoring", included: true },
      { label: "Live support", included: true },
      { label: "Performance reporting", included: true },
      { label: "Full automation controls", included: false },
      { label: "Adjustable risk percentage", included: false },
      { label: "Advanced risk settings", included: false },
      { label: "Full leverage control", included: false },
      { label: "Maximum capital utilization", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Full control over automation, risk settings, and capital deployment.",
    price: 99,
    periodDays: 28,
    periodLabel: "28 days",
    isPopular: true,
    ctaLabel: "Start Premium Free Trial",
    features: [
      { label: "Everything in Basic", included: true },
      { label: "Full automation controls", included: true },
      { label: "Adjustable risk percentage", included: true },
      { label: "Advanced risk settings", included: true },
      { label: "Full leverage control", included: true },
      { label: "Maximum capital utilization", included: true },
      { label: "Priority signal delivery", included: true },
      { label: "Advanced trading controls", included: true },
      { label: "MT5 integration", included: true },
      { label: "IC Markets support", included: true },
      { label: "Trading dashboard", included: true },
      { label: "Live support", included: true },
      { label: "Performance reporting", included: true },
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

export type ComparisonCell = string;

export type ComparisonRow = {
  feature: string;
  basic: ComparisonCell;
  premium: ComparisonCell;
};

export const PLAN_COMPARISON: ComparisonRow[] = [
  { feature: "Automation", basic: "Predefined", premium: "Full control" },
  { feature: "Risk settings", basic: "Predefined", premium: "Adjustable" },
  { feature: "Leverage", basic: "Limited", premium: "Full control" },
  { feature: "Capital utilization", basic: "Predefined", premium: "Adjustable" },
  { feature: "Advanced risk controls", basic: "Limited", premium: "Included" },
  { feature: "Priority execution", basic: "Not included", premium: "Included" },
  { feature: "MT5", basic: "Included", premium: "Included" },
  { feature: "IC Markets", basic: "Included", premium: "Included" },
  { feature: "Dashboard", basic: "Included", premium: "Included" },
  { feature: "Live support", basic: "Included", premium: "Included" },
  { feature: "Performance reporting", basic: "Included", premium: "Included" },
];

export const PRICING_BENEFITS = [
  {
    id: "automation",
    eyebrow: "Trading Automation",
    description:
      "Automate trade execution through your connected MT5 account while keeping control through the PipAngel dashboard.",
  },
  {
    id: "risk",
    eyebrow: "Risk Management",
    description:
      "Configure how much capital is exposed to each trade and maintain predefined risk limits.",
  },
  {
    id: "dashboard",
    eyebrow: "Live Dashboard",
    description:
      "Monitor trades, account activity, automation status, and controls from one dashboard.",
  },
  {
    id: "support",
    eyebrow: "Live Support",
    description:
      "Get assistance with your account, automation setup, and trading dashboard when you need it.",
  },
] as const;

export const BILLING_STEPS = [
  {
    step: "01",
    title: "Start your 4-day free trial.",
    description: "Create an account and explore the platform with no payment required to begin.",
  },
  {
    step: "02",
    title: "Choose Basic or Premium.",
    description: "Select the plan that matches how much control you want over automation and risk.",
  },
  {
    step: "03",
    title: "Continue after the trial.",
    description:
      "Activate your selected plan with PayPal from your account to keep access after the 4-day trial.",
  },
  {
    step: "04",
    title: "Manage your subscription from your account.",
    description: "Review plan status, trial timing, and PayPal checkout from your PipAngel account.",
  },
] as const;

export const PRICING_FAQ = [
  {
    question: "Is there a free trial?",
    answer: "Every new account receives a 4-day free trial.",
  },
  {
    question: "What happens after the free trial?",
    answer:
      "Trial access lasts 4 days. To continue after the trial, activate Basic or Premium with PayPal from your account. If a plan is not activated, trial access ends.",
  },
  {
    question: "Can I change my plan?",
    answer:
      "You can select Basic or Premium from your account and activate the plan with PayPal.",
  },
  {
    question: "Can I cancel?",
    answer:
      "Plan selection and PayPal checkout are managed from your PipAngel account. For billing questions, contact support.",
  },
  {
    question: "What payment methods are supported?",
    answer: "Paid plans are activated through PayPal.",
  },
  {
    question: "Do I need a trading account?",
    answer:
      "Automated execution requires a connected IC Markets MetaTrader 5 account. You can still review the dashboard and performance data during your trial.",
  },
] as const;

export const PRICING_TRIAL_POINTS = [
  { value: "4 DAYS", label: "Free trial on every plan" },
  { value: "FULL ACCESS", label: "Explore the available controls" },
  { value: "NO COMMITMENT", label: "No payment required to start" },
] as const;
