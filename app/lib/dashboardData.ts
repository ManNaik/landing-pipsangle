import type { BrokerConnectionData } from "./brokerConnection";
import { isLiveExecutedTrade } from "./format";
import { isMockApiEnabled, mockExecutedTrades } from "./mockData";
import { isOnboardingReady } from "./onboardingStatus";
import { ALL_TIME_PROFIT } from "./profitData";
import type { TradeStats } from "./tradesApi";
import type { AuthUser, ExecutedTrade } from "./types";
import {
  getSubscriptionRenewalIso,
  getSubscriptionStartIso,
  getTrialEndIso,
  getTrialStartIso,
} from "./subscriptionData";

/** Only figures derived from the customer's own executed trades. */
export type AccountMetrics = {
  todayLivePnL: number;
  overallProfit: number;
  winRatePercent: number | null;
  closedTrades: number;
  openTrades: number;
};

export type DashboardStats = {
  displayName: string;
  memberSince: string;
  subscriptionStarted: string;
  subscriptionRenews: string;
  billingCycle: string;
  automationStatus: "connected" | "disconnected";
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

export function getAccountMetrics(
  _user: AuthUser,
  options?: {
    tradeStats?: TradeStats | null;
    openTrades?: ExecutedTrade[];
    allTimeProfit?: number;
  }
): AccountMetrics {
  const mock = isMockApiEnabled();
  const openTrades =
    options?.openTrades ?? (mock ? mockExecutedTrades.filter((trade) => isLiveExecutedTrade(trade.status)) : []);
  const livePnL = openTrades.reduce((sum, trade) => sum + trade.profit_loss, 0);
  const overallProfit = options?.allTimeProfit ?? options?.tradeStats?.totalPnl ?? (mock ? ALL_TIME_PROFIT : 0);
  const closed = options?.tradeStats?.closed ?? 0;
  const wins = options?.tradeStats?.wins ?? 0;

  return {
    todayLivePnL: Math.round(livePnL * 100) / 100,
    overallProfit,
    winRatePercent: closed > 0 ? Math.round((wins / closed) * 100) : null,
    closedTrades: closed,
    openTrades: openTrades.length,
  };
}

/** Automation status comes from the real broker connection, never from the plan name. */
export function getDashboardStats(user: AuthUser, connection?: BrokerConnectionData | null): DashboardStats {
  const trialStart = new Date(getTrialStartIso(user));
  const plan = user.plan === "Premium" ? "Premium" : user.plan === "Basic" ? "Basic" : null;
  const connected = Boolean(connection && isOnboardingReady(connection.status));

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

  const brokerLabel =
    connected && connection
      ? [connection.brokerName || "IC Markets", connection.mt5Login ? `MT5 ${connection.mt5Login}` : "MT5"].join(", ")
      : "No broker connected";

  return {
    displayName: displayNameFromEmail(user.email),
    memberSince: formatDate(trialStart.toISOString()),
    subscriptionStarted: formatDate(subscriptionStartedIso),
    subscriptionRenews: formatDate(subscriptionRenewsIso),
    billingCycle: plan === "Premium" ? "28 days" : plan === "Basic" ? "7 days" : "—",
    automationStatus: connected ? "connected" : "disconnected",
    automationBroker: brokerLabel,
  };
}
