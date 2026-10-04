import Link from "next/link";
import type { SiteChrome } from "../lib/siteChrome";
import { HOW_IT_WORKS_PATH, IC_MARKETS_GUIDE_PATH } from "../lib/siteChrome";
import type { SiteConfig } from "../lib/types";

type FooterProps = {
  siteConfig: SiteConfig;
  chrome: SiteChrome;
};

type FooterLink = { name: string; href: string };

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-paper">{title}</h2>
      <ul className="mt-3 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="inline-block py-1.5 text-sm text-sage-400 hover:text-paper">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ siteConfig, chrome }: FooterProps) {
  const product: FooterLink[] = [
    { name: "How it works", href: HOW_IT_WORKS_PATH },
    { name: "Pricing", href: "/pricing" },
    { name: "Security", href: "/security" },
    ...(chrome.showResults ? [{ name: "Results", href: "/trading-performance" }] : []),
    { name: "Open an IC Markets account", href: IC_MARKETS_GUIDE_PATH },
  ];
  const help: FooterLink[] = [
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
    ...(chrome.showBlog ? [{ name: "Blog", href: "/blog" }] : []),
    ...(chrome.showNews ? [{ name: chrome.newsLabel, href: "/news" }] : []),
  ];
  const company: FooterLink[] = [
    { name: "About", href: "/about" },
    { name: "Terms of service", href: "/terms" },
    { name: "Privacy policy", href: "/privacy" },
  ];

  const identity = [
    siteConfig.legal_name,
    siteConfig.registration_number ? `Registration no. ${siteConfig.registration_number}` : "",
    siteConfig.registered_address,
  ].filter(Boolean);

  const channels = [
    ...(siteConfig.whatsapp_url ? [{ name: "WhatsApp", url: siteConfig.whatsapp_url }] : []),
    ...(siteConfig.telegram_url ? [{ name: "Telegram", url: siteConfig.telegram_url }] : []),
    ...(siteConfig.social_links ?? []),
  ];

  return (
    <footer className="border-t border-forest-700 bg-forest-950 px-5 pb-10 pt-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(3,minmax(0,1fr))]">
          <div className="max-w-sm">
            <Link href="/" aria-label={`${siteConfig.brand_name} home`} className="inline-flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/pipsangel-logo.png"
                alt={siteConfig.brand_name}
                width={518}
                height={108}
                loading="lazy"
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-sage-400">
              Copies trades to your own IC Markets MetaTrader 5 account. Every trade has a stop loss, and your
              money stays with IC Markets.
            </p>
            <p className="mt-4 text-sm text-sage-300">
              <a href={`mailto:${siteConfig.support_email}`} className="font-semibold hover:text-paper">
                {siteConfig.support_email}
              </a>
              {siteConfig.support_hours ? (
                <span className="mt-1 block text-sage-500">Support hours: {siteConfig.support_hours}</span>
              ) : null}
            </p>
            {channels.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {channels.map((channel) => (
                  <li key={channel.url}>
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sage-400 underline underline-offset-4 hover:text-paper"
                    >
                      {channel.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <FooterColumn title="Product" links={product} />
          <FooterColumn title="Help" links={help} />
          <FooterColumn title="Company" links={company} />
        </div>

        <div className="mt-12 border-t border-forest-700 pt-8 text-xs leading-relaxed text-sage-500">
          <p className="max-w-4xl">{siteConfig.risk_disclaimer}</p>
          {identity.length > 0 ? <p className="mt-3 max-w-4xl text-sage-400">{identity.join(", ")}</p> : null}
          <p className="mt-3">
            © {new Date().getFullYear()} {siteConfig.legal_name || siteConfig.brand_name}
          </p>
        </div>
      </div>
    </footer>
  );
}
