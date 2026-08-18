import Link from "next/link";
import {
  formatPrice,
  getSignupUrl,
  PRICING_TIERS,
  type PricingTier,
} from "../../lib/pricing";
import { FREE_TRIAL_DAYS } from "../../lib/trial";
import { PricingIcon } from "./PricingIcon";

function PricingCard({ tier }: { tier: PricingTier }) {
  const isPremium = tier.id === "premium";

  return (
    <article
      className={
        isPremium
          ? "group relative flex flex-col rounded-2xl border border-emerald-500/30 bg-[#07110d] p-6 shadow-[0_0_48px_-20px_rgba(16,185,129,0.35)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-500/45 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8 lg:p-9"
          : "group relative flex flex-col rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-6 transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8"
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-lg font-semibold tracking-tight text-white">{tier.name}</h2>
        {isPremium ? (
          <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Recommended
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{tier.tagline}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tabular-nums tracking-tight text-white">
          {formatPrice(tier.price)}
        </span>
        <span className="text-sm text-zinc-500">/ {tier.periodLabel}</span>
      </div>
      <p className="mt-2 text-sm text-zinc-500">{FREE_TRIAL_DAYS}-day free trial included</p>

      <Link
        href={getSignupUrl(tier.id)}
        className={
          isPremium
            ? "mt-6 inline-flex min-h-[3rem] items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-400"
            : "mt-6 inline-flex min-h-[3rem] items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.03] px-5 py-3 text-sm font-medium text-zinc-100 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06]"
        }
      >
        {tier.ctaLabel}
      </Link>

      <ul className="mt-7 space-y-2.5 border-t border-white/[0.06] pt-6">
        {tier.features.map((feature) => (
          <li
            key={feature.label}
            className="flex items-start gap-2.5 rounded-md px-1 py-1 text-sm transition-colors duration-150 hover:bg-white/[0.03] motion-reduce:transition-none"
          >
            {feature.included ? (
              <PricingIcon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <PricingIcon name="lock" className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600" />
            )}
            <span className={feature.included ? "text-zinc-300" : "text-zinc-600"}>
              {feature.label}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function PricingCards() {
  const basic = PRICING_TIERS.find((tier) => tier.id === "basic")!;
  const premium = PRICING_TIERS.find((tier) => tier.id === "premium")!;

  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2 lg:items-stretch lg:gap-6">
        <PricingCard tier={basic} />
        <PricingCard tier={premium} />
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-zinc-500">
        Risk is managed, not eliminated. Trading involves market risk. Past
        performance does not guarantee future results.
      </p>
    </section>
  );
}
