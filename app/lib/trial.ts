export const FREE_TRIAL_DAYS = 2;

export const FREE_TRIAL_LABEL = `${FREE_TRIAL_DAYS}-day free trial`;
export const FREE_TRIAL_CTA = `Start your ${FREE_TRIAL_DAYS}-day free trial`;
export const FREE_TRIAL_SHORT = `Try free for ${FREE_TRIAL_DAYS} days`;
export const FREE_TRIAL_HEADLINE = `${FREE_TRIAL_DAYS}-Day Free Trial`;

export function getTrialSignupUrl(plan?: string, period?: string): string {
  const params = new URLSearchParams({ trial: "1" });
  if (plan) params.set("plan", plan);
  if (period) params.set("period", period);
  return `/signup?${params.toString()}`;
}
