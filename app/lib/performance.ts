import { safeApiGet } from "./api";
import type { PaginatedResponse, PerformanceStats, Trade } from "./types";

export type PublishedPerformance = {
  stats: PerformanceStats;
  trades: Trade[];
  totalTrades: number;
};

/**
 * Stats appear only after staff explicitly publish a real track record.
 * Older API versions never send `published`, so their numbers stay hidden.
 */
export async function getPublishedStats(): Promise<PerformanceStats | null> {
  const stats = await safeApiGet<PerformanceStats>("/stats/performance/", 300);
  return stats?.published === true ? stats : null;
}

export async function getPublishedPerformance(limit = 100): Promise<PublishedPerformance | null> {
  const stats = await getPublishedStats();
  if (!stats) return null;
  const trades = await safeApiGet<PaginatedResponse<Trade>>(`/trades/?limit=${limit}`, 300);
  return {
    stats,
    trades: trades?.results ?? [],
    totalTrades: trades?.count ?? stats.trades_executed,
  };
}

export type TradeSummary = {
  total: number;
  wins: number;
  losses: number;
  winRate: number;
  netPips: number;
  averageWin: number;
  averageLoss: number;
  longestWinStreak: number;
  longestLossStreak: number;
  firstClosedAt: string | null;
  lastClosedAt: string | null;
};

/** Everything here is derived from the listed trades, oldest first. */
export function summarizeTrades(trades: Trade[]): TradeSummary {
  const ordered = [...trades].sort(
    (a, b) => new Date(a.closed_at).getTime() - new Date(b.closed_at).getTime()
  );
  const wins = ordered.filter((trade) => trade.pips > 0);
  const losses = ordered.filter((trade) => trade.pips < 0);
  const sum = (list: Trade[]) => list.reduce((total, trade) => total + trade.pips, 0);

  let winStreak = 0;
  let lossStreak = 0;
  let longestWinStreak = 0;
  let longestLossStreak = 0;
  for (const trade of ordered) {
    if (trade.pips > 0) {
      winStreak += 1;
      lossStreak = 0;
    } else if (trade.pips < 0) {
      lossStreak += 1;
      winStreak = 0;
    } else {
      winStreak = 0;
      lossStreak = 0;
    }
    longestWinStreak = Math.max(longestWinStreak, winStreak);
    longestLossStreak = Math.max(longestLossStreak, lossStreak);
  }

  return {
    total: ordered.length,
    wins: wins.length,
    losses: losses.length,
    winRate: ordered.length ? Math.round((wins.length / ordered.length) * 1000) / 10 : 0,
    netPips: sum(ordered),
    averageWin: wins.length ? Math.round((sum(wins) / wins.length) * 10) / 10 : 0,
    averageLoss: losses.length ? Math.round((sum(losses) / losses.length) * 10) / 10 : 0,
    longestWinStreak,
    longestLossStreak,
    firstClosedAt: ordered[0]?.closed_at ?? null,
    lastClosedAt: ordered[ordered.length - 1]?.closed_at ?? null,
  };
}

/** Running total of pips after each closed trade, starting at zero. */
export function cumulativePips(trades: Trade[]): number[] {
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
