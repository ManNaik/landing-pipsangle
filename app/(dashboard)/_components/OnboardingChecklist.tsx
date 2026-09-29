"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BrokerConnectionData, BrokerConnectPayload } from "../../lib/brokerConnection";
import {
  buildOnboardingChecklist,
  canUpdateCredentials,
  formatBrokerStatusLabel,
  getTrialCountdown,
  isOnboardingIncomplete,
  isOnboardingInProgress,
  isOnboardingReady,
  shouldShowPaymentCta,
  type ChecklistStepState,
} from "../../lib/onboardingStatus";
import { FREE_TRIAL_DAYS } from "../../lib/trial";
import { BrokerConnectForm } from "./BrokerConnectForm";

type OnboardingChecklistProps = {
  connection: BrokerConnectionData;
  submitting?: boolean;
  error?: string | null;
  onSubmit: (payload: BrokerConnectPayload) => Promise<unknown>;
  onSkip?: () => void;
  onRefresh?: () => void;
};

function stepDotClass(state: ChecklistStepState): string {
  switch (state) {
    case "complete":
      return "bg-emerald-500";
    case "current":
      return "bg-amber-400";
    case "error":
      return "bg-red-500";
    case "blocked":
      return "bg-zinc-700";
    default:
      return "bg-zinc-600";
  }
}

function statusTone(status: BrokerConnectionData["status"]): string {
  if (status === "failed" || status === "disabled") {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }
  if (status === "trial_expired") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }
  if (isOnboardingReady(status)) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }
  if (isOnboardingInProgress(status)) {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }
  return "border-zinc-700 bg-zinc-900 text-zinc-300";
}

export function OnboardingChecklist({
  connection,
  submitting,
  error,
  onSubmit,
  onSkip,
  onRefresh,
}: OnboardingChecklistProps) {
  const [now, setNow] = useState(() => Date.now());
  const steps = buildOnboardingChecklist(connection.status, {
    hasError: Boolean(connection.error || error),
  });
  const requiresForm =
    isOnboardingIncomplete(connection.status) ||
    connection.status === "failed" ||
    connection.status === "trial_expired" ||
    connection.status === "disabled";
  const [manualEdit, setManualEdit] = useState(false);
  const editing = requiresForm || manualEdit;
  const countdown = getTrialCountdown(connection.trialEndsAt);
  const displayError = error || connection.error;

  useEffect(() => {
    if (connection.status !== "active_trial" || !connection.trialEndsAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, [connection.status, connection.trialEndsAt]);

  // Recompute countdown label with ticking clock for active trial.
  const liveCountdown =
    connection.status === "active_trial"
      ? getTrialCountdown(connection.trialEndsAt)
      : countdown;
  void now;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
          Account setup
        </p>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Connect your trading account
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
              One MT5 account per customer. Submit details once, track provisioning,
              then start your {FREE_TRIAL_DAYS}-day trial after verification.
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusTone(connection.status)}`}
          >
            {formatBrokerStatusLabel(connection.status)}
          </span>
        </div>
      </header>

      {displayError && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <p className="font-medium">Something needs attention</p>
          <p className="mt-1 text-red-200/80">{displayError}</p>
          {connection.errorCode && (
            <p className="mt-1 text-xs text-red-200/50">Code: {connection.errorCode}</p>
          )}
        </div>
      )}

      {(connection.status === "active_trial" ||
        connection.status === "trial_expired") && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-100">
                {connection.status === "trial_expired"
                  ? "Trial ended"
                  : `${FREE_TRIAL_DAYS}-day free trial`}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {connection.status === "trial_expired"
                  ? "Subscribe to reactivate copy trading. Your setup is retained for a short grace period."
                  : `Time remaining: ${liveCountdown.label}`}
              </p>
            </div>
            {shouldShowPaymentCta(connection.status) && (
              <Link
                href="/subscription"
                className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                {connection.status === "trial_expired" ? "Subscribe now" : "Continue to payment"}
              </Link>
            )}
          </div>
        </div>
      )}

      <ol className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className="flex gap-3 rounded-xl px-2 py-2.5 sm:px-3"
          >
            <div className="flex flex-col items-center">
              <span
                className={`mt-1 h-2.5 w-2.5 rounded-full ${stepDotClass(step.state)}`}
                aria-hidden
              />
              {index < steps.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-zinc-800" aria-hidden />
              )}
            </div>
            <div className="min-w-0 flex-1 pb-2">
              <p className="text-sm font-medium text-white">{step.label}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{step.description}</p>
            </div>
            <p className="shrink-0 text-[11px] uppercase tracking-wide text-zinc-500">
              {step.state}
            </p>
          </li>
        ))}
      </ol>

      {(connection.mt5Login || connection.mt5Server || connection.brokerName) && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 px-4 py-3 text-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Submitted account
          </p>
          <dl className="mt-2 grid gap-2 sm:grid-cols-3">
            <div>
              <dt className="text-zinc-500">Broker</dt>
              <dd className="text-zinc-200">{connection.brokerName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">MT5 login</dt>
              <dd className="tabular-nums text-zinc-200">{connection.mt5Login ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Server</dt>
              <dd className="text-zinc-200">{connection.mt5Server ?? "—"}</dd>
            </div>
          </dl>
        </div>
      )}

      {editing ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-6">
          <h2 className="text-base font-semibold text-white">
            {connection.status === "failed" || connection.status === "disabled"
              ? "Update credentials"
              : "Broker credentials"}
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Password is transmitted once and is never saved in this browser.
          </p>
          <div className="mt-5">
            <BrokerConnectForm
              disabled={submitting}
              initial={connection}
              submitLabel={
                connection.status === "failed" || connection.mt5Login
                  ? "Retry / update credentials"
                  : "Submit for provisioning"
              }
              onSubmit={onSubmit}
            />
          </div>
        </div>
      ) : (
        canUpdateCredentials(connection.status) && (
          <button
            type="button"
            onClick={() => setManualEdit(true)}
            className="rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
          >
            Update credentials
          </button>
        )
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-800 pt-4">
        {onRefresh && isOnboardingInProgress(connection.status) && (
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
          >
            Refresh status
          </button>
        )}
        {isOnboardingReady(connection.status) && (
          <Link
            href="/dashboard"
            className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            Go to dashboard
          </Link>
        )}
        {onSkip && isOnboardingIncomplete(connection.status) && (
          <button
            type="button"
            onClick={onSkip}
            className="rounded-lg px-4 py-2 text-sm text-zinc-500 transition hover:text-zinc-300"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
