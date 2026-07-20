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
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold tabular-nums tracking-tight sm:text-[1.65rem] ${valueClassName}`}>
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

export function HeroMetrics({ metrics }: HeroMetricsProps) {
  const livePnLPositive = metrics.todayLivePnL >= 0;

  return (
    <section aria-label="Account metrics">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Total Account Equity"
          value={formatCurrency(metrics.totalAccountEquity)}
          hint="Balance + unrealized P&L"
        />
        <MetricCard
          label="Today's Live P&L"
          value={formatSignedCurrency(metrics.todayLivePnL)}
          valueClassName={livePnLPositive ? "text-emerald-400" : "text-red-400"}
          hint="Unrealized from open positions"
        />
        <MetricCard
          label="Overall Profit"
          value={formatCurrency(metrics.overallProfit)}
          valueClassName="text-emerald-400"
          hint="All-time cumulative"
        />
        <MetricCard
          label="Win Rate"
          value={`${metrics.winRatePercent}%`}
          hint="Closed trade success rate"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Max Drawdown
          </span>
          <span className="text-sm font-semibold tabular-nums text-amber-400/90">
            {metrics.maxDrawdownPercent}%
          </span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Margin Level
          </span>
          <span
            className={`text-sm font-semibold tabular-nums ${
              metrics.marginLevelPercent >= 300
                ? "text-emerald-400"
                : metrics.marginLevelPercent >= 150
                  ? "text-amber-400"
                  : metrics.marginLevelPercent > 0
                    ? "text-red-400"
                    : "text-zinc-500"
            }`}
          >
            {metrics.marginLevelPercent > 0 ? `${metrics.marginLevelPercent}%` : "—"}
          </span>
        </div>
      </div>
    </section>
  );
}
