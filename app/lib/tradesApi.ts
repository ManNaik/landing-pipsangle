import type { ProfitDataPoint, ProfitPeriod } from "./profitData";
import type { ExecutedTrade, PaginatedResponse } from "./types";
import { userGet } from "./userApi";

export type TradeStats = {
  total: number;
  live: number;
  closed: number;
  totalPnl: number;
  wins: number;
  losses: number;
  pairs: number;
};

type TradeStatsResponse = {
  total: number;
  live: number;
  closed: number;
  total_pnl: number;
  wins: number;
  losses: number;
  pairs: number;
};

type ProfitPointResponse = {
  label: string;
  date: string;
  profit: number;
  cumulative: number;
};

type ProfitResponse = {
  all_time_profit: number;
  base_equity: number;
  results: ProfitPointResponse[];
};

export function mapTradeStats(data: TradeStatsResponse): TradeStats {
  return {
    total: data.total,
    live: data.live,
    closed: data.closed,
    totalPnl: data.total_pnl,
    wins: data.wins,
    losses: data.losses,
    pairs: data.pairs,
  };
}

export function mapProfitResults(
  data: ProfitResponse
): { points: ProfitDataPoint[]; allTimeProfit: number; baseEquity: number } {
  let peakEquity = data.base_equity;
  const points: ProfitDataPoint[] = data.results.map((point) => {
    const equity = Math.round((data.base_equity + point.cumulative) * 100) / 100;
    peakEquity = Math.max(peakEquity, equity);
    const drawdownPercent =
      peakEquity > 0
        ? Math.round(((peakEquity - equity) / peakEquity) * 1000) / 10
        : 0;

    return {
      label: point.label,
      date: point.date,
      profit: point.profit,
      cumulative: point.cumulative,
      equity,
      drawdownPercent,
    };
  });

  return {
    points,
    allTimeProfit: data.all_time_profit,
    baseEquity: data.base_equity,
  };
}

export async function fetchTrades(
  page = 1,
  pageSize = 10,
  status?: string,
  range?: { from: string; to: string }
): Promise<PaginatedResponse<ExecutedTrade>> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  if (status) params.set("status", status);
  if (range?.from) params.set("from", range.from);
  if (range?.to) params.set("to", range.to);
  return userGet<PaginatedResponse<ExecutedTrade>>(`/me/trades/?${params.toString()}`);
}

export async function fetchOpenTrades(): Promise<ExecutedTrade[]> {
  const data = await userGet<{ results: ExecutedTrade[] }>("/me/trades/open/");
  return data.results;
}

export async function fetchTradeStats(): Promise<TradeStats> {
  const data = await userGet<TradeStatsResponse>("/me/trades/stats/");
  return mapTradeStats(data);
}

export async function fetchProfit(
  period: ProfitPeriod,
  custom?: { from: string; to: string }
): Promise<{ points: ProfitDataPoint[]; allTimeProfit: number; baseEquity: number }> {
  const params = new URLSearchParams({ period });
  if (period === "custom" && custom) {
    params.set("from", custom.from);
    params.set("to", custom.to);
  }
  const data = await userGet<ProfitResponse>(`/me/profit/?${params.toString()}`);
  return mapProfitResults(data);
}
