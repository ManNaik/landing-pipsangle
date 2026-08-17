export function AutomationDashboardVisual() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-md lg:max-w-none">
      <div
        className="automation-glow pointer-events-none absolute -inset-2 rounded-2xl bg-emerald-500/10 blur-2xl sm:-inset-4"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0F10]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-md sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
          <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500 sm:text-xs">
            PipAngel Automation
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/30 sm:text-xs">
            <span className="automation-pipeline-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
            SYSTEM LIVE
          </span>
        </div>

        <div className="mt-3 space-y-3">
          <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3 sm:p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              Market Setup
            </p>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-base font-semibold text-white sm:text-lg">
                EUR/USD
              </p>
              <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-400 sm:text-xs">
                BUY
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] sm:grid-cols-4 sm:text-xs">
              <div>
                <p className="text-zinc-500">Signal Score</p>
                <p className="mt-0.5 font-mono text-zinc-200">78/100</p>
              </div>
              <div>
                <p className="text-zinc-500">Validation</p>
                <p className="mt-0.5 font-mono text-emerald-400">✓ APPROVED</p>
              </div>
              <div>
                <p className="text-zinc-500">Risk</p>
                <p className="mt-0.5 font-mono text-zinc-200">1.0%</p>
              </div>
              <div>
                <p className="text-zinc-500">Position</p>
                <p className="mt-0.5 font-mono text-zinc-200">0.12 LOT</p>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

          <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3 sm:p-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              MT5 Connection
            </p>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-medium text-white">IC Markets</p>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 sm:text-xs">
                <span className="automation-pipeline-pulse h-2 w-2 rounded-full bg-emerald-400" />
                CONNECTED
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-500/5 px-3 py-2 ring-1 ring-emerald-500/20">
              <span className="text-[11px] text-zinc-400 sm:text-xs">Execution</span>
              <span className="font-mono text-[11px] font-medium text-emerald-400 sm:text-xs">
                ✓ READY
              </span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-wider text-zinc-600">
          System Preview
        </p>
      </div>
    </div>
  );
}
