import Link from "next/link";
import { safeApiGet } from "../../lib/api";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  buildProductOfferSchema,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import type { ContentBlock, ListResponse, PricingPlan } from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Forex Signals Pricing | Plans & Subscriptions",
    description:
      "Compare PipAngel forex signals and automation pricing plans. Choose a subscription that fits your trading goals.",
    path: "/pricing",
    keywords: [
      "forex signals pricing",
      "forex signal subscription",
      "automated forex trading cost",
      "forex trading plans",
    ],
  });
}

export default async function PricingPage() {
  const [plansData, pageBlock, siteConfig] = await Promise.all([
    safeApiGet<ListResponse<PricingPlan>>("/pricing/plans/", 300),
    safeApiGet<ContentBlock>("/content/blocks/pricing.page/", 3600),
    getSiteConfig(),
  ]);

  const plans = plansData?.results ?? [];
  const siteUrl = resolveSiteUrl(siteConfig);
  const brandName = siteConfig?.brand_name ?? "PipAngel";

  const productSchemas = plans.map((plan) =>
    buildProductOfferSchema(siteUrl, brandName, {
      name: plan.name,
      description: plan.features.join(". "),
      price: plan.price,
      url: plan.cta_url,
    })
  );
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
  ]);

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([...productSchemas, breadcrumbSchema]),
        }}
      />
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {pageBlock?.title ?? "Forex Signals Pricing"}
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            {pageBlock?.subtitle ?? "Choose the plan that fits your trading goals."}
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl min-w-0">
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl border p-6 sm:p-8 ${
                  plan.is_popular
                    ? "border-emerald-500/50 bg-emerald-950/20"
                    : "border-zinc-800 bg-zinc-900/30"
                }`}
              >
                <h2 className="text-lg font-semibold text-white sm:text-xl">
                  {plan.name}
                </h2>
                <p className="mt-2">
                  <span className="text-2xl font-bold text-white sm:text-3xl">
                    {plan.price_display}
                  </span>
                  <span className="text-zinc-500">/{plan.billing_period}</span>
                </p>
                <ul className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-zinc-400"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.cta_url}
                  className={`mt-6 block rounded-lg py-3 text-center text-sm font-medium transition min-h-[3rem] flex items-center justify-center sm:mt-8 ${
                    plan.is_popular
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "border border-zinc-600 text-white hover:bg-zinc-800"
                  }`}
                >
                  {plan.cta_label}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-zinc-500">
            Not sure which plan fits? Read our{" "}
            <Link href="/faq" className="text-emerald-400 hover:text-emerald-300">
              FAQ
            </Link>{" "}
            or view{" "}
            <Link href="/trading-performance" className="text-emerald-400 hover:text-emerald-300">
              trading performance
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
