import { safeApiGet } from "./api";
import type { FaqItem, ListResponse, PricingPlan } from "./types";
import { PRICING_TIERS, type PricingTier } from "./pricing";

export async function fetchFaqFromApi(): Promise<FaqItem[]> {
  const data = await safeApiGet<ListResponse<FaqItem>>("/faq/", 300);
  return data?.results ?? [];
}

export async function fetchPricingPlansFromApi(): Promise<PricingPlan[]> {
  const data = await safeApiGet<ListResponse<PricingPlan>>(
    "/pricing/plans/",
    300
  );
  return (data?.results ?? []).filter((plan) => plan.is_active);
}

/** Overlay API prices onto local tier presentation when slugs match. */
export function mergePricingTiers(
  apiPlans: PricingPlan[]
): PricingTier[] {
  if (!apiPlans.length) return PRICING_TIERS;

  return PRICING_TIERS.map((tier) => {
    const match = apiPlans.find(
      (plan) =>
        plan.slug === tier.id ||
        plan.name.toLowerCase() === tier.name.toLowerCase()
    );
    if (!match) return tier;
    return {
      ...tier,
      price: match.price,
      ctaLabel: match.cta_label || tier.ctaLabel,
      isPopular: match.is_popular,
      tagline: match.features?.[0]
        ? tier.tagline
        : tier.tagline,
    };
  });
}
