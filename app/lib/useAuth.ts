"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearLegacyTokenStorage,
  fetchCurrentUser,
  logout as authLogout,
  onAuthChange,
} from "./auth";
import type { AuthUser } from "./types";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    clearLegacyTokenStorage();
    try {
      const current = await fetchCurrentUser();
      setUser(current);
    } catch {
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

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
  }, []);

  return { user, loading, logout, refresh };
}
