export const CONSENT_CHANGE_EVENT = "pipsangel:consent-change";

export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
};

declare global {
  interface Window {
    __pipsangelConsent?: ConsentState;
  }
}

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return { analytics: false, marketing: false };
  return window.__pipsangelConsent ?? { analytics: false, marketing: false };
}

export function hasAnalyticsConsent(): boolean {
  return getConsent().analytics;
}
