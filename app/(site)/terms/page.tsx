import { safeApiGet } from "../../lib/api";
import { buildBreadcrumbSchema, buildPageMetadataFromConfig, getSiteConfig, jsonLdScript, resolveSiteUrl } from "../../lib/seo";
import type { ContentBlock } from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Terms of Service",
    description: "PipAngel terms of service governing use of our forex signals and automated trading platform.",
    path: "/terms",
  });
}

export default async function TermsPage() {
  const [pageBlock, siteConfig] = await Promise.all([
    safeApiGet<ContentBlock>("/content/blocks/terms.page/", 3600),
    getSiteConfig(),
  ]);
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Terms of Service", path: "/terms" },
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
            {pageBlock?.title ?? "Terms of Service"}
          </h1>
          <div
            className="mt-8 space-y-4 text-sm text-zinc-400 [&_p]:leading-relaxed [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white sm:text-base"
            dangerouslySetInnerHTML={{
              __html: pageBlock?.body ?? "<p>Terms of service content goes here.</p>",
            }}
          />
        </article>
      </section>
    </div>
  );
}
