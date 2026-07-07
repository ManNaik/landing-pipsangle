import type { AuthUser } from "./types";
import { FREE_TRIAL_DAYS } from "./trial";

export type SubscriptionStatus = "trial" | "active" | "expired" | "none";

export const PREMIUM_BILLING_DAYS = 28;
export const BASIC_BILLING_DAYS = 7;

export type SubscriptionInfo = {
  plan: "Basic" | "Premium" | null;
  status: SubscriptionStatus;
  isTrial: boolean;
  /** Days left in the current countdown (trial or billing). */
  remainingDays: number;
  /** Formatted end date for the current countdown phase. */
  phaseEndDate: string;
  trialDaysRemaining: number;
  trialEndsDate: string;
  subscriptionRenewsDate: string;
  subscriptionDaysRemaining: number;
  subscriptionPeriodDays: number;
  subscriptionStartsDate: string;
  billingCycle: string;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysUntil(iso: string): number {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
}

export function isOnTrial(user: AuthUser): boolean {
  return Boolean(user.trial_active && user.plan);
}

export function getBillingPeriodDays(plan: "Basic" | "Premium"): number {
  return plan === "Premium" ? PREMIUM_BILLING_DAYS : BASIC_BILLING_DAYS;
}

export function getTrialEndIso(user: AuthUser): string {
  if (user.trial_ends_at) return user.trial_ends_at;
  return new Date(Date.now() + FREE_TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

export function getTrialStartIso(user: AuthUser): string {
  const trialEnd = new Date(getTrialEndIso(user));
  trialEnd.setDate(trialEnd.getDate() - FREE_TRIAL_DAYS);
  return trialEnd.toISOString();
}

/** Paid subscription begins when the free trial ends. */
export function getSubscriptionStartIso(user: AuthUser): string {
  return getTrialEndIso(user);
}

export function getSubscriptionRenewalIso(
  user: AuthUser,
  plan: "Basic" | "Premium"
): string {
  const periodDays = getBillingPeriodDays(plan);
  const trialEnd = new Date(getTrialEndIso(user));
  const renewal = new Date(trialEnd);
  renewal.setDate(renewal.getDate() + periodDays);

  if (user.trial_active) {
    return renewal.toISOString();
  }

  const now = Date.now();
  while (renewal.getTime() <= now) {
    renewal.setDate(renewal.getDate() + periodDays);
  }
  return renewal.toISOString();
}

export function getSubscriptionInfo(user: AuthUser): SubscriptionInfo {
  const plan =
    user.plan === "Premium"
      ? "Premium"
      : user.plan === "Basic"
        ? "Basic"
        : null;

  if (!plan) {
    return {
      plan: null,
      status: "none",
      isTrial: false,
      remainingDays: 0,
      phaseEndDate: "—",
      trialDaysRemaining: 0,
      trialEndsDate: "—",
      subscriptionRenewsDate: "—",
      subscriptionDaysRemaining: 0,
      subscriptionPeriodDays: 0,
      subscriptionStartsDate: "—",
      billingCycle: "—",
    };
  }

  const isTrial = Boolean(user.trial_active);
  const trialEndIso = getTrialEndIso(user);
  const subscriptionStartIso = getSubscriptionStartIso(user);
  const subscriptionRenewalIso = getSubscriptionRenewalIso(user, plan);
  const subscriptionPeriodDays = getBillingPeriodDays(plan);

  const trialDaysRemaining = daysUntil(trialEndIso);
  const subscriptionDaysRemaining = daysUntil(subscriptionRenewalIso);

  const status: SubscriptionStatus = isTrial
    ? "trial"
    : subscriptionDaysRemaining > 0
      ? "active"
      : "expired";

  const remainingDays = isTrial ? trialDaysRemaining : subscriptionDaysRemaining;
  const phaseEndDate = formatDate(isTrial ? trialEndIso : subscriptionRenewalIso);

  return {
    plan,
    status,
    isTrial,
    remainingDays,
    phaseEndDate,
    trialDaysRemaining,
    trialEndsDate: formatDate(trialEndIso),
    subscriptionRenewsDate: formatDate(subscriptionRenewalIso),
    subscriptionDaysRemaining,
    subscriptionPeriodDays,
    subscriptionStartsDate: formatDate(subscriptionStartIso),
    billingCycle: plan === "Premium" ? "28 days" : "Weekly",
  };
}
