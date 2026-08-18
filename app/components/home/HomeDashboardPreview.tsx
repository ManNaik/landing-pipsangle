import { DASHBOARD_CONTROLS } from "../../lib/homeContent";

export function HomeDashboardPreview() {
  return (
    <section className="border-b border-zinc-800 bg-[#080808] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            You&apos;re Always in Control
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Automation does not mean giving up control. Monitor your trading
            activity and manage automation directly from your PipAngel
            dashboard.
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Pause, resume, adjust risk, review trades, or disconnect your
            account when you choose.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0C0C0E] p-4 sm:p-5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              Trading Dashboard
            </p>
            <span className="text-[10px] uppercase tracking-wider text-zinc-600">
              System Preview
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
            <span className="text-xs text-zinc-400">Automation Status</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              ACTIVE
            </span>
          </div>

          <dl className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2">
              <dt className="text-xs text-zinc-500">Broker</dt>
              <dd className="font-mono text-xs text-zinc-200">IC Markets MT5</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2">
              <dt className="text-xs text-zinc-500">Configured Risk</dt>
              <dd className="font-mono text-xs text-zinc-200">1.0%</dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            {DASHBOARD_CONTROLS.map((control) => (
              <span
                key={control}
                className="rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] text-zinc-300"
              >
                {control}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
