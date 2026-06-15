"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminGet } from "../../lib/adminApi";
import type { AdminDashboardStats } from "../../lib/types";
import { PageHeader } from "./_components/PageHeader";

const STAT_LINKS: { key: keyof AdminDashboardStats; label: string; href: string }[] = [
  { key: "blog_unpublished", label: "Unpublished blog posts", href: "/managementadmin/blog" },
  { key: "news_unpublished", label: "Unpublished news articles", href: "/managementadmin/news" },
  { key: "contact_unhandled", label: "Unhandled contact leads", href: "/managementadmin/contact-leads" },
  { key: "leads_uncontacted", label: "Uncontacted chatbot leads", href: "/managementadmin/chatbot-leads" },
  { key: "signals_active", label: "Active signals", href: "/managementadmin/signals" },
  { key: "users_total", label: "Total users", href: "/managementadmin/users" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGet<AdminDashboardStats>("/dashboard/")
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load stats."));
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of landing page content and inbound leads."
      />

      {error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : !stats ? (
        <p className="text-sm text-zinc-400">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STAT_LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 transition-colors hover:border-emerald-500/30"
            >
              <p className="text-3xl font-bold text-white">{stats[item.key]}</p>
              <p className="mt-1 text-sm text-zinc-400">{item.label}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
