import Link from "next/link";
import { AUTOMATION_PATH } from "../../lib/homeContent";

const STEPS = [
  "AI Intelligence",
  "Validated Opportunity",
  "Risk Control",
  "IC Markets MT5",
] as const;

export function HomeAutomationBrief() {
  return (
    <section className="border-b border-zinc-800 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
          From Intelligence to Automated Execution
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          When automation is enabled, validated trading opportunities can be
          executed through your connected IC Markets MT5 account using
          predefined risk controls.
        </p>

        <ol className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center">
          {STEPS.map((step, idx) => (
            <li key={step} className="flex flex-1 items-center gap-2">
              <span className="w-full rounded-lg border border-white/[0.08] bg-[#0C0C0E] px-3 py-3 text-center text-sm text-zinc-200">
                {step}
              </span>
              {idx < STEPS.length - 1 && (
                <span className="hidden text-emerald-500/40 sm:inline" aria-hidden>
                  →
                </span>
              )}
            </li>
          ))}
        </ol>

        <Link
          href={AUTOMATION_PATH}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300"
        >
          Know More About Automation
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
