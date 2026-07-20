import { Suspense } from "react";
import { buildPageMetadataFromConfig } from "../../lib/seo";
import SubscriptionPage from "./page.client";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Subscription",
    description: "Manage your PipAngel subscription, renewals, and extensions.",
    path: "/dashboard/subscription",
    noIndex: true,
  });
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl py-8">
          <p className="text-sm text-zinc-500">Loading subscription…</p>
        </div>
      }
    >
      <SubscriptionPage />
    </Suspense>
  );
}
