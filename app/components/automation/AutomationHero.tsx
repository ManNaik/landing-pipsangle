import Link from "next/link";
import { AutomationDashboardVisual } from "./AutomationDashboardVisual";

type AutomationHeroProps = {
  signupUrl?: string;
};

export function AutomationHero({ signupUrl = "/signup" }: AutomationHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-[#050505] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(16,185,129,0.08),transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto grid min-w-0 max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="automation-fade-up min-w-0 text-center lg:text-left">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-500/80 sm:text-xs">
            Automated Forex Execution
          </p>
          <h1 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
            Your Trades.
            <br />
            Executed Automatically.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-400 sm:text-base md:text-lg lg:mx-0">
            AI-powered trade intelligence with disciplined risk management and
            automated MT5 execution.
          </p>
          <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={signupUrl}
              className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 sm:w-auto sm:px-6"
            >
              Connect IC Markets MT5
            </Link>
            <Link
              href="#pipeline"
              className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] sm:w-auto sm:px-6"
            >
              See How It Works
            </Link>
          </div>
        </div>
        <div className="automation-fade-up min-w-0 w-full lg:justify-self-end">
          <AutomationDashboardVisual />
        </div>
      </div>
    </section>
  );
}
