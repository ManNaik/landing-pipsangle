import Link from "next/link";
import { DemoBadge } from "../editorial/DemoBadge";
import { ReadArrow } from "../editorial/ReadArrow";
import {
  formatEditorialDate,
  formatEditorialTime,
  type NewsArticle,
} from "../../lib/newsContent";
import { NewsVisual } from "./NewsVisual";

export function NewsArticleView({
  article,
  related,
}: {
  article: NewsArticle;
  related: NewsArticle[];
}) {
  return (
    <div className="min-w-0 bg-[#050505]">
      <article className="border-b border-white/[0.06] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/news"
            className="inline-flex min-h-[2.5rem] items-center text-sm text-zinc-500 transition hover:text-white"
          >
            Back to News
          </Link>
          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-500/85">
            Forex Market News
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-400">
              {article.category}
            </span>
            {article.isDemo ? <DemoBadge /> : null}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">{article.summary}</p>
          <dl className="mt-6 grid gap-3 text-xs text-zinc-500 sm:grid-cols-2">
            <div>
              <dt className="uppercase tracking-[0.14em]">Published</dt>
              <dd className="mt-1 text-zinc-300">
                {formatEditorialDate(article.publishedAt)} ({formatEditorialTime(article.publishedAt)})
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.14em]">Updated</dt>
              <dd className="mt-1 text-zinc-300">{formatEditorialDate(article.updatedAt)}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.14em]">Source</dt>
              <dd className="mt-1 text-zinc-300">{article.source}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.14em]">Read time</dt>
              <dd className="mt-1 text-zinc-300">{article.readTime}</dd>
            </div>
          </dl>
        </div>
        <div className="mx-auto mt-8 max-w-4xl">
          <NewsVisual visual={article.visual} featured className="h-52 w-full sm:h-64" />
        </div>
        <div
          className="mx-auto mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-zinc-400 [&_p]:leading-relaxed [&_strong]:text-amber-200/90"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {related.length > 0 ? (
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold text-white">Related Market News</h2>
            <ul className="mt-5 space-y-4">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/news/${item.slug}`}
                    className="group flex items-start justify-between gap-4 border-b border-white/[0.06] py-3"
                  >
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                        {item.category}
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">{item.title}</p>
                    </div>
                    <ReadArrow className="mt-1 shrink-0 text-emerald-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
