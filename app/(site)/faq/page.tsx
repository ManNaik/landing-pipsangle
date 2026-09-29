import { FAQExplorer } from "../../components/faq/FAQExplorer";
import { LeadChatbot } from "../../components/LeadChatbot";
import { fetchFaqFromApi } from "../../lib/cmsApi";
import {
  getFaqItems,
  getFaqSections,
  type FaqItem as LocalFaqItem,
  type FaqSection,
} from "../../lib/faqContent";
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

function mergeApiFaq(sections: FaqSection[], apiItems: Array<{ id: string; question: string; answer: string }>): FaqSection[] {
  if (!apiItems.length) return sections;

  const apiSection: FaqSection = {
    id: "support",
    navLabel: "Latest answers",
    heading: "From PipAngel",
    description: "Published answers from the PipAngel knowledge base.",
    items: apiItems.map((item, index) => ({
      id: `api-${item.id}`,
      category: "support" as const,
      question: item.question,
      answer: item.answer,
      order: index + 1,
      keywords: [],
    })),
  };

  const withoutSupport = sections.filter((section) => section.id !== "support");
  const existingSupport = sections.find((section) => section.id === "support");
  return [
    apiSection,
    ...withoutSupport,
    ...(existingSupport
      ? [
          {
            ...existingSupport,
            items: existingSupport.items,
          },
        ]
      : []),
  ];
}

export default async function FAQPage() {
  const localSections = getFaqSections();
  const localItems = getFaqItems();
  const apiItems = await fetchFaqFromApi();
  const sections = mergeApiFaq(localSections, apiItems);

  const schemaItems: LocalFaqItem[] = [
    ...apiItems.map((item, index) => ({
      id: `api-${item.id}`,
      category: "support" as const,
      question: item.question,
      answer: item.answer,
      order: index,
      keywords: [] as string[],
    })),
    ...localItems,
  ];

  const siteConfig = await getSiteConfig();
  const siteUrl = resolveSiteUrl(siteConfig);

  const faqSchema = buildFAQPageSchema(
    schemaItems.map((item) => ({ question: item.question, answer: item.answer })),
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
