import Link from "next/link";
import { getSignupUrl } from "../../lib/pricing";
import { PricingIcon } from "./PricingIcon";

export function PricingFinalCta() {
  return (
    <section className="border-t border-white/[0.06] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Ready to Trade With More Control?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Start with a 4-day free trial and explore PipAngel before choosing the
          plan that fits your trading workflow.
        </p>
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
        <Link
          href="/trading-performance"
          className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors duration-200 hover:text-zinc-200"
        >
          View Performance
          <PricingIcon
            name="arrow"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0"
          />
        </Link>
      </div>
    </section>
  );
}
