import type { AuthUser } from "./types";
import {
  getBillingPeriodDays,
  getSubscriptionRenewalIso,
  daysUntil as subscriptionDaysUntil,
} from "./subscriptionData";

export const SUBSCRIPTION_EXTENSION_STORAGE_KEY =
  "pipangel-store-subscription-end";

export type SubscriptionStateOverride = {
  renewalEndIso?: string;
  trial_active?: boolean;
};

export type StoreRewardCategory = "coupon" | "extension";

export type StoreReward = {
  id: string;
  category: StoreRewardCategory;
  name: string;
  description: string;
  cost: number;
  badge?: string;
  couponCode?: string;
  discountLabel?: string;
  extensionDays?: number;
};

export const STORE_REWARDS: StoreReward[] = [
  {
    id: "coupon-10-off",
    category: "coupon",
    name: "10% off Premium",
    description: "Apply on your next Premium subscription checkout.",
    cost: 150,
    badge: "Popular",
    couponCode: "PIP10PREM",
    discountLabel: "10% off",
  },
  {
    id: "coupon-20-renewal",
    category: "coupon",
    name: "20% off Premium renewal",
    description: "Stackable on your next billing renewal cycle.",
    cost: 250,
    couponCode: "PIP20RENEW",
    discountLabel: "20% off renewal",
  },
  {
    id: "coupon-10-usd",
    category: "coupon",
    name: "$10 off Premium",
    description: "Flat discount on Premium — best for annual upgrades.",
    cost: 300,
    badge: "Best value",
    couponCode: "PIP10FLAT",
    discountLabel: "$10 off",
  },
  {
    id: "extend-7",
    category: "extension",
    name: "+7 days extension",
    description: "Extend your current subscription by one week.",
    cost: 100,
    extensionDays: 7,
  },
  {
    id: "extend-14",
    category: "extension",
    name: "+14 days extension",
    description: "Two extra weeks of Premium access on your account.",
    cost: 175,
    badge: "Popular",
    extensionDays: 14,
  },
  {
    id: "extend-28",
    category: "extension",
    name: "+28 days extension",
    description: "Add a full billing cycle to your subscription end date.",
    cost: 300,
    extensionDays: 28,
  },
];

export function getCouponRewards(): StoreReward[] {
  return STORE_REWARDS.filter((r) => r.category === "coupon");
}

export function getExtensionRewards(): StoreReward[] {
  return STORE_REWARDS.filter((r) => r.category === "extension");
}

function defaultRenewalIso(user: AuthUser): string {
  const plan =
    user.plan === "Premium"
      ? "Premium"
      : user.plan === "Basic"
        ? "Basic"
        : null;
  if (!plan) {
    return new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();
  }
  return getSubscriptionRenewalIso(user, plan);
}

export function loadSubscriptionState(): SubscriptionStateOverride {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(SUBSCRIPTION_EXTENSION_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SubscriptionStateOverride;
  } catch {
    return {};
  }
}

export function loadSubscriptionEndOverride(): string | null {
  return loadSubscriptionState().renewalEndIso ?? null;
}

export function saveSubscriptionState(patch: SubscriptionStateOverride): void {
  if (typeof window === "undefined") return;
  const current = loadSubscriptionState();
  localStorage.setItem(
    SUBSCRIPTION_EXTENSION_STORAGE_KEY,
    JSON.stringify({ ...current, ...patch })
  );
}

export function saveSubscriptionEndOverride(renewalEndIso: string): void {
  saveSubscriptionState({ renewalEndIso });
}

export function loadTrialActiveOverride(user: AuthUser): boolean {
  const override = loadSubscriptionState().trial_active;
  if (typeof override === "boolean") return override;
  return Boolean(user.trial_active);
}

export function getEffectiveSubscriptionEnd(user: AuthUser): string {
  const override = loadSubscriptionEndOverride();
  if (override) return override;
  return defaultRenewalIso(user);
}

export function renewSubscriptionPeriod(user: AuthUser): string {
  const plan =
    user.plan === "Premium"
      ? "Premium"
      : user.plan === "Basic"
        ? "Basic"
        : null;
  if (!plan) {
    throw new Error("No active plan to renew.");
  }

  const periodDays = getBillingPeriodDays(plan);
  const currentEnd = getEffectiveSubscriptionEnd(user);
  const newEnd = extendSubscriptionEnd(currentEnd, periodDays);
  saveSubscriptionState({ renewalEndIso: newEnd, trial_active: false });
  return newEnd;
}

export function extendSubscriptionEnd(
  currentEndIso: string,
  days: number
): string {
  const end = new Date(currentEndIso);
  const now = new Date();
  const base = end > now ? end : now;
  base.setDate(base.getDate() + days);
  return base.toISOString();
}

export function formatStoreDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysUntilDate(iso: string): number {
  return subscriptionDaysUntil(iso);
}
