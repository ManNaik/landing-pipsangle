import { BILLING_STEPS } from "../../lib/pricing";

export function PricingBilling() {
  return (
    <section className="border-t border-white/[0.06] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Simple, Transparent Billing
        </h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BILLING_STEPS.map((item) => (
            <li key={item.step} className="min-w-0">
              <p className="text-[11px] font-medium tabular-nums tracking-[0.16em] text-emerald-500/80">
                {item.step}
              </p>
              <h3 className="mt-2 text-sm font-medium text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
