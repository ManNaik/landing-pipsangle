import Link from "next/link";

type AutomationFinalCTAProps = {
  signupUrl?: string;
};

export function AutomationFinalCTA({
  signupUrl = "/signup",
}: AutomationFinalCTAProps) {
  return (
    <section className="bg-[#0A0A0A] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto min-w-0 max-w-3xl rounded-2xl border border-white/[0.08] bg-[#0D0F10] px-4 py-10 text-center sm:px-8 sm:py-12">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
          Ready to Automate Your Execution?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Connect your trading account and let PipAngel handle the execution
          process through its automated trading infrastructure.
        </p>
        <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href={signupUrl}
            className="inline-flex min-h-[3rem] w-full items-center justify-center gap-1 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 sm:w-auto sm:px-8 sm:text-base"
          >
            Get Started
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/trading-performance"
            className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] sm:w-auto sm:px-8 sm:text-base"
          >
            View Performance
          </Link>
        </div>
        <p className="mx-auto mt-6 max-w-md text-[11px] leading-relaxed text-zinc-600 sm:text-xs">
          Forex trading involves substantial risk. Risk controls are designed
          to manage exposure but cannot eliminate market, execution, or liquidity
          risk. Past performance does not guarantee future results.
        </p>
      </div>
    </section>
  );
}
