import { Suspense } from "react";
import { buildPageMetadataFromConfig } from "../../lib/seo";
import { TradesHistory } from "../_components/TradesHistory";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Trade History",
    description: "View all lifetime executed trades on your PipAngel account.",
    path: "/trades",
    noIndex: true,
  });
}

function TradesHistoryFallback() {
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm text-zinc-500">Loading trade history…</p>
    </div>
  );
}

export default function TradesPage() {
  return (
    <Suspense fallback={<TradesHistoryFallback />}>
      <TradesHistory />
    </Suspense>
  );
}
