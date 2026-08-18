import { PerformanceDashboard } from "../../components/performance/PerformanceDashboard";
import { safeApiGet } from "../../lib/api";
import {
  hasLivePerformanceData,
  buildLiveReport,
} from "../../lib/performanceReport";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import type {
  PaginatedResponse,
  PerformanceStats,
  Trade,
} from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Forex Trading Performance",
    description:
      "Review PipAngel forex trading performance including recorded trades, risk metrics, drawdown, and account activity.",
    path: "/trading-performance",
    keywords: [
      "forex trading performance",
      "forex win rate",
      "trading track record",
      "IC Markets MT5 performance",
    ],
  });
}

export default async function TradingPerformancePage() {
  const [stats, tradesData, siteConfig] = await Promise.all([
    safeApiGet<PerformanceStats>("/stats/performance/", 60),
    safeApiGet<PaginatedResponse<Trade>>("/trades/?limit=50", 60),
    getSiteConfig(),
  ]);

  const trades = tradesData?.results ?? [];
  const liveReport = hasLivePerformanceData(stats, trades)
    ? buildLiveReport(stats, trades)
    : null;
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
      <PerformanceDashboard liveReport={liveReport} />
    </div>
  );
}
