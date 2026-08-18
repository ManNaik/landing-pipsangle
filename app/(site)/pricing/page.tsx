import { PricingBenefits } from "../../components/pricing/PricingBenefits";
import { PricingBilling } from "../../components/pricing/PricingBilling";
import { PricingCards } from "../../components/pricing/PricingCards";
import { PricingCompare } from "../../components/pricing/PricingCompare";
import { PricingFaq } from "../../components/pricing/PricingFaq";
import { PricingFinalCta } from "../../components/pricing/PricingFinalCta";
import { PricingHero } from "../../components/pricing/PricingHero";
import { PricingTrial } from "../../components/pricing/PricingTrial";
import { PricingTrust } from "../../components/pricing/PricingTrust";
import { formatPrice, getSignupUrl, PRICING_TIERS } from "../../lib/pricing";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  buildProductOfferSchema,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";

export async function generateMetadata() {
  const basic = PRICING_TIERS.find((tier) => tier.id === "basic")!;
  const premium = PRICING_TIERS.find((tier) => tier.id === "premium")!;

  return buildPageMetadataFromConfig({
    title: "Pricing | Basic and Premium Plans",
    description: `Choose Basic or Premium. Start with a 4-day free trial. Basic is ${formatPrice(basic.price)} per ${basic.periodLabel}. Premium is ${formatPrice(premium.price)} per ${premium.periodLabel}. Compare control, risk settings, and automation.`,
    path: "/pricing",
    keywords: [
      "PipAngel pricing",
      "forex automation plans",
      "automated forex trading cost",
      "forex trading plans",
    ],
  });
}

export default async function PricingPage() {
  const siteConfig = await getSiteConfig();
  const siteUrl = resolveSiteUrl(siteConfig);
  const brandName = siteConfig?.brand_name ?? "PipAngel";

  const productSchemas = PRICING_TIERS.map((tier) =>
    buildProductOfferSchema(siteUrl, brandName, {
      name: `${tier.name} (${tier.periodLabel})`,
      description: tier.tagline,
      price: tier.price,
      url: getSignupUrl(tier.id),
    })
  );
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
  ]);

  return (
    <div className="min-w-0 bg-[#050505]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([...productSchemas, breadcrumbSchema]),
        }}
      />
      <PricingHero />
      <PricingCards />
      <PricingCompare />
      <PricingBenefits />
      <PricingTrial />
      <PricingBilling />
      <PricingFaq />
      <PricingTrust />
      <PricingFinalCta />
    </div>
  );
}
