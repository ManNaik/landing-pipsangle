import { ALL_TIME_PROFIT } from "./profitData";
import { mockExecutedTrades, mockPerformanceStats } from "./mockData";
import type { AuthUser } from "./types";
import { isLiveExecutedTrade } from "./format";
import type { TradeStats } from "./tradesApi";
import type { ExecutedTrade } from "./types";
import {
  getSubscriptionRenewalIso,
  getSubscriptionStartIso,
  getTrialEndIso,
  getTrialStartIso,
} from "./subscriptionData";

export type AccountMetrics = {
  totalAccountEquity: number;
  todayLivePnL: number;
  overallProfit: number;
  winRatePercent: number;
  maxDrawdownPercent: number;
  marginLevelPercent: number;
};

export type DashboardStats = {
  displayName: string;
  memberSince: string;
  subscriptionStarted: string;
  subscriptionRenews: string;
  billingCycle: string;
  signalsThisWeek: number;
  signalsWinRate: number;
  activeSignals: number;
  automationStatus: "connected" | "paused" | "disconnected";
  automationLastSync: string;
  automationTrades: number;
  automationBroker: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "Trader";
  if (local === "demo") return "Demo User";
  return local
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const BASE_ACCOUNT_BALANCE = 25_000;

function closedTradeWinRate(trades: ExecutedTrade[]): number {
  const closed = trades.filter((trade) => trade.status === "closed");
  if (closed.length === 0) return 0;
  const wins = closed.filter((trade) => trade.profit_loss > 0).length;
  return Math.round((wins / closed.length) * 100);
}

export function getAccountMetrics(
  user: AuthUser,
  options?: {
    tradeStats?: TradeStats | null;
    openTrades?: ExecutedTrade[];
    allTimeProfit?: number;
  }
): AccountMetrics {
  const stats = getDashboardStats(user);
  const openTrades = options?.openTrades ?? mockExecutedTrades.filter((trade) =>
    isLiveExecutedTrade(trade.status)
  );
  const livePnL = openTrades.reduce((sum, trade) => sum + trade.profit_loss, 0);
  const overallProfit = options?.allTimeProfit ?? options?.tradeStats?.totalPnl ?? ALL_TIME_PROFIT;

  const equityBoost =
    stats.automationStatus === "connected" ? overallProfit : overallProfit * 0.35;
  const marginLevel =
    stats.automationStatus === "connected"
      ? 412.6
      : stats.automationStatus === "paused"
        ? 286.4
        : 0;

  const winRate =
    options?.tradeStats && options.tradeStats.closed > 0
      ? Math.round((options.tradeStats.wins / options.tradeStats.closed) * 100)
      : stats.signalsWinRate || closedTradeWinRate(mockExecutedTrades);

  return {
    totalAccountEquity: Math.round((BASE_ACCOUNT_BALANCE + equityBoost + livePnL) * 100) / 100,
    todayLivePnL: Math.round(livePnL * 100) / 100,
    overallProfit,
    winRatePercent: winRate,
    maxDrawdownPercent: mockPerformanceStats.max_drawdown_percent,
    marginLevelPercent: marginLevel,
  };
}

export type CapitalAllocation = {
  accountEquity: number;
  utilizationPercent: number;
  utilizedAmount: number;
  availableAmount: number;
};

export function getCapitalAllocation(
  user: AuthUser,
  utilizationPercent: number
): CapitalAllocation {
  const { totalAccountEquity } = getAccountMetrics(user);
  const utilizedAmount =
    Math.round(totalAccountEquity * (utilizationPercent / 100) * 100) / 100;
  const availableAmount =
    Math.round((totalAccountEquity - utilizedAmount) * 100) / 100;

  return {
    accountEquity: totalAccountEquity,
    utilizationPercent,
    utilizedAmount,
    availableAmount,
  };
}

export function getDashboardStats(user: AuthUser): DashboardStats {
  const trialStart = new Date(getTrialStartIso(user));
  const memberSince = new Date(trialStart.getTime() - 14 * 24 * 60 * 60 * 1000);

  const isPremium = user.plan === "Premium";
  const hasPlan = Boolean(user.plan);
  const plan = user.plan === "Premium" ? "Premium" : user.plan === "Basic" ? "Basic" : null;

  const subscriptionStartedIso = user.trial_active
    ? getTrialStartIso(user)
    : plan
      ? getSubscriptionStartIso(user)
      : trialStart.toISOString();

  const subscriptionRenewsIso =
    user.trial_active && plan
      ? getTrialEndIso(user)
      : plan
        ? getSubscriptionRenewalIso(user, plan)
        : getTrialEndIso(user);

  return {
    displayName: displayNameFromEmail(user.email),
    memberSince: formatDate(memberSince.toISOString()),
    subscriptionStarted: formatDate(subscriptionStartedIso),
    subscriptionRenews: formatDate(subscriptionRenewsIso),
    billingCycle: isPremium ? "28 days" : hasPlan ? "Weekly" : "—",
    signalsThisWeek: isPremium ? 18 : hasPlan ? 12 : 0,
    signalsWinRate: isPremium ? 74 : hasPlan ? 68 : 0,
    activeSignals: isPremium ? 3 : hasPlan ? 2 : 0,
    automationStatus: isPremium ? "connected" : hasPlan ? "paused" : "disconnected",
    automationLastSync: isPremium ? "12 minutes ago" : hasPlan ? "2 days ago" : "—",
    automationTrades: isPremium ? 47 : hasPlan ? 0 : 0,
    automationBroker: isPremium ? "IC Markets (MT5)" : "—",
  };
}
