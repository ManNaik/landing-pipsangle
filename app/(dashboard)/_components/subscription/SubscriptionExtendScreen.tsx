"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  addClaimedReward,
  deductPipCoins,
  loadPipCoinsBalance,
} from "../../../lib/pipCoins";
import {
  extendSubscriptionEnd,
  formatStoreDate,
  getEffectiveSubscriptionEnd,
  getExtensionRewards,
  saveSubscriptionEndOverride,
} from "../../../lib/storeData";
import type { SubscriptionInfo } from "../../../lib/subscriptionData";
import type { AuthUser } from "../../../lib/types";
import { ScreenBackButton } from "./SubscriptionShared";

type SubscriptionExtendScreenProps = {
  user: AuthUser;
  subscription: SubscriptionInfo;
  onExtended: () => void;
  onBack: () => void;
};

export function SubscriptionExtendScreen({
  user,
  subscription,
  onExtended,
  onBack,
}: SubscriptionExtendScreenProps) {
  const [balance, setBalance] = useState(0);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [currentEnd, setCurrentEnd] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const extensions = getExtensionRewards();

  useEffect(() => {
    setBalance(loadPipCoinsBalance());
    setCurrentEnd(getEffectiveSubscriptionEnd(user));
  }, [user]);

  const handleExtend = useCallback(
    async (rewardId: string, days: number, cost: number, name: string) => {
      if (balance < cost) return;

      setClaiming(rewardId);
      setSuccessMessage(null);

      await new Promise((resolve) => window.setTimeout(resolve, 400));

      const newEnd = extendSubscriptionEnd(currentEnd, days);
      saveSubscriptionEndOverride(newEnd);
      const newBalance = deductPipCoins(cost);
      addClaimedReward({
        id: `claim-${Date.now()}`,
        rewardId,
        rewardName: name,
        category: "extension",
        cost,
        claimedAt: new Date().toISOString(),
        extensionDays: days,
      });

      setBalance(newBalance);
      setCurrentEnd(newEnd);
      setSuccessMessage(`Extended by ${days} days. New end date: ${formatStoreDate(newEnd)}.`);
      setClaiming(null);
      onExtended();
    },
    [balance, currentEnd, onExtended]
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-950/20 via-zinc-900/70 to-zinc-950/90 p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/[0.06] blur-3xl"
        aria-hidden
      />

      <div className="relative space-y-5">
        <ScreenBackButton onClick={onBack} />

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-400/80">
              Extend subscription
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              Add time to your {subscription.plan} plan
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
              Use Pip Coins from referrals to push your renewal date forward without waiting
              for the next billing cycle.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-4 py-3 text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Current end
            </p>
            <p className="mt-0.5 text-sm font-semibold text-white">
              {currentEnd ? formatStoreDate(currentEnd) : subscription.phaseEndDate}
            </p>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Pip Coins
            </p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-amber-300">
              {balance.toLocaleString()}
            </p>
          </div>
        </div>

        {successMessage && (
          <div
            role="status"
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
          >
            {successMessage}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          {extensions.map((reward) => {
            const affordable = balance >= reward.cost;
            const isClaiming = claiming === reward.id;

            return (
              <article
                key={reward.id}
                className="flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{reward.name}</p>
                  {reward.badge && (
                    <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-300">
                      {reward.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-zinc-500">
                  {reward.description}
                </p>
                <p className="mt-3 text-sm font-semibold tabular-nums text-amber-300">
                  {reward.cost.toLocaleString()} coins
                </p>
                <button
                  type="button"
                  disabled={!affordable || isClaiming}
                  onClick={() =>
                    void handleExtend(
                      reward.id,
                      reward.extensionDays ?? 0,
                      reward.cost,
                      reward.name
                    )
                  }
                  className="mt-3 rounded-lg bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isClaiming ? "Extending…" : affordable ? "Extend" : "Need more coins"}
                </button>
              </article>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-200">Need more Pip Coins?</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Refer traders to earn coins and unlock extensions in the rewards store.
            </p>
          </div>
          <Link
            href="/store"
            className="shrink-0 rounded-lg border border-zinc-700 px-4 py-2 text-center text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
          >
            Go to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
