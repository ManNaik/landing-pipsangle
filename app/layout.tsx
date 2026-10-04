import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "./globals.css";
import { Analytics } from "./components/Analytics";
import { AnalyticsGate } from "./components/AnalyticsGate";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "./lib/seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
  themeColor: "#0a0a0a",
};

const brandFont = Schibsted_Grotesk({
  variable: "--font-brand",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const siteUrl = resolveSiteUrl(config);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${config.brand_name}: ${config.default_title}`,
      template: config.title_template,
    },
    description: config.default_description,
    keywords: config.keywords,
    applicationName: config.brand_name,
    openGraph: {
      title: `${config.brand_name}: ${config.default_title}`,
      description: config.default_description,
      type: "website",
      url: "/",
      siteName: config.brand_name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.brand_name}: ${config.default_title}`,
      description: config.default_description,
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
  const config = await getSiteConfig();
  const siteUrl = resolveSiteUrl(config);

  return (
    <html lang="en" className={brandFont.variable}>
      <body className="min-h-screen min-w-0 overflow-x-clip bg-forest-900 font-sans text-paper antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript([
              buildOrganizationSchema(siteUrl, config),
              buildWebSiteSchema(siteUrl, config.brand_name),
            ]),
          }}
        />
        <AnalyticsGate>
          <Analytics />
        </AnalyticsGate>

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[300] focus:rounded-md focus:bg-mint-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
