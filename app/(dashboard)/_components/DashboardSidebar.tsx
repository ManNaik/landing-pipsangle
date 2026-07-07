"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", exact: true as const },
  { href: "/trades", label: "Trades", exact: false as const },
  { href: "/store", label: "Referral and Store", exact: false as const },
  { href: "/control", label: "Control", exact: false as const },
] as const;

type DashboardSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function DashboardSidebar({ open, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col overflow-y-auto bg-zinc-900/95 transition-transform duration-200 ease-out lg:z-40 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 py-6">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
            Menu
          </p>
        </div>

        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
