"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDateTime } from "../../lib/format";
import {
  addClaimedReward,
  deductPipCoins,
  loadClaimHistory,
  loadPipCoinsBalance,
  type ClaimedReward,
} from "../../lib/pipCoins";
import {
  daysUntilDate,
  extendSubscriptionEnd,
  formatStoreDate,
  getCouponRewards,
  getEffectiveSubscriptionEnd,
  getExtensionRewards,
  saveSubscriptionEndOverride,
  type StoreReward,
} from "../../lib/storeData";
import { DEMO_REFERRAL_PROGRAM } from "../../lib/referralData";
import { getTrialEndIso, isOnTrial } from "../../lib/subscriptionData";
import { useAuth } from "../../lib/useAuth";
import { ReferralCard } from "./ReferralCard";

function PipCoinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="9"
        className="fill-amber-500/20 stroke-amber-400/50"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r="6.5"
        className="stroke-amber-300/30"
        strokeWidth="0.75"
        strokeDasharray="2 2"
      />
      <text
        x="12"
        y="13.5"
        textAnchor="middle"
        className="fill-amber-200 text-[7px] font-bold"
        style={{ fontSize: "7px" }}
      >
        P
      </text>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
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

function CouponIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18a2.25 2.25 0 01-2.25 2.25h-13.5A2.25 2.25 0 012.25 18v-2.25m0-12.75V6A2.25 2.25 0 014.5 3.75h3.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a2.25 2.25 0 012.25 2.25v.75"
      />
    </svg>
  );
}

function CalendarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

function CoinCost({ cost }: { cost: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-sm font-semibold tabular-nums text-amber-200/90">
      <PipCoinIcon className="h-4 w-4" />
      {cost.toLocaleString()}
    </span>
  );
}

type ClaimResult = {
  reward: StoreReward;
  couponCode?: string;
  newEndDate?: string;
};

function RewardCard({
  reward,
  balance,
  onClaim,
  claiming,
}: {
  reward: StoreReward;
  balance: number;
  onClaim: (reward: StoreReward) => void;
  claiming: string | null;
}) {
  const canAfford = balance >= reward.cost;
  const isClaiming = claiming === reward.id;
  const isCoupon = reward.category === "coupon";

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/70 via-zinc-900/50 to-zinc-950/80 p-5 sm:p-6">
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl ${
          isCoupon ? "bg-amber-500/[0.05]" : "bg-emerald-500/[0.05]"
        }`}
        aria-hidden
      />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${
              isCoupon
                ? "bg-gradient-to-br from-amber-500/20 to-amber-900/15 text-amber-300/90"
                : "bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 text-emerald-300/90"
            }`}
          >
            {isCoupon ? <CouponIcon /> : <CalendarIcon />}
          </div>
          {reward.badge && (
            <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300/90">
              {reward.badge}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-base font-semibold text-white">{reward.name}</h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-zinc-500">
          {reward.description}
        </p>

        {reward.discountLabel && (
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-amber-400/70">
            {reward.discountLabel}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <CoinCost cost={reward.cost} />
          <button
            type="button"
            disabled={!canAfford || isClaiming}
            onClick={() => onClaim(reward)}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              canAfford
                ? isCoupon
                  ? "bg-amber-500/15 text-amber-200 hover:bg-amber-500/25"
                  : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                : "cursor-not-allowed bg-zinc-800/60 text-zinc-600"
            }`}
          >
            {isClaiming ? "Claiming…" : canAfford ? "Claim reward" : "Insufficient coins"}
          </button>
        </div>
      </div>
    </article>
  );
}

function ClaimSuccessModal({
  result,
  onClose,
  onApplyCoupon,
  applied,
}: {
  result: ClaimResult;
  onClose: () => void;
  onApplyCoupon: () => void;
  applied: boolean;
}) {
  const { reward } = result;
  const isCoupon = reward.category === "coupon";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-labelledby="claim-success-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-emerald-950/30 p-6 shadow-2xl ring-1 ring-zinc-800/80"
      >
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/[0.08] blur-3xl"
          aria-hidden
        />

        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <CheckIcon />
          </div>

          <h2 id="claim-success-title" className="mt-4 text-xl font-semibold text-white">
            Reward claimed
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {isCoupon
              ? `Your ${reward.name} is ready to use.`
              : `Your subscription has been extended by ${reward.extensionDays} days.`}
          </p>

          {isCoupon && result.couponCode && (
            <div className="mt-5 rounded-xl bg-zinc-950/50 px-4 py-3.5 ring-1 ring-amber-400/20">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-600">
                Coupon code
              </p>
              <p className="mt-1 font-mono text-lg font-semibold tracking-wide text-amber-200">
                {result.couponCode}
              </p>
            </div>
          )}

          {!isCoupon && result.newEndDate && (
            <div className="mt-5 rounded-xl bg-zinc-950/50 px-4 py-3.5 ring-1 ring-emerald-400/20">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-600">
                New renewal date
              </p>
              <p className="mt-1 text-lg font-semibold text-emerald-200">
                {formatStoreDate(result.newEndDate)}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            {isCoupon && (
              <button
                type="button"
                onClick={onApplyCoupon}
                disabled={applied}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  applied
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                {applied ? (
                  <>
                    <CheckIcon />
                    Applied to account
                  </>
                ) : (
                  "Apply to account"
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                isCoupon
                  ? "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800"
                  : "flex-1 bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
            >
              {isCoupon ? "Done" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClaimHistoryItem({ entry }: { entry: ClaimedReward }) {
  const isCoupon = entry.category === "coupon";

  return (
    <article className="flex items-center justify-between gap-4 rounded-xl bg-zinc-950/30 px-4 py-3.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-200">{entry.rewardName}</p>
        <p className="mt-0.5 text-[11px] text-zinc-600">
          {formatDateTime(entry.claimedAt)}
          {entry.couponCode && (
            <span className="ml-2 font-mono text-amber-400/70">{entry.couponCode}</span>
          )}
          {entry.extensionDays && (
            <span className="ml-2 text-emerald-400/70">+{entry.extensionDays} days</span>
          )}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
          isCoupon ? "bg-amber-500/10 text-amber-300/80" : "bg-emerald-500/10 text-emerald-300/80"
        }`}
      >
        {isCoupon ? "Coupon" : "Extension"}
      </span>
    </article>
  );
}

export function PipCoinStore() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<ClaimedReward[]>([]);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [renewalEnd, setRenewalEnd] = useState<string | null>(null);
  const [remainingDays, setRemainingDays] = useState(0);

  useEffect(() => {
    if (!user) return;
    setBalance(loadPipCoinsBalance());
    setHistory(loadClaimHistory());
    const onTrial = isOnTrial(user);
    const end = onTrial ? getTrialEndIso(user) : getEffectiveSubscriptionEnd(user);
    setRenewalEnd(end);
    setRemainingDays(daysUntilDate(end));
  }, [user]);

  const handleClaim = useCallback(
    async (reward: StoreReward) => {
      if (!user || balance < reward.cost) return;

      setClaiming(reward.id);
      setCouponApplied(false);

      await new Promise((resolve) => window.setTimeout(resolve, 400));

      const newBalance = deductPipCoins(reward.cost);
      setBalance(newBalance);

      let result: ClaimResult = { reward };

      if (reward.category === "coupon" && reward.couponCode) {
        result = { reward, couponCode: reward.couponCode };
        addClaimedReward({
          id: `claim-${Date.now()}`,
          rewardId: reward.id,
          rewardName: reward.name,
          category: "coupon",
          cost: reward.cost,
          claimedAt: new Date().toISOString(),
          couponCode: reward.couponCode,
        });
      } else if (reward.category === "extension" && reward.extensionDays) {
        const currentEnd = getEffectiveSubscriptionEnd(user);
        const newEnd = extendSubscriptionEnd(currentEnd, reward.extensionDays);
        saveSubscriptionEndOverride(newEnd);
        setRenewalEnd(newEnd);
        setRemainingDays(daysUntilDate(newEnd));
        result = { reward, newEndDate: newEnd };
        addClaimedReward({
          id: `claim-${Date.now()}`,
          rewardId: reward.id,
          rewardName: reward.name,
          category: "extension",
          cost: reward.cost,
          claimedAt: new Date().toISOString(),
          extensionDays: reward.extensionDays,
        });
      }

      setHistory(loadClaimHistory());
      setClaimResult(result);
      setClaiming(null);
    },
    [user, balance]
  );

  if (!user) return null;

  const couponRewards = getCouponRewards();
  const extensionRewards = getExtensionRewards();

  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/80 via-zinc-900/50 to-amber-950/15 p-5 sm:p-7">
        <div
          className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-amber-500/[0.06] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-emerald-500/[0.05] blur-3xl"
          aria-hidden
        />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-amber-400/70">
              Earn &amp; redeem
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Referral and Store
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
              Refer friends to earn Pip Coins, then spend them on Premium
              discounts and subscription extensions.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-zinc-950/40 px-4 py-3.5 ring-1 ring-amber-400/15">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/25 via-amber-400/10 to-emerald-500/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <PipCoinIcon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                Your balance
              </p>
              <p className="text-2xl font-bold tabular-nums tracking-tight text-white">
                {balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      <ReferralCard
        program={DEMO_REFERRAL_PROGRAM}
        pipCoinsBalance={balance}
        hideBalance
      />

      <div className="relative flex items-center gap-4 py-1">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        <p className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-600">
          Redeem rewards
        </p>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {renewalEnd && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/25 via-zinc-900/60 to-zinc-950/80 p-5 sm:p-6">
          <div
            className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-emerald-500/[0.06] blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                {isOnTrial(user) ? "Trial ends" : "Subscription renews"}
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatStoreDate(renewalEnd)}
              </p>
              <p className="mt-0.5 text-sm text-zinc-500">
                {isOnTrial(user)
                  ? `${remainingDays} ${remainingDays === 1 ? "day" : "days"} left in your trial`
                  : `${remainingDays} ${remainingDays === 1 ? "day" : "days"} until next renewal`}
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300/90">
              <CalendarIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-medium text-white">Premium discount coupons</h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            Claim codes to apply on your next Premium checkout or renewal.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {couponRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              balance={balance}
              onClaim={handleClaim}
              claiming={claiming}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-medium text-white">Subscription extenders</h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            Add extra days to your current billing cycle instantly.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {extensionRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              balance={balance}
              onClaim={handleClaim}
              claiming={claiming}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-medium text-white">Claimed rewards</h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            Your redemption history for this demo session.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-900/30 px-5 py-10 text-center">
            <PipCoinIcon className="mx-auto h-8 w-8 opacity-40" />
            <p className="mt-3 text-sm text-zinc-500">No rewards claimed yet</p>
            <p className="mt-1 text-xs text-zinc-600">
              Claim a coupon or extension above to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((entry) => (
              <ClaimHistoryItem key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </section>

      <footer className="pt-1">
        <p className="text-[11px] text-zinc-600">
          Pip Coin balance and claims persist locally for this demo session.
        </p>
      </footer>

      {claimResult && (
        <ClaimSuccessModal
          result={claimResult}
          applied={couponApplied}
          onApplyCoupon={() => setCouponApplied(true)}
          onClose={() => {
            setClaimResult(null);
            setCouponApplied(false);
          }}
        />
      )}
    </div>
  );
}
