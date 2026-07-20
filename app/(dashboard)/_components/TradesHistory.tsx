"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  formatDateTime,
  formatExecutedTradeProfitLabel,
  formatExecutedTradeStatus,
  formatSignedCurrency,
  isLiveExecutedTrade,
} from "../../lib/format";
import {
  computeTradeStats,
  filterTradesByRange,
  formatTradeHistoryRangeLabel,
  getLifetimeTrades,
  getTradeHistoryRange,
  TRADES_PAGE_SIZE,
  type TradeHistoryRangePreset,
} from "../../lib/tradesHistoryData";
import { fetchTrades } from "../../lib/tradesApi";
import { isMockApiEnabled } from "../../lib/mockData";
import { useTradeStats } from "../../lib/useTrades";
import type { ExecutedTrade, ExecutedTradeStatus } from "../../lib/types";

type TradeFilter = "all" | "live" | "closed";
type SortOrder = "newest" | "oldest";

const FILTER_OPTIONS: { value: TradeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "closed", label: "Closed" },
];

const RANGE_OPTIONS: { value: TradeHistoryRangePreset; label: string }[] = [
  { value: "all", label: "All time" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
  { value: "custom", label: "Custom" },
];

function defaultCustomDates() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

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
  const [rangePreset, setRangePreset] = useState<TradeHistoryRangePreset>("all");
  const [customDates, setCustomDates] = useState(defaultCustomDates);
  const [apiTrades, setApiTrades] = useState<ExecutedTrade[]>([]);
  const [apiCount, setApiCount] = useState(0);
  const [loading, setLoading] = useState(!isMockApiEnabled());

  const { stats: apiStats } = useTradeStats();

  const selectedRange = useMemo(
    () =>
      getTradeHistoryRange(
        rangePreset,
        rangePreset === "custom" ? customDates : undefined
      ),
    [rangePreset, customDates]
  );

  const rangeLabel = formatTradeHistoryRangeLabel(rangePreset, selectedRange);

  const rangeQuery = useMemo(() => {
    if (!selectedRange) return undefined;
    return {
      from: selectedRange.from.toISOString().slice(0, 10),
      to: selectedRange.to.toISOString().slice(0, 10),
    };
  }, [selectedRange]);

  const pageFromUrl = Math.max(1, Number(searchParams.get("page")) || 1);

  useEffect(() => {
    if (isMockApiEnabled()) return;

    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const status =
          filter === "live" ? "open" : filter === "closed" ? "closed" : undefined;
        const data = await fetchTrades(pageFromUrl, TRADES_PAGE_SIZE, status, rangeQuery);
        if (!cancelled) {
          setApiTrades(data.results);
          setApiCount(data.count);
        }
      } catch {
        if (!cancelled) {
          setApiTrades([]);
          setApiCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [filter, pageFromUrl, rangeQuery]);

  const allTrades = isMockApiEnabled() ? getLifetimeTrades() : apiTrades;

  const rangeTrades = useMemo(() => {
    if (rangePreset === "all") return allTrades;
    return filterTradesByRange(allTrades, selectedRange);
  }, [allTrades, rangePreset, selectedRange]);

  const stats = useMemo(() => {
    if (isMockApiEnabled() || rangePreset !== "all") {
      return computeTradeStats(rangeTrades);
    }

    if (!apiStats) {
      return computeTradeStats([]);
    }

    return {
      total: apiStats.total,
      live: apiStats.live,
      closed: apiStats.closed,
      totalPnl: apiStats.totalPnl,
      wins: apiStats.wins,
      losses: apiStats.losses,
    };
  }, [apiStats, rangeTrades, rangePreset]);

  const filteredTrades = useMemo(() => {
    const list =
      filter === "live"
        ? rangeTrades.filter((trade) => isLiveExecutedTrade(trade.status))
        : filter === "closed"
          ? rangeTrades.filter((trade) => trade.status === "closed")
          : rangeTrades;

    return [...list].sort((a, b) => {
      const aLive = isLiveExecutedTrade(a.status) ? 1 : 0;
      const bLive = isLiveExecutedTrade(b.status) ? 1 : 0;
      if (sortOrder === "newest" && aLive !== bLive) return bLive - aLive;

      const diff =
        new Date(a.executed_at).getTime() - new Date(b.executed_at).getTime();
      return sortOrder === "newest" ? -diff : diff;
    });
  }, [rangeTrades, filter, sortOrder]);

  const totalPages = isMockApiEnabled()
    ? Math.max(1, Math.ceil(filteredTrades.length / TRADES_PAGE_SIZE))
    : Math.max(1, Math.ceil(apiCount / TRADES_PAGE_SIZE));
  const currentPage = Math.min(pageFromUrl, totalPages);

  const paginatedTrades = useMemo(() => {
    if (!isMockApiEnabled()) return filteredTrades;
    const start = (currentPage - 1) * TRADES_PAGE_SIZE;
    return filteredTrades.slice(start, start + TRADES_PAGE_SIZE);
  }, [filteredTrades, currentPage]);

  const rangeStart =
    (isMockApiEnabled() ? filteredTrades.length : apiCount) === 0
      ? 0
      : (currentPage - 1) * TRADES_PAGE_SIZE + 1;
  const rangeEnd = isMockApiEnabled()
    ? Math.min(currentPage * TRADES_PAGE_SIZE, filteredTrades.length)
    : Math.min(currentPage * TRADES_PAGE_SIZE, apiCount);

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

  const handleRangeChange = (next: TradeHistoryRangePreset) => {
    setRangePreset(next);
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

  const paginationFooter = (
    <div className="flex flex-col gap-3 border-t border-zinc-800/80 bg-zinc-900/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-zinc-500">
        Showing {rangeStart}–{rangeEnd} of {isMockApiEnabled() ? filteredTrades.length : apiCount} trades
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
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:gap-5">
      <div>
        <p className="text-sm text-zinc-500">Account activity</p>
        <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Trade history
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Executed trades for your connected account
          {rangePreset !== "all" && (
            <span className="text-zinc-500"> · {rangeLabel}</span>
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-zinc-900/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Date range
          </p>
          <p className="mt-0.5 text-sm text-zinc-300">{rangeLabel}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleRangeChange(option.value)}
              className={`rounded-lg px-2.5 py-1 text-sm transition ${
                rangePreset === option.value
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {rangePreset === "custom" && (
        <div className="flex flex-wrap items-end gap-3 rounded-2xl bg-zinc-900/30 px-4 py-3 sm:px-5">
          <label className="flex flex-col gap-1 text-xs text-zinc-500">
            From
            <input
              type="date"
              value={customDates.from}
              max={customDates.to}
              onChange={(event) => {
                setCustomDates((current) => ({
                  ...current,
                  from: event.target.value,
                }));
                setPage(1);
              }}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-1 ring-zinc-800 focus:ring-emerald-500/40"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-zinc-500">
            To
            <input
              type="date"
              value={customDates.to}
              min={customDates.from}
              onChange={(event) => {
                setCustomDates((current) => ({
                  ...current,
                  to: event.target.value,
                }));
                setPage(1);
              }}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 outline-none ring-1 ring-zinc-800 focus:ring-emerald-500/40"
            />
          </label>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-zinc-900/40 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            {rangePreset === "all" ? "Total trades" : "Trades in range"}
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
            {rangePreset === "all" ? "Lifetime P/L" : "Period P/L"}
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

        {loading ? (
          <p className="mt-6 rounded-xl bg-zinc-900/40 px-4 py-8 text-center text-sm text-zinc-500">
            Loading trades…
          </p>
        ) : filteredTrades.length === 0 ? (
          <p className="mt-6 rounded-xl bg-zinc-900/40 px-4 py-8 text-center text-sm text-zinc-500">
            No {filter === "live" ? "live" : filter === "closed" ? "closed" : ""} trades
            {rangePreset !== "all" ? ` in ${rangeLabel.toLowerCase()}` : ""} to show.
          </p>
        ) : (
          <div className="mt-4 hidden overflow-hidden rounded-xl border border-zinc-800/80 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="bg-zinc-900/50">
                  <tr className="border-b border-zinc-800/80 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    <th className="px-4 py-3 font-medium">Pair</th>
                    <th className="px-4 py-3 font-medium">Direction</th>
                    <th className="px-4 py-3 font-medium">Entry</th>
                    <th className="px-4 py-3 font-medium">Exit / Current</th>
                    <th className="px-4 py-3 font-medium">P/L</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTrades.map((trade) => {
                    const live = isLiveExecutedTrade(trade.status);
                    return (
                      <tr
                        key={trade.id}
                        className={`border-b border-zinc-800/60 last:border-b-0 ${
                          live ? "bg-emerald-500/[0.04]" : "hover:bg-zinc-800/30"
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-white">
                          {trade.pair}
                        </td>
                        <td
                          className={`px-4 py-3 font-medium ${
                            trade.direction === "BUY"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {trade.direction}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-zinc-300">
                          {trade.entry}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-zinc-300">
                          {exitOrCurrentPrice(trade)}
                        </td>
                        <td
                          className={`px-4 py-3 font-semibold tabular-nums ${
                            trade.profit_loss >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {formatSignedCurrency(trade.profit_loss)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusBadgeClass(trade.status)}`}
                          >
                            {live && <LivePulseDot />}
                            {formatExecutedTradeStatus(trade.status)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                          {formatDateTime(trade.executed_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {paginationFooter}
          </div>
        )}

        {filteredTrades.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800/80 md:hidden">
            <div className="space-y-2 p-3">
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
            {paginationFooter}
          </div>
        )}
      </section>
    </div>
  );
}
