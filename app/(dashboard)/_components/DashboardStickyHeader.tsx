"use client";

import { useCallback, useEffect, useState } from "react";
import type { BrokerConnectionStatus } from "../../lib/brokerConnection";
import { getDashboardStats } from "../../lib/dashboardData";
import {
  getPlanLimits,
  loadTradingSettings,
  saveTradingSettings,
  type TradingSettings,
} from "../../lib/settingsData";
import { useAuth } from "../../lib/useAuth";

type DashboardStickyHeaderProps = {
  brokerStatus: BrokerConnectionStatus;
};

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/25 to-emerald-600/10 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/25"
      aria-hidden
    >
      {initials || "?"}
    </div>
  );
}

function ConnectionPill({ status }: { status: BrokerConnectionStatus }) {
  if (status === "connected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        Connected
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-400">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
      <span className="h-2 w-2 rounded-full bg-zinc-500" />
      Offline
    </span>
  );
}

function PlayIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
      />
    </svg>
  );
}

function StopIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
      />
    </svg>
  );
}

function SyncIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  );
}

function botButtonStyles(botActive: boolean, botEnabled: boolean): string {
  if (botActive) {
    return "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/15";
  }
  if (botEnabled) {
    return "border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/15";
  }
  return "bg-emerald-500 text-white hover:bg-emerald-600";
}

export function DashboardStickyHeader({ brokerStatus }: DashboardStickyHeaderProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<TradingSettings | null>(null);
  const [stopConfirmOpen, setStopConfirmOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    setSettings(loadTradingSettings(user.plan));
  }, [user]);

  const updateSettings = useCallback(
    (patch: Partial<TradingSettings>) => {
      if (!user || !settings) return;
      const next = { ...settings, ...patch };
      setSettings(next);
      saveTradingSettings(next);
    },
    [settings, user]
  );

  if (!user || !settings) return null;

  const stats = getDashboardStats(user);
  const limits = getPlanLimits(user.plan);
  const botActive = settings.autoTradeEnabled && stats.automationStatus === "connected";
  const botEnabled = settings.autoTradeEnabled;

  function handleToggle() {
    if (botEnabled) {
      setStopConfirmOpen(true);
      return;
    }
    if (limits.autoTrade.controllable) {
      updateSettings({ autoTradeEnabled: true });
    }
  }

  const BotStateIcon = botActive ? StopIcon : botEnabled ? SyncIcon : PlayIcon;
  const botLabel = botActive ? "Stop Bot" : botEnabled ? "Awaiting Sync" : "Start Bot";

  return (
    <>
      <header className="sticky top-14 z-20 -mx-4 border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar name={stats.displayName} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-semibold text-white">{stats.displayName}</p>
                <ConnectionPill status={brokerStatus} />
              </div>
              <p className="truncate text-xs text-zinc-500">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            disabled={!limits.autoTrade.controllable && !botEnabled}
            onClick={handleToggle}
            aria-pressed={botEnabled}
            className={`inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition sm:w-auto ${botButtonStyles(botActive, botEnabled)}`}
          >
            <BotStateIcon />
            {botLabel}
          </button>
        </div>
      </header>

      {stopConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="stop-bot-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
            <h2 id="stop-bot-title" className="text-base font-semibold text-white">
              Stop trading bot?
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Automated trades will pause until you start the bot again. Open positions remain
              active on your broker.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setStopConfirmOpen(false)}
                className="flex-1 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateSettings({ autoTradeEnabled: false });
                  setStopConfirmOpen(false);
                }}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500"
              >
                Stop Bot
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
