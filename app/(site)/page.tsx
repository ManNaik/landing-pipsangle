import type { Metadata } from "next";
import Link from "next/link";
import { FreeTrialBadge } from "../components/FreeTrialBadge";
import { HeroBackground } from "../components/HeroBackground";
import { HomeAiEngine } from "../components/home/HomeAiEngine";
import { HomeAutomationBrief } from "../components/home/HomeAutomationBrief";
import { HomeDashboardPreview } from "../components/home/HomeDashboardPreview";
import { HomeHeroVisual } from "../components/home/HomeHeroVisual";
import { HomeIcMarkets } from "../components/home/HomeIcMarkets";
import { HomeLayers } from "../components/home/HomeLayers";
import { HomePerformance } from "../components/home/HomePerformance";
import { HomeSupport } from "../components/home/HomeSupport";
import { HomeWhyForex } from "../components/home/HomeWhyForex";
import { LeadChatbot } from "../components/LeadChatbot";
import { getHomeData } from "../lib/home";
import { buildPageMetadataFromConfig, getSiteConfig } from "../lib/seo";
import { FREE_TRIAL_CTA, FREE_TRIAL_DAYS, getTrialSignupUrl } from "../lib/trial";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return buildPageMetadataFromConfig({
    title: "AI-Powered Forex Trading Intelligence and Automation",
    description:
      "PipAngel combines AI market intelligence, professional trading expertise and disciplined risk management to identify forex opportunities and automate execution through IC Markets MT5.",
    path: "/",
    keywords: config?.keywords ?? [
      "AI forex trading",
      "forex trading automation",
      "IC Markets MT5",
      "automated forex trading",
    ],
  });
}

export default async function Home() {
  const { performanceStats, trades } = await getHomeData();

  const showStats = Boolean(
    performanceStats &&
      performanceStats.trades_executed > 0 &&
      performanceStats.win_rate_percent > 0
  );

  return (
    <div className="min-w-0">
      <section className="relative overflow-hidden border-b border-zinc-800 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <HeroBackground />
        <div className="absolute inset-0 bg-zinc-950/75" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_-10%,rgba(16,185,129,0.12),transparent)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto grid min-w-0 max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="min-w-0 text-center lg:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-400/90">
              AI-Powered Forex Trading
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[3.15rem] lg:leading-[1.12]">
              Intelligence Behind Every Trade.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-200 sm:text-lg lg:mx-0">
              PipAngel combines AI market intelligence, professional trading
              expertise and disciplined risk management to identify forex
              opportunities and automate execution through IC Markets MT5.
            </p>
            <p className="mt-3 text-sm text-zinc-500">
              Built specifically for IC Markets MetaTrader 5.
            </p>
            <div className="mx-auto mt-8 max-w-lg lg:mx-0">
              <div className="mb-6 flex justify-center lg:justify-start">
                <FreeTrialBadge variant="highlight" />
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href={getTrialSignupUrl()}
                  className="inline-flex min-h-[3rem] items-center justify-center rounded-lg bg-emerald-500 px-7 py-3.5 text-base font-medium text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                >
                  {FREE_TRIAL_CTA}
                </Link>
                <Link
                  href="#what-is-pipangel"
                  className="inline-flex min-h-[3rem] items-center justify-center rounded-lg border border-zinc-600/70 bg-zinc-950/50 px-7 py-3.5 text-base font-medium text-zinc-100 backdrop-blur-sm transition hover:border-zinc-500"
                >
                  Explore PipAngel
                </Link>
              </div>
              <p className="mt-5 text-xs text-zinc-500">
                {FREE_TRIAL_DAYS}-Day Free Trial · Live Support · Trading Dashboard
              </p>
            </div>
          </div>
          <HomeHeroVisual />
        </div>
      </section>

      <HomeLayers />
      <HomeAiEngine />
      <HomeWhyForex />
      <HomeIcMarkets />
      <HomeAutomationBrief />
      <HomeDashboardPreview />
      <HomeSupport />
      <HomePerformance
        winRate={showStats && performanceStats ? performanceStats.win_rate_percent : null}
        totalTrades={
          showStats && performanceStats ? performanceStats.trades_executed_display : null
        }
        trades={trades}
      />

      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Try PipAngel Free for {FREE_TRIAL_DAYS} Days
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Explore PipAngel, connect your IC Markets MT5 account and experience
            the platform before choosing a paid plan.
          </p>
          <Link
            href={getTrialSignupUrl()}
            className="mt-8 inline-flex min-h-[3rem] items-center justify-center rounded-lg bg-emerald-500 px-8 py-3.5 text-base font-medium text-white transition hover:bg-emerald-400"
          >
            {FREE_TRIAL_CTA}
          </Link>
        </div>
      </section>

      <LeadChatbot />
    </div>
  );
}
