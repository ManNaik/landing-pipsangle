"use client";

import { createContext, useContext } from "react";
import type { BrokerConnectionStatus } from "../../lib/brokerConnection";

type BrokerConnectionContextValue = {
  status: BrokerConnectionStatus;
  openOnboarding: () => void;
  showConnectedMessage: boolean;
  dismissConnectedMessage: () => void;
};

const BrokerConnectionContext = createContext<BrokerConnectionContextValue | null>(null);

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
    throw new Error("useBrokerConnectionContext must be used within BrokerConnectionProvider");
  }
  return context;
}
