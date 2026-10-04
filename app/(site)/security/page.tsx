import Link from "next/link";
import { FinalCta } from "../../components/site/FinalCta";
import { CheckIcon, CrossIcon, PageHero, Section, SectionIntro } from "../../components/site/ui";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Security: your MT5 account and your money",
    description:
      "What PipsAngel receives when you connect IC Markets MT5, how your password is handled, what the login can and can't do, and how to revoke access.",
    path: "/security",
  });
}

const PASSWORD_STEPS = [
  {
    title: "You enter it on our website",
    body: "The connection form is served over HTTPS. We don't store it in your browser.",
  },
  {
    title: "Our website passes it on once",
    body: "It's sent a single time to our trading servers over a signed server-to-server connection. Our website doesn't store it or write it to logs.",
  },
  {
    title: "Our trading servers keep it encrypted",
    body: "It's stored encrypted and used only to log your MT5 terminal in to IC Markets. It's never returned by any of our systems or written to logs.",
  },
  {
    title: "It's deleted when you leave",
    body: "When your connection is released, the stored password is deleted along with your terminal.",
  },
];

const CAN = [
  "Open trades, each with a stop loss",
  "Change stop losses and targets, and close trades",
  "Read your balance and trade history",
];

const CANNOT = [
  "Withdraw, deposit or transfer money",
  "Change your IC Markets profile or payment details",
  "Log in to the IC Markets client area",
];

export default async function SecurityPage() {
  const siteConfig = await getSiteConfig();
  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Security", path: "/security" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }} />

      <PageHero title="Your account and your money">
        <p>
          To copy trades we need your IC Markets MT5 login. This page explains exactly what that allows, how
          the password is protected, and how to take access away again.
        </p>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionIntro title="What we ask for, and why" />
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-sage-300">
              <p>
                Your MT5 <strong className="text-paper">login number</strong>,{" "}
                <strong className="text-paper">server name</strong> and{" "}
                <strong className="text-paper">password</strong>. The MT5 terminal we run for you needs all
                three to log in to your account and place trades.
              </p>
              <p>
                It has to be your main MT5 password. An investor (read-only) password can&apos;t place trades,
                so copying wouldn&apos;t work.
              </p>
              <p>
                We never ask for your IC Markets client-area password, your email password, or your card or bank
                details. If anyone claiming to be PipsAngel asks for them, don&apos;t share them and tell us.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <h3 className="text-lg font-bold">The MT5 login can</h3>
              <ul className="mt-4 space-y-3">
                {CAN.map((item) => (
                  <li key={item} className="flex gap-3 text-sage-200">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-mint-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">It can&apos;t</h3>
              <ul className="mt-4 space-y-3">
                {CANNOT.map((item) => (
                  <li key={item} className="flex gap-3 text-sage-200">
                    <CrossIcon className="mt-0.5 h-5 w-5 shrink-0 text-coral-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-sage-400">
                Money can only be moved from the IC Markets client area, which uses a separate login.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="deep">
        <SectionIntro title="How your MT5 password is handled" />
        <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {PASSWORD_STEPS.map((step, index) => (
            <li key={step.title} className="border-t-2 border-mint-500/60 pt-5">
              <span className="text-sm font-bold tabular-nums text-mint-400">Step {index + 1}</span>
              <h3 className="mt-1 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-sage-300">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionIntro title="Stopping and revoking access" />
            <dl className="mt-6 divide-y divide-forest-600 border-y border-forest-600">
              <div className="py-4">
                <dt className="font-bold">Pause copying</dt>
                <dd className="mt-1 leading-relaxed text-sage-300">
                  Switch copying off in your dashboard. No new trades are sent to your account. Trades already
                  open are still managed, and you can close them yourself in MT5.
                </dd>
              </div>
              <div className="py-4">
                <dt className="font-bold">Cut access completely</dt>
                <dd className="mt-1 leading-relaxed text-sage-300">
                  Change your MT5 password in the IC Markets client area. Our terminal can no longer log in.
                </dd>
              </div>
              <div className="py-4">
                <dt className="font-bold">Remove your connection</dt>
                <dd className="mt-1 leading-relaxed text-sage-300">
                  Email{" "}
                  <a href={`mailto:${siteConfig.support_email}`} className="font-semibold text-mint-400 underline underline-offset-4">
                    {siteConfig.support_email}
                  </a>{" "}
                  from your account email and we&apos;ll release your terminal and delete the stored password.
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <SectionIntro title="Payments and personal data" />
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-sage-300">
              <p>
                Payments go through PayPal. We receive confirmation that a payment was made, never your card or
                bank details.
              </p>
              <p>
                Your PipsAngel login uses its own password, which we store only as a one-way hash. The{" "}
                <Link href="/privacy" className="font-semibold text-mint-400 underline underline-offset-4">
                  privacy policy
                </Link>{" "}
                lists everything we collect and how long we keep it.
              </p>
              <p>
                Found a security problem? Email {siteConfig.support_email} and we&apos;ll respond as a priority.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <FinalCta location="security_final" />
    </>
  );
}
