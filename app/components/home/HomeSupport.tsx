"use client";

import Link from "next/link";
import { OPEN_LIVE_SUPPORT_EVENT } from "../../lib/leadChatFlow";

const TOPICS = [
  "Account Assistance",
  "Automation Support",
  "Dashboard Assistance",
] as const;

function openLiveSupport() {
  window.dispatchEvent(new Event(OPEN_LIVE_SUPPORT_EVENT));
}

export function HomeSupport() {
  return (
    <section className="border-b border-zinc-800 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-500/80">
            PipAngel Support
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Real Support. Real People.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
            Get help with your account, automation setup, trading dashboard, or
            connection whenever you need it.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            Contact Support
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="group min-w-0 rounded-[18px] border border-white/[0.08] bg-[#0C0C0E] p-5 transition-[border-color] duration-300 hover:border-white/[0.16] sm:p-6">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <p className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              Support Status
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium text-emerald-400">
              <span className="home-support-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
              LIVE
            </span>
          </div>

          <p className="mt-4 text-sm text-zinc-300">Available</p>

          <ul className="mt-5 space-y-2.5">
            {TOPICS.map((topic) => (
              <li
                key={topic}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2.5"
              >
                <span className="text-sm text-zinc-400">{topic}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={openLiveSupport}
            className="mt-5 inline-flex min-h-[2.75rem] w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            Open Live Support
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
