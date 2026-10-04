import type { FaqCategoryId, FaqSection } from "../../lib/faqContent";

export function FAQSidebar({
  sections,
  active,
  onSelect,
}: {
  sections: FaqSection[];
  active: FaqCategoryId;
  onSelect: (id: FaqCategoryId) => void;
}) {
  return (
    <nav aria-label="FAQ sections" className="sticky top-24 hidden self-start lg:block">
      <ul className="space-y-1 border-l border-forest-600">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => onSelect(section.id)}
                aria-current={isActive ? "true" : undefined}
                className={`-ml-px block w-full border-l-2 py-1.5 pl-4 text-left text-[0.95rem] transition-colors ${
                  isActive
                    ? "border-mint-400 font-semibold text-paper"
                    : "border-transparent text-sage-400 hover:text-paper"
                }`}
              >
                {section.navLabel}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
