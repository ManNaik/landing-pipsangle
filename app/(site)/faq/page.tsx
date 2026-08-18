import { FAQExplorer } from "../../components/faq/FAQExplorer";
import { LeadChatbot } from "../../components/LeadChatbot";
import { getFaqItems, getFaqSections } from "../../lib/faqContent";
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
    title: "Forex Trading FAQ",
    description:
      "Find answers about PipAngel, automated forex trading, MT5, risk management, performance, pricing, and account support.",
    path: "/faq",
    keywords: [
      "PipAngel FAQ",
      "automated forex trading questions",
      "MT5 FAQ",
      "forex risk management",
      "PipAngel pricing",
    ],
  });
}

export default async function FAQPage() {
  const sections = getFaqSections();
  const items = getFaqItems();
  const siteConfig = await getSiteConfig();
  const siteUrl = resolveSiteUrl(siteConfig);

  const faqSchema = buildFAQPageSchema(
    items.map((item) => ({ question: item.question, answer: item.answer })),
    siteUrl
  );
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]);

  return (
    <div className="min-w-0 bg-[#050505]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([faqSchema, breadcrumbSchema]),
        }}
      />
      <FAQExplorer sections={sections} />
      <LeadChatbot />
    </div>
  );
}
