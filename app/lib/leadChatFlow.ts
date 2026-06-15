export type LeadInterest = "signals" | "automation" | "both" | "exploring";
export type LeadExperience = "beginner" | "intermediate" | "experienced";
export type LeadPlanInterest = "starter" | "premium" | "unsure";

export type LeadChatStep =
  | "welcome"
  | "interest"
  | "experience"
  | "plan"
  | "capture"
  | "success";

export type LeadChatAnswers = {
  interest?: LeadInterest;
  experience?: LeadExperience;
  plan_interest?: LeadPlanInterest;
};

export type LeadChatButton = {
  label: string;
  value?: string;
  action?: "dismiss" | "next";
};

export type LeadChatStepConfig = {
  id: LeadChatStep;
  message: string;
  buttons?: LeadChatButton[];
};

export const LEAD_CHAT_STEPS: Record<
  Exclude<LeadChatStep, "capture" | "success">,
  LeadChatStepConfig
> = {
  welcome: {
    id: "welcome",
    message: "Hi! I can help you find the right PipAngel plan.",
    buttons: [
      { label: "Get started", action: "next" },
      { label: "Maybe later", action: "dismiss" },
    ],
  },
  interest: {
    id: "interest",
    message: "What are you most interested in?",
    buttons: [
      { label: "Forex signals", value: "signals", action: "next" },
      { label: "Automation", value: "automation", action: "next" },
      { label: "Both", value: "both", action: "next" },
      { label: "Just exploring", value: "exploring", action: "next" },
    ],
  },
  experience: {
    id: "experience",
    message: "How much trading experience do you have?",
    buttons: [
      { label: "New to forex", value: "beginner", action: "next" },
      { label: "Some experience", value: "intermediate", action: "next" },
      { label: "Experienced trader", value: "experienced", action: "next" },
    ],
  },
  plan: {
    id: "plan",
    message: "Which plan sounds closest?",
    buttons: [
      { label: "Starter ($29/mo)", value: "starter", action: "next" },
      { label: "Premium ($99/mo)", value: "premium", action: "next" },
      { label: "Not sure yet", value: "unsure", action: "next" },
    ],
  },
};

export const LEAD_CAPTURE_MESSAGE =
  "Share your details and we'll follow up with the best next step for you.";

export const LEAD_SUCCESS_MESSAGE =
  "Thanks! Your details are saved. A member of our team will be in touch soon.";

export const SESSION_SEEN_KEY = "pipangel-lead-chat-seen";
export const SESSION_DONE_KEY = "pipangel-lead-chat-done";
export const AUTO_OPEN_DELAY_MS = 5000;

export function getSignupUrl(plan?: LeadPlanInterest): string {
  if (plan === "starter") return "/signup?plan=starter";
  if (plan === "premium") return "/signup?plan=premium";
  return "/signup";
}

export function getInterestLabel(value: LeadInterest): string {
  const map: Record<LeadInterest, string> = {
    signals: "Forex signals",
    automation: "Automation",
    both: "Both",
    exploring: "Just exploring",
  };
  return map[value];
}

export function getExperienceLabel(value: LeadExperience): string {
  const map: Record<LeadExperience, string> = {
    beginner: "New to forex",
    intermediate: "Some experience",
    experienced: "Experienced trader",
  };
  return map[value];
}

export function getPlanLabel(value: LeadPlanInterest): string {
  const map: Record<LeadPlanInterest, string> = {
    starter: "Starter ($29/mo)",
    premium: "Premium ($99/mo)",
    unsure: "Not sure yet",
  };
  return map[value];
}

export function getNextStep(current: LeadChatStep): LeadChatStep | null {
  const order: LeadChatStep[] = [
    "welcome",
    "interest",
    "experience",
    "plan",
    "capture",
    "success",
  ];
  const index = order.indexOf(current);
  if (index === -1 || index >= order.length - 1) return null;
  return order[index + 1];
}
