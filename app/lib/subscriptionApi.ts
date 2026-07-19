import type { SubscriptionInfo } from "./subscriptionData";
import { userGet } from "./userApi";

type SubscriptionMeResponse = {
  plan: "Basic" | "Premium" | null;
  status: "trial" | "active" | "expired" | "none";
  is_trial: boolean;
  remaining_days: number;
  phase_end_date: string;
  phase_end_iso: string;
  trial_days_remaining: number;
  trial_ends_date: string;
  subscription_renews_date: string;
  subscription_days_remaining: number;
  subscription_period_days: number;
  subscription_starts_date: string;
  billing_cycle: string;
};

export function mapSubscriptionInfo(data: SubscriptionMeResponse): SubscriptionInfo {
  return {
    plan: data.plan,
    status: data.status,
    isTrial: data.is_trial,
    remainingDays: data.remaining_days,
    phaseEndDate: data.phase_end_date,
    phaseEndIso: data.phase_end_iso,
    trialDaysRemaining: data.trial_days_remaining,
    trialEndsDate: data.trial_ends_date,
    subscriptionRenewsDate: data.subscription_renews_date,
    subscriptionDaysRemaining: data.subscription_days_remaining,
    subscriptionPeriodDays: data.subscription_period_days,
    subscriptionStartsDate: data.subscription_starts_date,
    billingCycle: data.billing_cycle,
  };
}

export async function fetchSubscriptionMe(): Promise<SubscriptionInfo> {
  const data = await userGet<SubscriptionMeResponse>("/subscriptions/me/");
  return mapSubscriptionInfo(data);
}
