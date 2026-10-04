import Link from "next/link";
import { IC_MARKETS_GUIDE_PATH } from "../../lib/siteChrome";
import type { SiteConfig } from "../../lib/types";

/** Most visitors don't have an IC Markets account yet; give them the next step. */
export function BrokerCallout({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-forest-600 bg-forest-850 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="max-w-xl">
        <h2 className="text-xl font-bold">No IC Markets account yet?</h2>
        <p className="mt-2 leading-relaxed text-sage-300">
          PipsAngel works with live IC Markets accounts on MetaTrader 5. Opening one is done on the IC Markets
          website and includes an identity check. Our guide walks through it and shows where to find the
          details you&apos;ll need.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-sage-500">
          {siteConfig.broker_affiliate_disclosure || "PipsAngel is independent of IC Markets."}
        </p>
      </div>
      <Link
        href={IC_MARKETS_GUIDE_PATH}
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-forest-500 px-5 font-semibold text-paper hover:border-sage-500 hover:bg-forest-800"
      >
        How to open an account
      </Link>
    </div>
  );
}
