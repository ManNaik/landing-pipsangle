"use client";

import Link from "next/link";
import { useState } from "react";
import { PRICING_TIERS } from "../../../lib/pricing";
import { renewSubscriptionPeriod } from "../../../lib/storeData";
import type { SubscriptionInfo } from "../../../lib/subscriptionData";
import type { AuthUser } from "../../../lib/types";
import {
  PausedFeaturesList,
  PlanPriceSummary,
  SecondaryPricingLink,
} from "./SubscriptionShared";

type SubscriptionExpiredScreenProps = {
  user: AuthUser;
  subscription: SubscriptionInfo;
  onRenewed: () => void;
};

export function SubscriptionExpiredScreen({
  user,
  subscription,
  onRenewed,
}: SubscriptionExpiredScreenProps) {
  const [renewing, setRenewing] = useState(false);
  const [renewed, setRenewed] = useState(false);
  const tier = PRICING_TIERS.find((item) => item.name === subscription.plan);

  async function handleRenew() {
    setRenewing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    renewSubscriptionPeriod(user);
    setRenewed(true);
    setRenewing(false);
    onRenewed();
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/30 via-zinc-900/70 to-zinc-950/90 p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-red-500/[0.08] blur-3xl"
        aria-hidden
      />

      <div className="relative space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-red-400/80">
              Subscription expired
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              Your access has ended
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
              {subscription.isTrial
                ? `Your free trial ended on ${subscription.phaseEndDate}. Renew to keep signals and automation running.`
                : `Your ${subscription.plan} plan expired on ${subscription.phaseEndDate}. Renew now to restore full access.`}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-[11px] font-semibold text-red-300">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            Expired
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="rounded-xl border border-red-500/10 bg-red-500/[0.04] p-4">
            <p className="text-sm font-medium text-zinc-200">Currently paused</p>
            <div className="mt-3">
              <PausedFeaturesList />
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              Your saved settings and broker connection remain on file.
            </p>
          </div>

          <div className="space-y-4">
            <PlanPriceSummary subscription={subscription} />

            {renewed ? (
              <div
                role="status"
                className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
              >
                Subscription renewed. Welcome back — your dashboard is active again.
              </div>
            ) : (
              <button
                type="button"
                disabled={renewing || !tier}
                onClick={() => void handleRenew()}
                className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {renewing
                  ? "Processing renewal…"
                  : `Renew ${subscription.plan} · $${tier?.price ?? "—"}`}
              </button>
            )}

            <Link
              href="/pricing"
              className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
            >
              View all plans
            </Link>
            <SecondaryPricingLink />
          </div>
        </div>
      </div>
    </div>
  );
}
