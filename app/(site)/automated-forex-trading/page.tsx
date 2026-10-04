import Link from "next/link";
import { BrokerCallout } from "../../components/site/BrokerCallout";
import { FinalCta } from "../../components/site/FinalCta";
import { SecurityBand } from "../../components/site/SecurityBand";
import { TrackedLink } from "../../components/site/TrackedLink";
import { PageHero, Section, SectionIntro } from "../../components/site/ui";
import {
  buildBreadcrumbSchema,
  buildHowToSchema,
  buildPageMetadataFromConfig,
  buildServiceSchema,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import { IC_MARKETS_GUIDE_PATH, SIGNUP_PATH } from "../../lib/siteChrome";
import { FREE_TRIAL_DAYS, TRIAL_START_NOTE } from "../../lib/trial";

const PATH = "/automated-forex-trading";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "How copy trading works with IC Markets MT5",
    description:
      "How PipsAngel copies trades to your IC Markets MetaTrader 5 account: what you connect, how each trade is placed and sized, what you control, and what copy trading can't do.",
    path: PATH,
    keywords: ["forex copy trading", "IC Markets MT5", "MT5 copy trading", "automated forex trading"],
  });
}

const JOURNEY = [
  {
    title: "Sign up and choose a plan",
    body: "Create an account with your email and pick Basic or Premium. Nothing to pay at this point.",
  },
  {
    title: "Submit your MT5 details",
    body: "Enter your IC Markets MT5 login number, server name and password, and confirm you understand the risks of trading.",
  },
  {
    title: "We start your MT5 terminal",
    body: "Each customer gets their own MT5 terminal on our servers. It logs in to your account and we check that the account number matches. If every terminal is busy, you're queued, and the dashboard shows where setup is up to.",
  },
  {
    title: `Your ${FREE_TRIAL_DAYS}-day trial starts`,
    body: "The trial clock starts when your account is connected and verified, so setup time doesn't eat into it.",
  },
  {
    title: "Trades are copied to your account",
    body: "When we open a trade, your terminal sizes it for your account and places it with a stop loss. You see it in MT5 and in your dashboard.",
  },
  {
    title: "Keep going or stop",
    body: "After the trial, pay with PayPal for 7 or 28 days to keep copying. If you don't, copying stops and your setup is kept for a short time in case you come back.",
  },
];

const CONTROLS = [
  {
    title: "Copying on or off",
    body: "Switch copying off and no new trades are sent to your account. Switch it back on when you're ready.",
  },
  {
    title: "Capital utilization",
    body: "How much of your balance is used for trading. Fixed at 25% on Basic; on Premium you choose between 10% and 100%.",
  },
  {
    title: "Every trade, in one place",
    body: "Your dashboard lists each copied trade with its result. MT5 on your phone or computer shows the same positions.",
  },
  {
    title: "Your MT5 details",
    body: "Update your login, server or password from the dashboard if you change them at IC Markets.",
  },
];

const LIMITS = [
  {
    title: "It can't guarantee profits",
    body: "Trades lose as well as win. A run of losing trades can take a large share of your balance.",
  },
  {
    title: "Stop losses aren't guaranteed prices",
    body: "In fast or gapping markets a trade can close at a worse price than its stop loss.",
  },
  {
    title: "Your results won't match ours exactly",
    body: "Spreads, slippage, account size and timing all differ slightly between accounts, so the same trade can end with a slightly different result.",
  },
  {
    title: "Manual trades change the picture",
    body: "Trading by hand on the same account uses the same balance and margin, which affects how copied trades are sized. Use a separate account for manual trading.",
  },
];

export default async function HowItWorksPage() {
  const siteConfig = await getSiteConfig();
  const siteUrl = resolveSiteUrl(siteConfig);

  const howTo = buildHowToSchema(siteUrl, {
    name: "How to start copy trading with PipsAngel",
    description: "From signing up to your first copied trade on an IC Markets MT5 account.",
    path: PATH,
    steps: JOURNEY.map((step) => `${step.title}: ${step.body}`),
  });
  const service = buildServiceSchema(siteUrl, siteConfig.brand_name, {
    name: "Copy trading for IC Markets MT5 accounts",
    description: "Trades copied to your own IC Markets MetaTrader 5 account, each opened with a stop loss.",
    path: PATH,
    serviceType: "Forex copy trading",
  });
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "How it works", path: PATH },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript([howTo, service, breadcrumb]) }}
      />

      <PageHero title="How PipsAngel copy trading works">
        <p>
          You connect your own IC Markets MetaTrader 5 account. We run an MT5 terminal for you, and every trade
          we open is copied into your account with a stop loss, sized for your balance. Your money stays with
          IC Markets the whole time.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <TrackedLink
            href={SIGNUP_PATH}
            location="how_hero"
            className="inline-flex min-h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-mint-500 px-7 font-semibold text-white hover:bg-leaf-600"
          >
            Start free trial
          </TrackedLink>
          <p className="text-sm text-sage-400">{TRIAL_START_NOTE}</p>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <SectionIntro title="From signup to your first copied trade">
            <p>
              What you&apos;ll need: a live IC Markets MT5 account, and its login number, server name and
              password.{" "}
              <Link href={IC_MARKETS_GUIDE_PATH} className="font-semibold text-mint-400 underline underline-offset-4">
                How to open an account
              </Link>
            </p>
          </SectionIntro>
          <ol className="relative space-y-8 border-l border-forest-600 pl-8">
            {JOURNEY.map((step, index) => (
              <li key={step.title} className="relative">
                <span className="absolute -left-[3.05rem] flex h-9 w-9 items-center justify-center rounded-full border border-forest-500 bg-forest-900 text-sm font-bold tabular-nums">
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="mt-1.5 leading-relaxed text-sage-300">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="raised">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionIntro title="How each trade is placed" />
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-sage-300">
              <p>
                Every trade starts with an entry price, a stop loss and usually a take-profit target. A trade
                without a stop loss is rejected before it reaches any account.
              </p>
              <p>
                Your terminal works out the position size from your account capital and the distance to the
                stop loss. A trade with a wider stop gets a smaller position, so each trade puts a similar share
                of your capital at risk.
              </p>
              <p>
                When we change or close a trade, the same change is applied to the copy in your account.
              </p>
            </div>
          </div>
          <div>
            <SectionIntro title="What you control" />
            <dl className="mt-6 divide-y divide-forest-600 border-y border-forest-600">
              {CONTROLS.map((control) => (
                <div key={control.title} className="py-4">
                  <dt className="font-bold">{control.title}</dt>
                  <dd className="mt-1 leading-relaxed text-sage-300">{control.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <SecurityBand />

      <Section>
        <SectionIntro title="What copy trading can't do">
          <p>Worth knowing before you connect a real account.</p>
        </SectionIntro>
        <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {LIMITS.map((limit) => (
            <div key={limit.title}>
              <h3 className="text-lg font-bold">{limit.title}</h3>
              <p className="mt-1.5 leading-relaxed text-sage-300">{limit.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="raised">
        <BrokerCallout siteConfig={siteConfig} />
      </Section>

      <FinalCta location="how_final" />
    </>
  );
}
