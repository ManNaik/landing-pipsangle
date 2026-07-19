"use client";

import { useMemo, useState } from "react";
import type { ProfitDataPoint } from "../../lib/profitData";

type ProfitChartProps = {
  data: ProfitDataPoint[];
  className?: string;
};

const CHART_WIDTH = 720;
const CHART_HEIGHT = 280;
const PADDING = { top: 20, right: 16, bottom: 36, left: 52 };

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function ProfitChart({ data, className = "h-64" }: ProfitChartProps) {
  const [showDrawdown, setShowDrawdown] = useState(false);

  const chart = useMemo(() => {
    if (data.length === 0) {
      return null;
    }

    const equityValues = data.map((point) => point.equity);
    const drawdownValues = data.map((point) => point.drawdownPercent);
    const minEquity = Math.min(...equityValues) * 0.998;
    const maxEquity = Math.max(...equityValues) * 1.002;
    const maxDrawdown = Math.max(...drawdownValues, 1);
    const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const xForIndex = (index: number) =>
      PADDING.left + (index / Math.max(data.length - 1, 1)) * innerWidth;

    const yForEquity = (value: number) => {
      const range = maxEquity - minEquity || 1;
      return PADDING.top + innerHeight - ((value - minEquity) / range) * innerHeight;
    };

    const yForDrawdown = (value: number) => {
      const range = maxDrawdown || 1;
      return PADDING.top + innerHeight - (value / range) * innerHeight * 0.45;
    };

    const equityLinePoints = data
      .map((point, index) => `${xForIndex(index)},${yForEquity(point.equity)}`)
      .join(" ");

    const equityAreaPoints = [
      `${xForIndex(0)},${yForEquity(minEquity)}`,
      ...data.map((point, index) => `${xForIndex(index)},${yForEquity(point.equity)}`),
      `${xForIndex(data.length - 1)},${yForEquity(minEquity)}`,
    ].join(" ");

    const drawdownAreaPoints = [
      `${xForIndex(0)},${yForDrawdown(0)}`,
      ...data.map((point, index) => `${xForIndex(index)},${yForDrawdown(point.drawdownPercent)}`),
      `${xForIndex(data.length - 1)},${yForDrawdown(0)}`,
    ].join(" ");

    const yTicks = [minEquity, (minEquity + maxEquity) / 2, maxEquity];
    const xLabelIndices =
      data.length <= 4
        ? data.map((_, index) => index)
        : [0, Math.floor(data.length / 2), data.length - 1];

    return {
      equityLinePoints,
      equityAreaPoints,
      drawdownAreaPoints,
      yTicks,
      xLabelIndices,
      xForIndex,
      yForEquity,
      yForDrawdown,
      maxDrawdown,
    };
  }, [data]);

  if (!chart || data.length === 0) {
    return (
      <div className={`flex items-center justify-center text-sm text-zinc-500 ${className}`}>
        No profit data for this period.
      </div>
    );
  }

  const currentDrawdown = data[data.length - 1]?.drawdownPercent ?? 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Equity curve
          </p>
          {showDrawdown && (
            <p className="mt-0.5 text-xs text-amber-400/80">
              Current drawdown: {formatPercent(currentDrawdown)}
            </p>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={showDrawdown}
          onClick={() => setShowDrawdown((current) => !current)}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            showDrawdown
              ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25"
              : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${showDrawdown ? "bg-amber-400" : "bg-zinc-500"}`}
            aria-hidden
          />
          Show drawdown
        </button>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className={`w-full min-w-[320px] ${className}`}
          role="img"
          aria-label="Profit performance chart with optional drawdown overlay"
        >
          <defs>
            <linearGradient id="profit-equity-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="profit-drawdown-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(245 158 11)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="rgb(245 158 11)" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {chart.yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={CHART_WIDTH - PADDING.right}
                y1={chart.yForEquity(tick)}
                y2={chart.yForEquity(tick)}
                stroke="rgb(39 39 42)"
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 8}
                y={chart.yForEquity(tick) + 4}
                textAnchor="end"
                className="fill-zinc-500 text-[10px]"
              >
                {formatCurrency(tick)}
              </text>
            </g>
          ))}

          {showDrawdown && (
            <>
              <polygon points={chart.drawdownAreaPoints} fill="url(#profit-drawdown-area)" />
              <polyline
                points={data
                  .map(
                    (point, index) =>
                      `${chart.xForIndex(index)},${chart.yForDrawdown(point.drawdownPercent)}`
                  )
                  .join(" ")}
                fill="none"
                stroke="rgb(251 191 36)"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity={0.85}
              />
            </>
          )}

          <polygon points={chart.equityAreaPoints} fill="url(#profit-equity-area)" />
          <polyline
            points={chart.equityLinePoints}
            fill="none"
            stroke="rgb(52 211 153)"
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {chart.xLabelIndices.map((index) => (
            <text
              key={data[index].date}
              x={chart.xForIndex(index)}
              y={CHART_HEIGHT - 10}
              textAnchor="middle"
              className="fill-zinc-500 text-[10px]"
            >
              {data[index].label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
