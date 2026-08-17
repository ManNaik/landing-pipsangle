import { RISK_FLOW } from "../../lib/automationContent";

export function RiskEngineVisualization() {
  return (
    <section className="border-b border-white/[0.06] bg-[#0A0A0A] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
              Risk Is Calculated Before Execution.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Trading involves losses. The objective is not to pretend losses
              don&apos;t happen. It is to control exposure when they do.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              PipAngel applies predefined risk controls and position-sizing rules
              designed to control the amount of capital exposed to each trade.
            </p>
          </div>

          <div className="relative min-w-0">
            <div
              className="automation-glow pointer-events-none absolute -inset-2 rounded-2xl bg-emerald-500/5 blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0F10] p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  Risk Engine
                </p>
                <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                  System Preview
                </span>
              </div>

              <div className="mt-4">
                {RISK_FLOW.map((item, idx) => {
                  const isLast = idx === RISK_FLOW.length - 1;

                  return (
                    <div key={item.label}>
                      <div className="grid grid-cols-[16px_minmax(0,1fr)] items-center gap-3">
                        <div className="relative flex h-full min-h-[3.25rem] items-center justify-center">
                          {!isLast && (
                            <span
                              className="absolute left-1/2 top-1/2 h-[calc(50%+0.75rem)] w-px -translate-x-1/2 bg-emerald-500/25"
                              aria-hidden
                            />
                          )}
                          {idx > 0 && (
                            <span
                              className="absolute bottom-1/2 left-1/2 h-[calc(50%+0.75rem)] w-px -translate-x-1/2 bg-emerald-500/25"
                              aria-hidden
                            />
                          )}
                          <span
                            className="relative z-10 h-2.5 w-2.5 rounded-full border border-emerald-500/50 bg-[#0D0F10]"
                            aria-hidden
                          />
                        </div>

                        <div
                          className="automation-risk-highlight min-w-0 rounded-lg border border-white/[0.06] bg-black/40 px-3.5 py-3 sm:px-4"
                          style={{ animationDelay: `${idx * 0.8}s` }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-zinc-500 sm:text-xs">
                              {item.label}
                            </span>
                            <span className="min-w-0 truncate text-right font-mono text-xs font-medium text-emerald-400/90 sm:text-sm">
                              {item.value}
                            </span>
                          </div>
                        </div>
                      </div>

                      {!isLast && (
                        <div
                          className="grid grid-cols-[16px_minmax(0,1fr)] items-center gap-3 py-1"
                          aria-hidden
                        >
                          <span className="h-3 w-px justify-self-center bg-emerald-500/25" />
                          <span className="text-center text-emerald-500/30">↓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-[16px_minmax(0,1fr)] items-center gap-3">
                <span aria-hidden />
                <div className="flex items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5">
                  <span className="font-mono text-xs font-medium text-emerald-400">
                    ✓ WITHIN CONFIGURED LIMIT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
