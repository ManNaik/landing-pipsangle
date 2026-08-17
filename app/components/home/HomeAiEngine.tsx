import { HOME_AI_FACTORS, HOME_AI_READS } from "../../lib/homeContent";

export function HomeAiEngine() {
  return (
    <section
      id="intelligence"
      className="border-b border-zinc-800 bg-[#080808] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-500/80">
            Intelligence
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            AI Market Intelligence Engine
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Market conditions are analyzed across multiple trading factors to
            identify potential opportunities before execution.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_minmax(0,0.85fr)] lg:items-start">
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C0C0E] p-4 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                Analysis Layer
              </p>
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                System Preview
              </span>
            </div>

            <div className="mt-5 rounded-xl border border-white/[0.06] bg-black/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Market Data
              </p>
              <p className="mt-2 font-mono text-sm text-zinc-200">
                EUR/USD · GBP/USD · USD/JPY · XAU/USD
              </p>
            </div>

            <div className="my-2 flex justify-center text-emerald-500/35" aria-hidden>
              ↓
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Market Structure
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {HOME_AI_FACTORS.map((factor) => (
                  <div
                    key={factor}
                    className="rounded-lg border border-white/[0.05] px-2 py-2 text-center text-xs text-zinc-300"
                  >
                    {factor}
                  </div>
                ))}
              </div>
            </div>

            <div className="my-2 flex justify-center text-emerald-500/35" aria-hidden>
              ↓
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-black/40 p-4">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                AI Analysis
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-3">
                {HOME_AI_READS.map((item) => (
                  <div key={item.label}>
                    <dt className="text-[11px] text-zinc-500">{item.label}</dt>
                    <dd className="mt-0.5 text-sm text-zinc-200">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="my-2 flex justify-center text-emerald-500/35" aria-hidden>
              ↓
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Trading Opportunity
              </p>
              <p className="mt-2 text-lg font-medium text-white">EUR/USD</p>
              <p className="mt-1 text-sm text-zinc-400">Potential setup under review</p>
            </div>
          </div>

          <div className="min-w-0 lg:pt-4">
            <h3 className="text-lg font-semibold text-white">
              An intelligence layer, not a prediction machine.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              PipAngel uses AI for market analysis, context evaluation,
              opportunity identification, risk-aware filtering and trade
              selection. It does not predict the future or guarantee outcomes.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-400">
              {[
                "Market analysis across structure, momentum and volatility",
                "Context evaluation before a setup is considered",
                "Risk-aware filtering before capital is exposed",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
