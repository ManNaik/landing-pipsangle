"use client";

import { useMemo, useState } from "react";
import {
  formatDateTime,
  formatExecutedTradeProfitLabel,
  formatExecutedTradeStatus,
  formatSignedCurrency,
  isLiveExecutedTrade,
} from "../../lib/format";
import type { ExecutedTrade, ExecutedTradeStatus } from "../../lib/types";

type ExecutedTradesListProps = {
  trades: ExecutedTrade[];
};

type TradeFilter = "all" | "live" | "closed";

const FILTER_OPTIONS: { value: TradeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "closed", label: "Closed" },
];

function statusBadgeClass(status: ExecutedTradeStatus): string {
  switch (status) {
    case "open":
      return "bg-emerald-500/15 text-emerald-400";
    case "closed":
      return "bg-zinc-800 text-zinc-300";
    case "cancelled":
      return "bg-zinc-800/80 text-zinc-500";
    default:
      return "bg-zinc-800 text-zinc-300";
  }
}

function LivePulseDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
    </span>
  );
}

function formatPriceLine(trade: ExecutedTrade): string {
  if (isLiveExecutedTrade(trade.status)) {
    const current = trade.current_price ?? "—";
    return `Entry ${trade.entry} · Now ${current}`;
  }
  if (trade.exit) {
    return `Entry ${trade.entry} · Exit ${trade.exit}`;
  }
  return `Entry ${trade.entry}`;
}

export function ExecutedTradesList({ trades }: ExecutedTradesListProps) {
  const [filter, setFilter] = useState<TradeFilter>("all");

  const filteredTrades = useMemo(() => {
    const list =
      filter === "live"
        ? trades.filter((trade) => isLiveExecutedTrade(trade.status))
        : filter === "closed"
          ? trades.filter((trade) => trade.status === "closed")
          : trades;

    return [...list].sort((a, b) => {
      const aLive = isLiveExecutedTrade(a.status) ? 1 : 0;
      const bLive = isLiveExecutedTrade(b.status) ? 1 : 0;
      if (aLive !== bLive) return bLive - aLive;
      return new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime();
    });
  }, [trades, filter]);

  const liveCount = trades.filter((trade) => isLiveExecutedTrade(trade.status)).length;

  return (
    <section className="flex h-[26rem] min-w-0 flex-col gap-3 sm:h-[30rem]">
      <div className="shrink-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-medium text-white">Executed trades</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              Trades placed in your connected account
              {liveCount > 0 && (
                <span className="text-emerald-400/80">
                  {" "}
                  · {liveCount} live position{liveCount === 1 ? "" : "s"}
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`rounded-lg px-2.5 py-1 text-sm transition ${
                  filter === option.value
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="scrollbar-subtle min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {filteredTrades.length === 0 ? (
          <p className="rounded-xl bg-zinc-900/40 px-4 py-6 text-center text-sm text-zinc-500">
            No {filter === "live" ? "live" : filter === "closed" ? "closed" : ""} trades
            to show.
          </p>
        ) : (
          filteredTrades.map((trade) => {
            const live = isLiveExecutedTrade(trade.status);

            return (
              <article
                key={trade.id}
                className={`rounded-xl px-4 py-3.5 ${
                  live
                    ? "bg-emerald-500/[0.06] ring-1 ring-emerald-500/20"
                    : "bg-zinc-900/40"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium text-white">
                      {trade.pair}{" "}
                      <span
                        className={
                          trade.direction === "BUY"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      >
                        {trade.direction}
                      </span>
                    </p>
                    <p className="text-xs tabular-nums text-zinc-400">
                      {formatPriceLine(trade)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusBadgeClass(trade.status)}`}
                    >
                      {live && <LivePulseDot />}
                      {formatExecutedTradeStatus(trade.status)}
                    </span>
                    <div className="text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                        {formatExecutedTradeProfitLabel(trade.status)}
                      </p>
                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          trade.profit_loss >= 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {formatSignedCurrency(trade.profit_loss)}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-zinc-500">
                  {live ? "Opened" : "Executed"} {formatDateTime(trade.executed_at)}
                </p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
