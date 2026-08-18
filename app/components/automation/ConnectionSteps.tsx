import Link from "next/link";
import { ONBOARDING_STEPS } from "../../lib/automationContent";

type ConnectionStepsProps = {
  signupUrl?: string;
};

export function ConnectionSteps({ signupUrl = "/signup" }: ConnectionStepsProps) {
  return (
    <section className="border-b border-white/[0.06] bg-[#0A0A0A] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto min-w-0 max-w-6xl">
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
          Connect Once. Automate Your Trades.
        </h2>

        <ol className="mt-6 flex flex-col gap-4 md:flex-row md:items-stretch md:gap-0">
          {ONBOARDING_STEPS.map((step, idx) => (
            <li key={step.step} className="flex min-w-0 flex-1 items-center md:flex-col md:text-center">
              <div className="min-w-0 flex-1 rounded-xl border border-white/[0.06] bg-[#0D0F10] px-4 py-3 md:px-5 md:py-4">
                <span className="font-mono text-xs font-semibold text-emerald-400">
                  {step.step}
                </span>
                <h3 className="mt-1 text-sm font-semibold tracking-wide text-white">
                  {step.label}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                  {step.description}
                </p>
              </div>
              {idx < ONBOARDING_STEPS.length - 1 && (
                <span
                  className="hidden shrink-0 px-3 text-emerald-500/40 md:block"
                  aria-hidden
                >
                  →
                </span>
              )}
              {idx < ONBOARDING_STEPS.length - 1 && (
                <span
                  className="flex justify-center py-1 text-emerald-500/40 md:hidden"
                  aria-hidden
                >
                  ↓
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-6 flex justify-center sm:mt-8">
          <Link
            href={signupUrl}
            className="inline-flex min-h-[3rem] w-full max-w-sm items-center justify-center gap-1 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 sm:w-auto sm:px-8 sm:text-base"
          >
            Connect IC Markets MT5
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
