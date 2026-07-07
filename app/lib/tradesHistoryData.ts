import type { ExecutedTrade, ExecutedTradeStatus, TradeDirection } from "./types";

const now = new Date();
const daysAgo = (n: number) =>
  new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();
const hoursAgo = (n: number) =>
  new Date(now.getTime() - n * 60 * 60 * 1000).toISOString();

type TradeSeed = {
  pair: string;
  direction: TradeDirection;
  entry: string;
  exit?: string | null;
  current_price?: string | null;
  profit_loss: number;
  status: ExecutedTradeStatus;
  executed_at: string;
};

const PAIRS = [
  "EUR/USD",
  "GBP/JPY",
  "USD/CAD",
  "AUD/USD",
  "XAU/USD",
  "GBP/USD",
  "USD/JPY",
  "EUR/GBP",
  "NZD/USD",
  "EUR/JPY",
  "USD/CHF",
  "CAD/JPY",
] as const;

const SEEDS: TradeSeed[] = [
  {
    pair: "EUR/USD",
    direction: "BUY",
    entry: "1.0865",
    current_price: "1.0882",
    profit_loss: 18.6,
    status: "open",
    executed_at: hoursAgo(1),
  },
  {
    pair: "USD/JPY",
    direction: "BUY",
    entry: "149.85",
    current_price: "150.12",
    profit_loss: 42.3,
    status: "open",
    executed_at: hoursAgo(4),
  },
  {
    pair: "XAU/USD",
    direction: "BUY",
    entry: "2358.20",
    current_price: "2351.40",
    profit_loss: -34.0,
    status: "open",
    executed_at: hoursAgo(8),
  },
  {
    pair: "EUR/USD",
    direction: "BUY",
    entry: "1.0842",
    exit: "1.0895",
    profit_loss: 186.4,
    status: "closed",
    executed_at: daysAgo(1),
  },
  {
    pair: "GBP/USD",
    direction: "SELL",
    entry: "1.2680",
    exit: "1.2610",
    profit_loss: 168.75,
    status: "closed",
    executed_at: hoursAgo(3),
  },
  {
    pair: "GBP/JPY",
    direction: "SELL",
    entry: "188.45",
    exit: "187.20",
    profit_loss: 312.8,
    status: "closed",
    executed_at: daysAgo(2),
  },
  {
    pair: "USD/CAD",
    direction: "BUY",
    entry: "1.3620",
    exit: "1.3585",
    profit_loss: -94.2,
    status: "closed",
    executed_at: daysAgo(3),
  },
  {
    pair: "AUD/USD",
    direction: "SELL",
    entry: "0.6580",
    exit: "0.6520",
    profit_loss: 142.5,
    status: "closed",
    executed_at: daysAgo(4),
  },
  {
    pair: "XAU/USD",
    direction: "BUY",
    entry: "2342.50",
    exit: "2368.00",
    profit_loss: 255.0,
    status: "closed",
    executed_at: daysAgo(5),
  },
  {
    pair: "EUR/GBP",
    direction: "BUY",
    entry: "0.8562",
    exit: "0.8562",
    profit_loss: 0,
    status: "cancelled",
    executed_at: daysAgo(5),
  },
  {
    pair: "NZD/USD",
    direction: "SELL",
    entry: "0.6048",
    exit: "0.5995",
    profit_loss: 127.4,
    status: "closed",
    executed_at: daysAgo(8),
  },
  { pair: "EUR/JPY", direction: "BUY", entry: "162.45", exit: "163.35", profit_loss: 198.2, status: "closed", executed_at: daysAgo(10) },
  { pair: "USD/CHF", direction: "SELL", entry: "0.8842", exit: "0.8795", profit_loss: 112.6, status: "closed", executed_at: daysAgo(12) },
  { pair: "CAD/JPY", direction: "BUY", entry: "110.25", exit: "109.80", profit_loss: -78.4, status: "closed", executed_at: daysAgo(14) },
  { pair: "GBP/USD", direction: "BUY", entry: "1.2540", exit: "1.2615", profit_loss: 145.0, status: "closed", executed_at: daysAgo(16) },
  { pair: "AUD/USD", direction: "BUY", entry: "0.6512", exit: "0.6488", profit_loss: -62.3, status: "closed", executed_at: daysAgo(18) },
  { pair: "EUR/USD", direction: "SELL", entry: "1.0920", exit: "1.0875", profit_loss: 134.8, status: "closed", executed_at: daysAgo(21) },
  { pair: "USD/JPY", direction: "SELL", entry: "151.20", exit: "150.45", profit_loss: 89.5, status: "closed", executed_at: daysAgo(24) },
  { pair: "XAU/USD", direction: "SELL", entry: "2385.00", exit: "2362.50", profit_loss: 175.2, status: "closed", executed_at: daysAgo(27) },
  { pair: "GBP/JPY", direction: "BUY", entry: "186.80", exit: "187.95", profit_loss: 221.4, status: "closed", executed_at: daysAgo(30) },
  { pair: "NZD/USD", direction: "BUY", entry: "0.5985", exit: "0.6012", profit_loss: 54.7, status: "closed", executed_at: daysAgo(33) },
  { pair: "EUR/GBP", direction: "SELL", entry: "0.8610", exit: "0.8582", profit_loss: 98.3, status: "closed", executed_at: daysAgo(36) },
  { pair: "USD/CAD", direction: "SELL", entry: "1.3685", exit: "1.3720", profit_loss: -71.6, status: "closed", executed_at: daysAgo(39) },
  { pair: "EUR/JPY", direction: "SELL", entry: "164.10", exit: "163.25", profit_loss: 156.9, status: "closed", executed_at: daysAgo(42) },
  { pair: "USD/CHF", direction: "BUY", entry: "0.8710", exit: "0.8755", profit_loss: 118.2, status: "closed", executed_at: daysAgo(45) },
  { pair: "CAD/JPY", direction: "SELL", entry: "111.80", exit: "112.35", profit_loss: -88.1, status: "closed", executed_at: daysAgo(48) },
  { pair: "EUR/USD", direction: "BUY", entry: "1.0785", exit: "1.0830", profit_loss: 167.5, status: "closed", executed_at: daysAgo(52) },
  { pair: "GBP/USD", direction: "SELL", entry: "1.2720", exit: "1.2655", profit_loss: 192.3, status: "closed", executed_at: daysAgo(55) },
  { pair: "AUD/USD", direction: "SELL", entry: "0.6645", exit: "0.6590", profit_loss: 138.6, status: "closed", executed_at: daysAgo(58) },
  { pair: "XAU/USD", direction: "BUY", entry: "2298.00", exit: "2325.50", profit_loss: 248.7, status: "closed", executed_at: daysAgo(62) },
  { pair: "USD/JPY", direction: "BUY", entry: "148.20", exit: "147.85", profit_loss: -45.2, status: "closed", executed_at: daysAgo(65) },
  { pair: "GBP/JPY", direction: "SELL", entry: "190.15", exit: "188.90", profit_loss: 285.4, status: "closed", executed_at: daysAgo(68) },
  { pair: "NZD/USD", direction: "SELL", entry: "0.6088", exit: "0.6120", profit_loss: -82.5, status: "closed", executed_at: daysAgo(72) },
  { pair: "EUR/GBP", direction: "BUY", entry: "0.8495", exit: "0.8528", profit_loss: 76.4, status: "closed", executed_at: daysAgo(75) },
  { pair: "USD/CAD", direction: "BUY", entry: "1.3510", exit: "1.3565", profit_loss: 124.8, status: "closed", executed_at: daysAgo(78) },
  { pair: "EUR/JPY", direction: "BUY", entry: "160.85", exit: "161.90", profit_loss: 201.3, status: "closed", executed_at: daysAgo(82) },
  { pair: "USD/CHF", direction: "SELL", entry: "0.8920", exit: "0.8965", profit_loss: -67.9, status: "closed", executed_at: daysAgo(85) },
  { pair: "CAD/JPY", direction: "BUY", entry: "108.90", exit: "109.65", profit_loss: 95.7, status: "closed", executed_at: daysAgo(88) },
  { pair: "EUR/USD", direction: "SELL", entry: "1.0955", exit: "1.0900", profit_loss: 178.2, status: "closed", executed_at: daysAgo(92) },
  { pair: "GBP/USD", direction: "BUY", entry: "1.2480", exit: "1.2445", profit_loss: -58.6, status: "closed", executed_at: daysAgo(96) },
  { pair: "AUD/USD", direction: "BUY", entry: "0.6455", exit: "0.6502", profit_loss: 112.4, status: "closed", executed_at: daysAgo(100) },
  { pair: "XAU/USD", direction: "SELL", entry: "2410.00", exit: "2388.50", profit_loss: 189.5, status: "closed", executed_at: daysAgo(105) },
  { pair: "USD/JPY", direction: "SELL", entry: "152.40", exit: "151.80", profit_loss: 72.8, status: "closed", executed_at: daysAgo(110) },
  { pair: "GBP/JPY", direction: "BUY", entry: "184.25", exit: "185.60", profit_loss: 234.6, status: "closed", executed_at: daysAgo(115) },
  { pair: "NZD/USD", direction: "BUY", entry: "0.5920", exit: "0.5958", profit_loss: 68.2, status: "closed", executed_at: daysAgo(120) },
  { pair: "EUR/GBP", direction: "SELL", entry: "0.8645", exit: "0.8645", profit_loss: 0, status: "cancelled", executed_at: daysAgo(125) },
  { pair: "USD/CAD", direction: "SELL", entry: "1.3740", exit: "1.3680", profit_loss: 148.3, status: "closed", executed_at: daysAgo(130) },
  { pair: "EUR/JPY", direction: "SELL", entry: "165.80", exit: "166.45", profit_loss: -91.7, status: "closed", executed_at: daysAgo(135) },
  { pair: "USD/CHF", direction: "BUY", entry: "0.8655", exit: "0.8702", profit_loss: 105.6, status: "closed", executed_at: daysAgo(140) },
  { pair: "CAD/JPY", direction: "SELL", entry: "112.50", exit: "111.85", profit_loss: 132.1, status: "closed", executed_at: daysAgo(145) },
  { pair: "EUR/USD", direction: "BUY", entry: "1.0720", exit: "1.0768", profit_loss: 156.0, status: "closed", executed_at: daysAgo(150) },
  { pair: "GBP/USD", direction: "SELL", entry: "1.2780", exit: "1.2815", profit_loss: -74.3, status: "closed", executed_at: daysAgo(155) },
  { pair: "AUD/USD", direction: "SELL", entry: "0.6680", exit: "0.6635", profit_loss: 128.9, status: "closed", executed_at: daysAgo(160) },
  { pair: "XAU/USD", direction: "BUY", entry: "2265.00", exit: "2292.00", profit_loss: 215.8, status: "closed", executed_at: daysAgo(165) },
  { pair: "USD/JPY", direction: "BUY", entry: "146.50", exit: "147.35", profit_loss: 142.6, status: "closed", executed_at: daysAgo(170) },
  { pair: "GBP/JPY", direction: "SELL", entry: "192.00", exit: "190.55", profit_loss: 298.7, status: "closed", executed_at: daysAgo(175) },
];

function seedToTrade(seed: TradeSeed, index: number): ExecutedTrade {
  return {
    id: `lt-${index + 1}`,
    pair: seed.pair,
    direction: seed.direction,
    entry: seed.entry,
    exit: seed.exit ?? null,
    current_price: seed.current_price ?? null,
    profit_loss: seed.profit_loss,
    status: seed.status,
    executed_at: seed.executed_at,
  };
}

export const mockLifetimeTrades: ExecutedTrade[] = SEEDS.map(seedToTrade);

export const TRADES_PAGE_SIZE = 10;

export function getLifetimeTrades(): ExecutedTrade[] {
  return mockLifetimeTrades;
}

export function getLifetimeTradeStats() {
  const trades = mockLifetimeTrades;
  const live = trades.filter((t) => t.status === "open").length;
  const closed = trades.filter((t) => t.status === "closed").length;
  const totalPnl = trades.reduce((sum, t) => sum + t.profit_loss, 0);
  const wins = trades.filter((t) => t.profit_loss > 0).length;
  const losses = trades.filter((t) => t.profit_loss < 0).length;

  return {
    total: trades.length,
    live,
    closed,
    totalPnl,
    wins,
    losses,
    pairs: PAIRS.length,
  };
}
