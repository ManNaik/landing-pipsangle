"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { BrokerConnectionStatus } from "../../lib/brokerConnection";
import { BrokerConnectForm } from "./BrokerConnectForm";

type OnboardingModalProps = {
  open: boolean;
  status: BrokerConnectionStatus;
  onSkip: () => void;
  onClose: () => void;
  onSubmit: (payload: { brokerId: string; brokerName: string; accountId: string }) => void;
  onCompleteVerification: () => void;
};

function WarningIcon({ className = "h-4 w-4" }: { className?: string }) {
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

export function OnboardingModal({
  open,
  status,
  onSkip,
  onClose,
  onSubmit,
  onCompleteVerification,
}: OnboardingModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"welcome" | "pending">("welcome");
  const isFirstVisit = status === "none";
  const showPending = step === "pending" || status === "pending";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setStep("welcome");
      return;
    }
    if (status === "pending") {
      setStep("pending");
    }
  }, [open, status]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isFirstVisit) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, isFirstVisit]);

  if (!open || !mounted) return null;

  function handleFormSubmit(payload: { brokerId: string; brokerName: string; accountId: string }) {
    onSubmit(payload);
    setStep("pending");
  }

  function handleDismiss() {
    if (showPending) {
      onClose();
      return;
    }
    if (!isFirstVisit) onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
    >
      <div
        className="fixed inset-0 bg-zinc-950/85 backdrop-blur-sm"
        aria-hidden={isFirstVisit && !showPending}
        onClick={isFirstVisit && !showPending ? undefined : handleDismiss}
        onKeyDown={undefined}
        role={isFirstVisit && !showPending ? "presentation" : "button"}
        tabIndex={isFirstVisit && !showPending ? -1 : 0}
      />

      <div
        ref={dialogRef}
        className="relative z-10 my-auto w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/50 sm:p-8"
      >
        {!isFirstVisit && (
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}

        {showPending ? (
          <div className="pr-2 sm:pr-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
              <WarningIcon className="h-6 w-6" />
            </div>
            <h2 id="onboarding-modal-title" className="mt-4 text-2xl font-bold text-white">
              Under verification
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Your broker connection is being reviewed. Verification typically takes up to{" "}
              <span className="text-zinc-300">5 working days</span>. You can use the dashboard
              while we complete the checks.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handleDismiss}
                className="flex-1 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
              >
                Go to dashboard
              </button>
              <button
                type="button"
                onClick={onCompleteVerification}
                className="flex-1 rounded-lg border border-zinc-700 px-4 py-3 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                Simulate verification complete
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-zinc-600">
              Demo: auto-verifies after 8s for demo@pipangel.com, or add{" "}
              <code className="text-zinc-500">?verify=1</code> to the URL.
            </p>
          </div>
        ) : (
          <>
            <div className="pr-2 sm:pr-8">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
                Welcome to PipAngel
              </p>
              <h2 id="onboarding-modal-title" className="mt-2 text-2xl font-bold text-white">
                Connect your broker
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Link your trading account so PipAngel can mirror signals and track your
                performance. This only takes a minute.
              </p>
            </div>

            <div className="mt-6">
              <BrokerConnectForm onSubmit={handleFormSubmit} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-800 pt-4">
              <p className="text-xs text-zinc-500">You can connect later from the dashboard.</p>
              <button
                type="button"
                onClick={onSkip}
                className="shrink-0 rounded-lg px-4 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              >
                Skip for now
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
