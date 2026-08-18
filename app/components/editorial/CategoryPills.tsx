type CategoryPillsProps = {
  categories: readonly string[];
  active: string;
  onChange: (category: string) => void;
};

export function CategoryPills({ categories, active, onChange }: CategoryPillsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`relative shrink-0 px-3 py-2 text-[13px] transition-colors duration-200 ${
              isActive ? "font-medium text-white" : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            {category}
            <span
              className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-emerald-500 transition-opacity duration-200 ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
