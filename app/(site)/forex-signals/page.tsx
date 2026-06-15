import Link from "next/link";
import { safeApiGet } from "../../lib/api";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  buildServiceSchema,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import type { ContentBlock, ListResponse, Signal } from "../../lib/types";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Professional Forex Trading Signals | Daily Entry, SL & TP",
    description:
      "Receive daily professional forex trading signals with clear entry price, stop loss, and take profit levels. Transparent performance history from PipAngel.",
    path: "/forex-signals",
    keywords: [
      "forex trading signals",
      "professional forex signals",
      "daily forex signals",
      "forex signal provider",
      "forex entry stop loss take profit",
    ],
  });
}

export default async function ForexSignalsPage() {
  const [signalsData, pageBlock, siteConfig] = await Promise.all([
    safeApiGet<ListResponse<Signal>>("/signals/?limit=10", 60),
    safeApiGet<ContentBlock>("/content/blocks/forex_signals.page/", 3600),
    getSiteConfig(),
  ]);

  const signals = signalsData?.results ?? [];
  const features = (pageBlock?.metadata?.features ?? []) as string[];
  const siteUrl = resolveSiteUrl(siteConfig);
  const brandName = siteConfig?.brand_name ?? "PipAngel";
  const title = pageBlock?.title ?? "Professional Forex Trading Signals";
  const subtitle =
    pageBlock?.subtitle ??
    "Daily trade setups with clear entry, stop loss and take profit.";

  const serviceSchema = buildServiceSchema(siteUrl, brandName, {
    name: title,
    description: subtitle,
    path: "/forex-signals",
    serviceType: "Forex Trading Signals",
  });
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Forex Signals", path: "/forex-signals" },
  ]);

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([serviceSchema, breadcrumbSchema]),
        }}
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
              Get Signals
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">
            How PipAngel Forex Signals Work
          </h2>
          <div className="mt-4 space-y-4 text-sm text-zinc-400 sm:text-base">
            <p>
              PipAngel delivers professional forex trading signals with a complete trade setup:
              currency pair, direction (buy or sell), entry price, stop loss, and take profit.
              Each signal is generated using technical indicators and algorithmic market analysis,
              then published in real time so you can act quickly.
            </p>
            <p>
              Signals work with manual trading on any major forex broker, or you can upgrade to
              automation and let our system execute trades via MetaTrader 4 or MetaTrader 5.
              Review our{" "}
              <Link href="/trading-performance" className="text-emerald-400 hover:text-emerald-300">
                published performance
              </Link>{" "}
              before subscribing.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            What You Get
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
        <div className="mx-auto max-w-4xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl">
            Example Signals
          </h2>
          <div className="mt-6 overflow-x-auto sm:mt-10">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500">
                  <th className="pb-3 pr-4 font-medium">Pair</th>
                  <th className="pb-3 pr-4 font-medium">Direction</th>
                  <th className="pb-3 pr-4 font-medium">Entry</th>
                  <th className="pb-3 pr-4 font-medium">SL</th>
                  <th className="pb-3 font-medium">TP</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((s) => (
                  <tr key={s.id} className="border-b border-zinc-800/50 text-zinc-300">
                    <td className="py-3 pr-4 font-medium text-white">{s.pair}</td>
                    <td className="py-3 pr-4">{s.direction}</td>
                    <td className="py-3 pr-4">{s.entry}</td>
                    <td className="py-3 pr-4">{s.stop_loss}</td>
                    <td className="py-3">{s.take_profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Link
            href="/pricing"
            className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-lg border border-zinc-600 px-6 py-3.5 text-base font-medium text-white transition hover:bg-zinc-800 sm:w-auto"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
