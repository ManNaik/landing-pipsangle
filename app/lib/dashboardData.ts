import type { AuthUser } from "./types";
import {
  getSubscriptionRenewalIso,
  getSubscriptionStartIso,
  getTrialEndIso,
  getTrialStartIso,
} from "./subscriptionData";

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
