"use client";

import { useMemo, useState } from "react";
import { SearchField } from "../editorial/SearchField";
import {
  filterNewsArticles,
  getFeaturedFromList,
  type NewsArticle,
} from "../../lib/newsContent";
import { FeaturedNews } from "./FeaturedNews";
import { NewsCategoryFilter } from "./NewsCategoryFilter";
import { NewsFeed } from "./NewsFeed";

export function NewsExplorer({ articles }: { articles: NewsArticle[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => filterNewsArticles(articles, category, query),
    [articles, category, query]
  );

  const featured = getFeaturedFromList(filtered);
  const featuredSlugs = new Set(featured.map((article) => article.slug));
  const feed = filtered.filter((article) => !featuredSlugs.has(article.slug));

  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-white/[0.06] pb-4 lg:flex-row lg:items-center lg:justify-between">
          <NewsCategoryFilter active={category} onChange={setCategory} />
          <div className="w-full lg:max-w-xs">
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search market news"
              label="Search market news"
            />
          </div>
        </div>

        <FeaturedNews articles={featured} />

        {feed.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Latest Market News
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Recent developments and events shaping the forex market.
            </p>
            <div className="mt-6">
              <NewsFeed articles={feed} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
