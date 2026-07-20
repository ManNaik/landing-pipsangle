export type ReferralEntry = {
  id: string;
  referredName: string;
  pipCoinsEarned: number;
  referredAt: string;
};

export type ReferralProgram = {
  referralCode: string;
  referralLink: string;
  completedReferrals: number;
  targetReferrals: number;
  bonusAmount: number;
  pipCoinsBalance: number;
  pipCoinsPerReferral: number;
  recentReferrals: ReferralEntry[];
};

export const DEMO_REFERRAL_PROGRAM: ReferralProgram = {
  referralCode: "DEMO123",
  referralLink: "https://pipangel.com/ref/DEMO123",
  completedReferrals: 3,
  targetReferrals: 5,
  bonusAmount: 20,
  pipCoinsBalance: 450,
  pipCoinsPerReferral: 150,
  recentReferrals: [
    {
      id: "ref-001",
      referredName: "Alex M.",
      pipCoinsEarned: 150,
      referredAt: "2026-06-28T14:22:00Z",
    },
    {
      id: "ref-002",
      referredName: "Sarah K.",
      pipCoinsEarned: 150,
      referredAt: "2026-06-20T09:10:00Z",
    },
    {
      id: "ref-003",
      referredName: "James T.",
      pipCoinsEarned: 150,
      referredAt: "2026-06-12T18:45:00Z",
    },
  ],
};
