"use client";

import { useMemo, useState } from "react";
import { getDashboardStats } from "../../lib/dashboardData";
import { mockExecutedTrades, mockSignals } from "../../lib/mockData";
import {
  ALL_TIME_PROFIT,
  getPeriodProfit,
  getProfitData,
  getProfitRange,
  type ProfitPeriod,
} from "../../lib/profitData";
import { shouldShowWarningBanner } from "../../lib/brokerConnection";
import { useAuth } from "../../lib/useAuth";
import { getSubscriptionInfo } from "../../lib/subscriptionData";
import { ActiveSubscriptionCard } from "./ActiveSubscriptionCard";
import { BrokerWarningBanner } from "./BrokerWarningBanner";
import { useBrokerConnectionContext } from "./BrokerConnectionContext";
import { ExecutedTradesList } from "./ExecutedTradesList";
import { ProfitChart } from "./ProfitChart";
import { SignalsList } from "./SignalsList";

const PERIOD_OPTIONS: { value: ProfitPeriod; label: string }[] = [
  { value: "1d", label: "1 day" },
  { value: "7d", label: "7 days" },
  { value: "1m", label: "1 month" },
  { value: "custom", label: "Custom" },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function defaultCustomDates() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 13);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

function ConnectedSuccessBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5"
    >
      <div className="flex items-start gap-3 sm:items-center">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 sm:mt-0">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-medium text-emerald-100">Broker verification completed</p>
          <p className="mt-0.5 text-sm text-emerald-200/70">
            Your account is connected and ready for automated trading.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg border border-emerald-500/30 px-4 py-2 text-sm text-emerald-200 transition hover:bg-emerald-500/15"
      >
        Dismiss
      </button>
    </div>
  );
}

export function DashboardContent() {
  const { user } = useAuth();
  const {
    status: brokerStatus,
    openOnboarding,
    showConnectedMessage,
    dismissConnectedMessage,
  } = useBrokerConnectionContext();
  const [period, setPeriod] = useState<ProfitPeriod>("7d");
  const [customDates, setCustomDates] = useState(defaultCustomDates);

  const stats = user ? getDashboardStats(user) : null;
  const subscription = user ? getSubscriptionInfo(user) : null;

  const profitData = useMemo(() => {
    const range = getProfitRange(
      period,
      period === "custom" ? customDates : undefined
    );
    return getProfitData(range);
  }, [period, customDates]);

  const periodProfit = useMemo(() => getPeriodProfit(profitData), [profitData]);

  if (!user || !stats || !subscription) return null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:gap-4">
      {showConnectedMessage && (
        <ConnectedSuccessBanner onDismiss={dismissConnectedMessage} />
      )}

      {shouldShowWarningBanner(brokerStatus) && (
        <BrokerWarningBanner onConnect={openOnboarding} />
      )}

      <div className="shrink-0">
        <p className="text-sm text-zinc-500">Welcome back</p>
        <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {stats.displayName}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Signed in as <span className="text-zinc-300">{user.email}</span>
        </p>
      </div>

      <div className="grid shrink-0 gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-4">
        <section className="min-w-0 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium text-white">Profit performance</h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Earnings over the selected period
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPeriod(option.value)}
                  className={`rounded-lg px-2.5 py-1 text-sm transition ${
                    period === option.value
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {period === "custom" && (
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex flex-col gap-1 text-xs text-zinc-500">
                From
                <input
                  type="date"
                  value={customDates.from}
                  max={customDates.to}
                  onChange={(event) =>
                    setCustomDates((current) => ({
                      ...current,
                      from: event.target.value,
                    }))
                  }
                  className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-1 ring-zinc-800 focus:ring-emerald-500/40"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-zinc-500">
                To
                <input
                  type="date"
                  value={customDates.to}
                  min={customDates.from}
                  onChange={(event) =>
                    setCustomDates((current) => ({
                      ...current,
                      to: event.target.value,
                    }))
                  }
                  className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-1 ring-zinc-800 focus:ring-emerald-500/40"
                />
              </label>
            </div>
          )}

          <div className="rounded-2xl bg-zinc-900/40 p-3 sm:p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Period profit
            </p>
            <p className="mt-0.5 text-xl font-semibold tabular-nums text-emerald-400 sm:text-2xl">
              {formatCurrency(periodProfit)}
            </p>
            <div className="mt-2">
              <ProfitChart data={profitData} className="h-36 sm:h-40" />
            </div>
          </div>
        </section>

        <section className="flex flex-col justify-center gap-3">
          <div className="rounded-2xl bg-zinc-900/40 p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Overall profit
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums text-white sm:text-4xl">
              {formatCurrency(ALL_TIME_PROFIT)}
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Cumulative all-time earnings from automated trades and signals.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/30 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              This period
            </p>
            <p className="mt-1.5 text-lg font-semibold tabular-nums text-emerald-400">
              {formatCurrency(periodProfit)}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {period === "1d"
                ? "Last 24 hours"
                : period === "7d"
                  ? "Last 7 days"
                  : period === "1m"
                    ? "Last 30 days"
                    : "Selected date range"}
            </p>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 sm:items-stretch sm:gap-4">
        <SignalsList signals={mockSignals} />
        <ExecutedTradesList trades={mockExecutedTrades} />
      </div>

      <ActiveSubscriptionCard subscription={subscription} />
    </div>
  );
}
