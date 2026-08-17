import type { BlogArticle } from "../../lib/blogContent";
import { BlogCard } from "./BlogCard";

export function BlogGrid({ articles }: { articles: BlogArticle[] }) {
  if (articles.length === 0) {
    return <p className="py-10 text-sm text-zinc-500">No matching guides in this demo set.</p>;
  }

  const first = articles.slice(0, 3);
  const middle = articles.slice(3, 5);
  const last = articles.slice(5);

  return (
    <div className="space-y-10">
      {first.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {first.map((article) => (
            <BlogCard key={article.slug} article={article} variant="standard" />
          ))}
        </div>
      ) : null}
      {middle.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {middle.map((article) => (
            <BlogCard key={article.slug} article={article} variant="large" />
          ))}
        </div>
      ) : null}
      {last.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {last.map((article) => (
            <BlogCard key={article.slug} article={article} variant="standard" />
          ))}
        </div>
      ) : null}
    </div>
  );
}
