import type { Metadata } from "next";
import Link from "next/link";

const features = [
  "Automatic trade execution",
  "Risk based lot sizing",
  "Stop loss protection",
  "Take profit management",
  "24/7 monitoring",
];

const workflow = [
  "Signal generated",
  "Automation engine processes trade",
  "Trade executed on broker",
  "Risk management applied",
];

export const metadata: Metadata = {
  title: "Automated Forex Trading",
  description:
    "Automate your forex trading account using our smart trading system.",
};

export default function AutomatedForexTradingPage() {
  return (
    <div className="min-w-0">
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Automated Forex Trading System
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            Let our system execute trades automatically with strict risk
            management.
          </p>
          <div className="mt-8 sm:mt-10">
            <Link
              href="/signup"
              className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-medium text-white transition hover:bg-emerald-600 sm:w-auto"
            >
              Start Automation
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            Automation Features
          </h2>
          <ul className="mt-6 grid gap-3 sm:mt-10 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-zinc-300 text-sm sm:text-base">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            How It Works
          </h2>
          <ol className="mt-6 space-y-3 sm:mt-10 sm:space-y-4">
            {workflow.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 sm:gap-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-base font-bold text-emerald-400 sm:h-10 sm:w-10 sm:text-lg">
                  {i + 1}
                </span>
                <span className="text-zinc-300 text-sm sm:text-base">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Link
            href="/pricing"
            className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-medium text-white transition hover:bg-emerald-600 sm:w-auto"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
