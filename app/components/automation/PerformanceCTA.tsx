import Link from "next/link";

export function PerformanceCTA() {
  return (
    <section className="border-b border-white/[0.06] bg-[#050505] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto min-w-0 max-w-3xl px-2 text-center sm:px-0">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
          See the Results
        </h2>
        <p className="mt-4 text-sm text-zinc-400 sm:text-base">
          Don&apos;t just read about the system. Review the trading performance.
        </p>
        <Link
          href="/trading-performance"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition hover:text-emerald-300 sm:mt-8 sm:text-base"
        >
          View Live Performance
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
