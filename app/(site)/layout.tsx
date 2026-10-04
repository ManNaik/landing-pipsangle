import { AttributionCapture } from "../components/AttributionCapture";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { SupportWidget } from "../components/SupportWidget";
import { getSiteConfig } from "../lib/seo";
import { getSiteChrome } from "../lib/siteChrome";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteConfig();
  const chrome = await getSiteChrome(siteConfig);

  return (
    <>
      <AttributionCapture />
      <Header brandName={siteConfig.brand_name} nav={chrome.nav} />
      <main id="main-content" className="min-w-0">
        {children}
      </main>
      <Footer siteConfig={siteConfig} chrome={chrome} />
      <SupportWidget
        supportEmail={siteConfig.support_email ?? ""}
        responseTime={siteConfig.support_response_time}
        whatsappUrl={siteConfig.whatsapp_url}
        telegramUrl={siteConfig.telegram_url}
      />
    </>
  );
}
