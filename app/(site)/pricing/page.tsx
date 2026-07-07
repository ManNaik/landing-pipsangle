import Link from "next/link";
import { FreeTrialBanner } from "../../components/FreeTrialBanner";
import { HeroBackground } from "../../components/HeroBackground";
import { PricingSection } from "../../components/PricingSection";
import { formatPrice, getSignupUrl, LIFETIME_LOCK_OFFER, PRICING_TIERS } from "../../lib/pricing";
import { FREE_TRIAL_DAYS, FREE_TRIAL_CTA } from "../../lib/trial";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  buildProductOfferSchema,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Forex Signals Pricing | Plans & Subscriptions",
    description:
      "Compare PipAngel Basic and Premium forex signals and automation plans. Launch pricing from $29/week (was $79) and $99/28 days (was $299) — first 50 clients lock in lifetime rates. 2-day free trial included.",
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
  const siteConfig = await getSiteConfig();
  const basicTier = PRICING_TIERS.find((t) => t.id === "basic")!;
  const premiumTier = PRICING_TIERS.find((t) => t.id === "premium")!;

  const siteUrl = resolveSiteUrl(siteConfig);
  const brandName = siteConfig?.brand_name ?? "PipAngel";

  const productSchemas = PRICING_TIERS.map((tier) =>
    buildProductOfferSchema(siteUrl, brandName, {
      name: `${tier.name} — ${tier.periodLabel}`,
      description: tier.features
        .filter((f) => f.included)
        .map((f) => f.label)
        .join(". "),
      price: tier.price,
      originalPrice: tier.originalPrice,
      url: getSignupUrl(tier.id),
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

      {/* Page intro */}
      <section className="relative overflow-hidden border-b border-zinc-800 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <HeroBackground />
        <div className="absolute inset-0 bg-zinc-950/75" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(16,185,129,0.08),transparent)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-medium tracking-[0.25em] text-zinc-500">
            Pricing
          </p>
          <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/[0.07] px-3.5 py-1.5 text-[11px] font-medium tracking-[0.1em] text-emerald-400/95">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
            {LIFETIME_LOCK_OFFER.heroBadge}
          </p>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Two plans. No surprises.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Professional signals and automation at launch pricing for our first{" "}
            <span className="font-medium text-zinc-200">{LIFETIME_LOCK_OFFER.maxClients} founding members</span>.
            Every plan includes a {FREE_TRIAL_DAYS}-day trial with full access.
          </p>
          <div
            className="relative mx-auto mt-10 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-xl border border-emerald-500/20 bg-zinc-800 sm:mt-12"
            role="note"
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
              aria-hidden
            />
            <div className="bg-zinc-950/80 px-4 py-4 text-left sm:px-5 sm:py-5">
              <p className="text-[11px] font-medium tracking-[0.12em] text-zinc-500">Basic</p>
              <p className="mt-1.5 text-lg font-semibold tracking-tight text-white">
                {formatPrice(basicTier.price)}
                <span className="text-sm font-normal text-zinc-500"> / week</span>
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                was {formatPrice(basicTier.originalPrice)} · {basicTier.discountPercent}% off
              </p>
            </div>
            <div className="bg-zinc-950/80 px-4 py-4 text-left sm:px-5 sm:py-5">
              <p className="text-[11px] font-medium tracking-[0.12em] text-zinc-500">Premium</p>
              <p className="mt-1.5 text-lg font-semibold tracking-tight text-white">
                {formatPrice(premiumTier.price)}
                <span className="text-sm font-normal text-zinc-500"> / 28 days</span>
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                was {formatPrice(premiumTier.originalPrice)} · {premiumTier.discountPercent}% off
              </p>
            </div>
          </div>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-zinc-400">
            <span className="font-medium text-zinc-200">{LIFETIME_LOCK_OFFER.headline}.</span>{" "}
            Subscribe now and keep these rates permanently — even when standard pricing returns.
          </p>
        </div>
      </section>

      {/* Plans & supporting sections */}
      <section className="relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="relative mx-auto max-w-6xl min-w-0">
          <FreeTrialBanner className="mb-12 sm:mb-16" />
          <PricingSection />
        </div>
      </section>

      {/* Bottom links */}
      <section className="border-t border-zinc-800 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-zinc-400">{FREE_TRIAL_CTA}</p>
          <p className="mt-2 text-sm text-zinc-600">
            Not sure which plan fits? Read our{" "}
            <Link href="/faq" className="font-medium text-zinc-300 transition hover:text-white">
              FAQ
            </Link>{" "}
            or review{" "}
            <Link
              href="/trading-performance"
              className="font-medium text-zinc-300 transition hover:text-white"
            >
              trading performance
            </Link>
            .
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <Link
              href={getSignupUrl("premium")}
              className="inline-flex min-h-[3rem] items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-500 sm:min-h-0"
            >
              Try Premium — {FREE_TRIAL_DAYS} days free
            </Link>
            <Link
              href={getSignupUrl("basic")}
              className="inline-flex min-h-[3rem] items-center justify-center rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800/40 sm:min-h-0"
            >
              Start Basic — {FREE_TRIAL_DAYS} days free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
