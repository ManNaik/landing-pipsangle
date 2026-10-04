"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Staff screens load no analytics or consent banner, so staff visits don't skew site data. */
export function AnalyticsGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const staffArea = pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/preview/");
  return staffArea ? null : children;
}
