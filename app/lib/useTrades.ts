"use client";

import { useCallback, useEffect, useState } from "react";
import type { ExecutedTrade } from "./types";
import { fetchOpenTrades, fetchTradeStats, type TradeStats } from "./tradesApi";
import { mockExecutedTrades, isMockApiEnabled } from "./mockData";
import { computeTradeStats, getLifetimeTrades } from "./tradesHistoryData";
import { onAuthChange } from "./auth";

export function useOpenTrades() {
  const [trades, setTrades] = useState<ExecutedTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (isMockApiEnabled()) {
      setTrades(mockExecutedTrades.filter((t) => t.status === "open"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchOpenTrades();
      setTrades(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trades.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return onAuthChange(() => {
      void refresh();
    });
  }, [refresh]);

  return { trades, loading, error, refresh };
}

export function useTradeStats() {
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (isMockApiEnabled()) {
      const allMock = getLifetimeTrades();
      const full = computeTradeStats(allMock);
      setStats({
        total: full.total,
        live: full.live,
        closed: full.closed,
        totalPnl: full.totalPnl,
        wins: full.wins,
        losses: full.losses,
        pairs: new Set(allMock.map((t) => t.pair)).size,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchTradeStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trade stats.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return onAuthChange(() => {
      void refresh();
    });
  }, [refresh]);

  return { stats, loading, error, refresh };
}
