import type { BrokerConnectPayload, BrokerConnectionData } from "./brokerConnection";
import { normalizeBrokerStatus } from "./onboardingStatus";
import { userGet, userPatch, userPost } from "./userApi";

export type BrokerConnectionResponse = {
  status: string;
  id?: string;
  broker_id?: string;
  broker_name?: string;
  mt5_login?: string;
  mt5_server?: string;
  account_id?: string;
  submitted_at?: string;
  verified_at?: string;
  trial_starts_at?: string | null;
  trial_ends_at?: string | null;
  error?: string | null;
  error_code?: string | null;
  account_key?: string | null;
  worker_id?: string | null;
  risk_acknowledged?: boolean;
};

export function mapBrokerConnection(data: BrokerConnectionResponse): BrokerConnectionData {
  const mt5Login = data.mt5_login ?? data.account_id;
  return {
    status: normalizeBrokerStatus(data.status),
    id: data.id,
    brokerId: data.broker_id,
    brokerName: data.broker_name,
    mt5Login,
    mt5Server: data.mt5_server,
    accountId: mt5Login,
    submittedAt: data.submitted_at,
    verifiedAt: data.verified_at,
    trialStartsAt: data.trial_starts_at,
    trialEndsAt: data.trial_ends_at,
    error: data.error,
    errorCode: data.error_code,
    accountKey: data.account_key,
    workerId: data.worker_id,
    riskAcknowledged: data.risk_acknowledged,
  };
}

function toApiBody(payload: BrokerConnectPayload) {
  return {
    broker_id: payload.brokerId,
    broker_name: payload.brokerName,
    mt5_login: payload.mt5Login,
    mt5_server: payload.mt5Server,
    mt5_password: payload.mt5Password,
    risk_acknowledged: payload.riskAcknowledged,
  };
}

export async function fetchBrokerConnection(): Promise<BrokerConnectionData> {
  const data = await userGet<BrokerConnectionResponse>("/broker/connection/");
  return mapBrokerConnection(data);
}

export async function submitBrokerConnectionApi(
  payload: BrokerConnectPayload
): Promise<BrokerConnectionData> {
  const data = await userPost<BrokerConnectionResponse>(
    "/broker/connection/",
    toApiBody(payload)
  );
  return mapBrokerConnection(data);
}

/** Replace credentials on an existing one-account connection (idempotent upsert). */
export async function updateBrokerCredentialsApi(
  payload: BrokerConnectPayload
): Promise<BrokerConnectionData> {
  try {
    const data = await userPatch<BrokerConnectionResponse>(
      "/broker/connection/",
      toApiBody(payload)
    );
    return mapBrokerConnection(data);
  } catch {
    // Fallback for backends that only expose POST upsert.
    return submitBrokerConnectionApi(payload);
  }
}

export async function skipBrokerConnectionApi(): Promise<BrokerConnectionData> {
  const data = await userPost<BrokerConnectionResponse>("/broker/connection/skip/");
  return mapBrokerConnection(data);
}
