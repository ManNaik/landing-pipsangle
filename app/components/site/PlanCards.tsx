import { dailyPrice, formatPrice, getSignupUrl, type PricingTier } from "../../lib/pricing";
import { TrackedLink } from "./TrackedLink";
import { CheckIcon } from "./ui";

export function PlanCards({
  tiers,
  location,
  detailed = false,
}: {
  tiers: PricingTier[];
  location: string;
  detailed?: boolean;
}) {
  const cheapestDaily = Math.min(...tiers.map((tier) => tier.price / tier.periodDays));

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {tiers.map((tier) => {
        const lowestDaily = tier.price / tier.periodDays === cheapestDaily && tiers.length > 1;
        const features = detailed ? tier.features : tier.features.slice(0, 3);
        return (
          <article
            key={tier.id}
            className={`flex flex-col rounded-2xl border p-6 sm:p-8 ${
              tier.id === "premium" ? "border-mint-500/60 bg-forest-800" : "border-forest-600 bg-forest-850"
            }`}
          >
            <h3 className="text-xl font-bold">{tier.name}</h3>
            <p className="mt-2 leading-relaxed text-sage-300">{tier.tagline}</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold tabular-nums tracking-tight">{formatPrice(tier.price)}</span>
              <span className="text-sage-300">for {tier.periodLabel}</span>
            </p>
            <p className="mt-1 text-sm text-sage-400">
              {dailyPrice(tier)} a day{lowestDaily ? ", the lower daily cost" : ""}
            </p>
            <p className="mt-5 rounded-lg bg-forest-900/70 px-4 py-3 text-sm">
              <span className="text-sage-400">Capital utilization: </span>
              <span className="font-semibold">{tier.capitalUtilization}</span>
            </p>
            <ul className="mt-5 space-y-2.5">
              {features.map((feature) => (
                <li key={feature.label} className="flex gap-3 text-[0.975rem] text-sage-200">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-mint-400" />
                  {feature.label}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-7">
              <TrackedLink
                href={getSignupUrl(tier.id)}
                location={location}
                label={`start_trial_${tier.id}`}
                className={`inline-flex min-h-12 w-full items-center justify-center rounded-lg font-semibold ${
                  tier.id === "premium"
                    ? "bg-mint-500 text-white hover:bg-leaf-600"
                    : "border border-forest-500 text-paper hover:border-sage-500 hover:bg-forest-700"
                }`}
              >
                Start free trial with {tier.name}
              </TrackedLink>
            </div>
          </article>
        );
      })}
    </div>
  );
}
