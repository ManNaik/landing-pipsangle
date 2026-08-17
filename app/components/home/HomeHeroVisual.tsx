import { HOME_AI_FACTORS } from "../../lib/homeContent";

export function HomeHeroVisual() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-md lg:max-w-none">
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C0C0E] p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            Market Intelligence
          </p>
          <span className="text-[10px] uppercase tracking-wider text-zinc-600">
            System Preview
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD"].map((symbol) => (
            <div
              key={symbol}
              className="rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2 font-mono text-xs text-zinc-200"
            >
              {symbol}
            </div>
          ))}
        </div>

        <div className="my-3 flex justify-center text-emerald-500/40" aria-hidden>
          ↓
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            AI Market Intelligence
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {HOME_AI_FACTORS.map((factor) => (
              <span
                key={factor}
                className="rounded-md border border-white/[0.06] px-2 py-1 text-[11px] text-zinc-400"
              >
                {factor}
              </span>
            ))}
            <span className="rounded-md border border-white/[0.06] px-2 py-1 text-[11px] text-zinc-400">
              Macro Factors
            </span>
          </div>
        </div>

        <div className="my-3 flex justify-center text-emerald-500/40" aria-hidden>
          ↓
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-3">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">
            Opportunity Detected
          </p>
          <p className="mt-1 text-sm font-medium text-white">EUR/USD · context reviewed</p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Risk Analysis</p>
            <p className="mt-1 text-xs text-zinc-300">Exposure evaluated</p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Execution</p>
            <p className="mt-1 font-mono text-xs text-emerald-400">READY</p>
          </div>
        </div>
      </div>
    </div>
  );
}
