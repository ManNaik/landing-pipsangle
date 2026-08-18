import Link from "next/link";
import { DemoBadge } from "../editorial/DemoBadge";
import { ReadArrow } from "../editorial/ReadArrow";
import { formatEditorialDate } from "../../lib/newsContent";
import type { BlogArticle } from "../../lib/blogContent";
import { BlogCTA } from "./BlogCTA";
import { BlogVisual } from "./BlogVisual";

export function BlogArticleView({
  article,
  related,
}: {
  article: BlogArticle;
  related: BlogArticle[];
}) {
  const showToc = article.sections.length >= 2;

  return (
    <div className="min-w-0 bg-[#050505]">
      <article className="border-b border-white/[0.06] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex min-h-[2.5rem] items-center text-sm text-zinc-500 transition hover:text-white"
          >
            Back to Blog
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-400/90">
              {article.category}
            </span>
            {article.isDemo ? <DemoBadge /> : null}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">{article.intro}</p>
          <p className="mt-5 text-xs text-zinc-500">
            {article.author} · Published {formatEditorialDate(article.publishedAt)} · Updated{" "}
            {formatEditorialDate(article.updatedAt)} · {article.readTime}
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-4xl">
          <BlogVisual visual={article.visual} className="h-52 w-full sm:h-64" />
        </div>
        <div className="mx-auto mt-8 max-w-3xl">
          {showToc ? (
            <nav className="mb-8 border border-white/[0.07] bg-[#0a0a0a] p-5" aria-label="Table of contents">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                In this article
              </p>
              <ol className="mt-3 space-y-2">
                {article.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm text-zinc-300 transition hover:text-white"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <div className="space-y-8">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-lg font-semibold text-white">{section.heading}</h2>
                <div
                  className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-400 [&_p]:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.body }}
                />
              </section>
            ))}
          </div>
          {article.showTrialCta ? <BlogCTA variant="trial" /> : null}
        </div>
      </article>

      {related.length > 0 ? (
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-lg font-semibold text-white">Related Articles</h2>
            <ul className="mt-5 space-y-4">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/${item.slug}`}
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
