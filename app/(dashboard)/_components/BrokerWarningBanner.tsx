"use client";

type BrokerWarningBannerProps = {
  onConnect: () => void;
};

function WarningIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
}

export function BrokerWarningBanner({ onConnect }: BrokerWarningBannerProps) {
  return (
    <div
      role="status"
      className="flex flex-col gap-3 rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-zinc-900/60 to-emerald-500/5 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5"
    >
      <div className="flex items-start gap-3 sm:items-center">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-400 sm:mt-0">
          <WarningIcon />
        </span>
        <div>
          <p className="text-sm font-medium text-amber-100">
            You haven&apos;t connected to any broker
          </p>
          <p className="mt-0.5 text-sm text-zinc-400">
            Connect your account to enable automated trading and live performance tracking.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onConnect}
        className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 sm:ml-4"
      >
        Connect
      </button>
    </div>
  );
}
