import Link from "next/link";
import { Suspense } from "react";
import { SignupForm } from "../../components/SignupForm";
import { getPricingTiers } from "../../lib/pricing";
import { buildPageMetadataFromConfig } from "../../lib/seo";
import { IC_MARKETS_GUIDE_PATH } from "../../lib/siteChrome";
import { FREE_TRIAL_DAYS } from "../../lib/trial";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Create your account",
    description: "Create a PipsAngel account and connect your IC Markets MT5 account to start a free trial.",
    path: "/signup",
    noIndex: true,
  });
}

const NEXT_STEPS = [
  {
    title: "Create your account",
    body: "Your email, a password and a plan. No payment.",
  },
  {
    title: "Connect your IC Markets MT5 account",
    body: "Have your MT5 login number, server name and password ready. We start your MT5 terminal and check it logs in.",
  },
  {
    title: `Your ${FREE_TRIAL_DAYS}-day trial starts`,
    body: "The clock starts once your account is connected, and trades begin copying.",
  },
  {
    title: "Decide whether to continue",
    body: "Pay with PayPal for 7 or 28 days to keep copying. Nothing renews automatically.",
  },
];

export default async function SignupPage() {
  const tiers = await getPricingTiers();

  return (
    <section className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
        <div className="max-w-xl">
          <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
            Create your account
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-sage-300">
            Free for {FREE_TRIAL_DAYS} days once your MT5 account is connected.
          </p>
          <div className="mt-8">
            <Suspense fallback={<p className="text-sage-400">Loading…</p>}>
              <SignupForm tiers={tiers} />
            </Suspense>
          </div>
        </div>

        <aside className="lg:pt-2">
          <div className="rounded-2xl border border-forest-600 bg-forest-850 p-6 sm:p-8">
            <h2 className="text-lg font-bold">What happens next</h2>
            <ol className="mt-5 space-y-5">
              {NEXT_STEPS.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-forest-500 text-sm font-bold tabular-nums">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-sage-300">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-7 space-y-2 border-t border-forest-700 pt-5 text-sm">
              <p className="text-sage-300">
                No IC Markets account?{" "}
                <Link href={IC_MARKETS_GUIDE_PATH} className="font-semibold text-mint-400 underline underline-offset-4">
                  How to open one
                </Link>
              </p>
              <p className="text-sage-300">
                Worried about sharing your MT5 login?{" "}
                <Link href="/security" className="font-semibold text-mint-400 underline underline-offset-4">
                  What it allows
                </Link>
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
