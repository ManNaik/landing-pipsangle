export const CHAT_OPEN_EVENT = "pipsangel:open-chat";
export const CHAT_CLOSE_EVENT = "pipsangel:close-chat";
/** CustomEvent<boolean>: the mobile menu opened (true) or closed (false). */
export const MENU_TOGGLE_EVENT = "pipsangel:menu-toggle";

export function openChat(): void {
  window.dispatchEvent(new Event(CHAT_OPEN_EVENT));
}

export type QuickAnswer = {
  question: string;
  answer: string;
  href: string;
  linkLabel: string;
};

export const QUICK_ANSWERS: QuickAnswer[] = [
  {
    question: "Can PipsAngel withdraw my money?",
    answer:
      "No. We only receive your MT5 trading login, which can open and close trades. Withdrawals need your IC Markets client-area login, which we never ask for.",
    href: "/security",
    linkLabel: "How account access works",
  },
  {
    question: "When does the free trial start?",
    answer:
      "When your MT5 account is connected and verified. The trial lasts 4 days and you don't pay anything to start.",
    href: "/pricing",
    linkLabel: "Plans and billing",
  },
  {
    question: "Do I need an IC Markets account?",
    answer: "Yes. PipsAngel works with live IC Markets accounts on MetaTrader 5 only.",
    href: "/ic-markets-account",
    linkLabel: "How to open one",
  },
  {
    question: "How do I stop copying?",
    answer:
      "Switch copying off in your dashboard at any time. To cut access completely, change your MT5 password in the IC Markets client area.",
    href: "/security",
    linkLabel: "Stopping and disconnecting",
  },
  {
    question: "Is it a subscription?",
    answer:
      "Nothing renews automatically. Each PayPal payment covers one period: 7 days on Basic or 28 days on Premium.",
    href: "/pricing",
    linkLabel: "See pricing",
  },
];
