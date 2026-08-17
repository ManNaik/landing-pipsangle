import { AUTOMATION_PIPELINE } from "../../lib/automationContent";
import { AutomationIcon } from "./AutomationIcon";

const CIRCLE = "h-10 w-10";

export function AutomationPipeline() {
  return (
    <section
      id="pipeline"
      className="border-b border-white/[0.06] bg-[#0A0A0A] px-4 py-12 sm:px-6 sm:py-14 lg:px-8"
    >
      <div className="mx-auto min-w-0 max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
            From Market Intelligence to Execution
          </h2>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            Every trade passes through multiple layers before reaching your
            account.
          </p>
        </div>

        {/* Desktop signature pipeline */}
        <div className="relative mt-10 hidden xl:block">
          <div className="relative">
            <div className="automation-pipeline-line" aria-hidden />
            <div className="automation-pipeline-line-track" aria-hidden>
              <span className="automation-pipeline-travel" />
            </div>
            <ol className="grid grid-cols-5 gap-x-3">
              {AUTOMATION_PIPELINE.map((stage) => (
                <li key={stage.step} className="group flex flex-col items-center text-center">
                  <div
                    className={`relative z-20 flex ${CIRCLE} items-center justify-center rounded-full border border-emerald-500/35 bg-[#0D0F10] ring-4 ring-[#0A0A0A] transition group-hover:border-emerald-500/60`}
                  >
                    <AutomationIcon name={stage.icon} />
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 font-mono text-[9px] font-bold text-black">
                      {stage.step.replace("0", "")}
                    </span>
                  </div>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-emerald-500/70">
                    {stage.shortTitle}
                  </p>
                  <h3 className="mt-1 min-h-[2.5rem] text-sm font-semibold leading-snug text-white">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    {stage.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Tablet scroll */}
        <div className="relative mt-8 hidden md:block xl:hidden">
          <div className="-mx-4 overflow-x-auto px-4 pb-2 overscroll-x-contain scrollbar-subtle">
            <ol className="flex min-w-max gap-3">
              {AUTOMATION_PIPELINE.map((stage) => (
                <li
                  key={stage.step}
                  className="w-[220px] shrink-0 rounded-2xl border border-white/[0.06] bg-[#0D0F10] p-4"
                >
                  <div className={`flex ${CIRCLE} items-center justify-center rounded-full border border-emerald-500/35 bg-black/40 text-emerald-400`}>
                    <AutomationIcon name={stage.icon} />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white">{stage.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">{stage.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Mobile vertical */}
        <ol className="relative mt-8 space-y-0 md:hidden">
          {AUTOMATION_PIPELINE.map((stage, idx) => (
            <li key={stage.step} className="relative flex gap-3 pb-8 last:pb-0">
              {idx < AUTOMATION_PIPELINE.length - 1 && (
                <span
                  className="absolute left-5 top-10 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/40 to-white/[0.06]"
                  aria-hidden
                />
              )}
              <div className={`relative z-10 flex ${CIRCLE} shrink-0 items-center justify-center rounded-full border border-emerald-500/35 bg-[#0D0F10] text-emerald-400`}>
                <AutomationIcon name={stage.icon} />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-500/70">
                  {stage.shortTitle}
                </p>
                <h3 className="mt-1 text-sm font-semibold text-white">{stage.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{stage.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
