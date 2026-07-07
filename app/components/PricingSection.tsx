import Link from "next/link";
import {
  formatPrice,
  getDailyPrice,
  getSignupUrl,
  LIFETIME_LOCK_OFFER,
  PLAN_COMPARISON,
  PRICING_FAQ_TEASER,
  PRICING_TIERS,
  PRICING_VALUE_PROPS,
  type ComparisonCell,
  type PricingTier,
} from "../lib/pricing";

function CheckIcon({ className = "text-emerald-400" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function LimitIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-amber-400/90"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-zinc-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function BasicPlanIcon() {
  return (
    <svg
      className="h-5 w-5 text-zinc-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function PremiumPlanIcon() {
  return (
    <svg
      className="h-7 w-7 text-emerald-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  );
}

function RecommendedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-gradient-to-r from-emerald-500/15 to-amber-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-200">
      <svg className="h-3 w-3 text-amber-400/90" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      Recommended
    </span>
  );
}

function ComparisonCellContent({ value }: { value: ComparisonCell }) {
  if (value === "yes") {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-400">
        <CheckIcon />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  if (value === "no") {
    return (
      <span className="inline-flex items-center gap-1.5 text-zinc-600">
        <XIcon />
        <span className="sr-only">Not included</span>
      </span>
    );
  }
  if (value === "limited") {
    return (
      <span className="inline-flex items-center gap-1.5 text-amber-400/90">
        <LimitIcon />
        <span className="text-zinc-400">Limited</span>
      </span>
    );
  }
  return <span className="text-zinc-300">{value}</span>;
}

function PricingCard({ tier }: { tier: PricingTier }) {
  const isPremium = tier.isPopular;

  return (
    <article
      className={
        isPremium
          ? "group relative z-10 flex flex-col overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/50 via-zinc-900/70 to-zinc-950 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.55),0_0_72px_-18px_rgba(16,185,129,0.18)] transition duration-300 hover:border-emerald-400/40 hover:shadow-[0_16px_56px_-12px_rgba(0,0,0,0.55),0_0_88px_-14px_rgba(16,185,129,0.26)] lg:-my-1"
          : "group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-950/20 transition duration-300 hover:border-zinc-700/50"
      }
    >
      {isPremium ? (
        <>
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/[0.08] blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-amber-500/[0.05] blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent"
            aria-hidden
          />
        </>
      ) : (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-700/20 to-transparent"
          aria-hidden
        />
      )}

      <div
        className={`relative flex flex-1 flex-col ${
          isPremium ? "p-7 sm:p-9 lg:p-10" : "p-6 sm:p-7"
        }`}
      >
        <div className={`flex flex-wrap items-center gap-2 ${isPremium ? "mb-6" : "mb-5"}`}>
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium tracking-wide ${
              isPremium
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                : "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-400/80"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isPremium ? "bg-emerald-300" : "bg-emerald-400/70"}`}
              aria-hidden
            />
            {LIFETIME_LOCK_OFFER.cardBadge}
          </span>
          {isPremium ? <RecommendedBadge /> : null}
        </div>

        <div className={`flex items-start gap-4 ${isPremium ? "gap-5" : ""}`}>
          <div
            className={
              isPremium
                ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/15 to-emerald-950/40 shadow-inner shadow-emerald-900/20"
                : "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800/80 bg-zinc-900/50"
            }
          >
            {isPremium ? <PremiumPlanIcon /> : <BasicPlanIcon />}
          </div>
          <div className="min-w-0 pt-0.5">
            <h2
              className={
                isPremium
                  ? "text-2xl font-semibold tracking-tight text-white sm:text-[1.75rem]"
                  : "text-lg font-semibold tracking-tight text-zinc-200 sm:text-xl"
              }
            >
              {tier.name}
            </h2>
            <p
              className={`mt-1.5 text-sm leading-relaxed ${
                isPremium ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {tier.tagline}
            </p>
          </div>
        </div>

        <div
          className={`border-b pb-8 ${
            isPremium
              ? "mt-9 border-emerald-500/15 sm:mt-10"
              : "mt-7 border-zinc-800/50"
          }`}
        >
          <p className={`text-sm ${isPremium ? "text-zinc-400" : "text-zinc-600"}`}>
            Standard{" "}
            <span
              className={`line-through ${
                isPremium
                  ? "text-zinc-500 decoration-zinc-600"
                  : "text-zinc-600 decoration-zinc-700"
              }`}
            >
              {formatPrice(tier.originalPrice)}
            </span>
          </p>
          <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span
              className={
                isPremium
                  ? "text-5xl font-bold tracking-tight text-white sm:text-6xl"
                  : "text-3xl font-semibold tracking-tight text-zinc-200 sm:text-4xl"
              }
            >
              {formatPrice(tier.price)}
            </span>
            <span className={`text-sm ${isPremium ? "text-zinc-400" : "text-zinc-600"}`}>
              / {tier.periodLabel}
            </span>
          </div>
          <p className={`mt-3 text-xs ${isPremium ? "text-zinc-400" : "text-zinc-600"}`}>
            {tier.discountPercent}% below standard · {getDailyPrice(tier.price, tier.periodDays)}
          </p>
          <p
            className={`mt-4 inline-flex items-center gap-2 text-xs leading-relaxed ${
              isPremium ? "text-emerald-300/90" : "text-emerald-400/70"
            }`}
          >
            <svg
              className={`h-3.5 w-3.5 shrink-0 ${
                isPremium ? "text-emerald-400" : "text-emerald-500/60"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Founding rate — locked for life at {formatPrice(tier.price)}
          </p>
        </div>

        <ul className={`flex-1 ${isPremium ? "mt-9 space-y-4 sm:mt-10" : "mt-7 space-y-3"}`}>
          {tier.features.map((feature) => {
            const isBasicLimit =
              tier.id === "basic" && feature.included && feature.highlight;

            return (
              <li
                key={feature.label}
                className={`flex items-start gap-3 leading-snug ${
                  isPremium ? "text-[0.9375rem]" : "text-sm"
                } ${feature.included ? (isPremium ? "text-zinc-200" : "text-zinc-400") : "text-zinc-600"}`}
              >
                {feature.included ? (
                  isBasicLimit ? (
                    <LimitIcon />
                  ) : (
                    <CheckIcon className={isPremium ? "text-emerald-400" : "text-zinc-600"} />
                  )
                ) : (
                  <XIcon />
                )}
                <span
                  className={
                    feature.highlight && feature.included
                      ? isPremium
                        ? "font-medium text-white"
                        : "text-zinc-500"
                      : ""
                  }
                >
                  {feature.label}
                </span>
              </li>
            );
          })}
        </ul>

        <Link
          href={getSignupUrl(tier.id)}
          className={
            isPremium
              ? "mt-9 flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-950/40 transition duration-200 hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-900/50 sm:mt-10"
              : "mt-7 flex min-h-[3rem] items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/30 text-center text-sm font-medium text-zinc-400 transition duration-200 hover:border-zinc-700 hover:bg-zinc-800/30 hover:text-zinc-300"
          }
        >
          {tier.ctaLabel}
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

function PlanComparison() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/20">
      <div className="border-b border-zinc-800 bg-zinc-950/40 px-4 py-5 sm:px-6">
        <p className="text-[11px] font-medium tracking-[0.2em] text-zinc-500">
          Side by side
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-white sm:text-xl">
          Feature comparison
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          See exactly what changes between Basic and Premium.
        </p>
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500">
              <th className="px-6 py-4 font-medium">Feature</th>
              <th className="px-6 py-4 font-medium">Basic</th>
              <th className="px-6 py-4 font-medium text-zinc-300">Premium</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {PLAN_COMPARISON.map((row) => (
              <tr key={row.feature} className="transition hover:bg-zinc-800/20">
                <td className="px-6 py-4 font-medium text-zinc-300">{row.feature}</td>
                <td className="px-6 py-4">
                  <ComparisonCellContent value={row.basic} />
                </td>
                <td className="px-6 py-4">
                  <ComparisonCellContent value={row.premium} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-zinc-800/60 sm:hidden">
        {PLAN_COMPARISON.map((row) => (
          <div key={row.feature} className="px-4 py-4">
            <p className="text-sm font-medium text-zinc-300">{row.feature}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                <p className="text-[10px] font-medium tracking-wider text-zinc-500">
                  Basic
                </p>
                <div className="mt-2">
                  <ComparisonCellContent value={row.basic} />
                </div>
              </div>
              <div className="rounded-lg border border-zinc-700/50 bg-zinc-900/30 p-3">
                <p className="text-[10px] font-medium tracking-wider text-zinc-400">
                  Premium
                </p>
                <div className="mt-2">
                  <ComparisonCellContent value={row.premium} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueProps() {
  return (
    <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
      {PRICING_VALUE_PROPS.map((prop) => (
        <div
          key={prop.title}
          className="relative rounded-xl border border-zinc-800/80 bg-zinc-900/20 p-5 sm:p-6"
        >
          <h3 className="text-base font-semibold tracking-tight text-white">{prop.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">{prop.description}</p>
        </div>
      ))}
    </div>
  );
}

function FaqTeaser() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <p className="text-[11px] font-medium tracking-[0.2em] text-zinc-500">
            Questions
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Common pricing questions
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Quick answers before you subscribe. For the full list, visit our FAQ.
          </p>
          <Link
            href="/faq"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            View all FAQs
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
        <div className="min-w-0 flex-1 space-y-3 lg:max-w-xl">
          {PRICING_FAQ_TEASER.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-zinc-800/80 bg-zinc-950/30 px-4 py-3.5 sm:px-5 sm:py-4"
            >
              <h3 className="text-sm font-medium text-zinc-200">{item.question}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PricingSection() {
  return (
    <div className="mx-auto max-w-6xl min-w-0 space-y-16 sm:space-y-20 lg:space-y-24">
      <div className="grid gap-5 lg:grid-cols-2 lg:items-center lg:gap-6">
        {PRICING_TIERS.map((tier) => (
          <PricingCard key={tier.id} tier={tier} />
        ))}
      </div>

      <ValueProps />

      <PlanComparison />

      <FaqTeaser />
    </div>
  );
}
