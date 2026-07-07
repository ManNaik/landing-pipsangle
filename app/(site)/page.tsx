import type { Metadata } from "next";
import Link from "next/link";
import { BrokerTicker } from "../components/BrokerTicker";
import { CommunityChats } from "../components/CommunityChats";
import { FreeTrialBadge } from "../components/FreeTrialBadge";
import { HeroBackground } from "../components/HeroBackground";
import { LeadChatbot } from "../components/LeadChatbot";
import { MarketHours } from "../components/MarketHours";
import { formatSignalStatus } from "../lib/format";
import { getBlockMeta, getHomeData } from "../lib/home";
import { buildPageMetadataFromConfig, getSiteConfig } from "../lib/seo";
import { FREE_TRIAL_CTA, getTrialSignupUrl } from "../lib/trial";
import type { AiIntelligenceModule } from "../lib/types";

const DEFAULT_HERO_BODY =
  "Daily forex signals with clear entry, stop loss, and take profit levels. Connect MetaTrader for optional hands-free execution with built-in risk controls.";

function splitHeroBody(body: string): { lead: string; support: string | null } {
  const trimmed = body.trim();
  const match = trimmed.match(/^([^.!?]+[.!?])\s+([\s\S]+)$/);
  if (match?.[2]) {
    return { lead: match[1], support: match[2] };
  }
  return { lead: trimmed, support: null };
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return buildPageMetadataFromConfig({
    title: config?.default_title ?? "Best Forex Signals & Automated Trading Platform",
    description:
      config?.default_description ??
      "Start trading with professional forex signals or automate your trading with our smart trading system.",
    path: "/",
    keywords: config?.keywords ?? [
      "forex signals",
      "forex trading automation",
      "automated forex trading",
      "AI forex trading",
      "AI forex signals",
      "AI trading bot",
      "AI trading system",
    ],
  });
}

export default async function Home() {
  const {
    performanceStats,
    trades,
    accuracy,
    liveSignals,
    aiIntelligence,
    blocks,
  } = await getHomeData();

  const hero = blocks["home.hero"];
  const heroMeta = getBlockMeta(hero);
  const { lead: heroLead, support: heroSupport } = splitHeroBody(
    hero?.body ?? DEFAULT_HERO_BODY
  );
  const forexBlock = blocks["home.forex_signals"];
  const forexMeta = getBlockMeta(forexBlock);
  const automationBlock = blocks["home.automation"];
  const automationMeta = getBlockMeta(automationBlock);
  const sectionsBlock = blocks["home.sections"];
  const sectionCards = (sectionsBlock?.metadata?.cards ?? []) as Array<{
    title: string;
    description: string;
    url: string;
  }>;
  const ctaBlock = blocks["home.cta"];
  const ctaButtons = (ctaBlock?.metadata?.cta_buttons ?? []) as Array<{
    label: string;
    url: string;
  }>;

  const stats = performanceStats
    ? [
        { label: "Trades Executed", value: performanceStats.trades_executed_display },
        { label: "Win Rate", value: `${performanceStats.win_rate_percent}%` },
        { label: "Years Tested", value: performanceStats.years_tested_display },
      ]
    : [];

  const benefits = (forexMeta.benefits ?? []) as string[];
  const howItWorks = (forexMeta.how_it_works_steps ?? []) as string[];
  const flowSteps = (automationMeta.flow_steps ?? []) as Array<{
    label: string;
    body: string;
  }>;
  const riskControls = (automationMeta.risk_controls ?? []) as string[];

  const aiTitle = aiIntelligence?.title ?? "AI Market Intelligence Engine";
  const aiDescription =
    aiIntelligence?.description ??
    "Our AI analyzes market conditions and risk factors to identify better trading opportunities.";
  const aiModules = aiIntelligence?.modules ?? [];

  const liveAccuracyPercent = accuracy?.percent ?? 0;
  const lastN = accuracy?.last_n ?? 10;
  const liveMessage =
    accuracy?.message ?? `Accuracy (last ${lastN} trades): ${liveAccuracyPercent}%`;

  return (
    <div className="min-w-0">
      {/* Hero */}
      <section className="relative flex min-h-[75vh] items-center overflow-hidden border-b border-zinc-800 px-4 py-24 sm:min-h-[80vh] sm:px-6 sm:py-32 lg:min-h-[88vh] lg:px-8 lg:py-36">
        <HeroBackground />
        <div
          className="absolute inset-0 bg-zinc-950/70"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.2),transparent)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-400/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
            {(heroMeta.eyebrow as string) ?? "Professional Forex Trading"}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)] sm:mt-5 sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.12] lg:tracking-[-0.02em]">
            {hero?.title ?? "Forex Signals & Automated Trading"}
          </h1>
          <div className="mx-auto mt-6 max-w-2xl space-y-3 sm:mt-8 sm:space-y-4">
            <p className="text-base leading-relaxed text-zinc-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-lg sm:leading-8">
              {heroLead}
            </p>
            {heroSupport ? (
              <p className="text-sm leading-relaxed text-zinc-400/95 sm:text-base sm:leading-7">
                {heroSupport}
              </p>
            ) : null}
          </div>
          <div className="mx-auto mt-10 flex max-w-lg flex-col items-center sm:mt-12">
            <FreeTrialBadge variant="highlight" className="mb-6" />
            <div
              className="mb-8 h-px w-20 bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent sm:mb-10"
              aria-hidden
            />
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
              <Link
                href={getTrialSignupUrl()}
                className="flex min-h-[3rem] items-center justify-center rounded-lg bg-emerald-500 px-7 py-3.5 text-base font-medium tracking-wide text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 sm:min-h-0 sm:min-w-[11rem]"
              >
                {FREE_TRIAL_CTA}
              </Link>
              <Link
                href={(heroMeta.cta_primary_url as string) ?? "#forex-signals"}
                className="flex min-h-[3rem] items-center justify-center rounded-lg border border-zinc-600/70 bg-zinc-950/50 px-7 py-3.5 text-base font-medium tracking-wide text-zinc-100 shadow-lg shadow-black/30 backdrop-blur-sm transition hover:border-zinc-500 hover:bg-zinc-900/70 sm:min-h-0 sm:min-w-[11rem]"
              >
                {(heroMeta.cta_primary_label as string) ?? "View Signals"}
              </Link>
              <Link
                href={(heroMeta.cta_secondary_url as string) ?? "#automation"}
                className="flex min-h-[3rem] items-center justify-center rounded-lg border border-zinc-600/70 bg-zinc-950/50 px-7 py-3.5 text-base font-medium tracking-wide text-zinc-100 shadow-lg shadow-black/30 backdrop-blur-sm transition hover:border-zinc-500 hover:bg-zinc-900/70 sm:min-h-0 sm:min-w-[11rem]"
              >
                {(heroMeta.cta_secondary_label as string) ?? "Automate Trading"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BrokerTicker variant="featured" label="Brokers we support" />

      {/* Integrated Forex Signals Overview */}
      <section
        id="forex-signals"
        className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl min-w-0">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-500/80">
              Forex Signals
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {forexBlock?.subtitle ?? "Done-for-you trade ideas, delivered in real time."}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              {forexBlock?.body ||
                "Get institutional-grade forex signals with clear entry, stop loss and take profit levels so you never second-guess a trade again."}
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_minmax(0,1fr)] lg:items-start">
            {/* Left: example signal feed */}
            <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
                    Live signal stream (sample)
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                    Signals are pushed in real time with full trade plan.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/40">
                  ● Live feed
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs sm:text-sm font-mono">
                {liveSignals.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2.5"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-zinc-200 sm:text-sm">
                        {s.pair}{" "}
                        <span
                          className={
                            s.direction === "BUY"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                        >
                          {s.direction}
                        </span>
                      </p>
                      <p className="text-[11px] text-zinc-400 sm:text-xs">
                        Entry {s.entry} · SL {s.stop_loss} · TP {s.take_profit}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11px] text-zinc-500 sm:text-xs">
                        R:R {s.risk_reward}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-xs ${
                          s.status === "hit_tp"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {formatSignalStatus(s.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[11px] text-zinc-500 sm:text-xs">
                This is illustrative data. Connect your preferred channel
                (Telegram, email, app) to receive real-time signals from your
                live account.
              </p>
            </div>

            {/* Right: benefits */}
            <div className="min-w-0 space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-white sm:text-base">
                  What you get with our signals
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                  {benefits.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                  How it works
                </p>
                <ol className="mt-2 space-y-1.5 text-sm text-zinc-300">
                  {howItWorks.map((step, i) => (
                    <li key={step}>
                      {i + 1}. {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Trade Performance + Market Hours (two columns) */}
      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
            Recent Trade Performance
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-zinc-400 sm:mt-4 sm:text-base">
            Here are some of our most recent forex trades.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8 sm:mt-8 items-start">
            {/* Left column: Recent trades (bigger, 3/5 on lg) */}
            <div className="lg:col-span-3 min-w-0">
              {/* Live accuracy showcase */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-4 sm:px-5 sm:py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      Live
                    </span>
                    <span className="text-sm text-zinc-400 sm:text-base">
                      Accuracy updates as new trades are added.
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums text-emerald-400 sm:text-3xl">
                      {liveAccuracyPercent}%
                    </span>
                    <span className="text-sm text-zinc-500">last {lastN} trades</span>
                  </div>
                </div>
                <p className="mt-3 border-t border-zinc-800/80 pt-3 text-sm text-zinc-400">
                  {liveMessage}
                </p>
              </div>

              <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800 -mx-4 px-4 sm:mx-0 sm:px-0 overscroll-x-contain min-w-0">
                <table className="w-full min-w-[520px] text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50">
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Pair</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Direction</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Entry</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3 hidden sm:table-cell">Stop Loss</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3 hidden sm:table-cell">Take Profit</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Pips</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-zinc-800/80 hover:bg-zinc-800/30"
                      >
                        <td className="px-3 py-2.5 font-medium sm:px-4 sm:py-3">{t.pair}</td>
                        <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3">{t.direction}</td>
                        <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3">{t.entry}</td>
                        <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3 hidden sm:table-cell">{t.stop_loss}</td>
                        <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3 hidden sm:table-cell">{t.take_profit}</td>
                        <td
                          className={`px-3 py-2.5 font-medium sm:px-4 sm:py-3 ${
                            t.pips >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {t.pips >= 0 ? `+${t.pips}` : t.pips}
                        </td>
                        <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              t.result === "profit"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {t.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center sm:text-left">
                <Link
                  href="/trading-performance"
                  className="text-sm font-medium text-emerald-400 hover:text-emerald-300 inline-block py-2"
                >
                  View full performance →
                </Link>
              </div>
            </div>

            {/* Right column: Market Hours + Community Chats (2/5 on lg) */}
            <div className="lg:col-span-2 min-w-0 space-y-0">
              <MarketHours />
              <CommunityChats />
            </div>
          </div>
        </div>
      </section>

      {/* Integrated Automation Overview */}
      <section
        id="automation"
        className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl min-w-0">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-500/80">
              Trading Automation
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {automationBlock?.subtitle ?? "Let the system execute the signals for you."}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              {automationBlock?.body ||
                "Connect your trading account once and let the automation engine mirror the same risk-managed strategies 24/5 without you watching every tick."}
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
            {/* Left: simple automation flow */}
            <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Automation flow (concept)
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {(flowSteps.length > 0
                  ? flowSteps
                  : [
                      { label: "Signal received", body: "AI + traders validate a setup in real time." },
                      { label: "Risk calculated", body: "Position size adjusted to your configured risk %." },
                      { label: "Trade executed", body: "Order placed automatically on your connected broker." },
                    ]
                ).map((step, idx) => (
                  <div
                    key={step.label}
                    className="relative flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-4"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/40">
                      {idx + 1}
                    </span>
                    <h3 className="mt-3 text-sm font-semibold text-white">
                      {step.label}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">{step.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-xs sm:text-sm">
                <p className="font-medium text-emerald-300">
                  Connect once. Trade automatically.
                </p>
                <p className="mt-1 text-zinc-300">
                  Integrate via investor password, copy-trading bridge or API
                  (MT4/MT5, cTrader, or compatible platforms). You stay in
                  control: pause, adjust risk or disconnect at any time.
                </p>
              </div>
            </div>

            {/* Right: safeguards */}
            <div className="min-w-0 space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-white sm:text-base">
                  Built-in risk controls
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                  {riskControls.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5 text-xs text-zinc-400 sm:text-sm">
                <p>
                  This section shows how the automation works conceptually. When
                  you are ready, you can plug in your broker and choose between
                  signals-only mode or full hands-off automation from the same
                  dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Market Intelligence Engine */}
      <section className="relative border-b border-zinc-800 px-4 py-12 sm:px-6 sm:py-20 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(16,185,129,0.04),transparent)] pointer-events-none" />
        <div className="relative mx-auto max-w-6xl min-w-0">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-widest uppercase text-emerald-500/80">
              Intelligence
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {aiTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              {aiDescription}
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16">
            {aiModules.map((module: AiIntelligenceModule, idx) => {
              const exampleInsight = module.example_insight;
              const exampleRiskReport = module.example_risk_report;
              const isResearcher = !!exampleInsight;
              const isRisk = !!exampleRiskReport;
              return (
                <div
                  key={module.name}
                  className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8"
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-px rounded-t-2xl ${
                      idx === 0
                        ? "bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"
                        : "bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"
                    }`}
                  />
                  <h3 className="text-lg font-semibold text-white sm:text-xl">
                    {module.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                    {module.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {module.features.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center rounded-md bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-400 border border-zinc-700/50"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  {isResearcher && exampleInsight && (
                    <div className="mt-6 rounded-xl bg-zinc-950/80 border border-zinc-800 p-4 font-mono text-xs">
                      <p className="text-zinc-500">Sample output</p>
                      <p className="mt-2 text-zinc-300">
                        <span className="text-white">{exampleInsight.pair}</span>
                        <span className="text-zinc-500 mx-1.5">→</span>
                        <span className="text-cyan-400">{exampleInsight.bias}</span>
                        <span className="text-zinc-500 ml-1.5">
                          ({exampleInsight.confidence})
                        </span>
                      </p>
                      <p className="mt-1 text-zinc-600">{exampleInsight.timeframe}</p>
                    </div>
                  )}
                  {isRisk && exampleRiskReport && (
                    <div className="mt-6 rounded-xl bg-zinc-950/80 border border-zinc-800 p-4">
                      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Current read</p>
                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <span className="text-zinc-400">
                          Level{" "}
                          <span className="font-medium text-amber-400/90">
                            {exampleRiskReport.risk_level}
                          </span>
                        </span>
                        <span className="text-zinc-400">
                          Size{" "}
                          <span className="font-medium text-white">
                            {exampleRiskReport.recommended_risk}
                          </span>
                        </span>
                        <span className="text-zinc-400">
                          Vol{" "}
                          <span className="text-zinc-300">{exampleRiskReport.volatility}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 text-center sm:p-6"
              >
                <p className="text-xl font-bold text-emerald-400 sm:text-2xl lg:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-3">
            {sectionCards.map((sec) => (
              <Link
                key={sec.title}
                href={sec.url}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 transition hover:border-emerald-500/30 hover:bg-zinc-900/50 sm:p-6"
              >
                <h2 className="font-semibold text-white group-hover:text-emerald-400 text-base sm:text-lg">
                  {sec.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-400">{sec.description}</p>
                <span className="mt-4 inline-block text-sm font-medium text-emerald-400">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

       {/* CTA */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-12">
          <FreeTrialBadge variant="highlight" className="mb-5" />
          <h2 className="text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
            {ctaBlock?.title ?? "Start Trading Smarter Today"}
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:mt-4 sm:text-base">
            {ctaBlock?.subtitle ?? "Join traders using our signals and automation platform."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <Link
              href={getTrialSignupUrl()}
              className="rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-medium text-white transition hover:bg-emerald-600 min-h-[3rem] flex items-center justify-center sm:min-h-0"
            >
              {FREE_TRIAL_CTA}
            </Link>
            {(ctaButtons.length > 0
              ? ctaButtons
              : [
                  { label: "View Signals", url: "#forex-signals" },
                  { label: "Automate Trading", url: "#automation" },
                ]
            ).map((btn, i) => (
              <Link
                key={btn.label}
                href={btn.url}
                className={
                  i === 0
                    ? "rounded-lg border border-zinc-600 px-6 py-3.5 text-base font-medium text-white transition hover:bg-zinc-800 min-h-[3rem] flex items-center justify-center sm:min-h-0"
                    : "rounded-lg border border-zinc-600 px-6 py-3.5 text-base font-medium text-white transition hover:bg-zinc-800 min-h-[3rem] flex items-center justify-center sm:min-h-0"
                }
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LeadChatbot />
    </div>
  );
}
