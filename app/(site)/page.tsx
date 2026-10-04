import type { Metadata } from "next";
import Link from "next/link";
import { AccessPanel } from "../components/site/AccessPanel";
import { BrokerCallout } from "../components/site/BrokerCallout";
import { FaqList } from "../components/site/FaqList";
import { FinalCta } from "../components/site/FinalCta";
import { PlanCards } from "../components/site/PlanCards";
import { ProofSummary } from "../components/site/ProofSummary";
import { SecurityBand } from "../components/site/SecurityBand";
import { TrackedLink } from "../components/site/TrackedLink";
import { CheckIcon, Section, SectionIntro } from "../components/site/ui";
import { getFeaturedFaqs } from "../lib/faqContent";
import { getPublishedPerformance } from "../lib/performance";
import { getPricingTiers } from "../lib/pricing";
import { buildPageMetadataFromConfig, getSiteConfig } from "../lib/seo";
import { HOW_IT_WORKS_PATH, IC_MARKETS_GUIDE_PATH, SIGNUP_PATH } from "../lib/siteChrome";
import { FREE_TRIAL_DAYS, TRIAL_START_NOTE } from "../lib/trial";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadataFromConfig({
    title: "Copy trading for IC Markets MT5 accounts",
    description:
      "PipsAngel copies trades to your own IC Markets MetaTrader 5 account. Every trade is opened with a stop loss and sized for your balance, your money stays with IC Markets, and you can switch copying off at any time.",
    path: "/",
  });
}

const STEPS = [
  {
    title: "Create your account",
    body: "Sign up with your email and pick Basic or Premium. You won't be asked to pay.",
  },
  {
    title: "Connect your IC Markets MT5 account",
    body: `Enter your MT5 login number, server and password. We start a dedicated MT5 terminal for you and check that it logs in. Your ${FREE_TRIAL_DAYS}-day trial starts once it's connected.`,
  },
  {
    title: "Trades are copied automatically",
    body: "Each trade opens in your account with a stop loss, sized for your balance. Follow every trade in MT5 or your dashboard, and switch copying off whenever you want.",
  },
];

const ALWAYS = [
  "Every trade is opened with a stop loss",
  "Position size is worked out for your account on each trade",
  "Your MT5 terminal runs on our servers, so nothing needs to stay open on your side",
];

const YOURS = [
  "Switch copying on or off from your dashboard",
  "Choose how much of your balance is used (Premium, 10% to 100%)",
  "Close any trade yourself in MT5 whenever you like",
];

export default async function Home() {
  const [siteConfig, tiers, performance] = await Promise.all([
    getSiteConfig(),
    getPricingTiers(),
    getPublishedPerformance(20),
  ]);
  const faqs = getFeaturedFaqs(
    {
      tiers,
      supportEmail: siteConfig.support_email ?? "",
      responseTime: siteConfig.support_response_time,
      hasPublicResults: Boolean(performance),
    },
    6
  );

  return (
    <>
      <section className="px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-16">
          <div>
            <h1 className="text-[2.35rem] font-bold leading-[1.06] tracking-[-0.025em] sm:text-5xl lg:text-[3.5rem]">
              Copy our forex trades into your IC Markets MT5 account
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sage-300 sm:text-xl">
              Connect your account once. Every trade is opened with a stop loss and sized for your balance,
              your money never leaves IC Markets, and you can switch copying off whenever you like.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <TrackedLink
                href={SIGNUP_PATH}
                location="home_hero"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-mint-500 px-7 text-base font-semibold text-white hover:bg-leaf-600"
              >
                Start free trial
              </TrackedLink>
              <Link
                href={HOW_IT_WORKS_PATH}
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-forest-500 px-6 font-semibold text-paper hover:border-sage-500 hover:bg-forest-800"
              >
                See how it works
              </Link>
            </div>
            <p className="mt-4 text-sm text-sage-400">{TRIAL_START_NOTE}</p>
            <p className="mt-6 max-w-xl border-l-2 border-forest-600 pl-4 text-sm leading-relaxed text-sage-300">
              You&apos;ll need a live IC Markets account on MetaTrader 5.{" "}
              <Link href={IC_MARKETS_GUIDE_PATH} className="font-semibold text-mint-400 underline underline-offset-4">
                Don&apos;t have one yet?
              </Link>
            </p>
          </div>
          <AccessPanel />
        </div>
      </section>

      <Section tone="raised" id="how-it-works">
        <SectionIntro title="How it works">
          <p>Three steps, and you only do the first two once.</p>
        </SectionIntro>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="text-5xl font-bold leading-none text-forest-500 tabular-nums">{index + 1}</span>
              <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-sage-300">{step.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12">
          <Link href={HOW_IT_WORKS_PATH} className="font-semibold text-mint-400 underline underline-offset-4">
            More detail on how copying works
          </Link>
        </p>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-[1.75rem] font-bold leading-tight tracking-[-0.015em] sm:text-[2.15rem]">
              What always happens
            </h2>
            <ul className="mt-6 space-y-4">
              {ALWAYS.map((item) => (
                <li key={item} className="flex gap-3 text-[1.0625rem] leading-snug text-sage-200">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-mint-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[1.75rem] font-bold leading-tight tracking-[-0.015em] sm:text-[2.15rem]">
              What stays up to you
            </h2>
            <ul className="mt-6 space-y-4">
              {YOURS.map((item) => (
                <li key={item} className="flex gap-3 text-[1.0625rem] leading-snug text-sage-200">
                  <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-mint-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 max-w-2xl rounded-lg border border-forest-600 bg-forest-850 px-4 py-3 text-sm leading-relaxed text-sage-300">
          Copy trading doesn&apos;t remove risk. Trades lose as well as win, and you could lose some or all of
          the money in your trading account. Only use money you can afford to lose.
        </p>
      </Section>

      <SecurityBand />

      <ProofSummary performance={performance} siteConfig={siteConfig} />

      <Section tone={performance || siteConfig.track_record_url ? "raised" : "base"}>
        <SectionIntro title="Two plans, nothing renews automatically">
          <p>
            Both plans copy the same trades. The difference is how much of your balance is used and how long
            each payment lasts. You pay with PayPal after the free trial, one period at a time.
          </p>
        </SectionIntro>
        <div className="mt-10">
          <PlanCards tiers={tiers} location="home_pricing" />
        </div>
        <p className="mt-8">
          <Link href="/pricing" className="font-semibold text-mint-400 underline underline-offset-4">
            Compare plans and billing details
          </Link>
        </p>
        <div className="mt-14">
          <BrokerCallout siteConfig={siteConfig} />
        </div>
      </Section>

      <Section tone="raised">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionIntro title="Questions people ask first">
            <p>
              The rest are in the{" "}
              <Link href="/faq" className="font-semibold text-mint-400 underline underline-offset-4">
                FAQ
              </Link>
              .
            </p>
          </SectionIntro>
          <FaqList items={faqs} />
        </div>
      </Section>

      <FinalCta location="home_final" />
    </>
  );
}
