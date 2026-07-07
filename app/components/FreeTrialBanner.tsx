import Link from "next/link";
import { LIFETIME_LOCK_OFFER } from "../lib/pricing";
import { FREE_TRIAL_DAYS, FREE_TRIAL_CTA, getTrialSignupUrl } from "../lib/trial";

type FreeTrialBannerProps = {
  className?: string;
  showCta?: boolean;
};

/** Founding member callout — prominent but restrained fintech styling */
export function FreeTrialBanner({ className = "", showCta = true }: FreeTrialBannerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 ${className}`}
      role="region"
      aria-label="Trial and founding member offer"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-emerald-500/70"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
        aria-hidden
      />

      <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-2xl space-y-5">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] text-emerald-500/80">
              {LIFETIME_LOCK_OFFER.eyebrow}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {LIFETIME_LOCK_OFFER.headline}
            </h2>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
              {LIFETIME_LOCK_OFFER.description}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <span className="h-px w-8 bg-emerald-500/30" aria-hidden />
            <span>
              {FREE_TRIAL_DAYS}-day trial on every plan — full access, no commitment
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-5 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <div
            className="flex items-center gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-5 py-4 sm:px-6"
            aria-label={LIFETIME_LOCK_OFFER.seatsLabel}
          >
            <p className="text-3xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl">
              {LIFETIME_LOCK_OFFER.maxClients}
            </p>
            <div className="min-w-0 border-l border-emerald-500/20 pl-4">
              <p className="text-sm font-medium text-zinc-200">founding seats</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Up to <span className="text-emerald-400/90">67%</span> below standard
              </p>
            </div>
          </div>
          {showCta ? (
            <Link
              href={getTrialSignupUrl()}
              className="group inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              {FREE_TRIAL_CTA}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
