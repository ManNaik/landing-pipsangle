import { FinalCta } from "../../components/site/FinalCta";
import { PageHero, Section } from "../../components/site/ui";
import { IC_MARKETS_URL } from "../../lib/brand";
import {
  buildBreadcrumbSchema,
  buildHowToSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import { IC_MARKETS_GUIDE_PATH } from "../../lib/siteChrome";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "How to open an IC Markets MT5 account for copy trading",
    description:
      "Open a live IC Markets account on MetaTrader 5, find your MT5 login number and server name, and connect it to PipsAngel.",
    path: IC_MARKETS_GUIDE_PATH,
  });
}

const STEPS = [
  {
    title: "Open a live account at IC Markets",
    body: "Sign up on the IC Markets website. When you're asked to choose a trading platform, pick MetaTrader 5. PipsAngel doesn't work with MetaTrader 4 or cTrader accounts.",
  },
  {
    title: "Verify your identity",
    body: "IC Markets asks for a photo ID and proof of address before you can trade. This is their process, and it's the same whether or not you use PipsAngel.",
  },
  {
    title: "Fund the account",
    body: "IC Markets sets its own minimum deposit and payment methods. Only deposit money you can afford to lose.",
  },
  {
    title: "Find your MT5 login number and server",
    body: "IC Markets emails both when your MT5 account is created, and they're listed in the IC Markets client area. The server name starts with \"ICMarkets\". You'll also need the account's main password, not the investor password.",
  },
  {
    title: "Connect it to PipsAngel",
    body: "Create your PipsAngel account, then enter the login number, server and password on the setup screen. Your free trial starts once the connection is verified.",
  },
];

export default async function IcMarketsGuidePage() {
  const siteConfig = await getSiteConfig();
  const siteUrl = resolveSiteUrl(siteConfig);
  const brokerUrl = siteConfig.broker_signup_url || IC_MARKETS_URL;
  const howTo = buildHowToSchema(siteUrl, {
    name: "Open an IC Markets MT5 account and connect it to PipsAngel",
    description: "Five steps from opening a live IC Markets account to your first copied trade.",
    path: IC_MARKETS_GUIDE_PATH,
    steps: STEPS.map((step) => `${step.title}: ${step.body}`),
  });
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Open an IC Markets account", path: IC_MARKETS_GUIDE_PATH },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript([howTo, breadcrumb]) }} />

      <PageHero title="Open an IC Markets MT5 account">
        <p>
          PipsAngel copies trades into live IC Markets accounts on MetaTrader 5. If you don&apos;t have one yet,
          here&apos;s how to open it and where to find the details you&apos;ll need.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={brokerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-forest-500 px-6 font-semibold text-paper hover:border-sage-500 hover:bg-forest-800"
          >
            Go to the IC Markets website
          </a>
          <p className="max-w-md text-sm text-sage-400">
            {siteConfig.broker_affiliate_disclosure ||
              "IC Markets is a separate company. PipsAngel is independent of IC Markets."}
          </p>
        </div>
      </PageHero>

      <Section>
        <ol className="max-w-3xl space-y-10">
          {STEPS.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4">
              <span className="text-3xl font-bold leading-none text-forest-500 tabular-nums">{index + 1}</span>
              <div>
                <h2 className="text-xl font-bold">{step.title}</h2>
                <p className="mt-2 leading-relaxed text-sage-300">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 max-w-3xl rounded-2xl border border-forest-600 bg-forest-850 p-6 sm:p-8">
          <h2 className="text-lg font-bold">Before you connect</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-sage-300">
            <li>Use an account you don&apos;t trade manually on. Manual trades share the same balance and margin.</li>
            <li>Never give your IC Markets client-area password to anyone, including us. We don&apos;t need it.</li>
            <li>Trading on margin is risky. You could lose some or all of the money in the account.</li>
          </ul>
        </div>
      </Section>

      <FinalCta title="Already have an account? Start your free trial" location="icm_guide_final" />
    </>
  );
}
