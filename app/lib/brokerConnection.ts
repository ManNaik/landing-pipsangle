import { normalizeBrokerStatus } from "./onboardingStatus";

export type BrokerConnectionStatus =
  | "none"
  | "skipped"
  | "pending"
  | "connected"
  | "submitted"
  | "provisioning"
  | "operator_action"
  | "verifying"
  | "active_trial"
  | "failed"
  | "trial_expired"
  | "paid"
  | "disabled";

export type BrokerConnectionData = {
  status: BrokerConnectionStatus;
  id?: string;
  brokerId?: string;
  brokerName?: string;
  mt5Login?: string;
  mt5Server?: string;
  /** @deprecated Prefer mt5Login — retained for legacy responses */
  accountId?: string;
  submittedAt?: string;
  verifiedAt?: string;
  trialStartsAt?: string | null;
  trialEndsAt?: string | null;
  error?: string | null;
  errorCode?: string | null;
  accountKey?: string | null;
  workerId?: string | null;
  riskAcknowledged?: boolean;
};

/** Write-only payload. mt5Password must never be persisted client-side. */
export type BrokerConnectPayload = {
  brokerId: string;
  brokerName: string;
  mt5Login: string;
  mt5Server: string;
  mt5Password: string;
  riskAcknowledged: boolean;
};

const STORAGE_PREFIX = "pipangel-broker-connection";
const CONNECTED_SHOWN_PREFIX = "pipangel-broker-connected-shown";
const BROKER_CHANGE_EVENT = "pipangel-broker-connection-change";

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}:${userId}`;
}

function connectedShownKey(userId: string): string {
  return `${CONNECTED_SHOWN_PREFIX}:${userId}`;
}

function sanitizeStored(data: BrokerConnectionData): BrokerConnectionData {
  // Never keep passwords — strip any accidental fields from older mocks.
  const {
    status,
    id,
    brokerId,
    brokerName,
    mt5Login,
    mt5Server,
    accountId,
    submittedAt,
    verifiedAt,
    trialStartsAt,
    trialEndsAt,
    error,
    errorCode,
    accountKey,
    workerId,
    riskAcknowledged,
  } = data;
  return {
    status: normalizeBrokerStatus(status),
    id,
    brokerId,
    brokerName,
    mt5Login: mt5Login ?? accountId,
    mt5Server,
    accountId: mt5Login ?? accountId,
    submittedAt,
    verifiedAt,
    trialStartsAt,
    trialEndsAt,
    error,
    errorCode,
    accountKey,
    workerId,
    riskAcknowledged,
  };
}

export function getBrokerConnection(userId: string): BrokerConnectionData {
  if (typeof window === "undefined") {
    return { status: "none" };
  }

  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return { status: "none" };
    const parsed = JSON.parse(raw) as Partial<BrokerConnectionData> & {
      mt5Password?: string;
      password?: string;
    };
    delete parsed.mt5Password;
    delete parsed.password;
    return sanitizeStored({
      status: normalizeBrokerStatus(parsed.status),
      ...parsed,
    });
  } catch {
    return { status: "none" };
  }
}

export function getBrokerConnectionStatus(userId: string): BrokerConnectionStatus {
  return getBrokerConnection(userId).status;
}

function saveBrokerConnection(userId: string, data: BrokerConnectionData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(sanitizeStored(data)));
  notifyBrokerConnectionChange();
}

export function skipBrokerConnection(userId: string): void {
  saveBrokerConnection(userId, { status: "skipped" });
}

export function submitBrokerConnection(
  userId: string,
  payload: Omit<BrokerConnectPayload, "mt5Password">
): void {
  saveBrokerConnection(userId, {
    status: "submitted",
    brokerId: payload.brokerId,
    brokerName: payload.brokerName,
    mt5Login: payload.mt5Login,
    mt5Server: payload.mt5Server,
    accountId: payload.mt5Login,
    riskAcknowledged: payload.riskAcknowledged,
    submittedAt: new Date().toISOString(),
    error: null,
    errorCode: null,
  });
}

/** Dev/mock only — advances mock localStorage state. */
export function completeBrokerVerification(userId: string): void {
  const current = getBrokerConnection(userId);
  const trialStartsAt = new Date().toISOString();
  const trialEnds = new Date();
  trialEnds.setDate(trialEnds.getDate() + 4);
  saveBrokerConnection(userId, {
    ...current,
    status: "active_trial",
    verifiedAt: trialStartsAt,
    trialStartsAt,
    trialEndsAt: trialEnds.toISOString(),
    error: null,
    errorCode: null,
  });
}

export function shouldShowWarningBanner(status: BrokerConnectionStatus): boolean {
  return status === "none" || status === "skipped";
}

export function shouldShowConnectedMessage(userId: string): boolean {
  if (typeof window === "undefined") return false;
  const status = getBrokerConnectionStatus(userId);
  if (status !== "active_trial" && status !== "paid" && status !== "connected") {
    return false;
  }
  return localStorage.getItem(connectedShownKey(userId)) !== "1";
}

export function markConnectedMessageShown(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(connectedShownKey(userId), "1");
}

export function notifyBrokerConnectionChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BROKER_CHANGE_EVENT));
  }
}

export function onBrokerConnectionChange(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(BROKER_CHANGE_EVENT, listener);
  return () => window.removeEventListener(BROKER_CHANGE_EVENT, listener);
}
