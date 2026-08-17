"use client";

import Link from "next/link";
import { OPEN_LIVE_SUPPORT_EVENT } from "../../lib/leadChatFlow";
import { getTrialSignupUrl } from "../../lib/trial";

function openLiveSupport() {
  window.dispatchEvent(new Event(OPEN_LIVE_SUPPORT_EVENT));
}

export function FAQTrustCTA() {
  return (
    <section className="border-t border-white/[0.06] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Still Have Questions?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
          Our support team can help with your account, dashboard, automation setup, and
          platform questions.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={openLiveSupport}
            className="inline-flex min-h-[3rem] items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-400"
          >
            Contact Support
          </button>
          <Link
            href={getTrialSignupUrl()}
            className="inline-flex min-h-[3rem] items-center justify-center rounded-xl border border-white/[0.12] px-6 py-3 text-sm font-medium text-zinc-200 transition-colors duration-200 hover:border-white/20"
          >
            Start 4-Day Free Trial
          </Link>
        </div>
      </div>
    </section>
  );
}
