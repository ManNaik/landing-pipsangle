import type { MarketEvent } from "../../lib/newsContent";

export function MarketEvents({ events }: { events: MarketEvent[] }) {
  return (
    <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Upcoming Market Events
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Demo market events shown for interface preview.
            </p>
          </div>
        </div>
        <div className="mt-6 overflow-hidden border border-white/[0.07]">
          <table className="hidden w-full text-left text-sm md:table">
            <thead className="bg-white/[0.03] text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-medium">Currency</th>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">When</th>
                <th className="px-5 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-white/[0.05]">
                  <td className="px-5 py-3.5 font-medium tabular-nums text-emerald-400">
                    {event.currency}
                  </td>
                  <td className="px-5 py-3.5 text-zinc-200">{event.title}</td>
                  <td className="px-5 py-3.5 text-zinc-400">{event.whenLabel}</td>
                  <td className="px-5 py-3.5 tabular-nums text-zinc-400">{event.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ol className="divide-y divide-white/[0.06] md:hidden">
            {events.map((event) => (
              <li key={event.id} className="flex items-start justify-between gap-4 px-4 py-4">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.14em] text-emerald-400">
                    {event.currency}
                  </p>
                  <p className="mt-1 text-sm text-white">{event.title}</p>
                </div>
                <p className="shrink-0 text-right text-xs text-zinc-500">
                  {event.whenLabel}
                  <br />
                  {event.time}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
