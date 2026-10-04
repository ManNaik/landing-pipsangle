import { PageHero, Section } from "../../components/site/ui";
import { safeApiGet } from "../../lib/api";
import { currentCmsBody, privacyHtml } from "../../lib/legal";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import type { ContentBlock } from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Privacy policy",
    description:
      "What personal data PipsAngel collects, including broker connection details, how it's used and protected, and your rights.",
    path: "/privacy",
  });
}

export default async function PrivacyPage() {
  const [block, siteConfig] = await Promise.all([
    safeApiGet<ContentBlock>("/content/blocks/privacy.page/", 3600),
    getSiteConfig(),
  ]);
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Privacy policy", path: "/privacy" },
  ]);
  const body = currentCmsBody(block?.body) ?? privacyHtml(siteConfig);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }} />
      <PageHero title="Privacy policy" />
      <Section className="pt-10 sm:pt-12">
        <article className="prose-site max-w-3xl" dangerouslySetInnerHTML={{ __html: body }} />
      </Section>
    </>
  );
}
