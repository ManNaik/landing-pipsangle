"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearTokens,
  fetchCurrentUser,
  getAccessToken,
  logout as authLogout,
  onAuthChange,
} from "./auth";
import type { AuthUser } from "./types";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const current = await fetchCurrentUser(token);
      setUser(current);
    } catch {
      clearTokens();
      setUser(null);
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

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  return { user, loading, logout, refresh };
}
