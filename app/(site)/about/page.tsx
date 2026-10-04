import Link from "next/link";
import { FinalCta } from "../../components/site/FinalCta";
import { PageHero, Section, SectionIntro } from "../../components/site/ui";
import { safeApiGet } from "../../lib/api";
import { normalizeBrandText } from "../../lib/brand";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import { HOW_IT_WORKS_PATH } from "../../lib/siteChrome";
import type { ContentBlock } from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "About",
    description: "Who runs PipsAngel, what the service does and doesn't do, and how to reach us.",
    path: "/about",
  });
}

const OUTDATED = /signal|metatrader 4|\bmt4\b|institutional/i;

export default async function AboutPage() {
  const [block, siteConfig] = await Promise.all([
    safeApiGet<ContentBlock>("/content/blocks/about.page/", 3600),
    getSiteConfig(),
  ]);
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  const paragraphs = ((block?.metadata?.paragraphs ?? []) as unknown[])
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0 && !OUTDATED.test(item))
    .map(normalizeBrandText);

  const company = [
    { label: "Company", value: siteConfig.legal_name },
    { label: "Registration number", value: siteConfig.registration_number },
    { label: "Registered address", value: siteConfig.registered_address },
    { label: "Governing law", value: siteConfig.governing_law },
  ].filter((row) => Boolean(row.value));
  const team = siteConfig.team_members ?? [];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }} />

      <PageHero title={`About ${siteConfig.brand_name}`}>
        <p>
          {siteConfig.brand_name} runs automated copy trading for IC Markets MetaTrader 5 accounts. We place
          trades on our side, and customers who connect their own accounts get the same trades, each opened with
          a stop loss and sized for their balance.
        </p>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionIntro title="What we do" />
            <ul className="mt-6 list-disc space-y-3 pl-5 text-[1.0625rem] leading-relaxed text-sage-300">
              <li>Run a dedicated MT5 terminal for each customer on our servers.</li>
              <li>Copy our trades into connected IC Markets MT5 accounts, sized for each account.</li>
              <li>Show every copied trade and its result in the customer&apos;s dashboard.</li>
            </ul>
            <p className="mt-6">
              <Link href={HOW_IT_WORKS_PATH} className="font-semibold text-mint-400 underline underline-offset-4">
                How copying works
              </Link>
            </p>
          </div>
          <div>
            <SectionIntro title="What we don't do" />
            <ul className="mt-6 list-disc space-y-3 pl-5 text-[1.0625rem] leading-relaxed text-sage-300">
              <li>We aren&apos;t a broker and never hold client money. Your funds stay with IC Markets.</li>
              <li>We don&apos;t give personal financial advice or promise returns.</li>
              <li>We never ask for your IC Markets client-area password.</li>
            </ul>
            <p className="mt-6">
              <Link href="/security" className="font-semibold text-mint-400 underline underline-offset-4">
                Security details
              </Link>
            </p>
          </div>
        </div>
        {paragraphs.length > 0 ? (
          <div className="mt-12 max-w-3xl space-y-4 text-[1.0625rem] leading-relaxed text-sage-300">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}
      </Section>

      {team.length > 0 ? (
        <Section tone="raised">
          <SectionIntro title="The team" />
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <li key={member.name} className="flex gap-4">
                {member.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.photo_url}
                    alt=""
                    width={72}
                    height={72}
                    loading="lazy"
                    className="h-18 w-18 shrink-0 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-lg font-bold">{member.name}</p>
                  <p className="text-sage-400">{member.role}</p>
                  {member.bio ? <p className="mt-2 leading-relaxed text-sage-300">{member.bio}</p> : null}
                  {member.linkedin_url ? (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-mint-400 underline underline-offset-4"
                    >
                      LinkedIn
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section tone={team.length > 0 ? "base" : "raised"}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionIntro title="Contact" />
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-sage-300">
              Email{" "}
              <a href={`mailto:${siteConfig.support_email}`} className="font-semibold text-mint-400 underline underline-offset-4">
                {siteConfig.support_email}
              </a>
              {siteConfig.support_hours ? `. Support hours: ${siteConfig.support_hours}` : ""}.
            </p>
          </div>
          {company.length > 0 ? (
            <div>
              <SectionIntro title="Company details" />
              <dl className="mt-6 divide-y divide-forest-600 border-y border-forest-600">
                {company.map((row) => (
                  <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
                    <dt className="text-sage-400">{row.label}</dt>
                    <dd className="font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </Section>

      <FinalCta location="about_final" />
    </>
  );
}
