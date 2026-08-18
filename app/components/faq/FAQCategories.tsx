import { CategoryPills } from "../editorial/CategoryPills";
import type { FaqCategoryId, FaqSection } from "../../lib/faqContent";

export function FAQCategories({
  sections,
  active,
  onChange,
}: {
  sections: FaqSection[];
  active: FaqCategoryId;
  onChange: (id: FaqCategoryId) => void;
}) {
  const labels = sections.map((section) => section.navLabel);
  const activeLabel = sections.find((section) => section.id === active)?.navLabel ?? labels[0];

  return (
    <div className="border-b border-white/[0.06] bg-[#050505] px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <CategoryPills
          categories={labels}
          active={activeLabel}
          onChange={(label) => {
            const match = sections.find((section) => section.navLabel === label);
            if (match) onChange(match.id);
          }}
        />
      </div>
    </div>
  );
}
