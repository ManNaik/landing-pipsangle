export type ProfitPeriod = "1d" | "7d" | "1m" | "custom";

export type ProfitDataPoint = {
  label: string;
  date: string;
  profit: number;
  cumulative: number;
};

export type ProfitRange = {
  from: Date;
  to: Date;
};

export const ALL_TIME_PROFIT = 12_847.32;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10_000;
  return x - Math.floor(x);
}

function dailyProfitForDate(date: Date): number {
  const seed = hashSeed(date.toISOString().slice(0, 10));
  const base = 120 + pseudoRandom(seed) * 280;
  const volatility = pseudoRandom(seed + 17) > 0.82 ? -1 : 1;
  return Math.round(base * volatility * 100) / 100;
}

function hourlyProfitForHour(date: Date, hour: number): number {
  const seed = hashSeed(`${date.toISOString().slice(0, 10)}-${hour}`);
  const base = 8 + pseudoRandom(seed) * 42;
  const volatility = pseudoRandom(seed + 5) > 0.78 ? -1 : 1;
  return Math.round(base * volatility * 100) / 100;
}

export function getProfitRange(
  period: ProfitPeriod,
  custom?: { from: string; to: string }
): ProfitRange {
  const now = new Date();

  if (period === "1d") {
    return { from: startOfDay(now), to: endOfDay(now) };
  }

  if (period === "7d") {
    const from = startOfDay(now);
    from.setDate(from.getDate() - 6);
    return { from, to: endOfDay(now) };
  }

  if (period === "1m") {
    const from = startOfDay(now);
    from.setDate(from.getDate() - 29);
    return { from, to: endOfDay(now) };
  }

  const from = custom?.from ? startOfDay(new Date(custom.from)) : startOfDay(now);
  const to = custom?.to ? endOfDay(new Date(custom.to)) : endOfDay(now);
  if (from > to) return { from: to, to: from };
  return { from, to };
}

function formatLabel(date: Date, hourly: boolean): string {
  if (hourly) {
    return date.toLocaleTimeString(undefined, { hour: "numeric" });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function getProfitData(range: ProfitRange): ProfitDataPoint[] {
  const msPerDay = 24 * 60 * 60 * 1000;
  const daySpan = Math.max(1, Math.round((range.to.getTime() - range.from.getTime()) / msPerDay) + 1);
  const hourly = daySpan <= 1;

  const points: ProfitDataPoint[] = [];
  let cumulative = 0;

  if (hourly) {
    for (let hour = 0; hour < 24; hour += 1) {
      const date = new Date(range.from);
      date.setHours(hour, 0, 0, 0);
      if (date > range.to) break;
      const profit = hourlyProfitForHour(range.from, hour);
      cumulative += profit;
      points.push({
        label: formatLabel(date, true),
        date: date.toISOString(),
        profit,
        cumulative: Math.round(cumulative * 100) / 100,
      });
    }
    return points;
  }

  const cursor = startOfDay(range.from);
  const end = startOfDay(range.to);

  while (cursor <= end) {
    const profit = dailyProfitForDate(cursor);
    cumulative += profit;
    points.push({
      label: formatLabel(cursor, false),
      date: cursor.toISOString(),
      profit,
      cumulative: Math.round(cumulative * 100) / 100,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return points;
}

export function getPeriodProfit(data: ProfitDataPoint[]): number {
  if (data.length === 0) return 0;
  return Math.round(data.reduce((sum, point) => sum + point.profit, 0) * 100) / 100;
}
