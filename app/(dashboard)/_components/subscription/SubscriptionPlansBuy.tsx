"use client";

import { useCallback, useState } from "react";
import {
  formatPrice,
  getDailyPrice,
  LIFETIME_LOCK_OFFER,
  PRICING_TIERS,
  type PricingTier,
} from "../../../lib/pricing";
import { FREE_TRIAL_DAYS } from "../../../lib/trial";
import { PayPalCheckout } from "./PayPalCheckout";

type SubscriptionPlansBuyProps = {
  currentPlan?: "Basic" | "Premium" | null;
  isTrial?: boolean;
  onPurchased: () => void;
};

function FeatureCheck({ included }: { included: boolean }) {
  if (!included) {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-zinc-600" aria-hidden>
        —
      </span>
    );
  }
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-emerald-400" aria-hidden>
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

function PlanBuyCard({
  tier,
  selected,
  onSelect,
  onPurchased,
  isCurrent,
}: {
  tier: PricingTier;
  selected: boolean;
  onSelect: () => void;
  onPurchased: () => void;
  isCurrent: boolean;
}) {
  const handlePaid = useCallback(() => {
    onPurchased();
  }, [onPurchased]);

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-5 transition ${
        selected
          ? "border-emerald-500/40 bg-emerald-500/[0.06] ring-1 ring-emerald-500/20"
          : "border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700"
      }`}
    >
      {tier.isPopular && (
        <span className="absolute -top-2.5 right-4 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          Popular
        </span>
      )}

      <button type="button" onClick={onSelect} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
              {tier.name}
            </p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="text-2xl font-bold tabular-nums text-white">
                {formatPrice(tier.price)}
              </span>
              <span className="text-sm text-zinc-500">/ {tier.periodLabel}</span>
              <span className="text-sm text-zinc-600 line-through tabular-nums">
                {formatPrice(tier.originalPrice)}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              {getDailyPrice(tier.price, tier.periodDays)}
              {isCurrent ? " · your current trial plan" : ""}
            </p>
          </div>
          <span
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              selected
                ? "border-emerald-400 bg-emerald-500 text-white"
                : "border-zinc-600 bg-transparent"
            }`}
            aria-hidden
          >
            {selected && (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{tier.tagline}</p>

        <ul className="mt-4 space-y-2">
          {tier.features
            .filter((f) => f.included)
            .slice(0, 5)
            .map((feature) => (
              <li key={feature.label} className="flex items-start gap-2 text-sm text-zinc-300">
                <FeatureCheck included />
                <span className={feature.highlight ? "text-zinc-200" : ""}>{feature.label}</span>
              </li>
            ))}
        </ul>

        {tier.id === "premium" && (
          <p className="mt-3 text-[11px] font-medium text-emerald-300/80">
            {LIFETIME_LOCK_OFFER.cardBadge}
          </p>
        )}
      </button>

      {selected && (
        <div className="mt-5 border-t border-zinc-800/80 pt-4">
          <PayPalCheckout
            planSlug={tier.id}
            label={`Pay ${formatPrice(tier.price)} · activate ${tier.name}`}
            onSuccess={handlePaid}
          />
        </div>
      )}
    </div>
  );
}

export function SubscriptionPlansBuy({
  currentPlan,
  isTrial,
  onPurchased,
}: SubscriptionPlansBuyProps) {
  const defaultSlug =
    currentPlan === "Premium"
      ? "premium"
      : currentPlan === "Basic"
        ? "basic"
        : "basic";
  const [selectedSlug, setSelectedSlug] = useState<"basic" | "premium">(defaultSlug);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-base font-medium text-white">View plans</h2>
        <p className="mt-0.5 text-sm text-zinc-500">
          {isTrial
            ? `You're on a ${FREE_TRIAL_DAYS}-day free trial. Choose a plan and pay with PayPal to continue after it ends.`
            : "Choose a plan and pay with PayPal to activate access."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PRICING_TIERS.map((tier) => (
          <PlanBuyCard
            key={tier.id}
            tier={tier}
            selected={selectedSlug === tier.id}
            onSelect={() => setSelectedSlug(tier.id)}
            onPurchased={onPurchased}
            isCurrent={currentPlan === tier.name}
          />
        ))}
      </div>
    </section>
  );
}
