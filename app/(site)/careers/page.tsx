import { safeApiGet } from "../../lib/api";
import { buildBreadcrumbSchema, buildPageMetadataFromConfig, getSiteConfig, jsonLdScript, resolveSiteUrl } from "../../lib/seo";
import type { ContentBlock } from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Careers at PipAngel",
    description: "Join the PipAngel team and help build the future of forex signals and automated trading.",
    path: "/careers",
  });
}

export default async function CareersPage() {
  const [pageBlock, siteConfig] = await Promise.all([
    safeApiGet<ContentBlock>("/content/blocks/careers.page/", 3600),
    getSiteConfig(),
  ]);

  const openings = (pageBlock?.metadata?.openings ?? []) as Array<{
    title?: string;
    description?: string;
  }>;
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
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
            {pageBlock?.title ?? "Careers"}
          </h1>
          <div
            className="mt-6 space-y-4 text-sm text-zinc-400 [&_p]:leading-relaxed sm:text-base"
            dangerouslySetInnerHTML={{
              __html: pageBlock?.body ?? "<p>Join the PipAngel team.</p>",
            }}
          />
          {openings.length > 0 && (
            <ul className="mt-8 space-y-4">
              {openings.map((job) => (
                <li
                  key={job.title}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 sm:p-6"
                >
                  <h2 className="font-semibold text-white">{job.title}</h2>
                  {job.description && (
                    <p className="mt-2 text-sm text-zinc-400">{job.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  );
}
