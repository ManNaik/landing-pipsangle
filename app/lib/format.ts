import type { ExecutedTradeStatus, SignalStatus } from "./types";

export function formatRelativeTime(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
}

export function formatSignalStatus(status: SignalStatus): string {
  const labels: Record<SignalStatus, string> = {
    active: "ACTIVE",
    hit_tp: "HIT TP",
    hit_sl: "HIT SL",
    cancelled: "CANCELLED",
    expired: "EXPIRED",
  };
  return labels[status] ?? status.toUpperCase();
}

export function formatPipsResult(pips: number, result: string): string {
  const sign = pips >= 0 ? "+" : "";
  return `${sign}${pips} pips`;
}

export function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function isLiveExecutedTrade(status: ExecutedTradeStatus): boolean {
  return status === "open";
}

export function formatExecutedTradeStatus(status: ExecutedTradeStatus): string {
  const labels: Record<ExecutedTradeStatus, string> = {
    open: "Live",
    closed: "Closed",
    cancelled: "Cancelled",
  };
  return labels[status] ?? status;
}

export function formatExecutedTradeProfitLabel(status: ExecutedTradeStatus): string {
  if (status === "open") return "Unrealized P/L";
  if (status === "closed") return "Final P/L";
  return "P/L";
}

export function formatSignedCurrency(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}
