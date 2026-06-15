"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearTokens } from "../../../lib/auth";

const NAV_ITEMS = [
  { href: "/managementadmin", label: "Dashboard", exact: true },
  { href: "/managementadmin/blog", label: "Blog" },
  { href: "/managementadmin/news", label: "News" },
  { href: "/managementadmin/pricing", label: "Pricing" },
  { href: "/managementadmin/faq", label: "FAQ" },
  { href: "/managementadmin/content", label: "Content Blocks" },
  { href: "/managementadmin/site-config", label: "Site Config" },
  { href: "/managementadmin/trades", label: "Trades" },
  { href: "/managementadmin/signals", label: "Signals" },
  { href: "/managementadmin/stats", label: "Performance Stats" },
  { href: "/managementadmin/community", label: "Community" },
  { href: "/managementadmin/contact-leads", label: "Contact Leads" },
  { href: "/managementadmin/chatbot-leads", label: "Chatbot Leads" },
  { href: "/managementadmin/users", label: "Users" },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  function handleLogout() {
    clearTokens();
    window.location.href = "/managementadmin/login";
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 px-4 py-5">
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
          PipAngel
        </p>
        <h1 className="mt-1 text-sm font-semibold text-white">Management Admin</h1>
        <p className="mt-1 truncate text-xs text-zinc-500">{email}</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-zinc-800 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
