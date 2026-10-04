"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  fetchBrokerConnection,
  skipBrokerConnectionApi,
  submitBrokerConnectionApi,
  updateBrokerCredentialsApi,
} from "./brokerApi";
import {
  completeBrokerVerification,
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
import { track, trackOnce } from "./analytics";
import { isDevDemoEnabled, isMockApiEnabled } from "./env";
import {
  isOnboardingReady,
  shouldPollOnboarding,
} from "./onboardingStatus";

type UseBrokerConnectionOptions = {
  userId: string;
  userEmail?: string;
  /** When true, incomplete onboarding redirects to /onboarding */
  autoRedirect?: boolean;
};

const POLL_INTERVAL_MS = 5000;

export function useBrokerConnection({
  userId,
  autoRedirect = true,
}: UseBrokerConnectionOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const [connection, setConnection] = useState<BrokerConnectionData>(() =>
    isMockApiEnabled() ? getBrokerConnection(userId) : { status: "none" }
  );
  const [loading, setLoading] = useState(!isMockApiEnabled());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConnectedMessage, setShowConnectedMessage] = useState(false);

  const refresh = useCallback(async () => {
    if (isMockApiEnabled()) {
      const next = getBrokerConnection(userId);
      setConnection(next);
      setShowConnectedMessage(shouldShowConnectedMessage(userId));
      setLoading(false);
      return next;
    }

    try {
      const next = await fetchBrokerConnection();
      setConnection(next);
      setShowConnectedMessage(
        isOnboardingReady(next.status) && shouldShowConnectedMessage(userId)
      );
      if (next.status === "active_trial") {
        trackOnce(`broker_connected_${userId}`, "broker_connected", { status: next.status });
      }
      setError(next.error ?? null);
      return next;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load onboarding status");
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
    return onBrokerConnectionChange(() => {
      void refresh();
    });
  }, [refresh]);

  useEffect(() => {
    // Only force first-time setup; skipped users may browse with a warning banner.
    if (!autoRedirect || loading) return;
    if (connection.status !== "none") return;
    if (pathname?.startsWith("/onboarding")) return;
    router.replace("/onboarding");
  }, [autoRedirect, loading, connection.status, pathname, router]);

  useEffect(() => {
    if (!shouldPollOnboarding(connection.status)) return;
    const poll = window.setInterval(() => {
      void refresh();
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(poll);
  }, [connection.status, refresh]);

  const handleSkip = useCallback(async () => {
    setError(null);
    try {
      if (isMockApiEnabled()) {
        skipBrokerConnection(userId);
        setConnection({ status: "skipped" });
      } else {
        const next = await skipBrokerConnectionApi();
        setConnection(next);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not skip onboarding");
    }
  }, [userId, router]);

  const handleSubmit = useCallback(
    async (payload: BrokerConnectPayload) => {
      setSubmitting(true);
      setError(null);
      try {
        // Password is write-only: never store it outside this request stack frame.
        const { mt5Password: _password, ...safeMeta } = payload;
        void _password;

        if (isMockApiEnabled()) {
          submitBrokerConnection(userId, safeMeta);
          const next = getBrokerConnection(userId);
          setConnection(next);
          if (isDevDemoEnabled()) {
            // Explicit local mock advance only — never in production.
            window.setTimeout(() => {
              completeBrokerVerification(userId);
            }, 1500);
          }
          return next;
        }

        const isUpdate =
          connection.status !== "none" && connection.status !== "skipped";
        const next = isUpdate
          ? await updateBrokerCredentialsApi(payload)
          : await submitBrokerConnectionApi(payload);
        setConnection(next);
        track("broker_submitted", { update: isUpdate });
        return next;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not submit broker details";
        setError(message);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [userId, connection.status]
  );

  const dismissConnectedMessage = useCallback(() => {
    markConnectedMessageShown(userId);
    setShowConnectedMessage(false);
  }, [userId]);

  const openOnboarding = useCallback(() => {
    router.push("/onboarding");
  }, [router]);

  const status: BrokerConnectionStatus = connection.status ?? "none";

  return {
    connection,
    status,
    loading,
    submitting,
    error,
    setError,
    openOnboarding,
    handleSkip,
    handleSubmit,
    refresh,
    showConnectedMessage,
    dismissConnectedMessage,
  };
}
