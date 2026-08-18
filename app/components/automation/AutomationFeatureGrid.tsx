import { FEATURE_LARGE, FEATURE_SMALL } from "../../lib/automationContent";
import { AutomationIcon } from "./AutomationIcon";

function ExecutionVisual() {
  return (
    <div className="mt-5 rounded-xl border border-white/[0.06] bg-black/50 p-3 font-mono text-[11px] sm:text-xs">
      <div className="flex items-center justify-between">
        <span className="text-white">EUR/USD</span>
        <span className="text-emerald-400">BUY</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-zinc-400">
        <div>
          <p className="text-zinc-600">Entry</p>
          <p className="text-zinc-200">1.16420</p>
        </div>
        <div>
          <p className="text-zinc-600">Stop Loss</p>
          <p className="text-zinc-200">1.16280</p>
        </div>
        <div className="col-span-2">
          <p className="text-zinc-600">Position</p>
          <p className="text-zinc-200">0.12 LOT</p>
        </div>
      </div>
      <p className="mt-3 text-emerald-400">✓ EXECUTED</p>
      <p className="mt-2 text-[10px] uppercase tracking-wider text-zinc-600">System Preview</p>
    </div>
  );
}

function SizingVisual() {
  const steps = [
    { label: "Account", value: "$10,000" },
    { label: "Risk", value: "1.0%" },
    { label: "Exposure", value: "$100" },
    { label: "Position", value: "0.12 LOT" },
  ];

  return (
    <div className="mt-5 space-y-0 rounded-xl border border-white/[0.06] bg-black/50 p-3 font-mono text-[11px] sm:text-xs">
      {steps.map((step, idx) => (
        <div key={step.label}>
          <div
            className="flex items-center justify-between py-1.5 automation-risk-highlight"
            style={{ animationDelay: `${idx * 0.6}s` }}
          >
            <span className="text-zinc-600">{step.label}</span>
            <span className="text-zinc-200">{step.value}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex justify-center py-0.5 text-emerald-500/50" aria-hidden>
              ↓
            </div>
          )}
        </div>
      ))}
      <p className="mt-2 text-[10px] uppercase tracking-wider text-zinc-600">System Preview</p>
    </div>
  );
}

export function AutomationFeatureGrid() {
  const [execution, sizing] = FEATURE_LARGE;

  return (
    <section className="border-b border-white/[0.06] bg-[#050505] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
            Built for Automated Execution
          </h2>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            What happens between validation and execution inside the system.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/[0.06] bg-[#0D0F10] p-5 sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-emerald-400">
              <AutomationIcon name="terminal" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{execution.title}</h3>
            <p className="mt-1 text-sm font-medium text-zinc-300">{execution.headline}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{execution.description}</p>
            <ExecutionVisual />
          </article>

          <article className="rounded-2xl border border-white/[0.06] bg-[#0D0F10] p-5 sm:p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-emerald-400">
              <AutomationIcon name="calculator" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{sizing.title}</h3>
            <p className="mt-1 text-sm font-medium text-zinc-300">{sizing.headline}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{sizing.description}</p>
            <SizingVisual />
          </article>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURE_SMALL.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-white/[0.06] bg-[#0D0F10] p-4 sm:p-5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-emerald-400">
                <AutomationIcon name={feature.icon} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">{feature.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
