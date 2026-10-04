"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { trackCtaClick } from "../lib/analytics";
import { logout } from "../lib/auth";
import { safeInternalPath } from "../lib/authSession";
import { CHAT_CLOSE_EVENT, MENU_TOGGLE_EVENT } from "../lib/chat";
import { SIGNUP_PATH } from "../lib/paths";
import type { NavItem } from "../lib/siteChrome";
import { OPEN_LOGIN_EVENT } from "../lib/uiEvents";
import { useAuth } from "../lib/useAuth";
import { LoginModal } from "./LoginModal";

type HeaderProps = {
  brandName: string;
  nav: NavItem[];
};

type LoginQuerySnapshot = {
  search: string;
  next: string | null;
};

const SERVER_LOGIN_QUERY: LoginQuerySnapshot = { search: "", next: null };

function subscribeLoginQuery() {
  return () => {};
}

function getServerLoginQuerySnapshot(): LoginQuerySnapshot {
  return SERVER_LOGIN_QUERY;
}

let loginQueryCache: LoginQuerySnapshot | null = null;

function readLoginQuerySnapshot(): LoginQuerySnapshot {
  const search = window.location.search;
  if (loginQueryCache?.search === search) return loginQueryCache;
  const params = new URLSearchParams(search);
  const next =
    params.get("login") === "1" ? (safeInternalPath(params.get("next")) ?? "/dashboard") : null;
  loginQueryCache = { search, next };
  return loginQueryCache;
}

export function Header({ brandName, nav }: HeaderProps) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginNext, setLoginNext] = useState("/dashboard");
  const [handledLoginPath, setHandledLoginPath] = useState<string | null>(null);
  const loginQuery = useSyncExternalStore(
    subscribeLoginQuery,
    readLoginQuerySnapshot,
    getServerLoginQuerySnapshot
  );

  if (loginQuery !== SERVER_LOGIN_QUERY && handledLoginPath !== pathname) {
    setHandledLoginPath(pathname);
    if (loginQuery.next) {
      setLoginNext(loginQuery.next);
      setLoginOpen(true);
    }
  }

  useEffect(() => {
    const onOpenLogin = () => setLoginOpen(true);
    window.addEventListener(OPEN_LOGIN_EVENT, onOpenLogin);
    return () => window.removeEventListener(OPEN_LOGIN_EVENT, onOpenLogin);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) window.dispatchEvent(new Event(CHAT_CLOSE_EVENT));
    window.dispatchEvent(new CustomEvent(MENU_TOGGLE_EVENT, { detail: menuOpen }));
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const signedIn = !loading && Boolean(user);

  return (
    <header className="sticky top-0 z-50 border-b border-forest-700 bg-forest-900 supports-[padding:env(safe-area-inset-top)]:pt-[env(safe-area-inset-top)]">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5 sm:gap-4 sm:px-8"
      >
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${brandName} home`}>
          {/* Below 360px only the eagle fits beside the trial button; 38px is its width at h-7. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/pipsangel-logo.png"
            alt={brandName}
            width={518}
            height={108}
            className="h-7 w-auto object-cover object-left max-[359px]:w-[38px] min-[390px]:h-8 sm:h-9"
            fetchPriority="high"
          />
        </Link>

        <ul className="ml-6 hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-md px-3 py-2 text-[0.95rem] transition-colors ${
                  isActive(item.href)
                    ? "font-semibold text-paper"
                    : "text-sage-300 hover:text-paper"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {signedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-md px-3 py-2 text-[0.95rem] font-semibold text-paper hover:text-mint-300 lg:inline-flex"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                className="hidden rounded-md px-3 py-2 text-[0.95rem] text-sage-300 hover:text-paper lg:inline-flex"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="hidden rounded-md px-3 py-2 text-[0.95rem] text-sage-300 hover:text-paper lg:inline-flex"
              >
                Log in
              </button>
              <Link
                href={SIGNUP_PATH}
                onClick={() => trackCtaClick("header")}
                className="inline-flex min-h-10 items-center rounded-lg bg-mint-500 px-3.5 text-sm font-semibold text-white transition-colors hover:bg-leaf-600 sm:px-4 sm:text-[0.95rem]"
              >
                Start free trial
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-forest-600 text-paper lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-[150] overflow-y-auto border-t border-forest-700 bg-forest-900 px-5 pb-10 pt-4 lg:hidden"
        >
          <ul className="divide-y divide-forest-700">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`block py-4 text-lg ${
                    isActive(item.href) ? "font-semibold text-paper" : "text-sage-200"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-4 text-lg text-sage-200">
                Contact
              </Link>
            </li>
          </ul>
          <div className="mt-6 grid gap-3">
            {signedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-mint-500 font-semibold text-white"
                >
                  Go to dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    void logout();
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-forest-500 font-semibold text-paper"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href={SIGNUP_PATH}
                  onClick={() => {
                    trackCtaClick("mobile_menu");
                    setMenuOpen(false);
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-mint-500 font-semibold text-white"
                >
                  Start free trial
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setLoginOpen(true);
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-forest-500 font-semibold text-paper"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

      <LoginModal open={loginOpen} redirectTo={loginNext} onClose={() => setLoginOpen(false)} />
    </header>
  );
}
