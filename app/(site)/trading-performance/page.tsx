import Link from "next/link";
import { safeApiGet } from "../../lib/api";
import { formatPipsResult } from "../../lib/format";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import type {
  ContentBlock,
  PaginatedResponse,
  PerformanceStats,
  Trade,
} from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Forex Trading Performance | Verified Results",
    description:
      "View PipAngel forex trading performance including win rate, average pips, max drawdown, and recent trade history.",
    path: "/trading-performance",
    keywords: [
      "forex trading performance",
      "forex signal results",
      "forex win rate",
      "trading track record",
    ],
  });
}

export default async function TradingPerformancePage() {
  const [stats, tradesData, pageBlock, siteConfig] = await Promise.all([
    safeApiGet<PerformanceStats>("/stats/performance/", 60),
    safeApiGet<PaginatedResponse<Trade>>("/trades/?limit=4", 60),
    safeApiGet<ContentBlock>("/content/blocks/trading_performance.page/", 3600),
    getSiteConfig(),
  ]);

  const trades = tradesData?.results ?? [];
  const heroTitle = pageBlock?.title ?? "Forex Trading Performance";
  const heroSubtitle =
    pageBlock?.subtitle ?? "Transparent results and historical trade data.";
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Performance", path: "/trading-performance" },
  ]);

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema) }}
      />
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {heroTitle}
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            {heroSubtitle}
          </p>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Understanding Performance Metrics
          </h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-400 sm:text-base">
            <p>
              <strong className="text-zinc-300">Win rate</strong> is the percentage of closed
              trades that were profitable. A high win rate alone does not guarantee profitability
              without solid risk-to-reward on each trade.
            </p>
            <p>
              <strong className="text-zinc-300">Average pips</strong> measures the typical gain or
              loss per trade in pip terms. <strong className="text-zinc-300">Max drawdown</strong>{" "}
              is the largest peak-to-trough decline in account equity, a key indicator of capital
              preservation under stress.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            Key Statistics
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center sm:p-8">
              <p className="text-2xl font-bold text-emerald-400 sm:text-3xl">
                {stats ? `${stats.win_rate_percent}%` : "N/A"}
              </p>
              <p className="mt-1 text-sm text-zinc-500">Win Rate</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center sm:p-8">
              <p className="text-2xl font-bold text-white sm:text-3xl">
                {stats?.average_pips ?? "N/A"}
              </p>
              <p className="mt-1 text-sm text-zinc-500">Average Pips</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center sm:p-8">
              <p className="text-2xl font-bold text-amber-400 sm:text-3xl">
                {stats ? `${stats.max_drawdown_percent}%` : "N/A"}
              </p>
              <p className="mt-1 text-sm text-zinc-500">Max Drawdown</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            Recent Trades
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-800 -mx-4 px-4 sm:mx-0 sm:px-0 sm:mt-10 overscroll-x-contain">
            <table className="w-full min-w-[280px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Pair</th>
                  <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Entry</th>
                  <th className="px-3 py-2.5 font-medium text-emerald-400 sm:px-4 sm:py-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-zinc-800/80 hover:bg-zinc-800/30"
                  >
                    <td className="px-3 py-2.5 font-medium sm:px-4 sm:py-3">{t.pair}</td>
                    <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3">{t.entry}</td>
                    <td
                      className={`px-3 py-2.5 font-medium sm:px-4 sm:py-3 ${
                        t.pips >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {formatPipsResult(t.pips, t.result)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Link
            href="/signup"
            className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-medium text-white transition hover:bg-emerald-600 sm:w-auto"
          >
            Start Trading
          </Link>
        </div>
      </section>
    </div>
  );
}
