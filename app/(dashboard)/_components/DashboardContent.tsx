"use client";

import { useEffect, useState } from "react";
import { getAccountMetrics, getDashboardStats } from "../../lib/dashboardData";
import { mockExecutedTrades, mockSignals, isMockApiEnabled } from "../../lib/mockData";
import { type ProfitPeriod } from "../../lib/profitData";
import { shouldShowWarningBanner } from "../../lib/brokerConnection";
import { useAuth } from "../../lib/useAuth";
import { useSubscriptionInfo } from "../../lib/useSubscriptionInfo";
import { useOpenTrades, useTradeStats } from "../../lib/useTrades";
import { useProfitData } from "../../lib/useProfitData";
import { fetchTrades } from "../../lib/tradesApi";
import type { ExecutedTrade } from "../../lib/types";
import { ActiveSubscriptionCard } from "./ActiveSubscriptionCard";
import { BrokerWarningBanner } from "./BrokerWarningBanner";
import { useBrokerConnectionContext } from "./BrokerConnectionContext";
import { DashboardStickyHeader } from "./DashboardStickyHeader";
import { ExecutedTradesList } from "./ExecutedTradesList";
import { HeroMetrics } from "./HeroMetrics";
import { ProfitChart } from "./ProfitChart";
import { SignalsList } from "./SignalsList";

const PERIOD_OPTIONS: { value: ProfitPeriod; label: string }[] = [
  { value: "1d", label: "1D" },
  { value: "7d", label: "7D" },
  { value: "1m", label: "1M" },
  { value: "custom", label: "Custom" },
];

type FeedTab = "live" | "signals";

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

function FeedTabs({
  active,
  onChange,
}: {
  active: FeedTab;
  onChange: (tab: FeedTab) => void;
}) {
  return (
    <div
      className="flex rounded-xl bg-zinc-900/80 p-1 ring-1 ring-zinc-800 lg:hidden"
      role="tablist"
      aria-label="Trade feeds"
    >
      <button
        type="button"
        role="tab"
        aria-selected={active === "live"}
        onClick={() => onChange("live")}
        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
          active === "live"
            ? "bg-zinc-800 text-white shadow-sm"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        My Account Trades
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={active === "signals"}
        onClick={() => onChange("signals")}
        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
          active === "signals"
            ? "bg-zinc-800 text-white shadow-sm"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        Detected Signals
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
  const [feedTab, setFeedTab] = useState<FeedTab>("live");
  const [dashboardTrades, setDashboardTrades] = useState<ExecutedTrade[]>([]);

  const { trades: openTrades } = useOpenTrades();
  const { stats: tradeStats } = useTradeStats();
  const { data: profitData, periodProfit } = useProfitData(
    period,
    period === "custom" ? customDates : undefined
  );
  const { subscription, refresh: refreshSubscription } = useSubscriptionInfo(user);

  useEffect(() => {
    if (isMockApiEnabled()) {
      setDashboardTrades(mockExecutedTrades);
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        const data = await fetchTrades(1, 20);
        if (!cancelled) setDashboardTrades(data.results);
      } catch {
        if (!cancelled) setDashboardTrades([]);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const stats = user ? getDashboardStats(user) : null;
  const metrics = user
    ? getAccountMetrics(user, {
        tradeStats,
        openTrades,
        allTimeProfit: tradeStats?.totalPnl,
      })
    : null;

  if (!user || !stats || !metrics || !subscription) return null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col">
      <DashboardStickyHeader brokerStatus={brokerStatus} />

      <div className="flex flex-col gap-4 pt-4 sm:gap-5">
        {showConnectedMessage && (
          <ConnectedSuccessBanner onDismiss={dismissConnectedMessage} />
        )}

        {shouldShowWarningBanner(brokerStatus) && (
          <BrokerWarningBanner onConnect={openOnboarding} />
        )}

        <HeroMetrics metrics={metrics} />

        <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Profit performance</h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                Account equity over the selected period
                <span className="ml-2 tabular-nums text-emerald-400">
                  {periodProfit >= 0 ? "+" : ""}
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "USD",
                  }).format(periodProfit)}
                </span>
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
            <div className="mt-3 flex flex-wrap items-end gap-3">
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

          <div className="mt-4">
            <ProfitChart data={profitData} className="h-48 sm:h-56" />
          </div>
        </section>

        <section aria-label="Trade activity feeds">
          <FeedTabs active={feedTab} onChange={setFeedTab} />

          <div className="mt-3 hidden gap-4 lg:grid lg:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
              <SignalsList signals={mockSignals} variant="embedded" />
            </div>
            <div className="min-w-0 rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4">
              <ExecutedTradesList trades={dashboardTrades} variant="embedded" />
            </div>
          </div>

          <div className="mt-3 lg:hidden">
            {feedTab === "live" ? (
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4">
                <ExecutedTradesList trades={dashboardTrades} variant="embedded" />
              </div>
            ) : (
              <div className="rounded-2xl border border-blue-500/10 bg-blue-500/[0.04] p-4">
                <SignalsList signals={mockSignals} variant="embedded" />
              </div>
            )}
          </div>
        </section>

        <ActiveSubscriptionCard
          user={user}
          subscription={subscription}
          onSubscriptionChange={refreshSubscription}
        />
      </div>
    </div>
  );
}
