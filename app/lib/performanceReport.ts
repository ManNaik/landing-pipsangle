import type { PerformanceStats, Trade } from "./types";

export type PerformancePeriod = "7D" | "30D" | "90D" | "6M" | "YTD" | "ALL";
export type PerformanceSource = "demo" | "live";

export const PERFORMANCE_PERIODS: { id: PerformancePeriod; label: string }[] = [
  { id: "7D", label: "7D" },
  { id: "30D", label: "30D" },
  { id: "90D", label: "90D" },
  { id: "6M", label: "6M" },
  { id: "YTD", label: "YTD" },
  { id: "ALL", label: "ALL" },
];

export type EquityPoint = {
  date: string;
  label: string;
  equity: number;
  change: number;
};

export type PerformanceTradeRow = {
  id: string;
  symbol: string;
  direction: "BUY" | "SELL";
  entry: string;
  stopLoss: string;
  takeProfit: string;
  exit: string;
  pips: number;
  pnl: number;
  status: "Closed";
};

export type SymbolPerformanceRow = {
  symbol: string;
  trades: number;
  winRate: number;
  netPnl: number;
  averagePips: number;
};

export type PerformanceReport = {
  source: PerformanceSource;
  period: PerformancePeriod;
  periodLabel: string;
  environment: string;
  execution: string;
  pnlUnit: "usd" | "pips";
  startingBalance: number;
  currentBalance: number;
  overview: {
    netReturnPercent: number;
    winRatePercent: number;
    profitFactor: number;
    totalTrades: number;
    maxDrawdownPercent: number;
    netPnl: number;
  };
  pnl: {
    winningTrades: number;
    losingTrades: number;
    averageWin: number;
    averageLoss: number;
    bestTrade: number;
    worstTrade: number;
  };
  tradeStats: {
    averageHoldingTime: string;
    winningStreak: number;
    losingStreak: number;
  };
  risk: {
    averageRiskPerTradePercent: number;
    largestSingleLoss: number;
    maxConsecutiveLosses: number;
  };
  equity: EquityPoint[];
  trades: PerformanceTradeRow[];
  symbols: SymbolPerformanceRow[];
};

const PERIOD_META: Record<
  PerformancePeriod,
  { days: number; label: string; scale: number }
> = {
  "7D": { days: 7, label: "Last 7 Days", scale: 0.32 },
  "30D": { days: 30, label: "Last 30 Days", scale: 1 },
  "90D": { days: 90, label: "Last 90 Days", scale: 1.85 },
  "6M": { days: 180, label: "Last 6 Months", scale: 2.55 },
  YTD: { days: 220, label: "Year to Date", scale: 2.2 },
  ALL: { days: 365, label: "All Available Data", scale: 3.35 },
};

const DEMO_BASE = {
  startingBalance: 10000,
  netReturnPercent: 12.84,
  winRatePercent: 68.4,
  profitFactor: 1.42,
  totalTrades: 148,
  maxDrawdownPercent: 1.8,
  netPnl: 1284,
  winningTrades: 101,
  losingTrades: 47,
  averageWin: 34.6,
  averageLoss: -21.4,
  bestTrade: 126,
  worstTrade: -58,
  averageHoldingTime: "2h 18m",
  winningStreak: 8,
  losingStreak: 3,
  averageRiskPerTradePercent: 1.0,
};

const DEMO_TRADES: PerformanceTradeRow[] = [
  {
    id: "d1",
    symbol: "EUR/USD",
    direction: "BUY",
    entry: "1.08420",
    stopLoss: "1.08220",
    takeProfit: "1.08820",
    exit: "1.08820",
    pips: 40,
    pnl: 80,
    status: "Closed",
  },
  {
    id: "d2",
    symbol: "GBP/USD",
    direction: "SELL",
    entry: "1.27140",
    stopLoss: "1.27340",
    takeProfit: "1.26740",
    exit: "1.26740",
    pips: 40,
    pnl: 80,
    status: "Closed",
  },
  {
    id: "d3",
    symbol: "XAU/USD",
    direction: "BUY",
    entry: "2338.40",
    stopLoss: "2330.40",
    takeProfit: "2354.40",
    exit: "2330.40",
    pips: -80,
    pnl: -80,
    status: "Closed",
  },
  {
    id: "d4",
    symbol: "USD/JPY",
    direction: "SELL",
    entry: "156.240",
    stopLoss: "156.440",
    takeProfit: "155.840",
    exit: "155.840",
    pips: 40,
    pnl: 80,
    status: "Closed",
  },
];

const DEMO_SYMBOLS: SymbolPerformanceRow[] = [
  { symbol: "EUR/USD", trades: 42, winRate: 71.4, netPnl: 428, averagePips: 10.2 },
  { symbol: "GBP/USD", trades: 38, winRate: 68.4, netPnl: 312, averagePips: 8.6 },
  { symbol: "USD/JPY", trades: 36, winRate: 66.7, netPnl: 264, averagePips: 7.4 },
  { symbol: "XAU/USD", trades: 32, winRate: 65.6, netPnl: 280, averagePips: 9.1 },
];

function round(value: number, digits = 2): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

function buildDemoEquity(
  days: number,
  start: number,
  end: number
): EquityPoint[] {
  const points: EquityPoint[] = [];
  const now = new Date();
  let previous = start;

  for (let i = 0; i < days; i += 1) {
    const t = days === 1 ? 1 : i / (days - 1);
    const wave = Math.sin(i / 3.2) * (end - start) * 0.035;
    const equity = round(start + (end - start) * t + wave, 0);
    const date = new Date(now);
    date.setDate(now.getDate() - (days - 1 - i));
    points.push({
      date: date.toISOString(),
      label: formatDayLabel(date),
      equity,
      change: round(equity - previous, 0),
    });
    previous = equity;
  }

  if (points.length > 0) {
    points[points.length - 1].equity = end;
    points[points.length - 1].change = round(
      end - (points[points.length - 2]?.equity ?? start),
      0
    );
  }

  return points;
}

export function getDemoReport(period: PerformancePeriod): PerformanceReport {
  const meta = PERIOD_META[period];
  const scale = meta.scale;
  const netReturnPercent = round(DEMO_BASE.netReturnPercent * scale, 2);
  const startingBalance = DEMO_BASE.startingBalance;
  const currentBalance = round(startingBalance * (1 + netReturnPercent / 100), 0);
  const netPnl = currentBalance - startingBalance;
  const totalTrades = Math.max(12, Math.round(DEMO_BASE.totalTrades * scale));
  const winningTrades = Math.round(totalTrades * (DEMO_BASE.winRatePercent / 100));
  const losingTrades = totalTrades - winningTrades;

  return {
    source: "demo",
    period,
    periodLabel: meta.label,
    environment: "IC Markets MT5",
    execution: "Automated",
    pnlUnit: "usd",
    startingBalance,
    currentBalance,
    overview: {
      netReturnPercent,
      winRatePercent: DEMO_BASE.winRatePercent,
      profitFactor: DEMO_BASE.profitFactor,
      totalTrades,
      maxDrawdownPercent: round(DEMO_BASE.maxDrawdownPercent * Math.min(scale, 1.6), 1),
      netPnl,
    },
    pnl: {
      winningTrades,
      losingTrades,
      averageWin: DEMO_BASE.averageWin,
      averageLoss: DEMO_BASE.averageLoss,
      bestTrade: DEMO_BASE.bestTrade,
      worstTrade: DEMO_BASE.worstTrade,
    },
    tradeStats: {
      averageHoldingTime: DEMO_BASE.averageHoldingTime,
      winningStreak: DEMO_BASE.winningStreak,
      losingStreak: DEMO_BASE.losingStreak,
    },
    risk: {
      averageRiskPerTradePercent: DEMO_BASE.averageRiskPerTradePercent,
      largestSingleLoss: DEMO_BASE.worstTrade,
      maxConsecutiveLosses: DEMO_BASE.losingStreak,
    },
    equity: buildDemoEquity(meta.days, startingBalance, currentBalance),
    trades: DEMO_TRADES,
    symbols: DEMO_SYMBOLS.map((row) => ({
      ...row,
      trades: Math.max(6, Math.round(row.trades * scale)),
      netPnl: round(row.netPnl * scale, 0),
    })),
  };
}

export function hasLivePerformanceData(
  stats: PerformanceStats | null,
  trades: Trade[]
): boolean {
  if (stats && stats.trades_executed > 0 && stats.win_rate_percent > 0) {
    return true;
  }
  return trades.length > 0;
}

function buildLiveEquity(trades: Trade[], start = 10000): EquityPoint[] {
  if (trades.length === 0) return [];
  const ordered = [...trades].sort(
    (a, b) => new Date(a.closed_at).getTime() - new Date(b.closed_at).getTime()
  );
  const points: EquityPoint[] = [];
  let equity = start;
  let previous = start;
  for (const trade of ordered) {
    equity = round(equity + trade.pips, 0);
    const date = new Date(trade.closed_at);
    points.push({
      date: trade.closed_at,
      label: formatDayLabel(date),
      equity,
      change: round(equity - previous, 0),
    });
    previous = equity;
  }
  return points;
}

export function buildLiveReport(
  stats: PerformanceStats | null,
  trades: Trade[],
  period: PerformancePeriod = "30D"
): PerformanceReport {
  const wins = trades.filter((t) => t.result === "profit" || t.pips > 0);
  const losses = trades.filter((t) => t.result === "loss" || t.pips < 0);
  const winPips = wins.reduce((sum, t) => sum + Math.max(t.pips, 0), 0);
  const lossPips = Math.abs(losses.reduce((sum, t) => sum + Math.min(t.pips, 0), 0));
  const netPips = trades.reduce((sum, t) => sum + t.pips, 0);
  const totalTrades = stats?.trades_executed || trades.length;
  const winRate =
    stats?.win_rate_percent ??
    (trades.length ? round((wins.length / trades.length) * 100, 1) : 0);
  const startingBalance = 10000;
  const currentBalance = startingBalance + netPips;
  const profitFactor = lossPips > 0 ? round(winPips / lossPips, 2) : winPips > 0 ? 0 : 0;
  const avgWin = wins.length ? round(winPips / wins.length, 1) : 0;
  const avgLoss = losses.length ? round(-(lossPips / losses.length), 1) : 0;
  const best = trades.length ? Math.max(...trades.map((t) => t.pips)) : 0;
  const worst = trades.length ? Math.min(...trades.map((t) => t.pips)) : 0;

  const bySymbol = new Map<string, Trade[]>();
  for (const trade of trades) {
    const list = bySymbol.get(trade.pair) ?? [];
    list.push(trade);
    bySymbol.set(trade.pair, list);
  }

  return {
    source: "live",
    period,
    periodLabel: PERIOD_META[period].label,
    environment: "IC Markets MT5",
    execution: "Automated",
    pnlUnit: "pips",
    startingBalance,
    currentBalance,
    overview: {
      netReturnPercent: round((netPips / startingBalance) * 100, 2),
      winRatePercent: winRate,
      profitFactor,
      totalTrades,
      maxDrawdownPercent: stats?.max_drawdown_percent ?? 0,
      netPnl: netPips,
    },
    pnl: {
      winningTrades: stats ? Math.round((winRate / 100) * totalTrades) : wins.length,
      losingTrades:
        totalTrades - (stats ? Math.round((winRate / 100) * totalTrades) : wins.length),
      averageWin: avgWin,
      averageLoss: avgLoss,
      bestTrade: best,
      worstTrade: worst,
    },
    tradeStats: {
      averageHoldingTime: "Recorded",
      winningStreak: 0,
      losingStreak: 0,
    },
    risk: {
      averageRiskPerTradePercent: 1,
      largestSingleLoss: worst,
      maxConsecutiveLosses: 0,
    },
    equity: buildLiveEquity(trades, startingBalance),
    trades: trades.slice(0, 8).map((trade) => ({
      id: trade.id,
      symbol: trade.pair,
      direction: trade.direction,
      entry: trade.entry,
      stopLoss: trade.stop_loss,
      takeProfit: trade.take_profit,
      exit: trade.result === "profit" ? trade.take_profit : trade.stop_loss,
      pips: trade.pips,
      pnl: trade.pips,
      status: "Closed" as const,
    })),
    symbols: Array.from(bySymbol.entries()).map(([symbol, list]) => {
      const symbolWins = list.filter((t) => t.pips > 0);
      const net = list.reduce((sum, t) => sum + t.pips, 0);
      return {
        symbol,
        trades: list.length,
        winRate: round((symbolWins.length / list.length) * 100, 1),
        netPnl: net,
        averagePips: round(net / list.length, 1),
      };
    }),
  };
}

export function resolvePerformanceReport(
  stats: PerformanceStats | null,
  trades: Trade[],
  period: PerformancePeriod = "30D"
): PerformanceReport {
  if (hasLivePerformanceData(stats, trades)) {
    return buildLiveReport(stats, trades, period);
  }
  return getDemoReport(period);
}

export function formatUsd(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatSignedPercent(value: number, digits = 2): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatPips(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}`;
}
