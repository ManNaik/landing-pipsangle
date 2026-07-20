"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "../../lib/auth";
import type { BrokerConnectionStatus } from "../../lib/brokerConnection";

type DashboardTopbarProps = {
  brandName: string;
  brokerStatus: BrokerConnectionStatus;
  onMenuOpen: () => void;
};

function WarningIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
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

function statusStyles(status: BrokerConnectionStatus): {
  container: string;
  label: string;
  indicator: React.ReactNode;
} {
  switch (status) {
    case "connected":
      return {
        container: "bg-emerald-500/10 text-emerald-400",
        label: "Connected",
        indicator: (
          <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
        ),
      };
    case "pending":
      return {
        container: "bg-amber-500/10 text-amber-400",
        label: "Pending verification",
        indicator: <WarningIcon />,
      };
    default:
      return {
        container: "bg-zinc-800 text-zinc-400",
        label: "Not connected",
        indicator: <WarningIcon className="text-zinc-500" />,
      };
  }
}

export function DashboardTopbar({
  brandName,
  brokerStatus,
  onMenuOpen,
}: DashboardTopbarProps) {
  const router = useRouter();
  const status = statusStyles(brokerStatus);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 bg-zinc-950 px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuOpen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white lg:hidden"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <Link
          href="/dashboard"
          className="truncate text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90 lg:hidden"
        >
          {brandName}
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div
          className={`hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium sm:inline-flex ${status.container}`}
        >
          {status.indicator}
          {status.label}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
