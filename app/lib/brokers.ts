export type Broker = {
  id: string;
  name: string;
  logo: string;
};

/** The only broker available for account connection. */
export const CONNECTABLE_BROKER: Broker = {
  id: "icmarkets",
  name: "IC Markets",
  logo: "/brokers/icmarkets.png",
};

export const CONNECTABLE_PLATFORM = {
  id: "mt5",
  name: "MetaTrader 5",
} as const;

export function getConnectableBrokerLabel(): string {
  return `${CONNECTABLE_BROKER.name} (${CONNECTABLE_PLATFORM.name})`;
}
