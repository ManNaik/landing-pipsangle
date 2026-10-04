import Script from "next/script";

const GA_MEASUREMENT_ID = "G-2X3VTFF543";

/**
 * Google Consent Mode v2: everything starts denied and CookieHub's callbacks
 * grant storage per category. gtag.js itself loads so consent-less pings work.
 */
const CONSENT_BOOTSTRAP = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('js', new Date());
  gtag('config', '${GA_MEASUREMENT_ID}');
`;

const COOKIEHUB_INIT = `
  (function () {
    var state = window.__pipsangelConsent || { analytics: false, marketing: false };
    window.__pipsangelConsent = state;

    function apply(category, granted) {
      var value = granted ? 'granted' : 'denied';
      if (category === 'analytics') {
        state.analytics = granted;
        window.gtag && window.gtag('consent', 'update', { analytics_storage: value });
      }
      if (category === 'marketing') {
        state.marketing = granted;
        window.gtag && window.gtag('consent', 'update', {
          ad_storage: value,
          ad_user_data: value,
          ad_personalization: value
        });
      }
      window.dispatchEvent(new Event('pipsangel:consent-change'));
    }

    function load() {
      if (!window.cookiehub) return;
      window.cookiehub.load({
        onInitialise: function () {
          ['analytics', 'marketing'].forEach(function (category) {
            if (window.cookiehub.hasConsented && window.cookiehub.hasConsented(category)) apply(category, true);
          });
        },
        onAllow: function (category) { apply(category, true); },
        onRevoke: function (category) { apply(category, false); }
      });
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.cookiehub.eu/c2/1a0a0b8e.js';
    script.async = true;
    script.onload = load;
    document.head.appendChild(script);
  })();
`;

export function Analytics() {
  return (
    <>
      <Script id="consent-bootstrap" strategy="beforeInteractive">
        {CONSENT_BOOTSTRAP}
      </Script>
      <Script id="cookiehub-init" strategy="afterInteractive">
        {COOKIEHUB_INIT}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
