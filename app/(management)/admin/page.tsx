"use client";

import { FileText, Newspaper, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { adminGet } from "../../lib/adminApi";
import type { AdminDashboardStats } from "../../lib/types";

const STATS: { key: keyof AdminDashboardStats; label: string; href: string }[] = [
  { key: "news_total", label: "News articles", href: "/admin/news" },
  { key: "news_unpublished", label: "News drafts", href: "/admin/news?status=draft" },
  { key: "blog_total", label: "Blog posts", href: "/admin/blog" },
  { key: "contact_unhandled", label: "Unhandled contact messages", href: "/admin/contact-leads" },
  { key: "leads_uncontacted", label: "Uncontacted chatbot leads", href: "/admin/chatbot-leads" },
  { key: "users_total", label: "Users", href: "/admin/users" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminGet<AdminDashboardStats>("/dashboard/")
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Couldn't load the dashboard."));
  }, []);

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Content, leads and users at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/news/new">
              <Plus />
              New article
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/blog/new">
              <Plus />
              New blog post
            </Link>
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((item) => (
          <Link key={item.key} href={item.href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardHeader>
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className="text-3xl tabular-nums">
                  {stats ? stats[item.key] : <Skeleton className="h-9 w-16" />}
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Newspaper className="size-4 text-primary" />
              News
            </CardTitle>
            <CardDescription>Market news and the content pipeline&apos;s articles.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/admin/news">All articles</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/news?status=pipeline">From the pipeline</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4 text-primary" />
              Blog
            </CardTitle>
            <CardDescription>Guides and evergreen articles.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/admin/blog">All posts</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/blog?status=draft">Drafts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
