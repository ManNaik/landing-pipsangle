import type { Metadata } from "next";
import Link from "next/link";

const features = [
  "Daily trade signals",
  "Entry price levels",
  "Stop loss protection",
  "Take profit targets",
  "Market analysis",
];

const exampleSignals = [
  {
    pair: "EURUSD",
    entry: "1.0842",
    stopLoss: "1.0820",
    takeProfit: "1.0890",
  },
  {
    pair: "GBPUSD",
    entry: "1.2670",
    stopLoss: "1.2645",
    takeProfit: "1.2725",
  },
];

export const metadata: Metadata = {
  title: "Forex Trading Signals",
  description:
    "Receive daily forex trading signals including entry price, stop loss, and take profit.",
};

export default function ForexSignalsPage() {
  return (
    <div className="min-w-0">
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Professional Forex Trading Signals
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            Daily trade setups with clear entry, stop loss and take profit.
          </p>
          <div className="mt-8 sm:mt-10">
            <Link
              href="/signup"
              className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-medium text-white transition hover:bg-emerald-600 sm:w-auto"
            >
              Get Signals
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            What You Get
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
        <div className="mx-auto max-w-4xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            Example Signals
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-800 -mx-4 px-4 sm:mx-0 sm:px-0 sm:mt-10 overscroll-x-contain">
            <table className="w-full min-w-[320px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Pair</th>
                  <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Entry</th>
                  <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Stop Loss</th>
                  <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Take Profit</th>
                </tr>
              </thead>
              <tbody>
                {exampleSignals.map((s) => (
                  <tr
                    key={s.pair}
                    className="border-b border-zinc-800/80 hover:bg-zinc-800/30"
                  >
                    <td className="px-3 py-2.5 font-medium sm:px-4 sm:py-3">{s.pair}</td>
                    <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3">{s.entry}</td>
                    <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3">{s.stopLoss}</td>
                    <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3">{s.takeProfit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
