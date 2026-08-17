import Link from "next/link";
import { DemoBadge } from "../editorial/DemoBadge";
import { ReadArrow } from "../editorial/ReadArrow";
import { formatEditorialDate } from "../../lib/newsContent";
import type { BlogArticle } from "../../lib/blogContent";
import { BlogVisual } from "./BlogVisual";

type BlogCardProps = {
  article: BlogArticle;
  variant?: "featured" | "large" | "standard";
};

export function BlogCard({ article, variant = "standard" }: BlogCardProps) {
  const href = `/blog/${article.slug}`;

  if (variant === "featured") {
    return (
      <article className="group overflow-hidden border border-white/[0.08] bg-[#0a0a0a] transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <Link href={href} className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-400/90">
                {article.category}
              </span>
              {article.isDemo ? <DemoBadge /> : null}
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {article.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400">{article.excerpt}</p>
            <p className="mt-5 text-xs text-zinc-500">
              Demo Article · {formatEditorialDate(article.publishedAt)} · {article.readTime}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
              Read Article
              <ReadArrow />
            </span>
          </div>
          <BlogVisual visual={article.visual} className="min-h-[180px] lg:min-h-full" />
        </Link>
      </article>
    );
  }

  if (variant === "large") {
    return (
      <article className="group overflow-hidden border border-white/[0.08] bg-[#0a0a0a] transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <Link href={href} className="block">
          <BlogVisual visual={article.visual} className="h-40 w-full" />
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-400/90">
                {article.category}
              </span>
              {article.isDemo ? <DemoBadge /> : null}
            </div>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">{article.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">{article.excerpt}</p>
            <p className="mt-4 text-xs text-zinc-500">{article.readTime}</p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group border-t border-white/[0.08] pt-5 transition duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <Link href={href} className="block">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-400/90">
            {article.category}
          </span>
          {article.isDemo ? <DemoBadge /> : null}
        </div>
        <h3 className="mt-2 text-base font-semibold tracking-tight text-white sm:text-lg">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-500">{article.excerpt}</p>
        <p className="mt-3 text-xs text-zinc-600">{article.readTime}</p>
      </Link>
    </article>
  );
}
