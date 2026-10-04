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

export function formatPipsResult(pips: number): string {
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

/** Fixed locale and time zone so server and client render the same text. */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Quote a price with the decimals traders expect: JPY pairs 3, gold 2, other majors 5. */
export function formatQuote(pair: string, value: string | number): string {
  const number = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(number)) return String(value);
  const symbol = pair.toUpperCase();
  const digits = symbol.includes("XAU") ? 2 : symbol.endsWith("JPY") ? 3 : 5;
  return number.toFixed(digits);
}

export function formatSignedPips(pips: number): string {
  const rounded = Math.round(pips * 10) / 10;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toLocaleString("en-US")} pips`;
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
