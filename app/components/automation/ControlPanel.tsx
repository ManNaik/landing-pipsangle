import { CONTROL_ITEMS } from "../../lib/automationContent";

export function ControlPanel() {
  return (
    <section className="border-b border-white/[0.06] bg-[#0A0A0A] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
              You&apos;re Always in Control
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              Configure risk, monitor execution, and pause or disconnect
              automation from your dashboard.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {CONTROL_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className="flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.06] bg-[#0D0F10] p-3.5 sm:p-4"
                >
                  <span className="automation-pipeline-pulse mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-w-0">
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0F10] p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  Control Panel
                </p>
                <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                  System Preview
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
                <span className="text-xs text-zinc-400">Automation</span>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-emerald-400">
                  <span className="automation-pipeline-pulse h-2 w-2 rounded-full bg-emerald-400" />
                  ACTIVE
                </span>
              </div>

              <dl className="mt-4 space-y-2.5">
                <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2">
                  <dt className="text-xs text-zinc-500">Configured Risk</dt>
                  <dd className="font-mono text-xs font-medium text-white">1.0%</dd>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2">
                  <dt className="text-xs text-zinc-500">Execution</dt>
                  <dd className="font-mono text-xs font-medium text-emerald-400">✓ READY</dd>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2">
                  <dt className="text-xs text-zinc-500">Account</dt>
                  <dd className="font-mono text-xs font-medium text-emerald-400">
                    ● CONNECTED
                  </dd>
                </div>
              </dl>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-white/20"
                >
                  Pause Automation
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-white/20"
                >
                  Adjust Risk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
