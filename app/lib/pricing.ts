import { safeApiGet } from "./api";
import { FREE_TRIAL_DAYS } from "./trial";
import type { ListResponse, PricingPlan } from "./types";

export type PricingTier = {
  id: "basic" | "premium";
  name: string;
  tagline: string;
  price: number;
  periodDays: number;
  periodLabel: string;
  isPopular: boolean;
  ctaLabel: string;
  capitalUtilization: string;
  features: Array<{
    label: string;
    included: boolean;
  }>;
};

const SHARED_FEATURES = [
  "Trades copied to your IC Markets MT5 account",
  "A stop loss on every trade",
  "An MT5 terminal we host for you",
  "Pause copying at any time",
  "Trade history in your dashboard",
  "Email support",
];

/** Presentation defaults. Live prices and billing periods come from the API. */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Copy trading with a fixed, conservative setting.",
    price: 30,
    periodDays: 7,
    periodLabel: "7 days",
    isPopular: false,
    ctaLabel: "Start free trial",
    capitalUtilization: "Fixed at 25%",
    features: [
      ...SHARED_FEATURES.map((label) => ({ label, included: true })),
      { label: "Capital utilization fixed at 25%", included: true },
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Everything in Basic, and you choose how much of your balance is used.",
    price: 99,
    periodDays: 28,
    periodLabel: "28 days",
    isPopular: true,
    ctaLabel: "Start free trial",
    capitalUtilization: "Your choice, 10% to 100%",
    features: [
      { label: "Everything in Basic", included: true },
      { label: "Capital utilization adjustable from 10% to 100%", included: true },
      { label: "One payment covers 28 days", included: true },
    ],
  },
];

function parsePeriodDays(label: string | undefined, fallback: number): number {
  const days = Number.parseInt(label ?? "", 10);
  return Number.isFinite(days) && days > 0 ? days : fallback;
}

/** Overlay live API prices and periods onto the local plan descriptions. */
export function mergePricingTiers(apiPlans: PricingPlan[]): PricingTier[] {
  if (!apiPlans.length) return PRICING_TIERS;
  return PRICING_TIERS.map((tier) => {
    const match = apiPlans.find(
      (plan) => plan.slug === tier.id || plan.name.toLowerCase() === tier.name.toLowerCase()
    );
    if (!match) return tier;
    const periodDays = parsePeriodDays(match.billing_period, tier.periodDays);
    return {
      ...tier,
      price: Number(match.price),
      periodDays,
      periodLabel: `${periodDays} days`,
      isPopular: match.is_popular,
    };
  });
}

export async function getPricingTiers(): Promise<PricingTier[]> {
  const data = await safeApiGet<ListResponse<PricingPlan>>("/pricing/plans/", 300);
  const plans = (data?.results ?? []).filter((plan) => plan.is_active);
  return mergePricingTiers(plans);
}

export function getSignupUrl(tier: PricingTier["id"]): string {
  return `/signup?plan=${tier}`;
}

export function formatPrice(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export function getDailyPrice(amount: number, periodDays: number): string {
  return `$${(amount / periodDays).toFixed(2)}/day`;
}

export function dailyPrice(tier: PricingTier): string {
  return `$${(tier.price / tier.periodDays).toFixed(2)}`;
}

export type ComparisonRow = {
  feature: string;
  basic: string;
  premium: string;
};

export function buildPlanComparison(tiers: PricingTier[]): ComparisonRow[] {
  const basic = tiers.find((tier) => tier.id === "basic") ?? PRICING_TIERS[0];
  const premium = tiers.find((tier) => tier.id === "premium") ?? PRICING_TIERS[1];
  return [
    { feature: "Trades copied to your MT5 account", basic: "Yes", premium: "Yes" },
    { feature: "Stop loss on every trade", basic: "Yes", premium: "Yes" },
    { feature: "MT5 terminal hosted for you", basic: "Yes", premium: "Yes" },
    { feature: "Pause copying at any time", basic: "Yes", premium: "Yes" },
    { feature: "Capital utilization", basic: basic.capitalUtilization, premium: premium.capitalUtilization },
    {
      feature: "Price per period",
      basic: `${formatPrice(basic.price)} for ${basic.periodLabel}`,
      premium: `${formatPrice(premium.price)} for ${premium.periodLabel}`,
    },
    { feature: "Works out per day", basic: dailyPrice(basic), premium: dailyPrice(premium) },
    { feature: "Support", basic: "Email", premium: "Email" },
  ];
}

export type PricingQuestion = { question: string; answer: string };

export function buildPricingFaq(tiers: PricingTier[], supportEmail: string): PricingQuestion[] {
  const basic = tiers.find((tier) => tier.id === "basic") ?? PRICING_TIERS[0];
  const premium = tiers.find((tier) => tier.id === "premium") ?? PRICING_TIERS[1];
  return [
    {
      question: "When does the free trial start?",
      answer: `When your IC Markets MT5 account is connected and verified, not when you sign up. The trial lasts ${FREE_TRIAL_DAYS} days and you don't pay anything to start.`,
    },
    {
      question: "Does my plan renew automatically?",
      answer: `No. Each PayPal payment covers one period: ${basic.periodLabel} on Basic or ${premium.periodLabel} on Premium. When the period ends, copying stops until you pay again.`,
    },
    {
      question: "How do I cancel?",
      answer:
        "There's nothing to cancel. Don't pay for the next period and copying stops when the current one ends. You can also switch copying off in your dashboard at any time.",
    },
    {
      question: "What happens when the trial ends?",
      answer:
        "Copying stops until you pay for a plan from your dashboard. Your setup is kept for a short time, so you can continue without connecting your account again.",
    },
    {
      question: "If I pay early, do I lose the time I have left?",
      answer: "No. Paying before your current period ends adds the new period on top of it.",
    },
    {
      question: "How do I pay?",
      answer: "With PayPal, from the subscription page in your dashboard.",
    },
    {
      question: "What if I was charged by mistake?",
      answer: `Email ${supportEmail} with your account email and the PayPal transaction ID, and we'll look into it.`,
    },
  ];
}
