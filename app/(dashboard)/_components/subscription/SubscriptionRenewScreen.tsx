"use client";

import { useCallback } from "react";
import { isMockApiEnabled } from "../../../lib/mockData";
import { PRICING_TIERS } from "../../../lib/pricing";
import { renewSubscriptionPeriod } from "../../../lib/storeData";
import type { SubscriptionInfo } from "../../../lib/subscriptionData";
import type { AuthUser } from "../../../lib/types";
import { PayPalCheckout } from "./PayPalCheckout";
import { PlanPriceSummary, SecondaryPricingLink } from "./SubscriptionShared";

type SubscriptionRenewScreenProps = {
  user: AuthUser;
  subscription: SubscriptionInfo;
  onRenewed: () => void;
  onExtend?: () => void;
};

export function SubscriptionRenewScreen({
  user,
  subscription,
  onRenewed,
  onExtend,
}: SubscriptionRenewScreenProps) {
  const tier = PRICING_TIERS.find((item) => item.name === subscription.plan);
  const daysLabel =
    subscription.remainingDays === 1
      ? "1 day left"
      : `${subscription.remainingDays} days left`;

  const handlePaid = useCallback(() => {
    if (isMockApiEnabled()) {
      renewSubscriptionPeriod(user);
    }
    onRenewed();
  }, [user, onRenewed]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/25 via-zinc-900/70 to-zinc-950/90 p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-amber-500/[0.07] blur-3xl"
        aria-hidden
      />

      <div className="relative space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-amber-400/80">
              Renewal due soon
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              {subscription.isTrial ? "Trial ending soon" : "Renew your subscription"}
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
              {subscription.isTrial
                ? `Your trial ends on ${subscription.phaseEndDate}. Convert to a paid plan to keep uninterrupted access.`
                : `Your ${subscription.plan} plan renews on ${subscription.phaseEndDate}. Renew early to avoid any service interruption.`}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            {daysLabel}
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="rounded-xl border border-amber-500/10 bg-amber-500/[0.04] p-4">
            <p className="text-sm font-medium text-zinc-200">What stays active after renewal</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              <li>Live signals and trade alerts</li>
              <li>Automated execution on your broker</li>
              <li>Dashboard metrics and trade history</li>
              <li>Founding-member locked pricing</li>
            </ul>
          </div>

          <div className="space-y-4">
            <PlanPriceSummary subscription={subscription} />

            {tier && (
              <PayPalCheckout
                planSlug={tier.id}
                label={
                  subscription.isTrial
                    ? `Start paid plan · $${tier.price} / ${tier.periodLabel}`
                    : `Renew now · $${tier.price} / ${tier.periodLabel}`
                }
                onSuccess={handlePaid}
              />
            )}

            {onExtend && !subscription.isTrial && (
              <button
                type="button"
                onClick={onExtend}
                className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
              >
                Extend with Pip Coins instead
              </button>
            )}

            <SecondaryPricingLink />
          </div>
        </div>
      </div>
    </div>
  );
}
