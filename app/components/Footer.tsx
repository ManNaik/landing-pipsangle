import Link from "next/link";
import type { SiteConfig } from "../lib/types";

type FooterProps = {
  siteConfig: SiteConfig;
};

export function Footer({ siteConfig }: FooterProps) {
  const footerLinks = siteConfig.footer_links;
  const brandName = siteConfig.brand_name;

  return (
    <footer className="border-t border-zinc-800 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl min-w-0">
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="text-base font-bold text-white sm:text-lg inline-block py-1">
              {brandName}
            </Link>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {footerLinks.company.map((l) => (
                <li key={l.name}>
                  <Link href={l.url} className="hover:text-white py-1 inline-block min-h-[2.25rem] flex items-center">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {footerLinks.product.map((l) => (
                <li key={l.name}>
                  <Link href={l.url} className="hover:text-white py-1 inline-block min-h-[2.25rem] flex items-center">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Resources
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {footerLinks.resources.map((l) => (
                <li key={l.name}>
                  <Link href={l.url} className="hover:text-white py-1 inline-block min-h-[2.25rem] flex items-center">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Legal
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {footerLinks.legal.map((l) => (
                <li key={l.name}>
                  <Link href={l.url} className="hover:text-white py-1 inline-block min-h-[2.25rem] flex items-center">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-xs text-zinc-500 sm:mt-12">
          {siteConfig.risk_disclaimer}
        </p>
      </div>
    </footer>
  );
}
