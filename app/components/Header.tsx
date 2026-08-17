"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { isRetiredNavItem } from "../lib/defaultSiteConfig";
import type { SiteConfig } from "../lib/types";
import { logout } from "../lib/auth";
import { useAuth } from "../lib/useAuth";
import { LoginModal } from "./LoginModal";

type HeaderProps = {
  siteConfig: SiteConfig;
};

export function Header({ siteConfig }: HeaderProps) {
  // Defense-in-depth: never render retired Signals nav even if CMS/cache still sends it.
  const navigation = siteConfig.navigation.filter(
    (item) => !isRetiredNavItem(item)
  );
  const brandName = siteConfig.brand_name;
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (url: string) => {
    if (url === "/") return pathname === "/";
    return pathname === url || pathname.startsWith(url + "/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/80 supports-[padding:env(safe-area-inset-top)]:pt-[env(safe-area-inset-top)]">
      <nav className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_auto] items-center px-4 sm:h-[4.25rem] sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        {/* Left: logo */}
        <div className="justify-self-start">
          <Link
            href="/"
            className="flex shrink-0 items-center transition-opacity hover:opacity-90"
            aria-label={`${brandName} home`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/pip-logo1.png"
              alt={brandName}
              className="h-11 w-auto max-w-[180px] object-contain sm:h-12"
            />
          </Link>
        </div>

        {/* Center: primary nav (desktop) */}
        <ul className="hidden h-full items-stretch justify-self-center lg:flex">
          {navigation.map((item) => {
            const active = isActive(item.url);
            return (
              <li key={item.name} className="flex">
                <Link
                  href={item.url}
                  className={`relative inline-flex items-center px-2 text-[13px] tracking-wide transition-colors duration-200 xl:px-2.5 ${
                    active
                      ? "font-medium text-white"
                      : "text-zinc-400 hover:text-zinc-100"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-500 transition-opacity duration-200 xl:inset-x-2.5 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: auth + mobile toggle */}
        <div className="flex h-full shrink-0 items-center justify-self-end gap-3">
          {!loading && user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden items-center px-2.5 text-[13px] tracking-wide text-zinc-400 transition-colors duration-200 hover:text-zinc-100 lg:inline-flex"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="hidden items-center rounded-lg border border-zinc-700/80 bg-zinc-900/50 px-3.5 py-2 text-[13px] font-medium tracking-wide text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white lg:inline-flex"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="hidden h-9 items-center rounded-lg bg-emerald-500 px-4 text-[13px] font-medium tracking-wide text-white transition-colors duration-200 hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 lg:inline-flex"
            >
              Log in
            </button>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900/40 p-2 text-zinc-400 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`h-0.5 w-5 origin-center rounded-full bg-current transition-all duration-300 ease-out ${
                menuOpen ? "translate-y-2 rotate-45" : "translate-y-0 rotate-0"
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-5 origin-center rounded-full bg-current transition-all duration-300 ease-out ${
                menuOpen ? "-translate-y-2 -rotate-45" : "translate-y-0 rotate-0"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 top-0 z-[-1] bg-zinc-950/80 backdrop-blur-sm transition-opacity duration-300 ease-out lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`absolute left-0 right-0 top-full overflow-hidden border-b border-zinc-800 bg-zinc-950 shadow-xl transition-all duration-300 ease-out lg:hidden ${
          menuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-3 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col px-4 py-4 pb-6">
          {navigation.map((item, index) => {
            const active = isActive(item.url);
            return (
              <li
                key={item.name}
                className={`border-b border-zinc-800/80 last:border-0 ${menuOpen ? "animate-nav-item-fade" : ""}`}
                style={menuOpen ? { animationDelay: `${index * 40}ms` } : undefined}
              >
                <Link
                  href={item.url}
                  onClick={() => setMenuOpen(false)}
                  className={`-ml-4 -mr-2 block rounded-lg border-l-2 py-3.5 pl-4 pr-2 text-base transition-all duration-200 ${
                    active
                      ? "border-emerald-500 bg-emerald-500/10 font-medium text-white"
                      : "border-transparent text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
          <li className="mt-4 border-t border-zinc-800/80 pt-4">
            {!loading && user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg border border-zinc-700/80 bg-zinc-900/40 px-4 py-3 text-center text-base font-medium text-zinc-200 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/60 hover:text-white"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="block w-full rounded-lg border border-zinc-700/80 bg-zinc-900/40 px-4 py-3 text-center text-base font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/60 hover:text-white"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setLoginOpen(true);
                }}
                className="block w-full rounded-lg bg-emerald-500 px-4 py-3 text-center text-base font-medium text-white transition-colors duration-200 hover:bg-emerald-600"
              >
                Log in
              </button>
            )}
          </li>
        </ul>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}
