import { SIGNUP_PATH } from "../../lib/siteChrome";
import { TRIAL_START_NOTE } from "../../lib/trial";
import { OpenSupportLink } from "./OpenSupportLink";
import { TrackedLink } from "./TrackedLink";

export function FinalCta({
  title = "Try it free for 4 days",
  location,
}: {
  title?: string;
  location: string;
}) {
  return (
    <section className="border-t border-forest-700 px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-[1.75rem] font-bold leading-tight tracking-[-0.015em] sm:text-[2.15rem]">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-sage-300">{TRIAL_START_NOTE}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <TrackedLink
            href={SIGNUP_PATH}
            location={location}
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-mint-500 px-7 text-base font-semibold text-white hover:bg-leaf-600"
          >
            Start free trial
          </TrackedLink>
          <OpenSupportLink className="text-sm font-semibold text-sage-300 underline underline-offset-4 hover:text-paper">
            Ask us a question first
          </OpenSupportLink>
        </div>
      </div>
    </section>
  );
}
