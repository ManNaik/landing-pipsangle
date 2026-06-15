import Link from "next/link";
import { safeApiGet } from "../../lib/api";
import {
  buildBreadcrumbSchema,
  buildHowToSchema,
  buildPageMetadataFromConfig,
  buildServiceSchema,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import type { ContentBlock } from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Automated Forex Trading System | MT4 & MT5",
    description:
      "Automate your forex trading with PipAngel. Connect MetaTrader 4 or 5 and let our system execute signals with built-in risk management.",
    path: "/automated-forex-trading",
    keywords: [
      "automated forex trading",
      "forex trading automation",
      "forex trading bot",
      "MT4 automation",
      "MT5 automated trading",
    ],
  });
}

export default async function AutomatedForexTradingPage() {
  const [pageBlock, siteConfig] = await Promise.all([
    safeApiGet<ContentBlock>("/content/blocks/automation.page/", 3600),
    getSiteConfig(),
  ]);

  const features = (pageBlock?.metadata?.features ?? []) as string[];
  const workflow = (pageBlock?.metadata?.workflow_steps ?? []) as string[];
  const siteUrl = resolveSiteUrl(siteConfig);
  const brandName = siteConfig?.brand_name ?? "PipAngel";
  const title = pageBlock?.title ?? "Automated Forex Trading System";
  const subtitle =
    pageBlock?.subtitle ??
    "Let our system execute trades automatically with strict risk management.";

  const serviceSchema = buildServiceSchema(siteUrl, brandName, {
    name: title,
    description: subtitle,
    path: "/automated-forex-trading",
    serviceType: "Automated Forex Trading",
  });
  const howToSchema =
    workflow.length > 0
      ? buildHowToSchema(siteUrl, {
          name: "How PipAngel Forex Automation Works",
          description:
            "Step-by-step process for automated forex trade execution via MetaTrader.",
          path: "/automated-forex-trading",
          steps: workflow,
        })
      : null;
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Automated Trading", path: "/automated-forex-trading" },
  ]);

  const schemas: Record<string, unknown>[] = [serviceSchema, breadcrumbSchema];
  if (howToSchema) schemas.unshift(howToSchema);

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(schemas) }}
      />
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            {subtitle}
          </p>
          <div className="mt-8 sm:mt-10">
            <Link
              href="/signup"
              className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-medium text-white transition hover:bg-emerald-600 sm:w-auto"
            >
              Start Automation
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            Broker Compatibility & Risk Controls
          </h2>
          <div className="mt-4 space-y-4 text-sm text-zinc-400 sm:text-base">
            <p>
              PipAngel automation connects to your forex broker via MetaTrader 4 or MetaTrader 5.
              Once connected, the system receives signals, applies position sizing and drawdown
              limits, and executes trades with mandatory stop loss protection on every order.
            </p>
            <p>
              You can pause or disable automation at any time from your dashboard. See our{" "}
              <Link href="/faq" className="text-emerald-400 hover:text-emerald-300">
                FAQ
              </Link>{" "}
              for common questions about safety and broker support.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            Automation Features
          </h2>
          <ul className="mt-6 grid gap-3 sm:mt-10 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="text-zinc-300 text-sm sm:text-base">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            How It Works
          </h2>
          <ol className="mt-6 space-y-3 sm:mt-10 sm:space-y-4">
            {workflow.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 sm:gap-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-base font-bold text-emerald-400 sm:h-10 sm:w-10 sm:text-lg">
                  {i + 1}
                </span>
                <span className="text-zinc-300 text-sm sm:text-base">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Link
            href="/pricing"
            className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-medium text-white transition hover:bg-emerald-600 sm:w-auto"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
