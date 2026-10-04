import { FREE_TRIAL_DAYS } from "./trial";
import type { BrokerConnectionStatus } from "./brokerConnection";

export type OnboardingChecklistStepId =
  | "details"
  | "consent"
  | "submitted"
  | "provisioning"
  | "operator"
  | "verifying"
  | "trial"
  | "payment";

export type ChecklistStepState = "complete" | "current" | "upcoming" | "error" | "blocked";

export type OnboardingChecklistStep = {
  id: OnboardingChecklistStepId;
  label: string;
  description: string;
  state: ChecklistStepState;
};

const ACTIVE_STATUSES: BrokerConnectionStatus[] = [
  "active_trial",
  "paid",
  "connected",
];

const IN_PROGRESS_STATUSES: BrokerConnectionStatus[] = [
  "submitted",
  "provisioning",
  "operator_action",
  "verifying",
  "pending",
];

const RETRYABLE_STATUSES: BrokerConnectionStatus[] = [
  "failed",
  "none",
  "skipped",
];

export function normalizeBrokerStatus(
  status: string | undefined | null
): BrokerConnectionStatus {
  switch (status) {
    case "none":
    case "skipped":
    case "pending":
    case "connected":
    case "submitted":
    case "provisioning":
    case "operator_action":
    case "verifying":
    case "active_trial":
    case "failed":
    case "trial_expired":
    case "paid":
    case "disabled":
      return status;
    default:
      return "none";
  }
}

export function formatBrokerStatusLabel(status: BrokerConnectionStatus): string {
  switch (status) {
    case "none":
      return "Not started";
    case "skipped":
      return "Skipped";
    case "pending":
    case "submitted":
      return "Submitted";
    case "provisioning":
      return "Provisioning";
    case "operator_action":
      return "Operator review";
    case "verifying":
      return "Verifying";
    case "active_trial":
      return "Active trial";
    case "failed":
      return "Failed";
    case "trial_expired":
      return "Trial expired";
    case "paid":
    case "connected":
      return "Active";
    case "disabled":
      return "Disabled";
    default:
      return "Unknown";
  }
}

export function isOnboardingIncomplete(status: BrokerConnectionStatus): boolean {
  return status === "none" || status === "skipped";
}

const REVIEW_STATUSES: BrokerConnectionStatus[] = [
  "none",
  "pending",
  "submitted",
  "provisioning",
  "operator_action",
  "verifying",
  "failed",
];

export function isDashboardLocked(status: BrokerConnectionStatus): boolean {
  return REVIEW_STATUSES.includes(status);
}

export function isOnboardingInProgress(status: BrokerConnectionStatus): boolean {
  return IN_PROGRESS_STATUSES.includes(status);
}

export function isOnboardingReady(status: BrokerConnectionStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}

export function canUpdateCredentials(status: BrokerConnectionStatus): boolean {
  return (
    RETRYABLE_STATUSES.includes(status) ||
    status === "failed" ||
    status === "trial_expired" ||
    status === "disabled" ||
    isOnboardingInProgress(status)
  );
}

export function shouldShowPaymentCta(status: BrokerConnectionStatus): boolean {
  return status === "active_trial" || status === "trial_expired";
}

export function shouldPollOnboarding(status: BrokerConnectionStatus): boolean {
  return isOnboardingInProgress(status);
}

export function getTrialCountdown(trialEndsAt: string | null | undefined): {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
  label: string;
} {
  if (!trialEndsAt) {
    return {
      totalMs: 0,
      days: FREE_TRIAL_DAYS,
      hours: 0,
      minutes: 0,
      expired: false,
      label: `${FREE_TRIAL_DAYS}-day trial`,
    };
  }

  const end = new Date(trialEndsAt).getTime();
  const now = Date.now();
  const totalMs = Math.max(0, end - now);
  const expired = totalMs <= 0;
  const days = Math.floor(totalMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((totalMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((totalMs % (60 * 60 * 1000)) / (60 * 1000));

  let label: string;
  if (expired) {
    label = "Trial ended";
  } else if (days > 0) {
    label = `${days}d ${hours}h left`;
  } else if (hours > 0) {
    label = `${hours}h ${minutes}m left`;
  } else {
    label = `${minutes}m left`;
  }

  return { totalMs, days, hours, minutes, expired, label };
}

function stepState(
  complete: boolean,
  current: boolean,
  error = false,
  blocked = false
): ChecklistStepState {
  if (error) return "error";
  if (blocked) return "blocked";
  if (complete) return "complete";
  if (current) return "current";
  return "upcoming";
}

/** Build a resumable checklist reflecting the current broker connection status. */
export function buildOnboardingChecklist(
  status: BrokerConnectionStatus,
  options?: { hasError?: boolean }
): OnboardingChecklistStep[] {
  const hasError = options?.hasError === true || status === "failed";
  const submitted =
    status !== "none" &&
    status !== "skipped" &&
    status !== "failed";
  const pastSubmitted =
    submitted &&
    status !== "submitted" &&
    status !== "pending";
  const pastProvisioning =
    pastSubmitted &&
    status !== "provisioning";
  const pastOperator =
    pastProvisioning &&
    status !== "operator_action";
  const pastVerifying =
    pastOperator &&
    status !== "verifying";
  const trialActive = status === "active_trial" || status === "paid" || status === "connected";
  const paid = status === "paid" || status === "connected";
  const expired = status === "trial_expired";
  const disabled = status === "disabled";

  const detailsComplete = status !== "none" && status !== "skipped";
  const consentComplete = detailsComplete;

  return [
    {
      id: "details",
      label: "Account details",
      description: "Broker, MT5 login, and server",
      state: stepState(detailsComplete, status === "none" || status === "skipped"),
    },
    {
      id: "consent",
      label: "Risk acknowledgement",
      description: "Confirm trading risk and credential consent",
      state: stepState(
        consentComplete,
        (status === "none" || status === "skipped") && !detailsComplete
      ),
    },
    {
      id: "submitted",
      label: "Submitted",
      description: "Credentials received securely",
      state: stepState(
        submitted || pastSubmitted,
        status === "submitted" || status === "pending",
        hasError && (status === "failed" || status === "submitted")
      ),
    },
    {
      id: "provisioning",
      label: "Provisioning",
      description: "Reserving a trading terminal",
      state: stepState(
        pastProvisioning,
        status === "provisioning",
        hasError && status === "provisioning",
        !submitted && !hasError
      ),
    },
    {
      id: "operator",
      label: "Operator setup",
      description: "Assisted MetaTrader login on your terminal",
      state: stepState(
        pastOperator,
        status === "operator_action",
        hasError && status === "operator_action",
        !pastProvisioning && !hasError
      ),
    },
    {
      id: "verifying",
      label: "Verifying",
      description: "Confirming MT5 login matches your account",
      state: stepState(
        pastVerifying && !hasError,
        status === "verifying",
        hasError && (status === "verifying" || status === "failed"),
        !pastOperator && !hasError
      ),
    },
    {
      id: "trial",
      label: `${FREE_TRIAL_DAYS}-day trial`,
      description: expired
        ? "Trial ended — subscribe to continue"
        : "Copy trading enabled after verification",
      state: stepState(
        trialActive || paid,
        status === "active_trial",
        false,
        (!pastVerifying && !trialActive && !expired && !disabled) || disabled
      ),
    },
    {
      id: "payment",
      label: "Subscription",
      description: paid
        ? "Subscription active"
        : expired
          ? "Payment required to reactivate"
          : "Continue after the trial",
      state: stepState(
        paid,
        status === "active_trial" || expired,
        false,
        !trialActive && !expired && !paid
      ),
    },
  ];
}
