import { formatEditorialTime } from "../../lib/newsContent";

export function NewsHero({ updatedAt }: { updatedAt?: string }) {
  return (
    <section className="border-b border-white/[0.06] bg-[#050505] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="editorial-fade-up mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-500/85">
            Forex Market News
          </p>
          <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200/90">
            Demo Content
          </span>
        </div>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]">
          What Is Moving the Currency Markets
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Daily forex market updates, macroeconomic developments, central bank
          decisions, and events influencing major currency pairs.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
          <span className="text-sm text-zinc-200">Market News</span>
          <span className="text-sm text-zinc-500">
            {updatedAt ? `Updated ${formatEditorialTime(updatedAt)}` : "Updated regularly"}
          </span>
        </div>
      </div>
    </section>
  );
}
