import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { NotFoundContent } from "./components/site/NotFoundContent";
import { getSiteConfig } from "./lib/seo";
import { getSiteChrome } from "./lib/siteChrome";

/** Unmatched URLs render outside the (site) layout, so the chrome is added here. */
export default async function NotFound() {
  const siteConfig = await getSiteConfig();
  const chrome = await getSiteChrome(siteConfig);
  return (
    <>
      <Header brandName={siteConfig.brand_name} nav={chrome.nav} />
      <main id="main-content">
        <NotFoundContent />
      </main>
      <Footer siteConfig={siteConfig} chrome={chrome} />
    </>
  );
}
