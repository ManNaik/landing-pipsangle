import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { safeApiGet } from "../lib/api";
import type { SiteConfig } from "../lib/types";

const defaultSiteConfig: SiteConfig = {
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
    { name: "Signals", url: "/forex-signals" },
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
      { name: "Careers", url: "/careers" },
    ],
    product: [
      { name: "Signals", url: "/forex-signals" },
      { name: "Automation", url: "/automated-forex-trading" },
      { name: "Pricing", url: "/pricing" },
    ],
    resources: [
      { name: "News", url: "/news" },
      { name: "FAQ", url: "/faq" },
      { name: "Blog", url: "/blog" },
      { name: "Guides", url: "/blog" },
    ],
    legal: [
      { name: "Terms", url: "/terms" },
      { name: "Privacy Policy", url: "/privacy" },
    ],
  },
  header_cta_label: "Start Trading",
  header_cta_action: "open_login",
};

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await safeApiGet<SiteConfig>("/site-config/", 3600);
  const siteConfig = config ?? defaultSiteConfig;

  return (
    <>
      <Header siteConfig={siteConfig} />
      <main id="main-content">{children}</main>
      <Footer siteConfig={siteConfig} />
    </>
  );
}
