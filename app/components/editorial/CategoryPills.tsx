type CategoryPillsProps = {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
};

export function CategoryPills({ categories, active, onChange }: CategoryPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            aria-pressed={isActive}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              isActive
                ? "border-mint-500/60 bg-mint-500/10 font-semibold text-mint-300"
                : "border-forest-600 text-sage-300 hover:border-sage-500 hover:text-paper"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
