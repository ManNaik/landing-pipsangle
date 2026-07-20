import Link from "next/link";
import { useState } from "react";
import { LIFETIME_LOCK_OFFER, PRICING_TIERS } from "../../lib/pricing";
import {
  resolveSubscriptionScreen,
  type SubscriptionInfo,
  type SubscriptionScreen,
} from "../../lib/subscriptionData";
import type { AuthUser } from "../../lib/types";
import { FREE_TRIAL_DAYS } from "../../lib/trial";
import { SubscriptionExpiredScreen } from "./subscription/SubscriptionExpiredScreen";
import { SubscriptionExtendScreen } from "./subscription/SubscriptionExtendScreen";
import { SubscriptionRenewScreen } from "./subscription/SubscriptionRenewScreen";

type ActiveSubscriptionCardProps = {
  user: AuthUser;
  subscription: SubscriptionInfo;
  onSubscriptionChange: () => void;
  initialScreen?: SubscriptionScreen | null;
};

function PremiumPlanIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={`text-emerald-300 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  );
}

function BasicPlanIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={`text-zinc-400 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0 text-emerald-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function trialTitle(plan: "Basic" | "Premium"): string {
  return plan === "Premium" ? "Premium trial" : "Free trial";
}

function daysLeftLabel(days: number): string {
  return days === 1 ? "1 day left" : `${days} days left`;
}

function CountdownRing({
  remaining,
  total,
  isPremium,
}: {
  remaining: number;
  total: number;
  isPremium: boolean;
}) {
  const size = 112;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? Math.min(1, remaining / total) : 0;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex h-[7rem] w-[7rem] shrink-0 items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-zinc-800/80"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={
            isPremium
              ? "text-emerald-400 transition-[stroke-dashoffset] duration-700"
              : "text-zinc-400 transition-[stroke-dashoffset] duration-700"
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-3xl font-bold tabular-nums tracking-tight ${
            isPremium ? "text-white" : "text-zinc-100"
          }`}
        >
          {remaining}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
          {remaining === 1 ? "day left" : "days left"}
        </span>
      </div>
    </div>
  );
}

function PhaseTimeline({
  remainingDays,
  totalDays,
  endDate,
  label,
  endPrefix,
}: {
  remainingDays: number;
  totalDays: number;
  endDate: string;
  label: string;
  endPrefix: string;
}) {
  const elapsed = Math.max(0, totalDays - remainingDays);
  const progress = totalDays > 0 ? elapsed / totalDays : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium uppercase tracking-[0.12em] text-zinc-500">
          {label}
        </span>
        <span className="text-zinc-400">
          {endPrefix} {endDate}
        </span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-zinc-800/60">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-600/50 to-emerald-400/80"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
        <div
          className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
          style={{ left: `calc(${Math.min(100, progress * 100)}% - 5px)` }}
        />
      </div>
    </div>
  );
}

function TrialSubscriptionCard({
  subscription,
  tier,
  isPremium,
}: {
  subscription: SubscriptionInfo;
  tier: (typeof PRICING_TIERS)[number];
  isPremium: boolean;
}) {
  const plan = subscription.plan!;
  const highlightFeatures =
    tier.features.filter((f) => f.included && f.highlight).slice(0, 3) ??
    tier.features.filter((f) => f.included).slice(0, 3);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isPremium
                ? "bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                : "bg-zinc-800/60"
            }`}
          >
            {isPremium ? <PremiumPlanIcon /> : <BasicPlanIcon />}
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
              Active trial
            </p>
            <p
              className={`mt-0.5 text-2xl font-semibold tracking-tight sm:text-[1.65rem] ${
                isPremium
                  ? "bg-gradient-to-r from-white via-emerald-50 to-emerald-200/90 bg-clip-text text-transparent"
                  : "text-white"
              }`}
            >
              {trialTitle(plan)}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Full {plan} access · ${tier.price}/{tier.periodLabel} after trial ends
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-zinc-800/40 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-200">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          {daysLeftLabel(subscription.trialDaysRemaining)}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <CountdownRing
          remaining={subscription.trialDaysRemaining}
          total={FREE_TRIAL_DAYS}
          isPremium={isPremium}
        />

        <div className="min-w-0 flex-1 space-y-5">
          {highlightFeatures.length > 0 && (
            <ul className="space-y-2">
              {highlightFeatures.map((feature) => (
                <li
                  key={feature.label}
                  className="flex items-start gap-2 text-sm text-zinc-300"
                >
                  <CheckIcon />
                  <span>{feature.label}</span>
                </li>
              ))}
            </ul>
          )}

          <PhaseTimeline
            remainingDays={subscription.trialDaysRemaining}
            totalDays={FREE_TRIAL_DAYS}
            endDate={subscription.trialEndsDate}
            label="Trial period"
            endPrefix="Ends"
          />
        </div>
      </div>
    </>
  );
}

function PaidSubscriptionCard({
  subscription,
  tier,
  isPremium,
  isBasic,
  onExtend,
}: {
  subscription: SubscriptionInfo;
  tier: (typeof PRICING_TIERS)[number];
  isPremium: boolean;
  isBasic: boolean;
  onExtend?: () => void;
}) {
  const plan = subscription.plan!;
  const highlightFeatures =
    tier.features.filter((f) => f.included && f.highlight).slice(0, 3) ??
    tier.features.filter((f) => f.included).slice(0, 3);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isPremium
                ? "bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                : "bg-zinc-800/60"
            }`}
          >
            {isPremium ? <PremiumPlanIcon /> : <BasicPlanIcon />}
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
              Current plan
            </p>
            <p
              className={`mt-0.5 text-2xl font-semibold tracking-tight sm:text-[1.65rem] ${
                isPremium
                  ? "bg-gradient-to-r from-white via-emerald-50 to-emerald-200/90 bg-clip-text text-transparent"
                  : "text-white"
              }`}
            >
              {plan}
            </p>
            <p className="mt-1 max-w-[16rem] text-xs leading-relaxed text-zinc-500">
              {tier.tagline}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
            subscription.status === "active"
              ? "bg-emerald-500/10 text-emerald-300"
              : subscription.status === "expired"
                ? "bg-red-500/10 text-red-400"
                : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {subscription.status === "active"
            ? "Active"
            : subscription.status === "expired"
              ? "Expired"
              : "No plan"}
        </span>
      </div>

      <div className="mt-4">
        <div className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-xl font-bold tabular-nums text-white">
            ${tier.price}
          </span>
          <span className="text-sm text-zinc-500">/ {tier.periodLabel}</span>
          <span className="text-sm text-zinc-600 line-through tabular-nums">
            ${tier.originalPrice}
          </span>
          {isPremium && (
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300/90">
              {LIFETIME_LOCK_OFFER.cardBadge}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
        <CountdownRing
          remaining={subscription.subscriptionDaysRemaining}
          total={subscription.subscriptionPeriodDays}
          isPremium={isPremium}
        />

        <div className="min-w-0 flex-1 space-y-5">
          {highlightFeatures.length > 0 && (
            <ul className="space-y-2">
              {highlightFeatures.map((feature) => (
                <li
                  key={feature.label}
                  className="flex items-start gap-2 text-sm text-zinc-300"
                >
                  <CheckIcon />
                  <span>{feature.label}</span>
                </li>
              ))}
            </ul>
          )}

          <PhaseTimeline
            remainingDays={subscription.subscriptionDaysRemaining}
            totalDays={subscription.subscriptionPeriodDays}
            endDate={subscription.subscriptionRenewsDate}
            label="Billing cycle"
            endPrefix="Renews"
          />
          <p className="text-[11px] text-zinc-600">
            {subscription.billingCycle} billing cycle
          </p>

          {onExtend && subscription.status === "active" && (
            <button
              type="button"
              onClick={onExtend}
              className="inline-flex rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/15"
            >
              Extend subscription
            </button>
          )}
        </div>
      </div>

      {isBasic && subscription.status !== "expired" && (
        <div className="mt-6 flex flex-col gap-3 rounded-xl bg-gradient-to-r from-emerald-500/[0.06] to-transparent p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-200">
              Unlock full control with Premium
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Adjustable risk, full leverage, and maximum capital utilization.
            </p>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            Upgrade to Premium
          </Link>
        </div>
      )}
    </>
  );
}

export function ActiveSubscriptionCard({
  user,
  subscription,
  onSubscriptionChange,
  initialScreen = null,
}: ActiveSubscriptionCardProps) {
  const [forcedScreen, setForcedScreen] = useState<SubscriptionScreen | null>(
    initialScreen
  );

  const screen = resolveSubscriptionScreen(subscription, forcedScreen);
  const { plan } = subscription;
  const isPremium = plan === "Premium";
  const isBasic = plan === "Basic";
  const hasPlan = Boolean(plan);
  const isTrial = subscription.isTrial;

  const tier = PRICING_TIERS.find((t) => t.name === plan);

  const sectionTitle =
    screen === "expired"
      ? "Subscription status"
      : screen === "renew"
        ? "Renewal"
        : screen === "extend"
          ? "Extend access"
          : "Active subscription";

  const sectionDescription =
    screen === "expired"
      ? "Restore signals and automation"
      : screen === "renew"
        ? "Keep uninterrupted access"
        : screen === "extend"
          ? "Add time with Pip Coins"
          : isTrial
            ? "Your free trial access"
            : "Your current plan and billing cycle";

  if (screen === "expired" && hasPlan) {
    return (
      <section className="flex min-w-0 flex-col gap-3">
        <div>
          <h2 className="text-base font-medium text-white">{sectionTitle}</h2>
          <p className="mt-0.5 text-sm text-zinc-500">{sectionDescription}</p>
        </div>
        <SubscriptionExpiredScreen
          user={user}
          subscription={subscription}
          onRenewed={onSubscriptionChange}
        />
      </section>
    );
  }

  if (screen === "renew" && hasPlan) {
    return (
      <section className="flex min-w-0 flex-col gap-3">
        <div>
          <h2 className="text-base font-medium text-white">{sectionTitle}</h2>
          <p className="mt-0.5 text-sm text-zinc-500">{sectionDescription}</p>
        </div>
        <SubscriptionRenewScreen
          user={user}
          subscription={subscription}
          onRenewed={onSubscriptionChange}
          onExtend={
            subscription.isTrial ? undefined : () => setForcedScreen("extend")
          }
        />
      </section>
    );
  }

  if (screen === "extend" && hasPlan) {
    return (
      <section className="flex min-w-0 flex-col gap-3">
        <div>
          <h2 className="text-base font-medium text-white">{sectionTitle}</h2>
          <p className="mt-0.5 text-sm text-zinc-500">{sectionDescription}</p>
        </div>
        <SubscriptionExtendScreen
          user={user}
          subscription={subscription}
          onExtended={onSubscriptionChange}
          onBack={() => setForcedScreen(null)}
        />
      </section>
    );
  }

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div>
        <h2 className="text-base font-medium text-white">{sectionTitle}</h2>
        <p className="mt-0.5 text-sm text-zinc-500">{sectionDescription}</p>
      </div>

      <div
        className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 ${
          isPremium
            ? "bg-gradient-to-br from-emerald-950/30 via-zinc-900/70 to-zinc-950/90"
            : "bg-gradient-to-br from-zinc-900/60 via-zinc-900/40 to-zinc-950/80"
        }`}
      >
        {isPremium && (
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/[0.07] blur-3xl"
            aria-hidden
          />
        )}
        {isPremium && (
          <div
            className="pointer-events-none absolute -bottom-8 left-1/4 h-24 w-48 rounded-full bg-amber-500/[0.04] blur-2xl"
            aria-hidden
          />
        )}

        <div className="relative">
          {hasPlan && tier ? (
            isTrial ? (
              <TrialSubscriptionCard
                subscription={subscription}
                tier={tier}
                isPremium={isPremium}
              />
            ) : (
              <PaidSubscriptionCard
                subscription={subscription}
                tier={tier}
                isPremium={isPremium}
                isBasic={isBasic}
                onExtend={() => setForcedScreen("extend")}
              />
            )
          ) : (
            <div className="rounded-xl bg-zinc-900/40 px-4 py-5 text-center">
              <p className="text-sm text-zinc-400">No active subscription</p>
              <Link
                href="/pricing"
                className="mt-3 inline-flex rounded-lg bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/25"
              >
                View plans
              </Link>
            </div>
          )}
        </div>

        {hasPlan && (
          <div className="relative mt-5 flex flex-wrap gap-2 border-t border-zinc-800/80 pt-4">
            <Link
              href="/subscription"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
            >
              Manage subscription
            </Link>
            {!isTrial && subscription.status === "active" && (
              <button
                type="button"
                onClick={() => setForcedScreen("extend")}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
              >
                Extend
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
