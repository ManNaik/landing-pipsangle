"use client";

import { useMemo, useState } from "react";
import type { EquityPoint, PerformanceSource } from "../../lib/performanceReport";
import { formatUsd } from "../../lib/performanceReport";

const WIDTH = 720;
const HEIGHT = 280;
const PAD = { top: 18, right: 16, bottom: 32, left: 56 };

type EquityChartProps = {
  points: EquityPoint[];
  source: PerformanceSource;
  unit: "usd" | "pips";
};

export function EquityChart({ points, source, unit }: EquityChartProps) {
  const [active, setActive] = useState<number | null>(null);

  const chart = useMemo(() => {
    if (points.length < 2) return null;
    const values = points.map((p) => p.equity);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const innerW = WIDTH - PAD.left - PAD.right;
    const innerH = HEIGHT - PAD.top - PAD.bottom;
    const x = (i: number) => PAD.left + (i / (points.length - 1)) * innerW;
    const y = (v: number) => PAD.top + innerH - ((v - min) / range) * innerH;
    const d = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(p.equity).toFixed(1)}`)
      .join(" ");
    const ticks = [min, (min + max) / 2, max];
    return { d, x, y, ticks, min, max };
  }, [points]);

  if (!chart) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-zinc-500">
        Equity data will appear as trades are recorded.
      </div>
    );
  }

  const hover = active !== null ? points[active] : null;
  const formatValue = (value: number) =>
    unit === "usd" ? formatUsd(value).replace("+", "") : `${value.toFixed(0)} pips`;

  return (
    <div className="relative">
      {source === "demo" && (
        <span className="absolute right-3 top-3 z-10 rounded-md border border-white/[0.08] bg-black/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Demo Data
        </span>
      )}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-[240px] w-full sm:h-[280px]"
        onMouseLeave={() => setActive(null)}
        role="img"
        aria-label="Account equity curve"
      >
        {chart.ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={chart.y(tick)}
              y2={chart.y(tick)}
              stroke="rgba(255,255,255,0.05)"
            />
            <text
              x={PAD.left - 8}
              y={chart.y(tick) + 3}
              textAnchor="end"
              className="fill-zinc-600"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
            >
              {formatValue(tick)}
            </text>
          </g>
        ))}
        <path
          d={chart.d}
          fill="none"
          stroke="rgb(16 185 129)"
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          className="perf-equity-line"
        />
        {points.map((point, index) => (
          <rect
            key={point.date}
            x={chart.x(index) - innerHit(points.length)}
            y={PAD.top}
            width={innerHit(points.length) * 2}
            height={HEIGHT - PAD.top - PAD.bottom}
            fill="transparent"
            onMouseEnter={() => setActive(index)}
          />
        ))}
        {hover && active !== null && (
          <g>
            <line
              x1={chart.x(active)}
              x2={chart.x(active)}
              y1={PAD.top}
              y2={HEIGHT - PAD.bottom}
              stroke="rgba(16,185,129,0.35)"
            />
            <circle
              cx={chart.x(active)}
              cy={chart.y(hover.equity)}
              r="3.5"
              fill="rgb(16 185 129)"
            />
          </g>
        )}
        <text
          x={PAD.left}
          y={HEIGHT - 10}
          className="fill-zinc-600"
          fontSize="10"
        >
          {points[0]?.label}
        </text>
        <text
          x={WIDTH - PAD.right}
          y={HEIGHT - 10}
          textAnchor="end"
          className="fill-zinc-600"
          fontSize="10"
        >
          {points[points.length - 1]?.label}
        </text>
      </svg>
      {hover && (
        <div className="pointer-events-none absolute right-4 top-12 rounded-lg border border-white/[0.08] bg-[#0A0A0C] px-3 py-2 text-xs">
          <p className="text-zinc-500">{hover.label}</p>
          <p className="mt-1 font-mono text-white">{formatValue(hover.equity)}</p>
          <p
            className={`mt-0.5 font-mono ${
              hover.change >= 0 ? "text-emerald-400" : "text-zinc-400"
            }`}
          >
            {unit === "usd" ? formatUsd(hover.change) : `${hover.change >= 0 ? "+" : ""}${hover.change} pips`}
          </p>
        </div>
      )}
    </div>
  );
}

function innerHit(count: number): number {
  return Math.max(6, (WIDTH - PAD.left - PAD.right) / count / 2);
}
