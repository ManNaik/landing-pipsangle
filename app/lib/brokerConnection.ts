export type BrokerConnectionStatus = "none" | "skipped" | "pending" | "connected";

export type BrokerConnectionData = {
  status: BrokerConnectionStatus;
  brokerId?: string;
  brokerName?: string;
  accountId?: string;
  submittedAt?: string;
};

export type BrokerConnectPayload = {
  brokerId: string;
  brokerName: string;
  accountId: string;
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

export function getBrokerConnection(userId: string): BrokerConnectionData {
  if (typeof window === "undefined") {
    return { status: "none" };
  }

  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return { status: "none" };
    const parsed = JSON.parse(raw) as Partial<BrokerConnectionData>;
    const status = parsed.status;
    if (
      status === "skipped" ||
      status === "pending" ||
      status === "connected"
    ) {
      return {
        status,
        brokerId: parsed.brokerId,
        brokerName: parsed.brokerName,
        accountId: parsed.accountId,
        submittedAt: parsed.submittedAt,
      };
    }
    return { status: "none" };
  } catch {
    return { status: "none" };
  }
}

export function getBrokerConnectionStatus(userId: string): BrokerConnectionStatus {
  return getBrokerConnection(userId).status;
}

function saveBrokerConnection(userId: string, data: BrokerConnectionData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(data));
  notifyBrokerConnectionChange();
}

export function skipBrokerConnection(userId: string): void {
  saveBrokerConnection(userId, { status: "skipped" });
}

export function submitBrokerConnection(
  userId: string,
  payload: BrokerConnectPayload
): void {
  saveBrokerConnection(userId, {
    status: "pending",
    brokerId: payload.brokerId,
    brokerName: payload.brokerName,
    accountId: payload.accountId,
    submittedAt: new Date().toISOString(),
  });
}

export function completeBrokerVerification(userId: string): void {
  const current = getBrokerConnection(userId);
  saveBrokerConnection(userId, {
    ...current,
    status: "connected",
  });
}

export function shouldShowWarningBanner(status: BrokerConnectionStatus): boolean {
  return status === "none" || status === "skipped";
}

export function shouldShowConnectedMessage(userId: string): boolean {
  if (typeof window === "undefined") return false;
  const status = getBrokerConnectionStatus(userId);
  if (status !== "connected") return false;
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

export const DEMO_AUTO_VERIFY_MS = 8000;
