"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchTradingSettings,
  patchTradingSettings,
  type TradingSettingsApiResult,
} from "./tradingSettingsApi";
import {
  getDefaultSettingsForPlan,
  type TradingSettings,
} from "./settingsData";
import { isMockApiEnabled } from "./mockData";
import { loadTradingSettings, saveTradingSettings } from "./settingsData";
import { onAuthChange } from "./auth";

export function useTradingSettings(plan: string | null) {
  const [settings, setSettings] = useState<TradingSettingsApiResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (isMockApiEnabled()) {
      const local = loadTradingSettings(plan);
      setSettings({
        ...local,
        planLimits: {
          min: plan === "Premium" ? 10 : 10,
          max: plan === "Premium" ? 100 : 40,
          default: plan === "Premium" ? 75 : 25,
          adjustable: plan === "Premium",
          step: 5,
        },
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchTradingSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, [plan]);

  const save = useCallback(
    async (next: TradingSettings) => {
      if (isMockApiEnabled()) {
        saveTradingSettings(next);
        setSettings((current) =>
          current ? { ...current, ...next } : { ...getDefaultSettingsForPlan(plan), ...next, planLimits: { min: 10, max: 100, default: 75, adjustable: true, step: 5 } }
        );
        return;
      }

      const data = await patchTradingSettings(next);
      setSettings(data);
    },
    [plan]
  );

  useEffect(() => {
    void refresh();
    return onAuthChange(() => {
      void refresh();
    });
  }, [refresh]);

  return { settings, loading, error, refresh, save };
}
