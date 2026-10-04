import { FAQExplorer } from "../../components/faq/FAQExplorer";
import { FinalCta } from "../../components/site/FinalCta";
import { fetchFaqFromApi } from "../../lib/cmsApi";
import { getFaqSections, type FaqSection } from "../../lib/faqContent";
import { getPublishedStats } from "../../lib/performance";
import { getPricingTiers } from "../../lib/pricing";
import {
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "FAQ",
    description:
      "Answers about connecting IC Markets MT5 to PipsAngel, what we can and can't do in your account, the free trial, billing and risk.",
    path: "/faq",
    keywords: ["PipsAngel FAQ", "IC Markets MT5 copy trading", "forex copy trading questions"],
  });
}

export default async function FAQPage() {
  const [siteConfig, tiers, stats, apiItems] = await Promise.all([
    getSiteConfig(),
    getPricingTiers(),
    getPublishedStats(),
    fetchFaqFromApi(),
  ]);

  const sections: FaqSection[] = getFaqSections({
    tiers,
    supportEmail: siteConfig.support_email ?? "",
    responseTime: siteConfig.support_response_time,
    hasPublicResults: Boolean(stats || siteConfig.track_record_url),
  });

  if (apiItems.length > 0) {
    sections.push({
      id: "more",
      navLabel: "More questions",
      heading: "More questions",
      items: apiItems.map((item, index) => ({
        id: `cms-${item.id}`,
        category: "more",
        question: item.question,
        answer: item.answer,
        order: index,
        keywords: [],
      })),
    });
  }

  const siteUrl = resolveSiteUrl(siteConfig);
  const faqSchema = buildFAQPageSchema(
    sections.flatMap((section) => section.items.map((item) => ({ question: item.question, answer: item.answer }))),
    siteUrl
  );
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([faqSchema, breadcrumb]) }} />
      <FAQExplorer sections={sections} supportEmail={siteConfig.support_email ?? ""} />
      <FinalCta title="Still deciding? Try it for 4 days" location="faq_final" />
    </>
  );
}
