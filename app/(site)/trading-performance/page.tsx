import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "../../components/site/FinalCta";
import { PipsChart } from "../../components/site/PipsChart";
import { PageHero, Section, SectionIntro } from "../../components/site/ui";
import { formatDate, formatQuote, formatSignedPips } from "../../lib/format";
import { cumulativePips, getPublishedPerformance, summarizeTrades } from "../../lib/performance";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import { HOW_IT_WORKS_PATH } from "../../lib/siteChrome";
import { FREE_TRIAL_DAYS } from "../../lib/trial";

export async function generateMetadata(): Promise<Metadata> {
  const [performance, config] = await Promise.all([getPublishedPerformance(1), getSiteConfig()]);
  const hasResults = Boolean(performance || config.track_record_url);
  return buildPageMetadataFromConfig({
    title: "Trading results",
    description: hasResults
      ? "Every trade PipsAngel has published, losses included, with figures calculated from those trades."
      : "How PipsAngel publishes its trading results.",
    path: "/trading-performance",
    noIndex: !hasResults,
  });
}

export default async function ResultsPage() {
  const [performance, siteConfig] = await Promise.all([getPublishedPerformance(100), getSiteConfig()]);
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Results", path: "/trading-performance" },
  ]);
  const trackRecordUrl = siteConfig.track_record_url;
  const provider = siteConfig.track_record_provider || "an independent tracking service";

  const verifiedLink = trackRecordUrl ? (
    <a
      href={trackRecordUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-12 items-center justify-center rounded-lg border border-forest-500 px-6 font-semibold text-paper hover:border-sage-500 hover:bg-forest-800"
    >
      Verified track record on {provider}
    </a>
  ) : null;

  if (!performance) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }} />
        <PageHero title="Trading results">
          {trackRecordUrl ? (
            <p>
              Our trading record is tracked independently by {provider}, which reads trades directly from the
              trading account.
            </p>
          ) : (
            <p>
              We haven&apos;t published a track record on this site yet, so we don&apos;t show any performance
              figures. When we do, it will list every closed trade, losses included, with every number
              calculated from those trades.
            </p>
          )}
          {verifiedLink ? <div className="mt-8">{verifiedLink}</div> : null}
        </PageHero>
        <Section>
          <SectionIntro title="Judging us in the meantime">
            <p>
              Read{" "}
              <Link href={HOW_IT_WORKS_PATH} className="font-semibold text-mint-400 underline underline-offset-4">
                how copying works
              </Link>{" "}
              and{" "}
              <Link href="/security" className="font-semibold text-mint-400 underline underline-offset-4">
                what we can and can&apos;t do in your account
              </Link>
              , or watch the trades in your own account during the {FREE_TRIAL_DAYS}-day free trial. Be wary
              of any service that shows results you can&apos;t check.
            </p>
          </SectionIntro>
        </Section>
        <FinalCta location="results_empty_final" />
      </>
    );
  }

  const { stats, trades, totalTrades } = performance;
  const summary = summarizeTrades(trades);
  const curve = cumulativePips(trades);
  const partial = trades.length < totalTrades;
  const since = stats.first_trade_at ?? summary.firstClosedAt;

  const figures = [
    { label: "Closed trades", value: stats.trades_executed.toLocaleString("en-US") },
    { label: "Won", value: `${stats.win_rate_percent}%` },
    { label: "Net result", value: formatSignedPips(stats.net_pips ?? summary.netPips) },
    { label: "Average winning trade", value: formatSignedPips(summary.averageWin) },
    { label: "Average losing trade", value: formatSignedPips(summary.averageLoss) },
    {
      label: "Longest losing run",
      value: `${summary.longestLossStreak} ${summary.longestLossStreak === 1 ? "trade" : "trades"}`,
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }} />

      <PageHero title="Trading results">
        <p>
          Every trade we&apos;ve published{since ? ` since ${formatDate(since)}` : ""}, losses included. Results
          are in pips and every figure is calculated from the trades listed below. Past results don&apos;t
          guarantee future results.
        </p>
        {verifiedLink ? <div className="mt-8">{verifiedLink}</div> : null}
      </PageHero>

      <Section>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-forest-600 bg-forest-600 md:grid-cols-3">
          {figures.map((figure) => (
            <div key={figure.label} className="bg-forest-850 p-5 sm:p-6">
              <dt className="text-sm text-sage-400">{figure.label}</dt>
              <dd className="mt-1 text-2xl font-bold sm:text-3xl">{figure.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-sage-400">
          {partial
            ? `Closed trades, won and net result cover all ${totalTrades.toLocaleString("en-US")} published trades. The averages, the losing run and the chart use the latest ${trades.length}.`
            : "All figures use every published trade."}
          {stats.last_trade_at ? ` Last trade closed ${formatDate(stats.last_trade_at)}.` : ""}
        </p>
        <div className="mt-10 rounded-2xl border border-forest-600 bg-forest-850 p-4 sm:p-6">
          <PipsChart values={curve} firstDate={summary.firstClosedAt} lastDate={summary.lastClosedAt} />
        </div>
      </Section>

      <Section tone="raised" id="trades">
        <SectionIntro title={partial ? `Latest ${trades.length} trades` : "Every trade"} />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-forest-600">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <caption className="sr-only">Closed trades, newest first</caption>
            <thead className="bg-forest-800 text-sage-300">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Closed</th>
                <th scope="col" className="px-4 py-3 font-semibold">Pair</th>
                <th scope="col" className="px-4 py-3 font-semibold">Direction</th>
                <th scope="col" className="px-4 py-3 font-semibold">Entry</th>
                <th scope="col" className="px-4 py-3 font-semibold">Stop loss</th>
                <th scope="col" className="px-4 py-3 font-semibold">Target</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-700">
              {trades.map((trade) => (
                <tr key={trade.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-sage-300">{formatDate(trade.closed_at)}</td>
                  <td className="px-4 py-3 font-semibold">{trade.pair}</td>
                  <td className="px-4 py-3 text-sage-300">{trade.direction === "BUY" ? "Buy" : "Sell"}</td>
                  <td className="px-4 py-3 text-sage-300">{formatQuote(trade.pair, trade.entry)}</td>
                  <td className="px-4 py-3 text-sage-300">{formatQuote(trade.pair, trade.stop_loss)}</td>
                  <td className="px-4 py-3 text-sage-300">{formatQuote(trade.pair, trade.take_profit)}</td>
                  <td
                    className={`px-4 py-3 text-right font-semibold ${
                      trade.pips < 0 ? "text-coral-400" : "text-mint-400"
                    }`}
                  >
                    {formatSignedPips(trade.pips)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <SectionIntro title="Reading these numbers">
          <p>
            A pip is the smallest standard price step for a currency pair. Results in pips show how trades
            performed regardless of account size. Your own results will differ: position sizes depend on your
            balance and settings, and spreads, slippage and timing vary between accounts. Trading on margin is
            risky and you could lose money.
          </p>
        </SectionIntro>
      </Section>

      <FinalCta location="results_final" />
    </>
  );
}
