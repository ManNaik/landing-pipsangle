import { safeApiGet } from "../../lib/api";
import { buildBreadcrumbSchema, buildPageMetadataFromConfig, getSiteConfig, jsonLdScript, resolveSiteUrl } from "../../lib/seo";
import type { ContentBlock } from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "About PipAngel | Forex Signals & Automation",
    description:
      "Learn about PipAngel, our mission to deliver transparent forex signals and automated trading with professional risk management.",
    path: "/about",
    keywords: ["about PipAngel", "forex signals company", "automated forex trading platform"],
  });
}

export default async function AboutPage() {
  const [pageBlock, siteConfig] = await Promise.all([
    safeApiGet<ContentBlock>("/content/blocks/about.page/", 3600),
    getSiteConfig(),
  ]);

  const paragraphs = (pageBlock?.metadata?.paragraphs ?? []) as string[];
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema) }}
      />
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {pageBlock?.title ?? "About PipAngel"}
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            {pageBlock?.subtitle ?? "Forex Signals & Automated Trading Platform"}
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl min-w-0 space-y-6 text-sm text-zinc-400 sm:text-base">
          {paragraphs.length > 0 ? (
            paragraphs.map((p) => <p key={p}>{p}</p>)
          ) : pageBlock?.body ? (
            <div dangerouslySetInnerHTML={{ __html: pageBlock.body }} />
          ) : (
            <p>Learn more about PipAngel and our trading platform.</p>
          )}
        </div>
      </section>
    </div>
  );
}
