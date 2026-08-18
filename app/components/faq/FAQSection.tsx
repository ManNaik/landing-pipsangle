import type { FaqSection } from "../../lib/faqContent";
import { FAQAccordion } from "./FAQAccordion";

export function FAQSection({ section }: { section: FaqSection }) {
  return (
    <section id={section.id} className="scroll-mt-28">
      <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {section.heading}
      </h2>
      {section.description ? (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
          {section.description}
        </p>
      ) : null}
      <div className="mt-5">
        <FAQAccordion items={section.items} />
      </div>
    </section>
  );
}
