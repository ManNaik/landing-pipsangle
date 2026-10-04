import Link from "next/link";
import { formatDate, formatSignedPips } from "../../lib/format";
import type { PublishedPerformance } from "../../lib/performance";
import type { SiteConfig } from "../../lib/types";

/**
 * Renders only real, published data or a verified third-party track record.
 * With neither, it renders nothing rather than a placeholder.
 */
export function ProofSummary({
  performance,
  siteConfig,
}: {
  performance: PublishedPerformance | null;
  siteConfig: SiteConfig;
}) {
  const trackRecordUrl = siteConfig.track_record_url;
  if (!performance && !trackRecordUrl) return null;

  const stats = performance?.stats;
  const provider = siteConfig.track_record_provider || "an independent tracking service";

  return (
    <section className="border-t border-forest-700 px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-end">
          <div>
            <h2 className="text-[1.75rem] font-bold leading-tight tracking-[-0.015em] sm:text-[2.15rem]">
              Results from real trades
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-sage-300">
              {stats?.first_trade_at
                ? `Every trade we've published since ${formatDate(stats.first_trade_at)}, losses included.`
                : "Every published trade counts, losses included."}{" "}
              Past results don&apos;t guarantee future results.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {performance ? (
                <Link href="/trading-performance" className="font-semibold text-mint-400 underline underline-offset-4">
                  See every trade
                </Link>
              ) : null}
              {trackRecordUrl ? (
                <a
                  href={trackRecordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-mint-400 underline underline-offset-4"
                >
                  Verified track record on {provider}
                </a>
              ) : null}
            </div>
          </div>
          {stats ? (
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-forest-600 bg-forest-600 sm:grid-cols-3">
              <div className="bg-forest-850 p-5">
                <dt className="text-sm text-sage-400">Closed trades</dt>
                <dd className="mt-1 text-2xl font-bold">{stats.trades_executed.toLocaleString("en-US")}</dd>
              </div>
              <div className="bg-forest-850 p-5">
                <dt className="text-sm text-sage-400">Won</dt>
                <dd className="mt-1 text-2xl font-bold">{stats.win_rate_percent}%</dd>
              </div>
              <div className="col-span-2 bg-forest-850 p-5 sm:col-span-1">
                <dt className="text-sm text-sage-400">Net result</dt>
                <dd className="mt-1 text-2xl font-bold">{formatSignedPips(stats.net_pips ?? 0)}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  );
}
