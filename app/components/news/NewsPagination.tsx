import Link from "next/link";
import { newsListPath } from "../../lib/newsArchive";
import type { NewsCategory } from "../../lib/newsContent";

const LINK = "font-semibold text-mint-400 underline decoration-mint-400/40 underline-offset-4 hover:decoration-mint-400";

export function NewsPagination({
  page,
  totalPages,
  category,
}: {
  page: number;
  totalPages: number;
  category: NewsCategory | null;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="News pages" className="mt-8 flex items-center justify-between gap-4 text-sm">
      {page > 1 ? (
        <Link href={newsListPath(page - 1, category)} rel="prev" className={LINK}>
          Newer articles
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sage-400">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={newsListPath(page + 1, category)} rel="next" className={LINK}>
          Older articles
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
