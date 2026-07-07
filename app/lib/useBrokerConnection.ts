"use client";

import { useCallback, useEffect, useState } from "react";
import {
  completeBrokerVerification,
  DEMO_AUTO_VERIFY_MS,
  getBrokerConnection,
  getBrokerConnectionStatus,
  markConnectedMessageShown,
  onBrokerConnectionChange,
  shouldShowConnectedMessage,
  skipBrokerConnection,
  submitBrokerConnection,
  type BrokerConnectPayload,
  type BrokerConnectionData,
  type BrokerConnectionStatus,
} from "./brokerConnection";

type UseBrokerConnectionOptions = {
  userId: string;
  userEmail?: string;
};

export function useBrokerConnection({ userId, userEmail }: UseBrokerConnectionOptions) {
  const [connection, setConnection] = useState<BrokerConnectionData>(() =>
    getBrokerConnection(userId)
  );
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [showConnectedMessage, setShowConnectedMessage] = useState(false);

  const refresh = useCallback(() => {
    const next = getBrokerConnection(userId);
    setConnection(next);
    setShowConnectedMessage(shouldShowConnectedMessage(userId));
  }, [userId]);

  useEffect(() => {
    refresh();
    return onBrokerConnectionChange(refresh);
  }, [refresh]);

  useEffect(() => {
    if (connection.status === "none") {
      setOnboardingOpen(true);
    }
  }, [connection.status]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("verify") === "1" && connection.status === "pending") {
      completeBrokerVerification(userId);
    }
  }, [connection.status, userId]);

  useEffect(() => {
    if (connection.status !== "pending") return;
    if (userEmail?.toLowerCase() !== "demo@pipangel.com") return;

    const timer = window.setTimeout(() => {
      completeBrokerVerification(userId);
    }, DEMO_AUTO_VERIFY_MS);

    return () => window.clearTimeout(timer);
  }, [connection.status, userEmail, userId]);

  const openOnboarding = useCallback(() => {
    setOnboardingOpen(true);
  }, []);

  const closeOnboarding = useCallback(() => {
    setOnboardingOpen(false);
  }, []);

  const handleSkip = useCallback(() => {
    skipBrokerConnection(userId);
    setOnboardingOpen(false);
  }, [userId]);

  const handleSubmit = useCallback(
    (payload: BrokerConnectPayload) => {
      submitBrokerConnection(userId, payload);
    },
    [userId]
  );

  const handleCompleteVerification = useCallback(() => {
    completeBrokerVerification(userId);
    setOnboardingOpen(false);
  }, [userId]);

  const dismissConnectedMessage = useCallback(() => {
    markConnectedMessageShown(userId);
    setShowConnectedMessage(false);
  }, [userId]);

  const status: BrokerConnectionStatus = connection.status ?? getBrokerConnectionStatus(userId);

  return {
    connection,
    status,
    onboardingOpen,
    openOnboarding,
    closeOnboarding,
    handleSkip,
    handleSubmit,
    handleCompleteVerification,
    showConnectedMessage,
    dismissConnectedMessage,
  };
}
