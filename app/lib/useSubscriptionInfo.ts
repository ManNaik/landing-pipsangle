"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [liveSubscription, setLiveSubscription] = useState<SubscriptionInfo | null>(null);
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

  const mockSubscription = useMemo(() => {
    if (!user || !isMockApiEnabled()) return null;
    // Stored overrides are external; `revision` is the signal to read them again.
    void revision;
    return getSubscriptionInfo(user, {
      effectiveRenewalIso: getEffectiveSubscriptionEnd(user),
      trialActiveOverride: loadTrialActiveOverride(user),
    });
  }, [user, revision]);

  useEffect(() => {
    if (!user || isMockApiEnabled()) return;

    const currentUser = user;
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchSubscriptionMe();
        if (!cancelled) setLiveSubscription(data);
      } catch {
        if (!cancelled) {
          setLiveSubscription(
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

  const subscription = !user
    ? null
    : isMockApiEnabled()
      ? mockSubscription
      : liveSubscription;

  return { subscription, refresh };
}
