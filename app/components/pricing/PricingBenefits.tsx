import { PRICING_BENEFITS } from "../../lib/pricing";
import { PricingIcon } from "./PricingIcon";

const ICONS = {
  automation: "automation",
  risk: "risk",
  dashboard: "dashboard",
  support: "support",
} as const;

export function PricingBenefits() {
  return (
    <section className="border-t border-white/[0.06] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Everything You Need to Trade With Control
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {PRICING_BENEFITS.map((item, index) => (
            <article
              key={item.id}
              className={
                index === 0
                  ? "rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-6 sm:p-7"
                  : index === 1
                    ? "border-l-2 border-emerald-500/40 py-1 pl-5 sm:pl-6"
                    : index === 2
                      ? "rounded-2xl bg-white/[0.03] p-6 sm:p-7"
                      : "flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-6 sm:pt-7"
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-emerald-400">
                  <PricingIcon name={ICONS[item.id]} className="h-4 w-4" />
                </div>
                <span className="text-[11px] tabular-nums tracking-[0.16em] text-zinc-600">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
                {item.eyebrow}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
