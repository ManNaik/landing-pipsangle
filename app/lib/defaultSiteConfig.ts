import type { NavLink, SiteConfig } from "./types";

/** Strip retired /forex-signals nav entries from CMS or cached API payloads. */
export function isRetiredSignalsNavItem(item: NavLink): boolean {
  const name = item.name.trim().toLowerCase();
  const url = item.url.trim().toLowerCase();
  if (name === "signals") return true;
  return (
    url === "/forex-signals" ||
    url.startsWith("/forex-signals/") ||
    url === "/#forex-signals" ||
    url === "#forex-signals"
  );
}

export function isRetiredNavItem(item: NavLink): boolean {
  return isRetiredSignalsNavItem(item) || isRetiredCareersNavItem(item);
}

export function isRetiredCareersNavItem(item: NavLink): boolean {
  const name = item.name.trim().toLowerCase();
  const url = item.url.trim().toLowerCase();
  if (name === "careers") return true;
  return url === "/careers" || url.startsWith("/careers/");
}

export function sanitizeSiteConfig(config: SiteConfig): SiteConfig {
  const filterNav = (items: NavLink[] | undefined) =>
    (items ?? []).filter((item) => !isRetiredNavItem(item));

  return {
    ...config,
    navigation: filterNav(config.navigation),
    footer_links: {
      company: filterNav(config.footer_links?.company),
      product: filterNav(config.footer_links?.product),
      resources: filterNav(config.footer_links?.resources),
      legal: filterNav(config.footer_links?.legal),
    },
  };
}

export const defaultSiteConfig: SiteConfig = {
  brand_name: "PipAngel",
  site_url: "https://pipangel.com",
  default_title: "Forex Signals & Automated Trading Platform",
  title_template: "%s | PipAngel",
  default_description:
    "Professional forex signals and automated trading platform with transparent performance and risk management.",
  keywords: [
    "forex signals",
    "forex trading automation",
    "forex trading bot",
    "automated forex trading",
    "forex copy trading",
  ],
  risk_disclaimer:
    "Trading forex involves substantial risk and may not be suitable for all investors. Past performance does not guarantee future results.",
  navigation: [
    { name: "Home", url: "/" },
    { name: "Automation", url: "/automated-forex-trading" },
    { name: "Performance", url: "/trading-performance" },
    { name: "Pricing", url: "/pricing" },
    { name: "News", url: "/news" },
    { name: "Blog", url: "/blog" },
    { name: "FAQ", url: "/faq" },
  ],
  footer_links: {
    company: [
      { name: "About", url: "/about" },
      { name: "Contact", url: "/contact" },
    ],
    product: [
      { name: "Automation", url: "/automated-forex-trading" },
      { name: "Pricing", url: "/pricing" },
    ],
    resources: [
      { name: "News", url: "/news" },
      { name: "Blog", url: "/blog" },
      { name: "Performance", url: "/trading-performance" },
      { name: "FAQ", url: "/faq" },
    ],
    legal: [
      { name: "Terms", url: "/terms" },
      { name: "Privacy Policy", url: "/privacy" },
    ],
  },
  header_cta_label: "Start Trading",
  header_cta_action: "open_login",
};
