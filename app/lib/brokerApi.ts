import type { BrokerConnectPayload, BrokerConnectionData } from "./brokerConnection";
import { userGet, userPost } from "./userApi";

type BrokerConnectionResponse = {
  status: "none" | "skipped" | "pending" | "connected";
  broker_id?: string;
  broker_name?: string;
  account_id?: string;
  submitted_at?: string;
};

export function mapBrokerConnection(data: BrokerConnectionResponse): BrokerConnectionData {
  return {
    status: data.status,
    brokerId: data.broker_id,
    brokerName: data.broker_name,
    accountId: data.account_id,
    submittedAt: data.submitted_at,
  };
}

export async function fetchBrokerConnection(): Promise<BrokerConnectionData> {
  const data = await userGet<BrokerConnectionResponse>("/broker/connection/");
  return mapBrokerConnection(data);
}

export async function submitBrokerConnectionApi(
  payload: BrokerConnectPayload
): Promise<BrokerConnectionData> {
  const data = await userPost<BrokerConnectionResponse>("/broker/connection/", {
    broker_id: payload.brokerId,
    broker_name: payload.brokerName,
    account_id: payload.accountId,
  });
  return mapBrokerConnection(data);
}

export async function skipBrokerConnectionApi(): Promise<BrokerConnectionData> {
  const data = await userPost<BrokerConnectionResponse>("/broker/connection/skip/");
  return mapBrokerConnection(data);
}
