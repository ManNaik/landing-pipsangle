import Link from "next/link";
import { getSignupUrl, PRICING_TRIAL_POINTS } from "../../lib/pricing";

export function PricingTrial() {
  return (
    <section className="border-t border-white/[0.06] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Try PipAngel for 4 Days
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Explore the platform, connect your trading account, test the dashboard,
          and experience the available automation controls before choosing a plan.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-3">
          {PRICING_TRIAL_POINTS.map((point) => (
            <div key={point.value} className="bg-[#0a0a0a] px-4 py-5">
              <p className="text-sm font-semibold tracking-[0.12em] text-white">{point.value}</p>
              <p className="mt-1.5 text-xs text-zinc-500">{point.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={getSignupUrl("premium")}
            className="inline-flex min-h-[3rem] items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-400"
          >
            Start Premium Free Trial
          </Link>
          <Link
            href={getSignupUrl("basic")}
            className="inline-flex min-h-[3rem] items-center justify-center rounded-xl border border-white/[0.12] px-6 py-3 text-sm font-medium text-zinc-200 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.04]"
          >
            Start Basic Free Trial
          </Link>
        </div>
      </div>
    </section>
  );
}
