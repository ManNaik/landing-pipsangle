"use client";

import { useEffect, useState } from "react";
import { apiGetClient } from "./api";
import { mergePricingTiers, PRICING_TIERS, type PricingTier } from "./pricing";
import type { ListResponse, PricingPlan } from "./types";

let cache: PricingTier[] | null = null;
let inflight: Promise<PricingTier[]> | null = null;

function loadTiers(): Promise<PricingTier[]> {
  if (cache) return Promise.resolve(cache);
  inflight ??= apiGetClient<ListResponse<PricingPlan>>("/pricing/plans/")
    .then((data) => {
      cache = mergePricingTiers((data.results ?? []).filter((plan) => plan.is_active));
      return cache;
    })
    .catch(() => {
      inflight = null;
      return PRICING_TIERS;
    });
  return inflight;
}

/** Live plan prices from the API (what PayPal charges), with local defaults until loaded. */
export function usePricingTiers(): PricingTier[] {
  const [tiers, setTiers] = useState<PricingTier[]>(cache ?? PRICING_TIERS);
  useEffect(() => {
    let active = true;
    void loadTiers().then((next) => {
      if (active) setTiers(next);
    });
    return () => {
      active = false;
    };
  }, []);
  return tiers;
}
