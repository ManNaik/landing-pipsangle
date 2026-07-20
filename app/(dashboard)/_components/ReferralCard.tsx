"use client";

import { useCallback, useState } from "react";
import { formatDateTime } from "../../lib/format";
import type { ReferralProgram } from "../../lib/referralData";

type ReferralCardProps = {
  program: ReferralProgram;
  pipCoinsBalance?: number;
  hideBalance?: boolean;
};

function PipCoinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
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

function CopyIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CheckSmallIcon() {
  return (
    <svg
      className="h-4 w-4"
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

function PersonIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function GiftIcon({ className = "h-4 w-4" }: { className?: string }) {
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
        d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  );
}

type ReferralJourneyProps = {
  completedReferrals: number;
  targetReferrals: number;
  bonusAmount: number;
};

function ReferralJourney({
  completedReferrals,
  targetReferrals,
  bonusAmount,
}: ReferralJourneyProps) {
  const remaining = Math.max(0, targetReferrals - completedReferrals);
  const bonusUnlocked = completedReferrals >= targetReferrals;
  const isClose = !bonusUnlocked && remaining <= 2;
  const progressPercent = (completedReferrals / targetReferrals) * 100;

  const steps = Array.from({ length: targetReferrals }, (_, index) => index + 1);

  return (
    <div className="rounded-xl bg-zinc-950/40 p-4 ring-1 ring-zinc-800/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            Referral journey
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <p className="text-2xl font-bold tabular-nums tracking-tight text-white">
              {completedReferrals}
            </p>
            <p className="text-sm text-zinc-500">
              of{" "}
              <span className="font-medium tabular-nums text-zinc-400">
                {targetReferrals}
              </span>{" "}
              referrals
            </p>
          </div>
          {!bonusUnlocked && remaining > 0 && (
            <p className="mt-1 text-xs text-zinc-500">
              {remaining === 1 ? "1 more referral" : `${remaining} more referrals`}{" "}
              to unlock your bonus
            </p>
          )}
        </div>

        <div
          className={`shrink-0 rounded-xl px-3.5 py-2.5 text-right transition ${
            bonusUnlocked
              ? "bg-gradient-to-br from-emerald-500/20 to-amber-500/10 ring-1 ring-emerald-400/30 shadow-[0_0_20px_rgba(52,211,153,0.12)]"
              : isClose
                ? "bg-gradient-to-br from-amber-500/10 to-emerald-500/5 ring-1 ring-amber-400/25 shadow-[0_0_16px_rgba(251,191,36,0.08)]"
                : "bg-zinc-900/60 ring-1 ring-zinc-800/80"
          }`}
        >
          <div className="flex items-center justify-end gap-1.5">
            {bonusUnlocked ? (
              <CheckSmallIcon />
            ) : (
              <GiftIcon
                className={`h-4 w-4 ${
                  isClose ? "text-amber-300/90" : "text-zinc-500"
                }`}
              />
            )}
            <span
              className={`text-base font-bold tabular-nums ${
                bonusUnlocked
                  ? "text-emerald-300"
                  : isClose
                    ? "text-amber-200"
                    : "text-zinc-400"
              }`}
            >
              ${bonusAmount}
            </span>
          </div>
          <p
            className={`mt-0.5 text-[10px] font-medium uppercase tracking-[0.1em] ${
              bonusUnlocked
                ? "text-emerald-400/80"
                : isClose
                  ? "text-amber-400/70"
                  : "text-zinc-600"
            }`}
          >
            {bonusUnlocked ? "Unlocked" : isClose ? "Almost there" : "Cash bonus"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-600">
          <span>Progress</span>
          <span className="tabular-nums text-zinc-500">
            {Math.round(progressPercent)}%
          </span>
        </div>

        <div
          className="flex gap-1"
          role="progressbar"
          aria-valuenow={completedReferrals}
          aria-valuemin={0}
          aria-valuemax={targetReferrals}
          aria-label={`${completedReferrals} of ${targetReferrals} referrals completed`}
        >
          {steps.map((step) => {
            const completed = step <= completedReferrals;
            return (
              <div
                key={step}
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                  completed
                    ? "bg-gradient-to-r from-emerald-600/80 to-emerald-400/90 shadow-[0_0_8px_rgba(52,211,153,0.2)]"
                    : "bg-zinc-800/90"
                }`}
              />
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1">
          {steps.map((step) => {
            const completed = step <= completedReferrals;
            const isCurrent = step === completedReferrals + 1 && !bonusUnlocked;

            return (
              <div key={step} className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                    completed
                      ? "bg-emerald-500/15 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.15)] ring-1 ring-emerald-400/25"
                      : isCurrent
                        ? "bg-zinc-800/80 text-zinc-300 ring-1 ring-zinc-600/60"
                        : "bg-zinc-900/80 text-zinc-600 ring-1 ring-zinc-800/60"
                  }`}
                >
                  {completed ? (
                    <CheckSmallIcon />
                  ) : (
                    <span className="text-[11px] font-semibold tabular-nums">
                      {step}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium tabular-nums ${
                    completed
                      ? "text-emerald-400/70"
                      : isCurrent
                        ? "text-zinc-400"
                        : "text-zinc-600"
                  }`}
                >
                  {completed ? "Done" : `Ref ${step}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ReferralCard({
  program,
  pipCoinsBalance: pipCoinsBalanceProp,
  hideBalance = false,
}: ReferralCardProps) {
  const [copied, setCopied] = useState(false);

  const {
    referralLink,
    referralCode,
    completedReferrals,
    targetReferrals,
    bonusAmount,
    pipCoinsBalance: programBalance,
    pipCoinsPerReferral,
    recentReferrals,
  } = program;

  const pipCoinsBalance = pipCoinsBalanceProp ?? programBalance;

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [referralLink]);

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div>
        <h2 className="text-base font-medium text-white">Referral program</h2>
        <p className="mt-0.5 text-sm text-zinc-500">
          Refer {targetReferrals} users and earn a{" "}
          <span className="font-medium text-emerald-400">${bonusAmount}</span> bonus
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/70 via-zinc-900/50 to-emerald-950/20 p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-amber-500/[0.05] blur-3xl"
          aria-hidden
        />

        <div
          className={`relative flex flex-wrap items-start gap-4 ${
            hideBalance ? "justify-end" : "justify-between"
          }`}
        >
          {!hideBalance && (
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/25 via-amber-400/10 to-emerald-500/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <PipCoinIcon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                  Pip Coins balance
                </p>
                <p className="mt-0.5 text-2xl font-bold tabular-nums tracking-tight text-white">
                  {pipCoinsBalance.toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <div className={hideBalance ? "text-left" : "text-right"}>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
              Per referral
            </p>
            <p
              className={`mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-amber-300/90 ${
                hideBalance ? "justify-start" : "justify-end"
              }`}
            >
              <PipCoinIcon className="h-4 w-4" />
              <span className="tabular-nums">+{pipCoinsPerReferral}</span>
            </p>
          </div>
        </div>

        <p className="relative mt-4 text-sm leading-relaxed text-zinc-400">
          Each successful referral earns{" "}
          <span className="font-medium text-amber-200/90">
            {pipCoinsPerReferral} Pip Coins
          </span>
          . Complete all {targetReferrals} to unlock your cash bonus.
        </p>

        <div className="relative mt-5">
          <div className="flex items-stretch gap-2">
            <div className="min-w-0 flex-1 rounded-xl bg-zinc-950/50 px-3.5 py-3 ring-1 ring-zinc-800/60">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-600">
                Your referral link
              </p>
              <p className="mt-1 truncate font-mono text-sm text-zinc-300">
                {referralLink}
              </p>
              <p className="mt-1.5 text-[11px] text-zinc-600">
                Code{" "}
                <span className="font-mono font-medium text-emerald-400/80">
                  {referralCode}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => void copyLink()}
              className={`flex shrink-0 flex-col items-center justify-center gap-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                copied
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              }`}
            >
              {copied ? <CheckSmallIcon /> : <CopyIcon />}
              <span className="text-[11px]">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        <div className="relative mt-6">
          <ReferralJourney
            completedReferrals={completedReferrals}
            targetReferrals={targetReferrals}
            bonusAmount={bonusAmount}
          />
        </div>

        {recentReferrals.length > 0 && (
          <div className="relative mt-7 space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500">
              Recent referrals
            </p>
            {recentReferrals.map((referral) => (
              <article
                key={referral.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800/40 bg-zinc-950/30 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400/80 ring-1 ring-emerald-500/15">
                    <PersonIcon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {referral.referredName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-600">
                      {formatDateTime(referral.referredAt)}
                    </p>
                  </div>
                </div>
                <p className="flex items-center gap-1 text-sm font-semibold tabular-nums text-amber-300/90">
                  <PipCoinIcon className="h-3.5 w-3.5" />
                  +{referral.pipCoinsEarned}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
