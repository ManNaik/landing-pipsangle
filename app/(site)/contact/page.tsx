import { ContactForm } from "../../components/ContactForm";
import { safeApiGet } from "../../lib/api";
import { buildBreadcrumbSchema, buildPageMetadataFromConfig, getSiteConfig, jsonLdScript, resolveSiteUrl } from "../../lib/seo";
import type { ContentBlock } from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Contact PipAngel",
    description: "Get in touch with the PipAngel team for support, partnerships, or general inquiries.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [pageBlock, siteConfig] = await Promise.all([
    safeApiGet<ContentBlock>("/content/blocks/contact.page/", 3600),
    getSiteConfig(),
  ]);
  const contactEmail = (pageBlock?.metadata?.contact_email as string) ?? "support@pipangel.com";
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema) }}
      />
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-md">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
            {pageBlock?.title ?? "Contact Us"}
          </h1>
          <p className="mt-4 text-base text-zinc-400 text-center">
            {pageBlock?.subtitle ?? "Get in touch with the PipAngel team."}
          </p>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Or email us at{" "}
            <a href={`mailto:${contactEmail}`} className="text-emerald-400 hover:text-emerald-300">
              {contactEmail}
            </a>
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
