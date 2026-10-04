import type { FaqCategoryId, FaqSection } from "../../lib/faqContent";
import { CategoryPills } from "../editorial/CategoryPills";

/** Section jump links for small screens; wider screens use the sidebar. */
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
    <div className="sticky top-16 z-20 border-b border-forest-700 bg-forest-900/95 px-5 py-3 backdrop-blur sm:px-8 lg:hidden">
      <CategoryPills
        categories={labels}
        active={activeLabel}
        onChange={(label) => {
          const match = sections.find((section) => section.navLabel === label);
          if (match) onChange(match.id);
        }}
      />
    </div>
  );
}
