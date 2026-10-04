type EventParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtag(): (...args: unknown[]) => void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    // Same queue shim as Google's snippet, so early events are replayed once gtag.js loads.
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  return window.gtag;
}

/** Send a GA4 event. Consent Mode decides what Google may store. */
export function track(event: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
  ensureGtag()("event", event, clean);
}

export function trackCtaClick(location: string, label = "start_free_trial"): void {
  track("cta_click", { location, label });
}

/** Send an event once per browser for a given key, e.g. the first verified connection. */
export function trackOnce(key: string, event: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const storageKey = `pipsangel_tracked_${key}`;
  try {
    if (window.localStorage.getItem(storageKey)) return;
    window.localStorage.setItem(storageKey, "1");
  } catch {
    // Without storage the event may repeat; that's acceptable.
  }
  track(event, params);
}
