import type { AuthUser } from "./types";
import { FREE_TRIAL_DAYS } from "./trial";

export type SubscriptionStatus = "trial" | "active" | "expired" | "none";

export type SubscriptionScreen =
  | "none"
  | "trial"
  | "active"
  | "renew"
  | "extend"
  | "expired";

export const EXPIRING_SOON_DAYS = 3;

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
  phaseEndIso: string;
  trialDaysRemaining: number;
  trialEndsDate: string;
  subscriptionRenewsDate: string;
  subscriptionDaysRemaining: number;
  subscriptionPeriodDays: number;
  subscriptionStartsDate: string;
  billingCycle: string;
};

export type SubscriptionInfoOptions = {
  effectiveRenewalIso?: string | null;
  trialActiveOverride?: boolean;
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

export function isPastIso(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export function isOnTrial(user: AuthUser, trialActiveOverride?: boolean): boolean {
  const active =
    typeof trialActiveOverride === "boolean"
      ? trialActiveOverride
      : Boolean(user.trial_active);
  return active && Boolean(user.plan);
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

export function resolveSubscriptionScreen(
  subscription: SubscriptionInfo,
  forcedScreen?: SubscriptionScreen | null
): SubscriptionScreen {
  if (forcedScreen) return forcedScreen;
  if (subscription.status === "none") return "none";
  if (subscription.status === "expired") return "expired";
  if (subscription.isTrial) {
    return subscription.remainingDays <= EXPIRING_SOON_DAYS ? "renew" : "trial";
  }
  if (subscription.remainingDays <= EXPIRING_SOON_DAYS) return "renew";
  return "active";
}

export function getSubscriptionInfo(
  user: AuthUser,
  options?: SubscriptionInfoOptions
): SubscriptionInfo {
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
      phaseEndIso: "",
      trialDaysRemaining: 0,
      trialEndsDate: "—",
      subscriptionRenewsDate: "—",
      subscriptionDaysRemaining: 0,
      subscriptionPeriodDays: 0,
      subscriptionStartsDate: "—",
      billingCycle: "—",
    };
  }

  const isTrial = isOnTrial(user, options?.trialActiveOverride);
  const trialEndIso = getTrialEndIso(user);
  const subscriptionStartIso = getSubscriptionStartIso(user);
  const computedRenewalIso = getSubscriptionRenewalIso(user, plan);
  const subscriptionRenewalIso =
    options?.effectiveRenewalIso ?? computedRenewalIso;
  const subscriptionPeriodDays = getBillingPeriodDays(plan);

  const trialDaysRemaining = daysUntil(trialEndIso);
  const subscriptionDaysRemaining = daysUntil(subscriptionRenewalIso);
  const subscriptionExpired = !isTrial && isPastIso(subscriptionRenewalIso);
  const trialExpired = isTrial && isPastIso(trialEndIso);

  const status: SubscriptionStatus = isTrial
    ? trialExpired
      ? "expired"
      : "trial"
    : subscriptionExpired
      ? "expired"
      : "active";

  const remainingDays = isTrial ? trialDaysRemaining : subscriptionDaysRemaining;
  const phaseEndIso = isTrial ? trialEndIso : subscriptionRenewalIso;
  const phaseEndDate = formatDate(phaseEndIso);

  return {
    plan,
    status,
    isTrial,
    remainingDays,
    phaseEndDate,
    phaseEndIso,
    trialDaysRemaining,
    trialEndsDate: formatDate(trialEndIso),
    subscriptionRenewsDate: formatDate(subscriptionRenewalIso),
    subscriptionDaysRemaining,
    subscriptionPeriodDays,
    subscriptionStartsDate: formatDate(subscriptionStartIso),
    billingCycle: plan === "Premium" ? "28 days" : "Weekly",
  };
}
