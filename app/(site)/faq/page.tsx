import Link from "next/link";
import { safeApiGet } from "../../lib/api";
import {
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import type { ContentBlock, ListResponse, FaqItem } from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "FAQ | Forex Signals & Automated Trading",
    description:
      "Frequently asked questions about PipAngel forex signals, automated trading, brokers, pricing, and risk management.",
    path: "/faq",
    keywords: [
      "forex signals FAQ",
      "automated forex trading questions",
      "forex trading help",
      "PipAngel FAQ",
    ],
  });
}

export default async function FAQPage() {
  const [faqData, pageBlock, siteConfig] = await Promise.all([
    safeApiGet<ListResponse<FaqItem>>("/faq/", 300),
    safeApiGet<ContentBlock>("/content/blocks/faq.page/", 3600),
    getSiteConfig(),
  ]);

  const faqItems = faqData?.results ?? [];
  const siteUrl = resolveSiteUrl(siteConfig);
  const brandName = siteConfig?.brand_name ?? "PipAngel";

  const faqSchema = buildFAQPageSchema(faqItems, siteUrl);
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]);

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([faqSchema, breadcrumbSchema]),
        }}
      />
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {pageBlock?.title ?? "Frequently Asked Questions"}
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            {pageBlock?.subtitle ?? "Common questions about our signals and automation."}
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl min-w-0 space-y-3 sm:space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 sm:p-6"
            >
              <h2 className="font-medium text-white text-base sm:text-lg">{item.question}</h2>
              <p className="mt-2 text-sm text-zinc-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-800 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-zinc-400">
            Ready to get started? Explore our{" "}
            <Link href="/forex-signals" className="text-emerald-400 hover:text-emerald-300">
              forex signals
            </Link>
            ,{" "}
            <Link href="/automated-forex-trading" className="text-emerald-400 hover:text-emerald-300">
              automated trading
            </Link>
            , or{" "}
            <Link href="/pricing" className="text-emerald-400 hover:text-emerald-300">
              pricing plans
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
