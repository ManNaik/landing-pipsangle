import type { NewsArticle } from "../../lib/newsContent";
import { NewsCard } from "./NewsCard";

export function NewsFeed({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) {
    return (
      <p className="py-10 text-sm text-zinc-500">No matching market news in this demo set.</p>
    );
  }

  return (
    <div>
      {articles.map((article) => (
        <NewsCard key={article.slug} article={article} variant="feed" />
      ))}
    </div>
  );
}
