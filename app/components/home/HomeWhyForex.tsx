import { FOREX_POINTS, FX_SESSIONS, HOME_MARKETS } from "../../lib/homeContent";

export function HomeWhyForex() {
  return (
    <section className="border-b border-zinc-800 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-500/80">
              Market
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Why Forex?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Forex is one of the world&apos;s largest and most actively traded
              financial markets.
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-[#0C0C0E] px-6 py-6 sm:px-8">
            <p className="font-mono text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              $9.6T
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Approximate average daily OTC foreign exchange turnover reported
              by the Bank for International Settlements in April 2025.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {FOREX_POINTS.map((point) => (
            <div key={point.title} className="border-t border-white/[0.08] pt-4">
              <h3 className="text-sm font-semibold text-white">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{point.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C0C0E] px-4 py-6 sm:px-8">
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Multiple Trading Sessions
          </p>
          <ol className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-0">
            {FX_SESSIONS.map((session, idx) => (
              <li key={session} className="flex items-center gap-2 sm:gap-3">
                <span className="rounded-full border border-white/[0.08] px-4 py-2 text-sm text-zinc-200">
                  {session}
                </span>
                {idx < FX_SESSIONS.length - 1 && (
                  <span className="text-emerald-500/40 sm:px-2" aria-hidden>
                    <span className="sm:hidden">↓</span>
                    <span className="hidden sm:inline">→</span>
                  </span>
                )}
              </li>
            ))}
            <li className="flex items-center gap-2 sm:gap-3">
              <span className="text-emerald-500/40 sm:px-2" aria-hidden>
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </span>
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/5 px-4 py-2 text-sm text-emerald-300">
                Global FX Market
              </span>
            </li>
          </ol>
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-sm leading-relaxed text-zinc-500">
          Forex is not risk-free and OTC trading has its own market structure
          and counterparty considerations. PipAngel is built around disciplined
          analysis and risk management rather than assuming markets are
          predictable.
        </p>

        <div className="mt-16 border-t border-zinc-800 pt-12">
          <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Built Around a Global Market
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Forex combines global participation, deep trading activity and
            continuous price discovery across major currency markets. PipAngel
            focuses its intelligence and execution systems on this environment.
          </p>

          <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            Markets We Focus On
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {HOME_MARKETS.map((market) => (
              <li
                key={market.symbol}
                className="rounded-xl border border-white/[0.08] bg-[#0C0C0E] px-4 py-4"
              >
                <p className="font-mono text-lg text-white">{market.symbol}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-zinc-500">
                  {market.category}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
