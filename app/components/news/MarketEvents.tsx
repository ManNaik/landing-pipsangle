import type { MarketEvent } from "../../lib/newsContent";

function figure(value: string | undefined) {
  return value && value.trim() ? value : "—";
}

export function MarketEvents({ events }: { events: MarketEvent[] }) {
  const isDemo = events.every((event) => event.isDemo);

  return (
    <section className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Today and tomorrow</h2>
            <p className="mt-2 max-w-2xl text-sage-300">
              {isDemo
                ? "Demo market events shown for interface preview."
                : "Major forex releases for today and tomorrow. Times are IST. Figures are from the Moneycontrol economic calendar."}
            </p>
          </div>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-forest-600">
          <table className="hidden w-full text-left text-sm md:table">
            <thead className="bg-forest-800 text-sm text-sage-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Currency</th>
                <th className="px-4 py-3 font-semibold">Event</th>
                <th className="px-4 py-3 font-semibold">When</th>
                <th className="px-4 py-3 font-semibold">Actual</th>
                <th className="px-4 py-3 font-semibold">Forecast</th>
                <th className="px-4 py-3 font-semibold">Previous</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-forest-700">
                  <td className="px-4 py-3.5 font-medium tabular-nums text-mint-400">
                    {event.currency}
                  </td>
                  <td className="px-4 py-3.5 text-sage-200">
                    <EventTitle event={event} />
                    {event.impact ? (
                      <span className="ml-2 text-xs text-sage-400">
                        {event.impact}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5 text-sage-300">
                    {event.whenLabel}
                    <span className="mt-0.5 block tabular-nums text-sage-400">{event.time}</span>
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-sage-200">{figure(event.actual)}</td>
                  <td className="px-4 py-3.5 tabular-nums text-sage-300">{figure(event.consensus)}</td>
                  <td className="px-4 py-3.5 tabular-nums text-sage-300">{figure(event.previous)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ol className="divide-y divide-forest-700 md:hidden">
            {events.map((event) => (
              <li key={event.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-mint-400">
                      {event.currency}
                      {event.impact ? (
                        <span className="ml-2 font-normal text-sage-400">{event.impact}</span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-sm text-paper">
                      <EventTitle event={event} />
                    </p>
                  </div>
                  <p className="shrink-0 text-right text-xs text-sage-400">
                    {event.whenLabel}
                    <br />
                    {event.time}
                  </p>
                </div>
                {isDemo ? null : (
                  <p className="mt-2 text-xs tabular-nums text-sage-400">
                    Actual {figure(event.actual)}, forecast {figure(event.consensus)}, previous{" "}
                    {figure(event.previous)}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function EventTitle({ event }: { event: MarketEvent }) {
  if (!event.sourceUrl) return event.title;
  return (
    <a
      href={event.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-forest-500 underline-offset-4 hover:decoration-mint-400"
    >
      {event.title}
    </a>
  );
}
