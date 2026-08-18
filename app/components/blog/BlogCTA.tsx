import Link from "next/link";
import { getTrialSignupUrl } from "../../lib/trial";

export function BlogCTA({
  variant = "explore",
}: {
  variant?: "explore" | "trial";
}) {
  if (variant === "trial") {
    return (
      <div className="mt-10 border-t border-white/[0.06] pt-8">
        <p className="text-sm text-zinc-400">
          Explore the dashboard and automation controls with a 4-day free trial.
        </p>
        <Link
          href={getTrialSignupUrl()}
          className="mt-4 inline-flex min-h-[3rem] items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-400"
        >
          Start Your 4-Day Free Trial
        </Link>
      </div>
    );
  }

  return (
    <section className="border-t border-white/[0.06] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Explore PipAngel
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
          Review the platform, automation controls, and recorded performance before
          choosing a plan. Trading involves market risk.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-[3rem] items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-400"
          >
            Explore PipAngel
          </Link>
          <Link
            href={getTrialSignupUrl()}
            className="inline-flex min-h-[3rem] items-center justify-center rounded-xl border border-white/[0.12] px-6 py-3 text-sm font-medium text-zinc-200 transition-colors duration-200 hover:border-white/20"
          >
            Start Your 4-Day Free Trial
          </Link>
        </div>
      </div>
    </section>
  );
}
