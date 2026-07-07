"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formatDateTime,
  formatExecutedTradeProfitLabel,
  formatExecutedTradeStatus,
  formatSignedCurrency,
  isLiveExecutedTrade,
} from "../../lib/format";
import {
  getLifetimeTradeStats,
  getLifetimeTrades,
  TRADES_PAGE_SIZE,
} from "../../lib/tradesHistoryData";
import type { ExecutedTrade, ExecutedTradeStatus } from "../../lib/types";

type TradeFilter = "all" | "live" | "closed";
type SortOrder = "newest" | "oldest";

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

function exitOrCurrentPrice(trade: ExecutedTrade): string {
  if (isLiveExecutedTrade(trade.status)) {
    return trade.current_price ?? "—";
  }
  return trade.exit ?? "—";
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function TradesHistory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<TradeFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const stats = getLifetimeTradeStats();
  const allTrades = getLifetimeTrades();

  const pageFromUrl = Math.max(1, Number(searchParams.get("page")) || 1);

  const filteredTrades = useMemo(() => {
    const list =
      filter === "live"
        ? allTrades.filter((trade) => isLiveExecutedTrade(trade.status))
        : filter === "closed"
          ? allTrades.filter((trade) => trade.status === "closed")
          : allTrades;

    return [...list].sort((a, b) => {
      const aLive = isLiveExecutedTrade(a.status) ? 1 : 0;
      const bLive = isLiveExecutedTrade(b.status) ? 1 : 0;
      if (sortOrder === "newest" && aLive !== bLive) return bLive - aLive;

      const diff =
        new Date(a.executed_at).getTime() - new Date(b.executed_at).getTime();
      return sortOrder === "newest" ? -diff : diff;
    });
  }, [allTrades, filter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredTrades.length / TRADES_PAGE_SIZE));
  const currentPage = Math.min(pageFromUrl, totalPages);

  const paginatedTrades = useMemo(() => {
    const start = (currentPage - 1) * TRADES_PAGE_SIZE;
    return filteredTrades.slice(start, start + TRADES_PAGE_SIZE);
  }, [filteredTrades, currentPage]);

  const rangeStart =
    filteredTrades.length === 0 ? 0 : (currentPage - 1) * TRADES_PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * TRADES_PAGE_SIZE, filteredTrades.length);

  const setPage = useCallback(
    (page: number) => {
      const next = Math.max(1, Math.min(page, totalPages));
      const params = new URLSearchParams(searchParams.toString());
      if (next === 1) {
        params.delete("page");
      } else {
        params.set("page", String(next));
      }
      const query = params.toString();
      router.replace(query ? `/trades?${query}` : "/trades", { scroll: false });
    },
    [router, searchParams, totalPages]
  );

  const handleFilterChange = (next: TradeFilter) => {
    setFilter(next);
    setPage(1);
  };

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:gap-5">
      <div>
        <p className="text-sm text-zinc-500">Account activity</p>
        <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Trade history
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          All lifetime executed trades on your connected account
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-zinc-900/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Total trades
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
            {stats.total}
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-900/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Live positions
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-400">
            {stats.live}
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-900/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Win / loss
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
            <span className="text-emerald-400">{stats.wins}</span>
            <span className="text-zinc-600"> / </span>
            <span className="text-red-400">{stats.losses}</span>
          </p>
        </div>
        <div className="rounded-2xl bg-zinc-900/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Lifetime P/L
          </p>
          <p
            className={`mt-1 text-2xl font-semibold tabular-nums ${
              stats.totalPnl >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {formatCurrency(stats.totalPnl)}
          </p>
        </div>
      </div>

      <section className="min-w-0 rounded-2xl bg-zinc-900/30 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFilterChange(option.value)}
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

          <button
            type="button"
            onClick={() =>
              setSortOrder((current) => (current === "newest" ? "oldest" : "newest"))
            }
            className="self-start rounded-lg px-2.5 py-1 text-sm text-zinc-400 transition hover:bg-zinc-800/80 hover:text-zinc-200 sm:self-auto"
          >
            Date: {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </button>
        </div>

        {filteredTrades.length === 0 ? (
          <p className="mt-6 rounded-xl bg-zinc-900/40 px-4 py-8 text-center text-sm text-zinc-500">
            No {filter === "live" ? "live" : filter === "closed" ? "closed" : ""} trades
            to show.
          </p>
        ) : (
          <>
            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/80 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    <th className="pb-3 pr-4 font-medium">Pair</th>
                    <th className="pb-3 pr-4 font-medium">Direction</th>
                    <th className="pb-3 pr-4 font-medium">Entry</th>
                    <th className="pb-3 pr-4 font-medium">Exit / Current</th>
                    <th className="pb-3 pr-4 font-medium">P/L</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {paginatedTrades.map((trade) => {
                    const live = isLiveExecutedTrade(trade.status);
                    return (
                      <tr
                        key={trade.id}
                        className={
                          live ? "bg-emerald-500/[0.04]" : "hover:bg-zinc-800/30"
                        }
                      >
                        <td className="py-3 pr-4 font-medium text-white">
                          {trade.pair}
                        </td>
                        <td
                          className={`py-3 pr-4 font-medium ${
                            trade.direction === "BUY"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {trade.direction}
                        </td>
                        <td className="py-3 pr-4 tabular-nums text-zinc-300">
                          {trade.entry}
                        </td>
                        <td className="py-3 pr-4 tabular-nums text-zinc-300">
                          {exitOrCurrentPrice(trade)}
                        </td>
                        <td
                          className={`py-3 pr-4 font-semibold tabular-nums ${
                            trade.profit_loss >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatSignedCurrency(trade.profit_loss)}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusBadgeClass(trade.status)}`}
                          >
                            {live && <LivePulseDot />}
                            {formatExecutedTradeStatus(trade.status)}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-400">
                          {formatDateTime(trade.executed_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-2 md:hidden">
              {paginatedTrades.map((trade) => {
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
                          Entry {trade.entry} ·{" "}
                          {live ? "Now" : "Exit"} {exitOrCurrentPrice(trade)}
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
              })}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-zinc-800/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-zinc-500">
                Showing {rangeStart}–{rangeEnd} of {filteredTrades.length} trades
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="rounded-lg px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-800/80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setPage(page)}
                    className={`min-w-[2rem] rounded-lg px-2.5 py-1.5 text-sm transition ${
                      page === currentPage
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="rounded-lg px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-800/80 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
