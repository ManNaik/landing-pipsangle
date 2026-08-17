import { FREE_TRIAL_DAYS } from "../../lib/trial";

export function PricingHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#050505] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_-8%,rgba(16,185,129,0.07),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-500/85">
          PipAngel Pricing
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
          Choose the level of control that fits your trading.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          Start with a 4-day free trial and choose the plan that matches how
          much control you want over automation, risk, and execution.
        </p>
        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-left">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden />
          <span className="text-sm text-zinc-200">
            {FREE_TRIAL_DAYS}-day free trial
            <span className="ml-2 text-zinc-500">No commitment required</span>
          </span>
        </div>
        <p className="mt-8 text-sm text-zinc-500">
          Basic is billed every 7 days. Premium is billed every 28 days.
        </p>
      </div>
    </section>
  );
}
