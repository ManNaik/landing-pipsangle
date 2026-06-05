import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PipAngel",
  description:
    "Learn about PipAngel — the forex signals and automated trading platform.",
};

export default function AboutPage() {
  return (
    <div className="min-w-0">
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            About PipAngel
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            Forex Signals & Automated Trading Platform
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl min-w-0 space-y-6 text-sm text-zinc-400 sm:text-base">
          <p>
            PipAngel helps traders trade smarter with professional forex
            signals and optional automation. We combine clear trade setups with
            strict risk management so you can follow signals manually or let the
            system execute trades on your account.
          </p>
          <p>
            Our platform is built for transparency: you can review performance
            history, understand each trade, and choose between signal-only or
            automated plans. Whether you are new to forex or an experienced
            trader, we aim to provide tools that support consistent, disciplined
            trading.
          </p>
          <p>
            Trading forex involves risk. We encourage you to understand the
            risks and only trade with capital you can afford to lose. Past
            performance does not guarantee future results.
          </p>
        </div>
      </section>
    </div>
  );
}
