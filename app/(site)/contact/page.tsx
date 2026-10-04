import { ContactForm } from "../../components/ContactForm";
import { PageHero, Section } from "../../components/site/ui";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Contact",
    description: "Email PipsAngel or send a message about setup, billing or your account.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const siteConfig = await getSiteConfig();
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);
  const channels = [
    ...(siteConfig.whatsapp_url ? [{ name: "WhatsApp", url: siteConfig.whatsapp_url }] : []),
    ...(siteConfig.telegram_url ? [{ name: "Telegram", url: siteConfig.telegram_url }] : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }} />
      <PageHero title="Contact us">
        <p>
          Questions about setup, billing or your account. We reply by email
          {siteConfig.support_response_time ? `, usually ${siteConfig.support_response_time}` : ""}.
        </p>
      </PageHero>

      <Section className="pt-12 sm:pt-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-semibold text-sage-400">Email</h2>
              <a
                href={`mailto:${siteConfig.support_email}`}
                className="mt-1 inline-block text-xl font-bold text-paper underline decoration-forest-500 underline-offset-4 hover:decoration-mint-400"
              >
                {siteConfig.support_email}
              </a>
            </div>
            {channels.length > 0 ? (
              <div>
                <h2 className="text-sm font-semibold text-sage-400">Chat</h2>
                <ul className="mt-2 flex flex-wrap gap-3">
                  {channels.map((channel) => (
                    <li key={channel.name}>
                      <a
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center rounded-lg border border-forest-500 px-4 font-semibold hover:bg-forest-800"
                      >
                        {channel.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {siteConfig.support_hours ? (
              <div>
                <h2 className="text-sm font-semibold text-sage-400">Support hours</h2>
                <p className="mt-1 text-lg">{siteConfig.support_hours}</p>
              </div>
            ) : null}
            {siteConfig.registered_address ? (
              <div>
                <h2 className="text-sm font-semibold text-sage-400">Address</h2>
                <p className="mt-1 leading-relaxed text-sage-200">
                  {siteConfig.legal_name ? (
                    <>
                      {siteConfig.legal_name}
                      <br />
                    </>
                  ) : null}
                  {siteConfig.registered_address}
                </p>
              </div>
            ) : null}
            <p className="rounded-xl border border-forest-600 bg-forest-850 px-5 py-4 text-sm leading-relaxed text-sage-300">
              Never send us your IC Markets client-area password. To help with setup we only ever need your
              account email and, if asked, your MT5 login number.
            </p>
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
