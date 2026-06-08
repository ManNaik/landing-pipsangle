"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { LoginModal } from "./LoginModal";

const navigation = [
  { name: "Home", url: "/" },
  // Removed dedicated nav items for Forex Signals & Automation –
  // both are now sections on the homepage instead of separate pages.
  { name: "Performance", url: "/trading-performance" },
  { name: "Pricing", url: "/pricing" },
  { name: "News", url: "/news" },
  { name: "Blog", url: "/blog" },
  { name: "FAQ", url: "/faq" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const [barStyle, setBarStyle] = useState({ left: 0, width: 0 });

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

  // Position the sliding bar at bottom of navbar, under the active link (desktop only)
  useEffect(() => {
    const ul = navRef.current;
    const header = headerRef.current;
    if (!ul || !header) return;
    const activeIndex = navigation.findIndex((item) => isActive(item.url));
    if (activeIndex === -1) return;
    const linkEl = ul.querySelector(`[data-nav-index="${activeIndex}"]`);
    if (!linkEl || !(linkEl instanceof HTMLElement)) return;

    const updateBar = () => {
      const headerRect = header.getBoundingClientRect();
      const linkRect = linkEl.getBoundingClientRect();
      setBarStyle({
        left: linkRect.left - headerRect.left,
        width: linkRect.width,
      });
    };

    updateBar();
    const t = requestAnimationFrame(updateBar);
    window.addEventListener("resize", updateBar);
    return () => {
      cancelAnimationFrame(t);
      window.removeEventListener("resize", updateBar);
    };
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className="relative sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm supports-[padding:env(safe-area-inset-top)]:pt-[env(safe-area-inset-top)]"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-white sm:text-xl min-w-[2.5rem] min-h-[2.5rem] flex items-center transition-opacity hover:opacity-90"
          aria-label="PipAngel home"
        >
          PipAngel
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:block">
          <ul ref={navRef} className="flex items-center gap-1 lg:gap-2">
            {navigation.map((item, index) => {
              const active = isActive(item.url);
              return (
                <li key={item.name}>
                  <Link
                    href={item.url}
                    data-nav-index={index}
                    className="group relative px-3 py-2.5 text-sm rounded-lg block"
                  >
                    <span
                      className={`block transition-colors duration-200 ${
                        active ? "text-white font-medium" : "text-zinc-400 group-hover:text-white"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="hidden rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 min-h-[2.75rem] min-w-[2.75rem] md:inline-flex md:items-center md:justify-center"
          >
            Start Trading
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-lg border border-zinc-700 bg-zinc-900/50 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all duration-200 md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out origin-center ${
                menuOpen ? "translate-y-2 rotate-45" : "translate-y-0 rotate-0"
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out origin-center ${
                menuOpen ? "-translate-y-2 -rotate-45" : "translate-y-0 rotate-0"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Sliding bar stuck to bottom of navbar (desktop) */}
      <span
        className="absolute bottom-0 left-0 h-0.5 bg-emerald-500 rounded-full pointer-events-none transition-[left,width] duration-300 ease-out hidden md:block"
        style={{ left: barStyle.left, width: barStyle.width }}
        aria-hidden
      />

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 top-0 z-[-1] bg-zinc-950/80 backdrop-blur-sm md:hidden transition-opacity duration-300 ease-out ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`absolute left-0 right-0 top-full border-b border-zinc-800 bg-zinc-950 shadow-xl md:hidden transition-all duration-300 ease-out overflow-hidden ${
          menuOpen
            ? "translate-y-0 opacity-100 visible"
            : "-translate-y-3 opacity-0 pointer-events-none invisible"
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
                  className={`block py-3.5 pl-4 pr-2 -ml-4 -mr-2 rounded-lg text-base transition-all duration-200 border-l-2 ${
                    active
                      ? "text-white font-medium bg-emerald-500/10 border-emerald-500"
                      : "text-zinc-300 border-transparent hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
          <li className="mt-4 pt-2">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setLoginOpen(true);
              }}
              className="flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-3.5 text-base font-medium text-white transition-all duration-200 hover:bg-emerald-600 min-h-[3rem] active:scale-[0.98]"
            >
              Start Trading
            </button>
          </li>
        </ul>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}
