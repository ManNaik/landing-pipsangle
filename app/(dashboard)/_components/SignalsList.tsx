import {
  formatDateTime,
  formatSignalStatus,
} from "../../lib/format";
import type { Signal, SignalStatus } from "../../lib/types";

type SignalsListProps = {
  signals: Signal[];
};

function statusBadgeClass(status: SignalStatus): string {
  switch (status) {
    case "active":
      return "bg-emerald-500/15 text-emerald-400";
    case "hit_tp":
      return "bg-emerald-500/20 text-emerald-300";
    case "hit_sl":
      return "bg-red-500/15 text-red-400";
    case "cancelled":
      return "bg-zinc-800 text-zinc-400";
    case "expired":
      return "bg-zinc-800/80 text-zinc-500";
    default:
      return "bg-zinc-800 text-zinc-300";
  }
}

export function SignalsList({ signals }: SignalsListProps) {
  return (
    <section className="flex h-[26rem] min-w-0 flex-col gap-3 sm:h-[30rem]">
      <div className="shrink-0">
        <h2 className="text-base font-medium text-white">Signals sent</h2>
        <p className="mt-0.5 text-sm text-zinc-500">
          All trade signals delivered to your account
        </p>
      </div>

      <div className="scrollbar-subtle min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {signals.map((signal) => (
          <article
            key={signal.id}
            className="rounded-xl bg-zinc-900/40 px-4 py-3.5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-medium text-white">
                  {signal.pair}{" "}
                  <span
                    className={
                      signal.direction === "BUY"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {signal.direction}
                  </span>
                </p>
                <p className="text-xs tabular-nums text-zinc-400">
                  Entry {signal.entry} · SL {signal.stop_loss} · TP{" "}
                  {signal.take_profit}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusBadgeClass(signal.status)}`}
              >
                {formatSignalStatus(signal.status)}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-zinc-500">
              {formatDateTime(signal.issued_at)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
