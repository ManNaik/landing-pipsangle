import Link from "next/link";
import { ReadArrow } from "../editorial/ReadArrow";

export function NewsCTA() {
  return (
    <section className="border-t border-white/[0.06] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Stay Informed About the Markets
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
          Follow the latest forex developments and use market information alongside
          your own trading decisions.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-[3rem] items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-400"
          >
            Explore PipAngel
          </Link>
          <Link
            href="/trading-performance"
            className="group inline-flex min-h-[3rem] items-center gap-2 px-4 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:text-white"
          >
            View Performance
            <ReadArrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
