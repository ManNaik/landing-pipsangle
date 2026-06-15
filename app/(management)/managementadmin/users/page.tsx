"use client";

import { useCallback, useEffect, useState } from "react";
import { adminGet, adminPatch } from "../../../lib/adminApi";
import type { AdminPaginatedResponse, AdminUser } from "../../../lib/types";
import { Alert } from "../_components/Alert";
import { PageHeader } from "../_components/PageHeader";
import { StatusBadge } from "../_components/StatusBadge";

export default function AdminUsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminGet<AdminPaginatedResponse<AdminUser>>("/users/?limit=100");
      setItems(data.results);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateUser(id: string, patch: Partial<AdminUser>) {
    try {
      await adminPatch(`/users/${id}/`, patch);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed.");
    }
  }

  return (
    <div>
      <PageHeader title="Users" description="Manage user accounts and staff access." />
      {error ? <Alert type="error" message={error} /> : null}
      {loading ? <p className="text-sm text-zinc-400">Loading…</p> : null}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-white">{item.email}</p>
                <p className="text-xs text-zinc-500">
                  Plan: {item.plan_slug ?? "none"} · Joined {new Date(item.date_joined).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <StatusBadge active={item.is_active} label={item.is_active ? "Active" : "Inactive"} />
                {item.is_staff ? <StatusBadge active label="Staff" /> : null}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={item.is_staff}
                  onChange={(e) => updateUser(item.id, { is_staff: e.target.checked })}
                />
                Staff
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={item.is_active}
                  onChange={(e) => updateUser(item.id, { is_active: e.target.checked })}
                />
                Active
              </label>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 ? (
          <p className="text-sm text-zinc-500">No users found.</p>
        ) : null}
      </div>
    </div>
  );
}
