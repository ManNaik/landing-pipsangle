import { DEMO_REFERRAL_PROGRAM } from "./referralData";

export const PIP_COINS_STORAGE_KEY = "pipangel-pip-coins-balance";
export const CLAIM_HISTORY_STORAGE_KEY = "pipangel-store-claim-history";

export type ClaimedReward = {
  id: string;
  rewardId: string;
  rewardName: string;
  category: "coupon" | "extension";
  cost: number;
  claimedAt: string;
  couponCode?: string;
  extensionDays?: number;
};

export function getDefaultPipCoinsBalance(): number {
  return DEMO_REFERRAL_PROGRAM.pipCoinsBalance;
}

export function loadPipCoinsBalance(): number {
  if (typeof window === "undefined") return getDefaultPipCoinsBalance();

  try {
    const raw = localStorage.getItem(PIP_COINS_STORAGE_KEY);
    if (raw === null) return getDefaultPipCoinsBalance();
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : getDefaultPipCoinsBalance();
  } catch {
    return getDefaultPipCoinsBalance();
  }
}

export function savePipCoinsBalance(balance: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PIP_COINS_STORAGE_KEY, String(Math.max(0, balance)));
}

export function deductPipCoins(amount: number): number {
  const current = loadPipCoinsBalance();
  const next = Math.max(0, current - amount);
  savePipCoinsBalance(next);
  return next;
}

export function loadClaimHistory(): ClaimedReward[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CLAIM_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ClaimedReward[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveClaimHistory(history: ClaimedReward[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLAIM_HISTORY_STORAGE_KEY, JSON.stringify(history));
}

export function addClaimedReward(entry: ClaimedReward): ClaimedReward[] {
  const history = [entry, ...loadClaimHistory()];
  saveClaimHistory(history);
  return history;
}
