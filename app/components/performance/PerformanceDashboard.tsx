"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  formatPips,
  formatSignedPercent,
  formatUsd,
  getDemoReport,
  PERFORMANCE_PERIODS,
  type PerformancePeriod,
  type PerformanceReport,
  type PerformanceSource,
} from "../../lib/performanceReport";
import { EquityChart } from "./EquityChart";

type PerformanceDashboardProps = {
  liveReport: PerformanceReport | null;
};

function money(value: number, unit: PerformanceReport["pnlUnit"]): string {
  return unit === "usd" ? formatUsd(value) : `${formatPips(value)} pips`;
}

export function PerformanceDashboard({ liveReport }: PerformanceDashboardProps) {
  const [period, setPeriod] = useState<PerformancePeriod>("30D");
  const [notice, setNotice] = useState(false);
  const source: PerformanceSource = liveReport ? "live" : "demo";

  const report = useMemo(
    () => liveReport ?? getDemoReport(period),
    [liveReport, period]
  );

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(false), 4200);
    return () => window.clearTimeout(id);
  }, [notice]);

  const unit = report.pnlUnit;
  const o = report.overview;
  const isDemo = report.source === "demo";

  return (
    <div className="min-w-0">
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="automation-fade-up mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-500/80">
            PipAngel Performance
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            Forex Trading Performance
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg">
            Transparent performance data from recorded trades, risk metrics, and
            account activity.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-emerald-400">
              <span className="home-support-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Performance Data
            </span>
            <span>Results update as new trades are recorded.</span>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                if (isDemo) setNotice(true);
                else document.getElementById("performance-overview")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex min-h-[3rem] items-center justify-center rounded-lg bg-emerald-500 px-6 text-sm font-medium text-white transition hover:bg-emerald-400"
            >
              Get Live Performance Report →
            </button>
            <a
              href="#recent-trades"
              className="inline-flex min-h-[3rem] items-center justify-center rounded-lg border border-white/10 px-6 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              View Recent Trades →
            </a>
          </div>
          {notice && (
            <p className="mt-4 text-sm text-zinc-400">
              Live reporting coming soon. Demo data is shown for interface preview
              only.
            </p>
          )}
        </div>
      </section>

      <section className="border-b border-zinc-800 bg-[#080808] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusItem
            label="Data Status"
            value={isDemo ? "Demo Data" : "Live Data"}
            live={!isDemo}
          />
          <StatusItem label="Report Period" value={report.periodLabel} />
          <StatusItem label="Trading Environment" value={report.environment} />
          <StatusItem label="Execution" value={report.execution} />
        </div>
      </section>

      {isDemo && (
        <section className="border-b border-amber-500/20 bg-amber-500/[0.04] px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-amber-400">
              Demo Data
            </span>
            <p className="text-sm text-zinc-400">
              Illustrative data for interface preview only. These figures are not
              actual PipAngel trading results.
            </p>
          </div>
        </section>
      )}

      <section
        id="performance-overview"
        className="border-b border-zinc-800 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Performance Overview
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                Headline metrics for the selected reporting period.
              </p>
            </div>
            <div className="flex flex-wrap gap-1 rounded-lg border border-white/[0.08] bg-[#0C0C0E] p-1">
              {PERFORMANCE_PERIODS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPeriod(item.id)}
                  className={`rounded-md px-3 py-1.5 font-mono text-[11px] transition ${
                    period === item.id
                      ? "bg-white/[0.08] text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label="Net Return"
              value={formatSignedPercent(o.netReturnPercent)}
              detail="Change in account equity over the reporting period."
              emphasis
            />
            <MetricCard
              label="Win Rate"
              value={`${o.winRatePercent.toFixed(1)}%`}
              detail="Percentage of closed trades that ended profitably."
            />
            <MetricCard
              label="Profit Factor"
              value={o.profitFactor.toFixed(2)}
              detail="Gross profit divided by gross loss."
            />
            <MetricCard
              label="Total Trades"
              value={String(o.totalTrades)}
              detail="Closed trades included in this report."
            />
            <MetricCard
              label="Max Drawdown"
              value={`${o.maxDrawdownPercent.toFixed(1)}%`}
              detail="Largest peak-to-trough decline during the reporting period."
              tone="amber"
            />
            <MetricCard
              label="Net P&L"
              value={money(o.netPnl, unit)}
              detail="Net result of recorded trades in the selected period."
            />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 bg-[#080808] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">Account Growth</h2>
              <p className="mt-2 text-sm text-zinc-500">
                {isDemo
                  ? "Illustrative account equity progression for the selected reporting period."
                  : "Equity progression derived from recorded trade results."}
              </p>
            </div>
            <div className="flex gap-4 text-[11px] uppercase tracking-wider text-zinc-500">
              <span>Starting {money(report.startingBalance, unit).replace("+", "")}</span>
              <span className="text-emerald-400">
                Current {money(report.currentBalance, unit).replace("+", "")}
              </span>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0C0C0E] p-3 sm:p-5">
            <EquityChart points={report.equity} source={report.source} unit={unit} />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Profit & Loss Analysis
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[18px] border border-white/[0.08] bg-[#0C0C0E] p-5 sm:p-6">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Winning vs Losing Trades
              </p>
              <WinLossBar
                wins={report.pnl.winningTrades}
                losses={report.pnl.losingTrades}
              />
            </div>
            <div className="rounded-[18px] border border-white/[0.08] bg-[#0C0C0E] p-5 sm:p-6">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Average Trade
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                <Stat label="Average Win" value={money(report.pnl.averageWin, unit)} />
                <Stat label="Average Loss" value={money(report.pnl.averageLoss, unit)} />
                <Stat label="Best Trade" value={money(report.pnl.bestTrade, unit)} />
                <Stat label="Worst Trade" value={money(report.pnl.worstTrade, unit)} muted />
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 bg-[#080808] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white sm:text-2xl">Trade Performance</h2>
            {isDemo && <DemoChip />}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Stat label="Total Trades" value={String(o.totalTrades)} boxed />
            <Stat label="Winning Trades" value={String(report.pnl.winningTrades)} boxed />
            <Stat label="Losing Trades" value={String(report.pnl.losingTrades)} boxed />
            <Stat label="Win Rate" value={`${o.winRatePercent.toFixed(1)}%`} boxed />
            <Stat label="Average Win" value={money(report.pnl.averageWin, unit)} boxed />
            <Stat label="Average Loss" value={money(report.pnl.averageLoss, unit)} boxed />
            <Stat label="Largest Win" value={money(report.pnl.bestTrade, unit)} boxed />
            <Stat label="Largest Loss" value={money(report.pnl.worstTrade, unit)} boxed muted />
            <Stat label="Average Holding Time" value={report.tradeStats.averageHoldingTime} boxed />
            <Stat label="Winning Streak" value={String(report.tradeStats.winningStreak)} boxed />
            <Stat label="Losing Streak" value={String(report.tradeStats.losingStreak)} boxed />
          </div>
        </div>
      </section>

      <section
        id="recent-trades"
        className="border-b border-zinc-800 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">Recent Trades</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Individual recorded trades for the current report.
              </p>
            </div>
            <Link
              href="/trades"
              className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              View All Trades →
            </Link>
          </div>

          <div className="mt-6 hidden overflow-x-auto rounded-[18px] border border-white/[0.08] md:block">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#0C0C0E] text-[11px] uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-3 font-medium">Symbol</th>
                  <th className="px-4 py-3 font-medium">Direction</th>
                  <th className="px-4 py-3 font-medium">Entry</th>
                  <th className="px-4 py-3 font-medium">Stop Loss</th>
                  <th className="px-4 py-3 font-medium">Take Profit</th>
                  <th className="px-4 py-3 font-medium">Exit</th>
                  <th className="px-4 py-3 font-medium">Pips</th>
                  <th className="px-4 py-3 font-medium">Result</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.trades.map((trade) => (
                  <tr
                    key={trade.id}
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 font-medium text-white">{trade.symbol}</td>
                    <td className={`px-4 py-3 ${trade.direction === "BUY" ? "text-emerald-400" : "text-zinc-300"}`}>
                      {trade.direction}
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-400">{trade.entry}</td>
                    <td className="px-4 py-3 font-mono text-zinc-500">{trade.stopLoss}</td>
                    <td className="px-4 py-3 font-mono text-zinc-500">{trade.takeProfit}</td>
                    <td className="px-4 py-3 font-mono text-zinc-400">{trade.exit}</td>
                    <td className={`px-4 py-3 font-mono ${trade.pips >= 0 ? "text-emerald-400" : "text-zinc-300"}`}>
                      {formatPips(trade.pips)}
                    </td>
                    <td className={`px-4 py-3 font-mono ${trade.pnl >= 0 ? "text-emerald-400" : "text-zinc-300"}`}>
                      {money(trade.pnl, unit)}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{trade.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-3 md:hidden">
            {report.trades.map((trade) => (
              <article
                key={trade.id}
                className="rounded-xl border border-white/[0.08] bg-[#0C0C0E] p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-white">{trade.symbol}</p>
                  <span className={trade.direction === "BUY" ? "text-emerald-400" : "text-zinc-300"}>
                    {trade.direction}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-500">
                  <div>Entry <span className="font-mono text-zinc-300">{trade.entry}</span></div>
                  <div>Exit <span className="font-mono text-zinc-300">{trade.exit}</span></div>
                  <div>SL <span className="font-mono text-zinc-300">{trade.stopLoss}</span></div>
                  <div>TP <span className="font-mono text-zinc-300">{trade.takeProfit}</span></div>
                </dl>
                <div className="mt-3 flex justify-between font-mono text-sm">
                  <span className={trade.pips >= 0 ? "text-emerald-400" : "text-zinc-300"}>
                    {formatPips(trade.pips)} pips
                  </span>
                  <span className={trade.pnl >= 0 ? "text-emerald-400" : "text-zinc-300"}>
                    {money(trade.pnl, unit)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 bg-[#080808] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Performance by Symbol
            </h2>
            {isDemo && <DemoChip />}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {report.symbols.map((row) => (
              <article
                key={row.symbol}
                className="rounded-[16px] border border-white/[0.08] bg-[#0C0C0E] p-5 transition hover:border-white/[0.14]"
              >
                <p className="font-mono text-lg text-white">{row.symbol}</p>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <Stat label="Trades" value={String(row.trades)} />
                  <Stat label="Win Rate" value={`${row.winRate.toFixed(1)}%`} />
                  <Stat label="Net P&L" value={money(row.netPnl, unit)} />
                  <Stat label="Average Pips" value={formatPips(row.averagePips)} />
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">Risk & Drawdown</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              PipAngel evaluates every trade through predefined risk controls
              before execution. Performance should therefore be evaluated
              alongside drawdown and exposure, not win rate alone.
            </p>
            <p className="mt-4 text-sm text-zinc-500">
              Risk is managed, not eliminated.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat
              label="Maximum Drawdown"
              value={`${o.maxDrawdownPercent.toFixed(1)}%`}
              boxed
              muted
            />
            <Stat
              label="Average Risk / Trade"
              value={`${report.risk.averageRiskPerTradePercent.toFixed(1)}%`}
              boxed
            />
            <Stat
              label="Largest Single Loss"
              value={money(report.risk.largestSingleLoss, unit)}
              boxed
              muted
            />
            <Stat
              label="Max Consecutive Losses"
              value={String(report.risk.maxConsecutiveLosses)}
              boxed
            />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 bg-[#080808] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Built for Transparent Reporting
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-zinc-400">
            We believe performance should be measured through complete trading
            data, not isolated winning trades.
          </p>
          <div className="mt-8 grid gap-px overflow-hidden rounded-[16px] border border-white/[0.08] bg-white/[0.06] sm:grid-cols-3">
            {[
              {
                title: "Complete Trade History",
                body: "Review individual trades instead of relying only on headline returns.",
              },
              {
                title: "Risk Included",
                body: "Evaluate returns alongside drawdown and exposure.",
              },
              {
                title: "Continuous Reporting",
                body: "Performance data updates as trades are recorded.",
              },
            ].map((item) => (
              <article key={item.title} className="bg-[#0C0C0E] p-5 sm:p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Get the Live Performance Report
          </h2>
          <p className="mt-4 text-sm text-zinc-400 sm:text-base">
            Review the latest recorded trades, performance metrics, risk
            statistics, and account activity from the PipAngel system.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                if (isDemo) setNotice(true);
                else document.getElementById("performance-overview")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex min-h-[3rem] items-center justify-center rounded-lg bg-emerald-500 px-6 text-sm font-medium text-white transition hover:bg-emerald-400"
            >
              Get Live Performance Report →
            </button>
            <a
              href="#recent-trades"
              className="inline-flex min-h-[3rem] items-center justify-center rounded-lg border border-white/10 px-6 text-sm font-medium text-zinc-200 transition hover:border-white/20"
            >
              View Recent Trades →
            </a>
          </div>
          <p className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isDemo ? "bg-amber-400" : "bg-emerald-400"
              }`}
            />
            {isDemo ? "Reporting system in development" : "Live reporting available"}
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Performance Disclosure
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Past performance does not guarantee future results. Forex trading
            involves substantial risk, and actual results may vary depending on
            market conditions, execution, spreads, slippage, account size, and
            other factors.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            {isDemo
              ? "Demo figures shown on this page are illustrative and are not actual trading results."
              : "Figures on this page are compiled from recorded trades and published performance statistics."}
          </p>
        </div>
      </section>
    </div>
  );
}

function DemoChip() {
  return (
    <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-400">
      Demo Data
    </span>
  );
}

function StatusItem({
  label,
  value,
  live = false,
}: {
  label: string;
  value: string;
  live?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-zinc-600">{label}</p>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-200">
        {(label === "Data Status") && (
          <span
            className={`h-1.5 w-1.5 rounded-full ${live ? "bg-emerald-400" : "bg-amber-400"}`}
          />
        )}
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  emphasis = false,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  emphasis?: boolean;
  tone?: "default" | "amber";
}) {
  return (
    <article
      className={`rounded-[16px] border border-white/[0.08] bg-[#0C0C0E] p-5 transition hover:border-white/[0.14] ${
        emphasis ? "sm:col-span-2 lg:col-span-1 lg:row-span-1 ring-1 ring-emerald-500/15" : ""
      }`}
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-2 font-mono font-medium tracking-tight ${
          emphasis ? "text-3xl text-emerald-400 sm:text-4xl" : "text-2xl text-white"
        } ${tone === "amber" ? "text-amber-400" : ""}`}
      >
        {value}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-zinc-600">{detail}</p>
    </article>
  );
}

function Stat({
  label,
  value,
  boxed = false,
  muted = false,
}: {
  label: string;
  value: string;
  boxed?: boolean;
  muted?: boolean;
}) {
  const inner = (
    <>
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-1 font-mono text-sm ${muted ? "text-amber-400" : "text-white"}`}>
        {value}
      </p>
    </>
  );
  if (!boxed) return <div>{inner}</div>;
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0C0C0E] px-4 py-3">{inner}</div>
  );
}

function WinLossBar({ wins, losses }: { wins: number; losses: number }) {
  const total = Math.max(wins + losses, 1);
  const winPct = (wins / total) * 100;
  return (
    <div className="mt-5">
      <div className="flex items-end justify-between text-sm">
        <div>
          <p className="text-zinc-500">Winning Trades</p>
          <p className="mt-1 font-mono text-2xl text-emerald-400">{wins}</p>
        </div>
        <div className="text-right">
          <p className="text-zinc-500">Losing Trades</p>
          <p className="mt-1 font-mono text-2xl text-zinc-300">{losses}</p>
        </div>
      </div>
      <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <span className="h-full bg-emerald-500" style={{ width: `${winPct}%` }} />
        <span className="h-full bg-zinc-600" style={{ width: `${100 - winPct}%` }} />
      </div>
    </div>
  );
}
