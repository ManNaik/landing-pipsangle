"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getPeriodProfit,
  getProfitData,
  getProfitRange,
  type ProfitDataPoint,
  type ProfitPeriod,
} from "./profitData";
import { fetchProfit } from "./tradesApi";
import { isMockApiEnabled } from "./mockData";
import { onAuthChange } from "./auth";

export function useProfitData(
  period: ProfitPeriod,
  custom?: { from: string; to: string }
) {
  const [data, setData] = useState<ProfitDataPoint[]>([]);
  const [allTimeProfit, setAllTimeProfit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (isMockApiEnabled()) {
      const range = getProfitRange(period, period === "custom" ? custom : undefined);
      const points = getProfitData(range);
      setData(points);
      setAllTimeProfit(getPeriodProfit(points));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetchProfit(period, period === "custom" ? custom : undefined);
      setData(result.points);
      setAllTimeProfit(result.allTimeProfit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profit data.");
    } finally {
      setLoading(false);
    }
  }, [period, custom?.from, custom?.to]);

  useEffect(() => {
    void refresh();
    return onAuthChange(() => {
      void refresh();
    });
  }, [refresh]);

  const periodProfit = getPeriodProfit(data);

  return { data, periodProfit, allTimeProfit, loading, error, refresh };
}
