import Link from "next/link";
import { newsListPath, type CategoryCount } from "../../lib/newsArchive";
import type { NewsCategory } from "../../lib/newsContent";

function pillClass(active: boolean): string {
  return `shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
    active
      ? "border-mint-500/60 bg-mint-500/10 font-semibold text-mint-300"
      : "border-forest-600 text-sage-300 hover:border-sage-500 hover:text-paper"
  }`;
}

export function NewsCategoryNav({
  categories,
  active,
}: {
  categories: CategoryCount[];
  active: NewsCategory | null;
}) {
  if (categories.length < 2 && active === null) return null;
  return (
    <nav
      aria-label="News categories"
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <Link href="/news" aria-current={active === null ? "page" : undefined} className={pillClass(active === null)}>
        All news
      </Link>
      {categories.map((entry) => (
        <Link
          key={entry.slug}
          href={newsListPath(1, entry.category)}
          aria-current={active === entry.category ? "page" : undefined}
          className={pillClass(active === entry.category)}
        >
          {entry.category}
        </Link>
      ))}
    </nav>
  );
}
