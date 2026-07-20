"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchSubscriptionMe } from "./subscriptionApi";
import { getSubscriptionInfo, type SubscriptionInfo } from "./subscriptionData";
import {
  getEffectiveSubscriptionEnd,
  loadTrialActiveOverride,
  SUBSCRIPTION_EXTENSION_STORAGE_KEY,
} from "./storeData";
import { isMockApiEnabled } from "./mockData";
import type { AuthUser } from "./types";
import { onAuthChange } from "./auth";

export function useSubscriptionInfo(user: AuthUser | null) {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [revision, setRevision] = useState(0);

  const refresh = useCallback(() => {
    setRevision((current) => current + 1);
  }, []);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === SUBSCRIPTION_EXTENSION_STORAGE_KEY) {
        refresh();
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      return;
    }

    if (isMockApiEnabled()) {
      setSubscription(
        getSubscriptionInfo(user, {
          effectiveRenewalIso: getEffectiveSubscriptionEnd(user),
          trialActiveOverride: loadTrialActiveOverride(user),
        })
      );
      return;
    }

    const currentUser = user;
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchSubscriptionMe();
        if (!cancelled) setSubscription(data);
      } catch {
        if (!cancelled) {
          setSubscription(
            getSubscriptionInfo(currentUser, {
              effectiveRenewalIso: getEffectiveSubscriptionEnd(currentUser),
              trialActiveOverride: loadTrialActiveOverride(currentUser),
            })
          );
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [user, revision]);

  useEffect(() => {
    return onAuthChange(refresh);
  }, [refresh]);

  return { subscription, refresh };
}
