import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { safeApiGet } from "../lib/api";
import { defaultSiteConfig } from "../lib/defaultSiteConfig";
import type { SiteConfig } from "../lib/types";

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
