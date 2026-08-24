import Script from "next/script";

const GA_MEASUREMENT_ID = "G-2X3VTFF543";

export function Analytics() {
  return (
    <>
      <Script
        src="https://cdn.cookiehub.eu/c2/1a0a0b8e.js"
        strategy="beforeInteractive"
      />
      <Script id="cookiehub-init" strategy="afterInteractive">
        {`
          (function () {
            function loadCookieHub() {
              if (!window.cookiehub) return;
              var cpm = {};
              window.cookiehub.load(cpm);
            }
            if (document.readyState === "loading") {
              document.addEventListener("DOMContentLoaded", loadCookieHub);
            } else {
              loadCookieHub();
            }
          })();
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
