import assert from "node:assert/strict";
import { test } from "node:test";
import {
  categoriesInUse,
  categoryFromSlug,
  categorySlug,
  newsListPath,
  paginate,
  parsePageParam,
} from "./newsArchive";
import type { NewsArticle, NewsCategory } from "./newsContent";

function article(slug: string, category: NewsCategory): NewsArticle {
  return {
    id: slug,
    slug,
    title: slug,
    summary: "",
    content: "",
    category,
    source: "PipsAngel",
    sourceUrl: null,
    publishedAt: "2026-10-01",
    updatedAt: "2026-10-01",
    readTime: "",
    image: null,
    visual: "grid",
    tags: [],
    featured: false,
    status: "published",
    isDemo: false,
  };
}

test("paginate splits items and rejects out-of-range pages", () => {
  const items = Array.from({ length: 25 }, (_, index) => index);
  assert.deepEqual(paginate(items, 1, 12)?.items, items.slice(0, 12));
  assert.deepEqual(paginate(items, 3, 12), { items: [24], page: 3, totalPages: 3 });
  assert.equal(paginate(items, 4, 12), null);
  assert.equal(paginate(items, 0, 12), null);
  assert.equal(paginate(items, 1.5, 12), null);
});

test("an empty list still has a first page", () => {
  assert.deepEqual(paginate([], 1), { items: [], page: 1, totalPages: 1 });
  assert.equal(paginate([], 2), null);
});

test("page params accept plain positive integers only", () => {
  assert.equal(parsePageParam("2"), 2);
  assert.equal(parsePageParam("0"), null);
  assert.equal(parsePageParam("02"), null);
  assert.equal(parsePageParam("2abc"), null);
  assert.equal(parsePageParam("999999"), null);
});

test("category slugs round-trip", () => {
  assert.equal(categorySlug("Central Banks"), "central-banks");
  assert.equal(categoryFromSlug("central-banks"), "Central Banks");
  assert.equal(categoryFromSlug("market-analysis"), "Market Analysis");
  assert.equal(categoryFromSlug("all"), null);
  assert.equal(categoryFromSlug("unknown"), null);
});

test("categoriesInUse counts only categories with articles, in a fixed order", () => {
  const counts = categoriesInUse([
    article("a", "Economic Data"),
    article("b", "Forex"),
    article("c", "Economic Data"),
  ]);
  assert.deepEqual(counts, [
    { category: "Forex", slug: "forex", count: 1 },
    { category: "Economic Data", slug: "economic-data", count: 2 },
  ]);
});

test("list paths keep page one at the base URL", () => {
  assert.equal(newsListPath(1), "/news");
  assert.equal(newsListPath(3), "/news/page/3");
  assert.equal(newsListPath(1, "Central Banks"), "/news/category/central-banks");
  assert.equal(newsListPath(2, "Central Banks"), "/news/category/central-banks/page/2");
});
