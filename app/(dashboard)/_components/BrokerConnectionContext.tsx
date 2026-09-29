"use client";

import { createContext, useContext } from "react";
import type {
  BrokerConnectPayload,
  BrokerConnectionData,
  BrokerConnectionStatus,
} from "../../lib/brokerConnection";

type BrokerConnectionContextValue = {
  connection: BrokerConnectionData;
  status: BrokerConnectionStatus;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  openOnboarding: () => void;
  handleSkip: () => Promise<void>;
  handleSubmit: (payload: BrokerConnectPayload) => Promise<unknown>;
  refresh: () => Promise<BrokerConnectionData | null>;
  showConnectedMessage: boolean;
  dismissConnectedMessage: () => void;
};

const BrokerConnectionContext = createContext<BrokerConnectionContextValue | null>(
  null
);

export function BrokerConnectionProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: BrokerConnectionContextValue;
}) {
  return (
    <BrokerConnectionContext.Provider value={value}>
      {children}
    </BrokerConnectionContext.Provider>
  );
}

export function useBrokerConnectionContext(): BrokerConnectionContextValue {
  const context = useContext(BrokerConnectionContext);
  if (!context) {
    throw new Error(
      "useBrokerConnectionContext must be used within BrokerConnectionProvider"
    );
  }
  return context;
}
