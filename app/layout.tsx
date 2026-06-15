import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "./components/Analytics";
import { safeApiGet } from "./lib/api";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  jsonLdScript,
  resolveSiteUrl,
} from "./lib/seo";
import type { SiteConfig } from "./lib/types";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  navigation: [],
  footer_links: { company: [], product: [], resources: [], legal: [] },
  header_cta_label: "Login",
  header_cta_action: "open_login",
};

export async function generateMetadata(): Promise<Metadata> {
  const config = await safeApiGet<SiteConfig>("/site-config/", 3600);
  const c = config ?? defaultSiteConfig;
  const siteUrl = resolveSiteUrl(c);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: c.default_title,
      template: c.title_template,
    },
    description: c.default_description,
    keywords: c.keywords,
    openGraph: {
      title: c.default_title,
      description: c.default_description,
      type: "website",
      url: "/",
      siteName: c.brand_name,
    },
    twitter: {
      card: "summary_large_image",
      title: c.default_title,
      description: c.default_description,
    },
    robots: { index: true, follow: true },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? {
          verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          },
        }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await safeApiGet<SiteConfig>("/site-config/", 3600);
  const siteConfig = config ?? defaultSiteConfig;
  const siteUrl = resolveSiteUrl(siteConfig);
  const brandName = siteConfig.brand_name;

  const orgSchema = buildOrganizationSchema(siteUrl, brandName);
  const webSiteSchema = buildWebSiteSchema(siteUrl, brandName);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 text-zinc-100 antialiased overflow-x-hidden min-w-0`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript([orgSchema, webSiteSchema]),
          }}
        />
        <Analytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
