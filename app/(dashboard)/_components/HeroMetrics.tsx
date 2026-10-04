"use client";

import type { AccountMetrics } from "../../lib/dashboardData";

type HeroMetricsProps = {
  metrics: AccountMetrics;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatSignedCurrency(value: number): string {
  const formatted = formatCurrency(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `−${formatted}`;
  return formatted;
}

type MetricCardProps = {
  label: string;
  value: string;
  valueClassName?: string;
  hint?: string;
};

function MetricCard({ label, value, valueClassName = "text-white", hint }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-4 sm:p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold tabular-nums tracking-tight sm:text-[1.65rem] ${valueClassName}`}>
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

/** Every figure here comes from trades copied into the customer's own account. */
export function HeroMetrics({ metrics }: HeroMetricsProps) {
  const toneFor = (value: number) =>
    value > 0 ? "text-emerald-400" : value < 0 ? "text-red-400" : "text-white";

  return (
    <section aria-label="Account metrics">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Open positions P&L"
          value={formatSignedCurrency(metrics.todayLivePnL)}
          valueClassName={toneFor(metrics.todayLivePnL)}
          hint={`${metrics.openTrades} open ${metrics.openTrades === 1 ? "trade" : "trades"}`}
        />
        <MetricCard
          label="Closed trades P&L"
          value={formatSignedCurrency(metrics.overallProfit)}
          valueClassName={toneFor(metrics.overallProfit)}
          hint="All closed copied trades"
        />
        <MetricCard
          label="Closed trades"
          value={String(metrics.closedTrades)}
          hint="Copied into your account"
        />
        <MetricCard
          label="Won"
          value={metrics.winRatePercent === null ? "—" : `${metrics.winRatePercent}%`}
          hint={metrics.winRatePercent === null ? "Shown after your first closed trade" : "Of closed trades"}
        />
      </div>
    </section>
  );
}
