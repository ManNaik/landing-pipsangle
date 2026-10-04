"use client";

import { LoaderCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider } from "@/app/components/ui/sidebar";
import { Toaster } from "@/app/components/ui/sonner";
import { fetchCurrentUser } from "../../lib/auth";
import type { AuthUser } from "../../lib/types";
import { AdminAppSidebar } from "./_components/AdminAppSidebar";
import { AdminHeader } from "./_components/AdminHeader";

const SHELL_CLASSES = ["admin-shell", "dark"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [user, setUser] = useState<AuthUser | null>(null);

  // Menus, dialogs and toasts render in portals on <body>, outside this tree.
  useEffect(() => {
    document.body.classList.add(...SHELL_CLASSES);
    return () => document.body.classList.remove(...SHELL_CLASSES);
  }, []);

  useEffect(() => {
    if (isLoginPage) return;
    let active = true;
    fetchCurrentUser()
      .then((current) => {
        if (!active) return;
        if (!current.is_staff) {
          router.replace("/admin/login");
          return;
        }
        setUser(current);
      })
      .catch(() => {
        if (active) router.replace("/admin/login");
      });
    return () => {
      active = false;
    };
  }, [isLoginPage, router]);

  if (isLoginPage) {
    return (
      <div className="admin-shell dark min-h-svh">
        {children}
        <Toaster position="top-center" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-shell dark flex min-h-svh items-center justify-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle className="size-4 animate-spin" />
        Loading admin…
      </div>
    );
  }

  return (
    <div className="admin-shell dark">
      <SidebarProvider>
        <AdminAppSidebar email={user.email} />
        <SidebarInset className="min-w-0">
          <AdminHeader />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
