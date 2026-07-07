"use client";

import { useMemo } from "react";
import type { ProfitDataPoint } from "../../lib/profitData";

type ProfitChartProps = {
  data: ProfitDataPoint[];
  className?: string;
};

const CHART_WIDTH = 640;
const CHART_HEIGHT = 240;
const PADDING = { top: 16, right: 12, bottom: 32, left: 48 };

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProfitChart({ data, className = "h-60" }: ProfitChartProps) {
  const chart = useMemo(() => {
    if (data.length === 0) {
      return null;
    }

    const values = data.map((point) => point.cumulative);
    const minY = Math.min(0, ...values);
    const maxY = Math.max(...values, 1);
    const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const xForIndex = (index: number) =>
      PADDING.left + (index / Math.max(data.length - 1, 1)) * innerWidth;

    const yForValue = (value: number) => {
      const range = maxY - minY || 1;
      return PADDING.top + innerHeight - ((value - minY) / range) * innerHeight;
    };

    const linePoints = data
      .map((point, index) => `${xForIndex(index)},${yForValue(point.cumulative)}`)
      .join(" ");

    const areaPoints = [
      `${xForIndex(0)},${yForValue(minY)}`,
      ...data.map((point, index) => `${xForIndex(index)},${yForValue(point.cumulative)}`),
      `${xForIndex(data.length - 1)},${yForValue(minY)}`,
    ].join(" ");

    const yTicks = [minY, (minY + maxY) / 2, maxY];
    const xLabelIndices =
      data.length <= 4
        ? data.map((_, index) => index)
        : [0, Math.floor(data.length / 2), data.length - 1];

    return {
      linePoints,
      areaPoints,
      yTicks,
      xLabelIndices,
      xForIndex,
      yForValue,
      maxY,
      minY,
    };
  }, [data]);

  if (!chart || data.length === 0) {
    return (
      <div className={`flex items-center justify-center text-sm text-zinc-500 ${className}`}>
        No profit data for this period.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className={`w-full min-w-[320px] ${className}`}
        role="img"
        aria-label="Profit performance chart"
      >
        <defs>
          <linearGradient id="profit-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {chart.yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING.left}
              x2={CHART_WIDTH - PADDING.right}
              y1={chart.yForValue(tick)}
              y2={chart.yForValue(tick)}
              stroke="rgb(39 39 42)"
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 8}
              y={chart.yForValue(tick) + 4}
              textAnchor="end"
              className="fill-zinc-500 text-[10px]"
            >
              {formatCurrency(tick)}
            </text>
          </g>
        ))}

        <polygon points={chart.areaPoints} fill="url(#profit-area)" />
        <polyline
          points={chart.linePoints}
          fill="none"
          stroke="rgb(52 211 153)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((point, index) => (
          <circle
            key={point.date}
            cx={chart.xForIndex(index)}
            cy={chart.yForValue(point.cumulative)}
            r={data.length <= 12 ? 3 : 0}
            fill="rgb(52 211 153)"
          />
        ))}

        {chart.xLabelIndices.map((index) => (
          <text
            key={data[index].date}
            x={chart.xForIndex(index)}
            y={CHART_HEIGHT - 8}
            textAnchor="middle"
            className="fill-zinc-500 text-[10px]"
          >
            {data[index].label}
          </text>
        ))}
      </svg>
    </div>
  );
}
