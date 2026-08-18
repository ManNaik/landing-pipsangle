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
    <nav
      aria-label="FAQ sections"
      className="sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 lg:block"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">FAQ</p>
      <ul className="mt-3 space-y-1">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => onSelect(section.id)}
                className={`block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors duration-200 ${
                  isActive
                    ? "text-emerald-400"
                    : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {section.heading === "About PipAngel" ? "PipAngel" : section.heading}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
