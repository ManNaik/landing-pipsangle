import type { Metadata } from "next";
import Link from "next/link";

const recentTrades = [
  { pair: "EURUSD", entry: "1.0842", result: "+48 pips" },
  { pair: "GBPUSD", entry: "1.2670", result: "+55 pips" },
  { pair: "USDJPY", entry: "150.20", result: "+80 pips" },
  { pair: "XAUUSD", entry: "2020", result: "+20" },
];

export const metadata: Metadata = {
  title: "Forex Trading Performance",
  description:
    "Track our trading performance and historical trade results.",
};

export default function TradingPerformancePage() {
  return (
    <div className="min-w-0">
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Forex Trading Performance
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            Transparent results and historical trade data.
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            Key Statistics
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center sm:p-8">
              <p className="text-2xl font-bold text-emerald-400 sm:text-3xl">72%</p>
              <p className="mt-1 text-sm text-zinc-500">Win Rate</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center sm:p-8">
              <p className="text-2xl font-bold text-white sm:text-3xl">45</p>
              <p className="mt-1 text-sm text-zinc-500">Average Pips</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center sm:p-8">
              <p className="text-2xl font-bold text-amber-400 sm:text-3xl">9%</p>
              <p className="mt-1 text-sm text-zinc-500">Max Drawdown</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            Recent Trades
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-800 -mx-4 px-4 sm:mx-0 sm:px-0 sm:mt-10 overscroll-x-contain">
            <table className="w-full min-w-[280px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Pair</th>
                  <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Entry</th>
                  <th className="px-3 py-2.5 font-medium text-emerald-400 sm:px-4 sm:py-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {recentTrades.map((t) => (
                  <tr
                    key={t.pair}
                    className="border-b border-zinc-800/80 hover:bg-zinc-800/30"
                  >
                    <td className="px-3 py-2.5 font-medium sm:px-4 sm:py-3">{t.pair}</td>
                    <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3">{t.entry}</td>
                    <td className="px-3 py-2.5 font-medium text-emerald-400 sm:px-4 sm:py-3">{t.result}</td>
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
            href="/signup"
            className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-medium text-white transition hover:bg-emerald-600 sm:w-auto"
          >
            Start Trading
          </Link>
        </div>
      </section>
    </div>
  );
}
