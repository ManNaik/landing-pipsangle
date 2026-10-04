import { HOW_IT_WORKS_PATH, SIGNUP_PATH } from "../../lib/paths";
import { FREE_TRIAL_DAYS, TRIAL_START_NOTE } from "../../lib/trial";
import { TrackedLink } from "../site/TrackedLink";
import { TextLink } from "../site/ui";

export function ArticleCta() {
  return (
    <aside className="mt-12 rounded-2xl border border-forest-600 bg-forest-850 p-6 sm:p-8">
      <h2 className="text-xl font-bold">Try PipsAngel free for {FREE_TRIAL_DAYS} days</h2>
      <p className="mt-2 leading-relaxed text-sage-300">
        We copy our trades into your IC Markets MT5 account, each opened with a stop loss. You can switch copying
        off whenever you like.
      </p>
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <TrackedLink
          href={SIGNUP_PATH}
          location="news_article"
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-mint-500 px-6 font-semibold text-white hover:bg-leaf-600"
        >
          Start free trial
        </TrackedLink>
        <TextLink href={HOW_IT_WORKS_PATH}>See how it works</TextLink>
      </div>
      <p className="mt-4 text-sm text-sage-400">{TRIAL_START_NOTE}</p>
    </aside>
  );
}
