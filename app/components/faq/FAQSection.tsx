import type { FaqSection } from "../../lib/faqContent";
import { FaqList } from "../site/FaqList";

export function FAQSection({ section }: { section: FaqSection }) {
  return (
    <section id={section.id} className="scroll-mt-36 lg:scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-[-0.01em]">{section.heading}</h2>
      {section.description ? <p className="mt-2 max-w-2xl text-sage-300">{section.description}</p> : null}
      <div className="mt-5">
        <FaqList items={section.items} />
      </div>
    </section>
  );
}
