import { safeApiGet } from "../../lib/api";
import { buildBreadcrumbSchema, buildPageMetadataFromConfig, getSiteConfig, jsonLdScript, resolveSiteUrl } from "../../lib/seo";
import type { ContentBlock } from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Privacy Policy",
    description: "PipAngel privacy policy. How we collect, use, and protect your personal data.",
    path: "/privacy",
  });
}

export default async function PrivacyPage() {
  const [pageBlock, siteConfig] = await Promise.all([
    safeApiGet<ContentBlock>("/content/blocks/privacy.page/", 3600),
    getSiteConfig(),
  ]);
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy" },
  ]);

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema) }}
      />
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {pageBlock?.title ?? "Privacy Policy"}
          </h1>
          <div
            className="mt-8 space-y-4 text-sm text-zinc-400 [&_p]:leading-relaxed [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white sm:text-base"
            dangerouslySetInnerHTML={{
              __html: pageBlock?.body ?? "<p>Privacy policy content goes here.</p>",
            }}
          />
        </article>
      </section>
    </div>
  );
}
