import type { Signal } from "./types";

export type SignalOutcome = {
  signal: Signal;
  result: "profit" | "loss";
  percentage: number;
};

export type SignalPerformance = {
  outcomes: SignalOutcome[];
  total: number;
  profitHits: number;
  lossHits: number;
  profitHitPercent: number;
  lossHitPercent: number;
};

export function signalOutcome(signal: Signal): SignalOutcome | null {
  if (signal.status !== "hit_tp" && signal.status !== "hit_sl") return null;

  const entry = Number(signal.entry);
  const exit = Number(signal.status === "hit_tp" ? signal.take_profit : signal.stop_loss);
  if (!Number.isFinite(entry) || !Number.isFinite(exit) || entry === 0) return null;

  const movement =
    signal.direction === "BUY"
      ? ((exit - entry) / entry) * 100
      : ((entry - exit) / entry) * 100;

  return {
    signal,
    result: signal.status === "hit_tp" ? "profit" : "loss",
    percentage: Math.round(movement * 100) / 100,
  };
}

export function getSignalPerformance(signals: Signal[]): SignalPerformance {
  const outcomes = signals
    .map(signalOutcome)
    .filter((outcome): outcome is SignalOutcome => outcome !== null)
    .sort(
      (a, b) =>
        new Date(b.signal.closed_at ?? b.signal.issued_at).getTime() -
        new Date(a.signal.closed_at ?? a.signal.issued_at).getTime()
    );
  const profitHits = outcomes.filter((outcome) => outcome.result === "profit").length;
  const lossHits = outcomes.length - profitHits;

  return {
    outcomes,
    total: outcomes.length,
    profitHits,
    lossHits,
    profitHitPercent: outcomes.length ? Math.round((profitHits / outcomes.length) * 100) : 0,
    lossHitPercent: outcomes.length ? Math.round((lossHits / outcomes.length) * 100) : 0,
  };
}
