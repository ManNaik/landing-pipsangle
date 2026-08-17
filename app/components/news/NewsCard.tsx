import Link from "next/link";
import { DemoBadge } from "../editorial/DemoBadge";
import { ReadArrow } from "../editorial/ReadArrow";
import { formatEditorialTime, type NewsArticle } from "../../lib/newsContent";
import { NewsVisual } from "./NewsVisual";

type NewsCardProps = {
  article: NewsArticle;
  variant?: "featured" | "compact" | "feed";
};

export function NewsCard({ article, variant = "feed" }: NewsCardProps) {
  const href = `/news/${article.slug}`;

  if (variant === "featured") {
    return (
      <article className="group overflow-hidden border border-white/[0.08] bg-[#0a0a0a] transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <Link href={href} className="block">
          <NewsVisual visual={article.visual} featured className="h-48 w-full sm:h-56" />
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-400/90">
                {article.category}
              </span>
              {article.isDemo ? <DemoBadge /> : null}
            </div>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {article.title}
            </h2>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">
              {article.summary}
            </p>
            <p className="mt-4 text-xs text-zinc-500">
              {article.source} · Updated {formatEditorialTime(article.updatedAt)} · {article.readTime}
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
              Read Analysis
              <ReadArrow />
            </span>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex h-full flex-col border border-white/[0.08] bg-[#0a0a0a] transition duration-200 hover:-translate-y-0.5 hover:border-white/[0.14] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <Link href={href} className="flex h-full flex-col p-4 sm:p-5">
          <NewsVisual visual={article.visual} className="mb-4 h-24 w-full" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-400/90">
              {article.category}
            </span>
            {article.isDemo ? <DemoBadge /> : null}
          </div>
          <h3 className="mt-2 text-base font-semibold tracking-tight text-white">{article.title}</h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-zinc-500">{article.summary}</p>
          <span className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-400">
            Read Analysis
            <ReadArrow />
          </span>
        </Link>
      </article>
    );
  }

  return (
    <article className="group border-b border-white/[0.06] py-5 transition-colors duration-150 hover:bg-white/[0.02] motion-reduce:transition-none sm:py-6">
      <Link href={href} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-400/90">
              {article.category}
            </span>
            {article.isDemo ? <DemoBadge /> : null}
          </div>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">{article.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">{article.summary}</p>
          <p className="mt-3 text-xs text-zinc-500">
            {article.source} · {formatEditorialTime(article.publishedAt)} · {article.readTime}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 self-end text-sm font-medium text-emerald-400 sm:self-center">
          Read article
          <ReadArrow />
        </span>
      </Link>
    </article>
  );
}
