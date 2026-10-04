import Link from "next/link";
import { BrokerCallout } from "../../components/site/BrokerCallout";
import { FaqList } from "../../components/site/FaqList";
import { FinalCta } from "../../components/site/FinalCta";
import { PlanCards } from "../../components/site/PlanCards";
import { PageHero, Section, SectionIntro } from "../../components/site/ui";
import type { FaqItem } from "../../lib/faqContent";
import { getPublishedStats } from "../../lib/performance";
import {
  buildPlanComparison,
  buildPricingFaq,
  formatPrice,
  getPricingTiers,
  getSignupUrl,
  PRICING_TIERS,
} from "../../lib/pricing";
import {
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildPageMetadataFromConfig,
  buildProductOfferSchema,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import { FREE_TRIAL_DAYS, TRIAL_START_NOTE } from "../../lib/trial";

export async function generateMetadata() {
  const tiers = await getPricingTiers();
  const basic = tiers.find((tier) => tier.id === "basic") ?? PRICING_TIERS[0];
  const premium = tiers.find((tier) => tier.id === "premium") ?? PRICING_TIERS[1];
  return buildPageMetadataFromConfig({
    title: "Pricing",
    description: `Basic is ${formatPrice(basic.price)} for ${basic.periodLabel} and Premium is ${formatPrice(premium.price)} for ${premium.periodLabel}. Both start with a ${FREE_TRIAL_DAYS}-day free trial and nothing renews automatically.`,
    path: "/pricing",
    keywords: ["PipsAngel pricing", "forex copy trading cost", "IC Markets copy trading price"],
  });
}

const BILLING_STEPS = [
  {
    title: "Free trial",
    body: `Starts when your MT5 account is connected and runs for ${FREE_TRIAL_DAYS} days. No payment details needed.`,
  },
  {
    title: "Pay for a period",
    body: "Choose Basic or Premium in your dashboard and pay with PayPal. The period starts straight away.",
  },
  {
    title: "Pay again only if you want to",
    body: "Nothing renews automatically. When a period ends, copying stops until you pay for the next one.",
  },
];

export default async function PricingPage() {
  const [siteConfig, tiers, stats] = await Promise.all([
    getSiteConfig(),
    getPricingTiers(),
    getPublishedStats(),
  ]);
  const siteUrl = resolveSiteUrl(siteConfig);
  const comparison = buildPlanComparison(tiers);
  const questions = buildPricingFaq(tiers, siteConfig.support_email ?? "");
  const faqItems: FaqItem[] = questions.map((item, index) => ({
    id: `pricing-${index}`,
    category: "pricing",
    question: item.question,
    answer: item.answer,
    order: index,
    keywords: [],
  }));

  const schemas = [
    ...tiers.map((tier) =>
      buildProductOfferSchema(siteUrl, siteConfig.brand_name, {
        name: `${siteConfig.brand_name} ${tier.name} (${tier.periodLabel})`,
        description: tier.tagline,
        price: tier.price,
        url: getSignupUrl(tier.id),
      })
    ),
    buildFAQPageSchema(questions, siteUrl),
    buildBreadcrumbSchema(siteUrl, [
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ]),
  ];
  const hasProof = Boolean(stats || siteConfig.track_record_url);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }} />

      <PageHero title="Pricing">
        <p>
          Two plans that copy the same trades. They differ in how much of your balance is used and how long
          each payment lasts. {TRIAL_START_NOTE}
        </p>
      </PageHero>

      <Section>
        <PlanCards tiers={tiers} location="pricing_cards" detailed />
        <p className="mt-6 text-sm leading-relaxed text-sage-400">
          Prices are in US dollars. Trading carries risk regardless of plan, and you could lose money.
        </p>
      </Section>

      <Section tone="raised">
        <SectionIntro title="Compare the plans" />
        <div className="mt-8 overflow-x-auto rounded-2xl border border-forest-600">
          <table className="w-full min-w-[34rem] text-left">
            <caption className="sr-only">Basic and Premium compared</caption>
            <thead className="bg-forest-800 text-sm text-sage-300">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-semibold">
                  Feature
                </th>
                <th scope="col" className="px-5 py-3.5 font-semibold">
                  Basic
                </th>
                <th scope="col" className="px-5 py-3.5 font-semibold">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-700">
              {comparison.map((row) => (
                <tr key={row.feature}>
                  <th scope="row" className="px-5 py-3.5 font-medium text-sage-200">
                    {row.feature}
                  </th>
                  <td className="px-5 py-3.5 text-sage-300">{row.basic}</td>
                  <td className="px-5 py-3.5 text-paper">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <SectionIntro title="How billing works" />
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {BILLING_STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="text-4xl font-bold leading-none text-forest-500 tabular-nums">{index + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-sage-300">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="raised">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionIntro title="Billing questions">
            <p>
              Anything else is in the{" "}
              <Link href="/faq" className="font-semibold text-mint-400 underline underline-offset-4">
                FAQ
              </Link>
              {hasProof ? (
                <>
                  , and our trading record is on the{" "}
                  <Link href="/trading-performance" className="font-semibold text-mint-400 underline underline-offset-4">
                    results page
                  </Link>
                </>
              ) : null}
              .
            </p>
          </SectionIntro>
          <FaqList items={faqItems} />
        </div>
      </Section>

      <Section>
        <BrokerCallout siteConfig={siteConfig} />
      </Section>

      <FinalCta location="pricing_final" />
    </>
  );
}
