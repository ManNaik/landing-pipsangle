"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getDashboardStats } from "../../lib/dashboardData";
import { getSignupUrl } from "../../lib/pricing";
import {
  clampSettings,
  getDefaultSettingsForPlan,
  getPlanLimits,
  loadTradingSettings,
  saveTradingSettings,
  type TradingSettings,
} from "../../lib/settingsData";
import { useAuth } from "../../lib/useAuth";

const PLAN_LIMITS_PREMIUM_CAP = getPlanLimits("Premium").capital.max;

function MinusIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function AutomationIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function CapitalIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
      />
    </svg>
  );
}

function StopIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}

function SaveIndicator({ visible }: { visible: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
      }`}
      aria-live="polite"
    >
      <CheckIcon />
      Saved
    </span>
  );
}

function StopConfirmDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stop-dialog-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-emerald-950/30 p-6 shadow-[0_0_40px_rgba(16,185,129,0.08)] ring-1 ring-emerald-500/10"
      >
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-500/[0.06] blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
            <StopIcon className="h-5 w-5 text-red-400" />
          </div>
          <h3 id="stop-dialog-title" className="mt-4 text-lg font-semibold text-white">
            Stop auto trading?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Are you sure you want to stop auto trading? No automated trades will execute until you
            resume.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800/60 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-xl bg-gradient-to-r from-red-600/90 to-red-500/80 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.15)] transition hover:from-red-600 hover:to-red-500"
            >
              Yes, stop trading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ValueGauge({
  value,
  min,
  max,
  unit,
}: {
  value: number;
  min: number;
  max: number;
  unit: string;
}) {
  const size = 96;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const range = max - min;
  const progress = range > 0 ? (value - min) / range : 0;
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-zinc-800/80"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-emerald-400 transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums tracking-tight text-white">
          {value}
          <span className="text-sm font-medium text-zinc-500">{unit}</span>
        </span>
      </div>
    </div>
  );
}

function PremiumSlider({
  value,
  min,
  max,
  step,
  disabled,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (next: number) => void;
}) {
  const range = max - min;
  const percent = range > 0 ? ((value - min) / range) * 100 : 0;

  return (
    <div className={`relative pt-1 ${disabled ? "opacity-60" : ""}`}>
      <div className="relative h-2 overflow-hidden rounded-full bg-zinc-800/70">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-600/60 to-emerald-400/90 transition-[width] duration-200"
          style={{ width: `${percent}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.45)] transition-[left] duration-200"
          style={{ left: `calc(${percent}% - 8px)` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className="absolute inset-x-0 top-0 h-2 w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4"
      />
      <div className="mt-2 flex justify-between text-[10px] font-medium tabular-nums text-zinc-600">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
}

function StepperControl({
  value,
  min,
  max,
  step,
  unit,
  disabled,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  disabled?: boolean;
  onChange: (next: number) => void;
}) {
  const canDecrease = !disabled && value - step >= min - 0.0001;
  const canIncrease = !disabled && value + step <= max + 0.0001;

  const adjust = (delta: number) => {
    const next = Math.round((value + delta) / step) * step;
    onChange(Math.min(max, Math.max(min, Number(next.toFixed(2)))));
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-600">
        Fine tune
      </span>
      <div className="flex items-center rounded-xl bg-zinc-950/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <button
          type="button"
          disabled={!canDecrease}
          onClick={() => adjust(-step)}
          aria-label="Decrease"
          className="flex h-9 w-9 items-center justify-center text-zinc-400 transition hover:bg-zinc-800/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
        >
          <MinusIcon />
        </button>
        <span className="min-w-[3.5rem] px-2 text-center text-sm font-semibold tabular-nums text-zinc-200">
          {value}
          {unit}
        </span>
        <button
          type="button"
          disabled={!canIncrease}
          onClick={() => adjust(step)}
          aria-label="Increase"
          className="flex h-9 w-9 items-center justify-center text-zinc-400 transition hover:bg-zinc-800/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}

function UpgradeStrip({ message }: { message: string }) {
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl bg-gradient-to-r from-emerald-500/[0.08] via-emerald-500/[0.04] to-transparent p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
          <LockIcon className="h-4 w-4 text-emerald-400/80" />
        </div>
        <p className="text-sm leading-relaxed text-zinc-400">{message}</p>
      </div>
      <Link
        href={getSignupUrl("premium")}
        className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-emerald-600"
      >
        Upgrade
      </Link>
    </div>
  );
}

function SettingCard({
  icon,
  iconBg,
  label,
  title,
  description,
  locked,
  lockLabel,
  upgradeMessage,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  title: string;
  description: string;
  locked?: boolean;
  lockLabel?: string;
  upgradeMessage?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/70 via-zinc-900/50 to-zinc-950/80 p-5 sm:p-6">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/[0.04] blur-3xl"
        aria-hidden
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${iconBg}`}
            >
              {icon}
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                {label}
              </p>
              <h2 className="mt-0.5 text-base font-semibold text-white">{title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500">{description}</p>
            </div>
          </div>
          {locked && lockLabel && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-zinc-800/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
              <LockIcon className="h-3 w-3" />
              {lockLabel}
            </span>
          )}
        </div>
        <div className="mt-5">{children}</div>
        {locked && upgradeMessage && <UpgradeStrip message={upgradeMessage} />}
      </div>
    </div>
  );
}

export function TradingSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<TradingSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [stopConfirmOpen, setStopConfirmOpen] = useState(false);

  const plan = user?.plan ?? null;
  const isPremium = plan === "Premium";
  const limits = getPlanLimits(plan);
  const stats = user ? getDashboardStats(user) : null;

  useEffect(() => {
    if (!user) return;
    setSettings(loadTradingSettings(plan));
  }, [user, plan]);

  const updateSettings = useCallback(
    (patch: Partial<TradingSettings>) => {
      setSettings((current) => {
        if (!current) return current;
        const next = clampSettings({ ...current, ...patch }, plan);
        saveTradingSettings(next);
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2000);
        return next;
      });
    },
    [plan]
  );

  const resetToDefaults = () => {
    const defaults = getDefaultSettingsForPlan(plan);
    setSettings(defaults);
    saveTradingSettings(defaults);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleStopConfirm = () => {
    updateSettings({ autoTradeEnabled: false });
    setStopConfirmOpen(false);
  };

  if (!user || !settings) return null;

  const automationRunning = settings.autoTradeEnabled && stats?.automationStatus === "connected";
  const brokerLabel = stats?.automationBroker ?? "No broker connected";

  const statusConfig = automationRunning
    ? {
        label: "Live",
        headline: "Automation running",
        detail: "Trades are executing on your connected broker.",
        dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]",
        panel: "from-emerald-950/40 via-zinc-900/60 to-zinc-950/90",
        glow: "bg-emerald-500/[0.08]",
      }
    : settings.autoTradeEnabled
      ? {
          label: "Standby",
          headline: "Enabled — awaiting sync",
          detail: "Auto trade is on but broker sync is pending.",
          dot: "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]",
          panel: "from-amber-950/20 via-zinc-900/60 to-zinc-950/90",
          glow: "bg-amber-500/[0.05]",
        }
      : {
          label: "Stopped",
          headline: "Auto trading paused",
          detail: "No automated trades will execute until resumed.",
          dot: "bg-zinc-500",
          panel: "from-zinc-900/70 via-zinc-900/50 to-zinc-950/80",
          glow: "bg-zinc-500/[0.04]",
        };

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/80 via-zinc-900/50 to-emerald-950/20 p-5 sm:p-7">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/[0.06] blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-400/70">
                Trading controls
              </p>
              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Control
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-400">
                Configure capital deployment and automation for your account.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
                  isPremium
                    ? "bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-300"
                    : "bg-zinc-800/80 text-zinc-400"
                }`}
              >
                {isPremium && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                )}
                {isPremium ? "Premium" : "Basic"} plan
              </span>
              <SaveIndicator visible={saved} />
            </div>
          </div>
        </header>

        {!isPremium && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/[0.07] via-zinc-900/50 to-zinc-950/60 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <LockIcon className="h-5 w-5 text-emerald-400/80" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Unlock full trading control</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-500">
                    Premium gives you adjustable capital utilization up to {PLAN_LIMITS_PREMIUM_CAP}%.
                  </p>
                </div>
              </div>
              <Link
                href={getSignupUrl("premium")}
                className="shrink-0 rounded-xl bg-emerald-500 px-5 py-2.5 text-center text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                View Premium
              </Link>
            </div>
          </div>
        )}

        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 sm:p-6">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${statusConfig.panel}`}
            aria-hidden
          />
          <div
            className={`pointer-events-none absolute -left-8 top-0 h-36 w-36 rounded-full blur-3xl ${statusConfig.glow}`}
            aria-hidden
          />

          <div className="relative">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800/60 text-emerald-300/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <AutomationIcon />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                  Auto trade
                </p>
                <h2 className="mt-0.5 text-base font-semibold text-white">Automation control</h2>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full opacity-20 ${
                      automationRunning
                        ? "bg-emerald-400 animate-pulse"
                        : settings.autoTradeEnabled
                          ? "bg-amber-400"
                          : "bg-zinc-600"
                    }`}
                  />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950/60">
                    <span className={`h-3 w-3 rounded-full ${statusConfig.dot}`} aria-hidden />
                  </div>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                        automationRunning
                          ? "bg-emerald-500/15 text-emerald-300"
                          : settings.autoTradeEnabled
                            ? "bg-amber-500/15 text-amber-300"
                            : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {statusConfig.label}
                    </span>
                    <p className="text-lg font-semibold text-white">{statusConfig.headline}</p>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{statusConfig.detail}</p>
                  <p className="mt-2 text-xs text-zinc-600">
                    {brokerLabel}
                    {stats?.automationLastSync ? ` · Synced ${stats.automationLastSync}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {!settings.autoTradeEnabled ? (
                  <button
                    type="button"
                    disabled={!limits.autoTrade.controllable}
                    onClick={() => updateSettings({ autoTradeEnabled: true })}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Resume auto trade
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStopConfirmOpen(true)}
                    className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-red-600/90 to-red-500/80 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.15)] transition hover:from-red-600 hover:to-red-500"
                  >
                    <StopIcon className="h-4 w-4" />
                    Stop auto trade
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <SettingCard
          icon={<CapitalIcon className="text-emerald-300/90" />}
          iconBg="bg-gradient-to-br from-emerald-500/20 to-emerald-900/20"
          label="Allocation"
          title="Capital utilization"
          description="Percentage of account balance allocated to active trades."
          locked={!limits.capital.adjustable}
          lockLabel="Basic cap"
          upgradeMessage={`Basic uses a fixed ${limits.capital.default}% cap. Premium unlocks up to ${PLAN_LIMITS_PREMIUM_CAP}%.`}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ValueGauge
              value={settings.capitalUtilization}
              min={limits.capital.min}
              max={limits.capital.max}
              unit="%"
            />
            <div className="min-w-0 flex-1 space-y-4">
              <PremiumSlider
                value={settings.capitalUtilization}
                min={limits.capital.min}
                max={limits.capital.max}
                step={limits.capital.step}
                disabled={!limits.capital.adjustable}
                onChange={(capitalUtilization) => updateSettings({ capitalUtilization })}
              />
              <StepperControl
                value={settings.capitalUtilization}
                min={limits.capital.min}
                max={limits.capital.max}
                step={limits.capital.step}
                unit="%"
                disabled={!limits.capital.adjustable}
                onChange={(capitalUtilization) => updateSettings({ capitalUtilization })}
              />
            </div>
          </div>
        </SettingCard>

        <footer className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-zinc-600">
            Settings persist locally for this demo session.
          </p>
          <button
            type="button"
            onClick={resetToDefaults}
            className="rounded-lg px-3 py-2 text-sm text-zinc-500 transition hover:bg-zinc-800/60 hover:text-zinc-300"
          >
            Reset to plan defaults
          </button>
        </footer>
      </div>

      <StopConfirmDialog
        open={stopConfirmOpen}
        onConfirm={handleStopConfirm}
        onCancel={() => setStopConfirmOpen(false)}
      />
    </>
  );
}
