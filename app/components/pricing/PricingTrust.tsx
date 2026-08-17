import Link from "next/link";
import { PricingIcon } from "./PricingIcon";

export function PricingTrust() {
  return (
    <section className="border-t border-white/[0.06] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-2xl border border-white/[0.07] px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">
            See Before You Subscribe
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
            Review PipAngel&apos;s performance data and recorded trades before choosing a plan.
          </p>
        </div>
        <Link
          href="/trading-performance"
          className="group inline-flex min-h-[2.75rem] items-center gap-2 text-sm font-medium text-emerald-400 transition-colors duration-200 hover:text-emerald-300"
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
