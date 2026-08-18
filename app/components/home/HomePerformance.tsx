"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Trade } from "../../lib/types";

type HomePerformanceProps = {
  winRate: number | null;
  totalTrades: string | null;
  trades: Trade[];
};

function buildCurve(trades: Trade[]): number[] {
  const ordered = [...trades].sort(
    (a, b) => new Date(a.closed_at).getTime() - new Date(b.closed_at).getTime()
  );
  const points = [0];
  let running = 0;
  for (const trade of ordered) {
    running += trade.pips;
    points.push(running);
  }
  return points;
}

function toPath(values: number[], width: number, height: number): string {
  if (values.length < 2) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - min) / span) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function HomePerformance({ winRate, totalTrades, trades }: HomePerformanceProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const netPips = trades.length
    ? trades.reduce((sum, trade) => sum + trade.pips, 0)
    : null;
  const hasMetrics = winRate !== null || totalTrades !== null || netPips !== null;
  const curve = useMemo(() => buildCurve(trades), [trades]);
  const path = toPath(curve, 640, 120);
  const canChart = curve.length >= 2 && path.length > 0;

  return (
    <section className="border-b border-zinc-800 bg-[#080808] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-500/80">
              Performance
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              See How the System Has Performed
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Review recorded trading activity and performance data with
              transparent reporting.
            </p>
          </div>
          <Link
            href="/trading-performance"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            View Full Performance
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div
          ref={panelRef}
          className={`mt-8 overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0C0C0E] p-5 sm:p-6 ${
            inView ? "home-perf-in" : ""
          }`}
        >
          {hasMetrics ? (
            <div className="grid grid-cols-1 gap-4 border-b border-white/[0.06] pb-5 sm:grid-cols-3">
              {winRate !== null && (
                <Metric label="Win Rate" value={`${winRate}%`} />
              )}
              {totalTrades !== null && (
                <Metric label="Total Trades" value={totalTrades} />
              )}
              {netPips !== null && (
                <Metric
                  label="Net Result"
                  value={`${netPips > 0 ? "+" : ""}${netPips} pips`}
                  emphasize={netPips >= 0}
                />
              )}
            </div>
          ) : (
            <div className="border-b border-white/[0.06] pb-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Performance Data
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Results will appear as trades are recorded.
              </p>
            </div>
          )}

          <div className="relative mt-5 h-[140px] sm:h-[160px]">
            {canChart ? (
              <svg
                viewBox="0 0 640 120"
                preserveAspectRatio="none"
                className="h-full w-full"
                aria-hidden
              >
                {[30, 60, 90].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    x2="640"
                    y1={y}
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                ))}
                <path
                  d={path}
                  fill="none"
                  stroke="rgb(16 185 129)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  pathLength={1}
                  className={reduceMotion || !inView ? undefined : "home-perf-line"}
                />
              </svg>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-sm text-zinc-500">
                  Live performance data
                  <span className="mt-1 block text-xs text-zinc-600">
                    Updating from recorded trades.
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="home-perf-metric">
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1.5 font-mono text-xl sm:text-2xl ${
          emphasize ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
