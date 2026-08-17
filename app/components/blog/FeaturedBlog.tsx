import type { BlogArticle } from "../../lib/blogContent";
import { BlogCard } from "./BlogCard";

export function FeaturedBlog({ article }: { article: BlogArticle | null }) {
  if (!article) return null;
  return (
    <section className="mt-8">
      <BlogCard article={article} variant="featured" />
    </section>
  );
}
