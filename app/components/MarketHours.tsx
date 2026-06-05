"use client";

import { useState, useEffect } from "react";

// Forex session times in UTC (Sun 22:00 UTC = week start; Fri 22:00 = week end)
// Sydney opens early; others follow. Times approximate, DST can shift by 1h.
const SESSIONS = [
  { id: "sydney", name: "Sydney", openUtc: { day: 0, h: 21, m: 0 }, closeUtc: { day: 5, h: 6, m: 0 } },   // Sun 21:00 - Fri 06:00
  { id: "tokyo", name: "Tokyo", openUtc: { day: 1, h: 0, m: 0 }, closeUtc: { day: 5, h: 9, m: 0 } },     // Mon 00:00 - Fri 09:00
  { id: "london", name: "London", openUtc: { day: 1, h: 7, m: 0 }, closeUtc: { day: 5, h: 16, m: 0 } }, // Mon 07:00 - Fri 16:00
  { id: "newyork", name: "New York", openUtc: { day: 1, h: 13, m: 0 }, closeUtc: { day: 5, h: 22, m: 0 } }, // Mon 13:00 - Fri 22:00
] as const;

function getNextOpen(session: typeof SESSIONS[number], now: Date): Date {
  const d = new Date(now);
  const utcDay = d.getUTCDay();
  const utcHours = d.getUTCHours();
  const utcMins = d.getUTCMinutes();
  const utcMs = utcHours * 3600000 + utcMins * 60000 + d.getUTCMilliseconds();

  const openDay = session.openUtc.day;
  const openMs = session.openUtc.h * 3600000 + session.openUtc.m * 60000;
  const closeDay = session.closeUtc.day;
  const closeMs = session.closeUtc.h * 3600000 + session.closeUtc.m * 60000;

  // Set d to start of current UTC week (Sunday 00:00)
  const startOfWeek = new Date(d);
  startOfWeek.setUTCDate(d.getUTCDate() - utcDay);
  startOfWeek.setUTCHours(0, 0, 0, 0);

  const openThisWeek = new Date(startOfWeek);
  openThisWeek.setUTCDate(openThisWeek.getUTCDate() + openDay);
  openThisWeek.setUTCHours(session.openUtc.h, session.openUtc.m, 0, 0);

  const closeThisWeek = new Date(startOfWeek);
  closeThisWeek.setUTCDate(closeThisWeek.getUTCDate() + closeDay);
  closeThisWeek.setUTCHours(session.closeUtc.h, session.closeUtc.m, 0, 0);

  // If we're before this week's open, next open is this week's open
  if (now.getTime() < openThisWeek.getTime()) return openThisWeek;
  // If we're between open and close, "next open" is next week
  if (now.getTime() < closeThisWeek.getTime()) {
    const nextWeekOpen = new Date(openThisWeek);
    nextWeekOpen.setUTCDate(nextWeekOpen.getUTCDate() + 7);
    return nextWeekOpen;
  }
  // After close: next open is next week
  const nextWeekOpen = new Date(openThisWeek);
  nextWeekOpen.setUTCDate(nextWeekOpen.getUTCDate() + 7);
  return nextWeekOpen;
}

function getNextClose(session: typeof SESSIONS[number], now: Date): Date {
  const d = new Date(now);
  const utcDay = d.getUTCDay();
  const startOfWeek = new Date(d);
  startOfWeek.setUTCDate(d.getUTCDate() - utcDay);
  startOfWeek.setUTCHours(0, 0, 0, 0);

  const closeThisWeek = new Date(startOfWeek);
  closeThisWeek.setUTCDate(closeThisWeek.getUTCDate() + session.closeUtc.day);
  closeThisWeek.setUTCHours(session.closeUtc.h, session.closeUtc.m, 0, 0);

  if (now.getTime() < closeThisWeek.getTime()) return closeThisWeek;
  const nextWeekClose = new Date(closeThisWeek);
  nextWeekClose.setUTCDate(nextWeekClose.getUTCDate() + 7);
  return nextWeekClose;
}

function isSessionOpen(session: typeof SESSIONS[number], now: Date): boolean {
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  const min = now.getUTCMinutes();
  const timeMins = hour * 60 + min;
  const openMins = session.openUtc.h * 60 + session.openUtc.m;
  const closeMins = session.closeUtc.h * 60 + session.closeUtc.m;
  const openDay = session.openUtc.day;
  const closeDay = session.closeUtc.day;
  // Same-week window: openDay/openMins to closeDay/closeMins (e.g. Sun 21:00 -> Fri 06:00)
  const afterOpen = day > openDay || (day === openDay && timeMins >= openMins);
  const beforeClose = day < closeDay || (day === closeDay && timeMins < closeMins);
  return afterOpen && beforeClose;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "0h 0m 0s";
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  return `${h}h ${m}m ${s}s`;
}

function useMarketHours() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return SESSIONS.map((session) => {
    const open = isSessionOpen(session, now);
    const nextClose = getNextClose(session, now);
    const nextOpen = getNextOpen(session, now);
    const msUntilClose = nextClose.getTime() - now.getTime();
    const msUntilOpen = nextOpen.getTime() - now.getTime();
    return {
      ...session,
      open,
      countdown: open ? formatCountdown(msUntilClose) : formatCountdown(msUntilOpen),
      status: open ? "closes" : "opens",
    };
  });
}

export function MarketHours() {
  const sessions = useMarketHours();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 sm:p-5 w-full">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="font-semibold text-white text-base sm:text-lg">Market Hours</h3>
        <span className="text-zinc-500" aria-hidden>→</span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-zinc-800 min-w-0">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Session</th>
              <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-b border-zinc-800/80 last:border-0 hover:bg-zinc-800/30">
                <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                  <span className="flex items-center gap-2 text-zinc-300">
                    <span className={s.open ? "text-amber-400" : "text-zinc-500"} aria-hidden>
                      {s.open ? "☀" : "☾"}
                    </span>
                    {s.name}
                  </span>
                </td>
                <td className="px-3 py-2.5 sm:px-4 sm:py-3 text-right tabular-nums text-zinc-400">
                  {s.status} in {s.countdown}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
