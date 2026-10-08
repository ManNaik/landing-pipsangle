import { formatDateTime } from "../../lib/format";
import { getSignalPerformance } from "../../lib/signalPerformance";
import type { Signal } from "../../lib/types";

type SignalPerformanceProps = {
  signals: Signal[];
};

function formatPercentage(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function SignalPerformance({ signals }: SignalPerformanceProps) {
  const performance = getSignalPerformance(signals);

  return (
    <section className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5">
      <div>
        <h2 className="text-base font-semibold text-white">General signal outcomes</h2>
        <p className="mt-0.5 text-sm text-zinc-500">
          Results for published signals, independent of your account size or copied lot size
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
          <p className="text-xs text-zinc-500">Completed</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-white">{performance.total}</p>
        </div>
        <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] p-3">
          <p className="text-xs text-emerald-300/70">Profit hit</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-emerald-400">
            {performance.profitHitPercent}%
          </p>
          <p className="text-xs text-zinc-500">{performance.profitHits} signals</p>
        </div>
        <div className="rounded-xl border border-red-500/15 bg-red-500/[0.06] p-3">
          <p className="text-xs text-red-300/70">Loss hit</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-red-400">
            {performance.lossHitPercent}%
          </p>
          <p className="text-xs text-zinc-500">{performance.lossHits} signals</p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-zinc-800/80 overflow-hidden rounded-xl border border-zinc-800">
        {performance.outcomes.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-zinc-500">
            No completed signal outcomes yet.
          </p>
        ) : (
          performance.outcomes.slice(0, 8).map(({ signal, result, percentage }) => (
            <div
              key={signal.id}
              className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/30 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {signal.pair} <span className="text-zinc-500">{signal.direction}</span>
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {formatDateTime(signal.closed_at ?? signal.issued_at)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${
                    result === "profit" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {result === "profit" ? "Profit hit" : "Loss hit"}
                </p>
                <p
                  className={`text-sm font-medium tabular-nums ${
                    percentage >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatPercentage(percentage)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-3 text-xs text-zinc-600">
        Percentage is the underlying market-price move from entry to the TP or SL level, not the
        return on a customer account.
      </p>
    </section>
  );
}
