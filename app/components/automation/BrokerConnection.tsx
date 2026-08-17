import { CONNECTION_STATUS } from "../../lib/automationContent";

const INFRA_LAYERS = [
  {
    label: "PipAngel Automation",
    sublabel: null,
    status: "SYSTEM ONLINE",
    highlight: true,
  },
  {
    label: "IC Markets",
    sublabel: "Broker Connection",
    status: null,
    highlight: false,
  },
  {
    label: "MetaTrader 5",
    sublabel: "Execution Layer",
    status: null,
    highlight: false,
  },
  {
    label: "Your Trading Account",
    sublabel: null,
    status: "CONNECTED",
    highlight: false,
  },
] as const;

export function BrokerConnection() {
  return (
    <section className="border-b border-white/[0.06] bg-[#050505] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
            Built Specifically for IC Markets MT5
          </h2>
          <p className="mt-2 text-sm text-zinc-400 sm:text-base">
            One connection. One execution environment. Complete automation.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_280px] lg:gap-5">
          {/* Central infrastructure panel */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0F10] p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Execution Infrastructure
              </p>
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                System Preview
              </span>
            </div>

            <ol className="mt-4 space-y-0">
              {INFRA_LAYERS.map((layer, idx) => (
                <li key={layer.label}>
                  <div
                    className={`rounded-xl border px-4 py-3 sm:py-3.5 ${
                      layer.highlight
                        ? "border-emerald-500/25 bg-emerald-500/5"
                        : "border-white/[0.06] bg-black/40"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {layer.label}
                        </p>
                        {layer.sublabel && (
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {layer.sublabel}
                          </p>
                        )}
                      </div>
                      {layer.status && (
                        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium text-emerald-400 sm:text-xs">
                          <span className="automation-pipeline-pulse h-2 w-2 rounded-full bg-emerald-400" />
                          {layer.status}
                        </span>
                      )}
                    </div>
                  </div>
                  {idx < INFRA_LAYERS.length - 1 && (
                    <div className="relative flex justify-center py-1" aria-hidden>
                      <span className="text-emerald-500/40">↓</span>
                      <span className="automation-connection-pulse absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400" />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* Status sidebar */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0F10] p-4 sm:p-5">
            <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Connection Status
            </p>
            <ul className="mt-4 space-y-2.5">
              {CONNECTION_STATUS.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/40 px-3 py-2"
                >
                  <span className="text-xs text-zinc-400">{item.label}</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium text-emerald-400">
                    <span className="automation-pipeline-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
