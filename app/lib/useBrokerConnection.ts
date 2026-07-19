"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchBrokerConnection,
  skipBrokerConnectionApi,
  submitBrokerConnectionApi,
} from "./brokerApi";
import {
  completeBrokerVerification,
  DEMO_AUTO_VERIFY_MS,
  getBrokerConnection,
  markConnectedMessageShown,
  onBrokerConnectionChange,
  shouldShowConnectedMessage,
  skipBrokerConnection,
  submitBrokerConnection,
  type BrokerConnectPayload,
  type BrokerConnectionData,
  type BrokerConnectionStatus,
} from "./brokerConnection";
import { isMockApiEnabled } from "./mockData";

type UseBrokerConnectionOptions = {
  userId: string;
  userEmail?: string;
};

export function useBrokerConnection({ userId, userEmail }: UseBrokerConnectionOptions) {
  const [connection, setConnection] = useState<BrokerConnectionData>(() =>
    isMockApiEnabled() ? getBrokerConnection(userId) : { status: "none" }
  );
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [showConnectedMessage, setShowConnectedMessage] = useState(false);

  const refresh = useCallback(async () => {
    if (isMockApiEnabled()) {
      const next = getBrokerConnection(userId);
      setConnection(next);
      setShowConnectedMessage(shouldShowConnectedMessage(userId));
      return;
    }

    try {
      const next = await fetchBrokerConnection();
      setConnection(next);
      setShowConnectedMessage(
        next.status === "connected" && shouldShowConnectedMessage(userId)
      );
    } catch {
      setConnection({ status: "none" });
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
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
      if (isMockApiEnabled()) {
        completeBrokerVerification(userId);
      } else {
        void refresh();
      }
    }
  }, [connection.status, userId, refresh]);

  useEffect(() => {
    if (connection.status !== "pending") return;
    if (isMockApiEnabled()) {
      if (userEmail?.toLowerCase() !== "demo@pipangel.com") return;
      const timer = window.setTimeout(() => {
        completeBrokerVerification(userId);
      }, DEMO_AUTO_VERIFY_MS);
      return () => window.clearTimeout(timer);
    }

    const poll = window.setInterval(() => {
      void refresh();
    }, 2000);
    const timeout = window.setTimeout(() => {
      window.clearInterval(poll);
    }, DEMO_AUTO_VERIFY_MS + 4000);

    return () => {
      window.clearInterval(poll);
      window.clearTimeout(timeout);
    };
  }, [connection.status, userEmail, userId, refresh]);

  const openOnboarding = useCallback(() => {
    setOnboardingOpen(true);
  }, []);

  const closeOnboarding = useCallback(() => {
    setOnboardingOpen(false);
  }, []);

  const handleSkip = useCallback(async () => {
    if (isMockApiEnabled()) {
      skipBrokerConnection(userId);
    } else {
      const next = await skipBrokerConnectionApi();
      setConnection(next);
    }
    setOnboardingOpen(false);
  }, [userId]);

  const handleSubmit = useCallback(
    async (payload: BrokerConnectPayload) => {
      if (isMockApiEnabled()) {
        submitBrokerConnection(userId, payload);
      } else {
        const next = await submitBrokerConnectionApi(payload);
        setConnection(next);
      }
    },
    [userId]
  );

  const handleCompleteVerification = useCallback(() => {
    if (isMockApiEnabled()) {
      completeBrokerVerification(userId);
    } else {
      void refresh();
    }
    setOnboardingOpen(false);
  }, [userId, refresh]);

  const dismissConnectedMessage = useCallback(() => {
    markConnectedMessageShown(userId);
    setShowConnectedMessage(false);
  }, [userId]);

  const status: BrokerConnectionStatus = connection.status ?? "none";

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
