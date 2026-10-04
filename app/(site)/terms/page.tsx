import { PageHero, Section } from "../../components/site/ui";
import { safeApiGet } from "../../lib/api";
import { currentCmsBody, termsHtml } from "../../lib/legal";
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
    title: "Terms of service",
    description: "The terms for using PipsAngel copy trading with an IC Markets MT5 account.",
    path: "/terms",
  });
}

export default async function TermsPage() {
  const [block, siteConfig] = await Promise.all([
    safeApiGet<ContentBlock>("/content/blocks/terms.page/", 3600),
    getSiteConfig(),
  ]);
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Terms of service", path: "/terms" },
  ]);
  const body = currentCmsBody(block?.body) ?? termsHtml(siteConfig);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }} />
      <PageHero title="Terms of service" />
      <Section className="pt-10 sm:pt-12">
        <article className="prose-site max-w-3xl" dangerouslySetInnerHTML={{ __html: body }} />
      </Section>
    </>
  );
}
