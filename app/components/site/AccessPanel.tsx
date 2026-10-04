import { CheckIcon, CrossIcon } from "./ui";

const CAN = [
  "Open trades in your account, each with a stop loss",
  "Size each trade for your balance and settings",
  "Change or close the trades it opened",
];

const CANNOT = [
  "Withdraw or transfer your money",
  "Log in to your IC Markets client area",
  "Open new trades after you switch copying off",
];

/** The single biggest objection, answered where the visitor decides whether to scroll. */
export function AccessPanel() {
  return (
    <aside
      aria-labelledby="access-panel-title"
      className="rounded-2xl border border-forest-600 bg-forest-850 p-6 sm:p-7"
    >
      <h2 id="access-panel-title" className="text-lg font-bold">
        What PipsAngel can do in your account
      </h2>
      <ul className="mt-4 space-y-3">
        {CAN.map((item) => (
          <li key={item} className="flex gap-3 text-[0.975rem] leading-snug text-sage-200">
            <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-mint-400" />
            {item}
          </li>
        ))}
      </ul>
      <h3 className="mt-6 border-t border-forest-700 pt-5 text-lg font-bold">What it can&apos;t do</h3>
      <ul className="mt-4 space-y-3">
        {CANNOT.map((item) => (
          <li key={item} className="flex gap-3 text-[0.975rem] leading-snug text-sage-200">
            <CrossIcon className="mt-0.5 h-5 w-5 shrink-0 text-coral-400" />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-relaxed text-sage-400">
        Your money stays in your IC Markets account. PipsAngel is not a broker and never holds client funds.
      </p>
    </aside>
  );
}
