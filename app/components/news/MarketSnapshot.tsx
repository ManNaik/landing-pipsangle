import type { MarketSnapshotItem } from "../../lib/newsContent";

export function MarketSnapshot({ items }: { items: MarketSnapshotItem[] }) {
  return (
    <section className="border-b border-white/[0.06] bg-[#070707] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 flex items-center gap-2">
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            Market snapshot
          </p>
          <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200/90">
            Demo
          </span>
        </div>
        <div className="flex gap-px overflow-x-auto bg-white/[0.06] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-4">
          {items.map((item) => {
            const up = item.changePercent >= 0;
            return (
              <div key={item.symbol} className="min-w-[9.5rem] bg-[#070707] px-4 py-3 sm:min-w-0">
                <p className="text-[11px] font-medium tracking-[0.12em] text-zinc-500">
                  {item.symbol}
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-white">{item.price}</p>
                <p
                  className={`mt-0.5 text-xs tabular-nums ${up ? "text-emerald-400" : "text-red-400"}`}
                >
                  {up ? "+" : ""}
                  {item.changePercent.toFixed(2)}%
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-zinc-600">
          Demo values shown for interface preview. Not live market prices.
        </p>
      </div>
    </section>
  );
}
