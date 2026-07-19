import Link from "next/link";
import { LIFETIME_LOCK_OFFER, PRICING_TIERS } from "../../../lib/pricing";
import type { SubscriptionInfo } from "../../../lib/subscriptionData";

export function PausedFeaturesList() {
  const items = [
    "Live signal delivery",
    "Automated trade execution",
    "Dashboard performance tracking",
    "Broker sync and bot controls",
  ];

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function PlanPriceSummary({
  subscription,
}: {
  subscription: SubscriptionInfo;
}) {
  const tier = PRICING_TIERS.find((item) => item.name === subscription.plan);
  if (!tier) return null;

  const isPremium = subscription.plan === "Premium";

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            {subscription.plan} plan
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-2xl font-bold tabular-nums text-white">${tier.price}</span>
            <span className="text-sm text-zinc-500">/ {tier.periodLabel}</span>
            <span className="text-sm text-zinc-600 line-through tabular-nums">
              ${tier.originalPrice}
            </span>
          </div>
        </div>
        {isPremium && (
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300/90">
            {LIFETIME_LOCK_OFFER.cardBadge}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-500">{tier.tagline}</p>
    </div>
  );
}

export function SecondaryPricingLink() {
  return (
    <p className="text-center text-xs text-zinc-500">
      Compare plans on{" "}
      <Link href="/pricing" className="text-emerald-400 transition hover:text-emerald-300">
        pricing
      </Link>
      .
    </p>
  );
}

export function ScreenBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-zinc-300"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back to subscription overview
    </button>
  );
}
