"use client";

import { useMemo, useState } from "react";
import { SearchField } from "../editorial/SearchField";
import { filterBlogArticles, type BlogArticle } from "../../lib/blogContent";
import { BlogCategoryFilter } from "./BlogCategoryFilter";
import { BlogGrid } from "./BlogGrid";
import { FeaturedBlog } from "./FeaturedBlog";

export function BlogExplorer({ articles }: { articles: BlogArticle[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => filterBlogArticles(articles, category, query),
    [articles, category, query]
  );

  const featured =
    category === "All" && query.trim() === ""
      ? filtered.find((article) => article.featured) ?? null
      : null;
  const grid = filtered.filter((article) => article.slug !== featured?.slug);

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-white/[0.06] pb-4 lg:flex-row lg:items-center lg:justify-between">
          <BlogCategoryFilter active={category} onChange={setCategory} />
          <div className="w-full lg:max-w-xs">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search trading guides"
              label="Search trading guides"
            />
          </div>
        </div>
        <FeaturedBlog article={featured} />
        <div className="mt-12">
          <BlogGrid articles={grid} />
        </div>
      </div>
    </section>
  );
}
