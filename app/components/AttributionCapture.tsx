"use client";

import { useEffect } from "react";
import { captureAttribution } from "../lib/attribution";
import { CONSENT_CHANGE_EVENT } from "../lib/consent";

/** Records where the visit came from so signups and messages can be attributed. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
    window.addEventListener(CONSENT_CHANGE_EVENT, captureAttribution);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, captureAttribution);
  }, []);
  return null;
}
