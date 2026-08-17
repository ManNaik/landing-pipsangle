const LAYERS = [
  "PipAngel",
  "IC Markets",
  "MetaTrader 5",
  "Your Trading Account",
] as const;

export function HomeIcMarkets() {
  return (
    <section className="border-b border-zinc-800 bg-[#080808] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
            Built Specifically for IC Markets MT5
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
            PipAngel is designed around a focused execution environment: IC
            Markets through MetaTrader 5.
          </p>
        </div>

        <ol className="flex flex-col gap-0 sm:flex-row sm:items-center sm:gap-2">
          {LAYERS.map((layer, idx) => (
            <li key={layer} className="flex flex-1 flex-col items-center sm:flex-row sm:gap-2">
              <span className="w-full rounded-lg border border-white/[0.08] bg-[#0C0C0E] px-3 py-2.5 text-center text-sm text-zinc-200">
                {layer}
              </span>
              {idx < LAYERS.length - 1 && (
                <span className="py-1 text-emerald-500/40 sm:px-0" aria-hidden>
                  <span className="sm:hidden">↓</span>
                  <span className="hidden sm:inline">→</span>
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
