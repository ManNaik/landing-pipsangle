"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { BlogArticleView } from "../../../../components/blog/BlogArticleView";
import { NewsArticleView } from "../../../../components/news/NewsArticleView";
import { adminGet } from "../../../../lib/adminApi";
import { previewStorageKey, type PostType, type PreviewDraft } from "../../../../lib/adminPreview";
import type { BlogArticle } from "../../../../lib/blogContent";
import type { NewsArticle, NewsCategory } from "../../../../lib/newsContent";
import type { AdminPost } from "../../../../lib/types";

type PreviewSource = Omit<PreviewDraft, "type">;

function readTime(html: string): string {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

function toNewsArticle(source: PreviewSource): NewsArticle {
  return {
    id: source.slug,
    slug: source.slug,
    title: source.title,
    summary: source.excerpt,
    content: source.content,
    category: (source.category || "Forex") as NewsCategory,
    source: "PipsAngel",
    sourceUrl: null,
    publishedAt: source.published_at,
    updatedAt: source.updated_at,
    readTime: readTime(source.content),
    image: source.image_url || null,
    imageAlt: source.image_alt ?? "",
    authorName: source.author_name || undefined,
    authorTitle: source.author_title || undefined,
    authorUrl: source.author_url || null,
    visual: "grid",
    tags: [],
    featured: false,
    status: source.published ? "published" : "draft",
    isDemo: false,
  };
}

function toBlogArticle(source: PreviewSource): BlogArticle {
  return {
    id: source.slug,
    slug: source.slug,
    title: source.title,
    excerpt: source.excerpt,
    intro: source.excerpt,
    sections: [],
    contentHtml: source.content,
    category: "Forex Basics",
    author: "PipsAngel",
    publishedAt: source.published_at,
    updatedAt: source.updated_at,
    readTime: readTime(source.content),
    image: null,
    visual: "journal",
    tags: [],
    featured: false,
    status: source.published ? "published" : "draft",
    isDemo: false,
    showTrialCta: false,
  };
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function PreviewClient() {
  const { type: rawType, id } = useParams<{ type: string; id: string }>();
  const type: PostType | null = rawType === "news" || rawType === "blog" ? rawType : null;
  const fromEditor = useSearchParams().get("draft") === "1";
  const key = type ? previewStorageKey(type, id) : "";

  const storedDraft = useSyncExternalStore(
    subscribeToStorage,
    () => (fromEditor && key ? localStorage.getItem(key) : null),
    () => null
  );
  const [saved, setSaved] = useState<AdminPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (fromEditor || !type || id === "new") return;
    adminGet<AdminPost>(`/${type}/${id}/`)
      .then(setSaved)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load this post."));
  }, [fromEditor, type, id]);

  let source: PreviewSource | null = saved;
  if (fromEditor && storedDraft) {
    try {
      source = JSON.parse(storedDraft) as PreviewDraft;
    } catch {
      source = null;
    }
  }

  const editorHref = type ? `/admin/${type}${id === "new" ? "/new" : `/${id}`}` : "/admin";

  return (
    <>
      <div className="border-b border-amber-400/30 bg-amber-400/10 px-5 py-2.5 text-center text-sm text-amber-100">
        Preview{fromEditor ? " of unsaved changes" : ""}
        {source && !source.published ? " · not published" : ""}. Only you can see this page.{" "}
        <Link href={editorHref} className="font-semibold underline underline-offset-4">
          Back to the editor
        </Link>
      </div>
      {!type ? (
        <p className="px-5 py-20 text-center text-sage-300">Unknown content type.</p>
      ) : error ? (
        <p className="px-5 py-20 text-center text-coral-400">{error}</p>
      ) : !source ? (
        <p className="px-5 py-20 text-center text-sage-300">
          {fromEditor ? "Nothing to preview yet. Click Preview in the editor again." : "Loading preview…"}
        </p>
      ) : type === "news" ? (
        <NewsArticleView article={toNewsArticle(source)} related={[]} />
      ) : (
        <BlogArticleView article={toBlogArticle(source)} related={[]} />
      )}
    </>
  );
}
