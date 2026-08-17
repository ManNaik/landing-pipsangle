import type { NewsArticle } from "../../lib/newsContent";
import { NewsCard } from "./NewsCard";

export function FeaturedNews({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return null;
  const [primary, ...rest] = articles;

  return (
    <section className="mt-8">
      <div className={`grid gap-4 ${rest.length > 0 ? "lg:grid-cols-[1.4fr_0.9fr]" : ""}`}>
        <NewsCard article={primary} variant="featured" />
        {rest.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {rest.slice(0, 2).map((article) => (
              <NewsCard key={article.slug} article={article} variant="compact" />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
