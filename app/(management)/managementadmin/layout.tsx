"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCurrentUser, getAccessToken } from "../../lib/auth";
import type { AuthUser } from "../../lib/types";
import { AdminSidebar } from "./_components/AdminSidebar";

export default function ManagementAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/managementadmin/login";
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      router.replace("/managementadmin/login");
      return;
    }

    fetchCurrentUser(token)
      .then((u) => {
        if (!u.is_staff) {
          router.replace("/managementadmin/login");
          return;
        }
        setUser(u);
        setLoading(false);
      })
      .catch(() => {
        router.replace("/managementadmin/login");
      });
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <p className="text-sm text-zinc-400">Loading admin panel…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar email={user.email} />
      <div className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
