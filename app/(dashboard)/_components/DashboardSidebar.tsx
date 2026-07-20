"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

type NavIconProps = { className?: string };

function DashboardIcon({ className = "h-5 w-5" }: NavIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function TradesIcon({ className = "h-5 w-5" }: NavIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    </svg>
  );
}

function StoreIcon({ className = "h-5 w-5" }: NavIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.705L5.404 5.109a48.54 48.54 0 017.192-.33 48.54 48.54 0 017.192.33l2.275 2.535A3.004 3.004 0 0121 9.349"
      />
    </svg>
  );
}

function SubscriptionIcon({ className = "h-5 w-5" }: NavIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
      />
    </svg>
  );
}

function ControlIcon({ className = "h-5 w-5" }: NavIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
      />
    </svg>
  );
}

function SupportIcon({ className = "h-5 w-5" }: NavIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
      />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }: NavIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    exact: true as const,
    Icon: DashboardIcon,
  },
  {
    href: "/control",
    label: "Control",
    exact: false as const,
    Icon: ControlIcon,
  },
  {
    href: "/trades",
    label: "Trades",
    exact: false as const,
    Icon: TradesIcon,
  },
  {
    href: "/store",
    label: "Store",
    exact: false as const,
    Icon: StoreIcon,
  },
  {
    href: "/subscription",
    label: "Subscription",
    exact: false as const,
    Icon: SubscriptionIcon,
  },
] as const;

type DashboardSidebarProps = {
  open: boolean;
  onClose: () => void;
  brandName: string;
};

export function DashboardSidebar({ open, onClose, brandName }: DashboardSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Account navigation"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(18rem,88vw)] shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:z-40 lg:w-64 lg:translate-x-0 ${
          open ? "translate-x-0 shadow-2xl shadow-black/40" : "-translate-x-full lg:translate-x-0 lg:shadow-none"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.12),transparent_60%)]"
          aria-hidden
        />

        <div className="relative flex items-center justify-between gap-3 border-b border-zinc-800/80 px-5 py-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="group min-w-0"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-400/70">
              Account
            </p>
            <p className="mt-1 truncate text-base font-semibold tracking-tight text-white transition group-hover:text-emerald-100">
              {brandName}
            </p>
          </Link>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-800 hover:text-white lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="relative flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const { Icon } = item;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                      active
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 shrink-0 ${
                        active ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative border-t border-zinc-800/80 p-3">
          <Link
            href="/contact"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
          >
            <SupportIcon className="h-5 w-5 shrink-0 text-zinc-500" />
            Support
          </Link>
        </div>
      </aside>
    </>
  );
}
