import Link from "next/link";
import { normalizeBrandText } from "../../lib/brand";
import { formatDate } from "../../lib/format";
import { newsListPath } from "../../lib/newsArchive";
import type { NewsArticle } from "../../lib/newsContent";
import { ArticleCta } from "./ArticleCta";
import { NewsletterSignup } from "./NewsletterSignup";

function Byline({ article }: { article: NewsArticle }) {
  const name = article.authorName ?? article.source;
  return (
    <p className="mt-6 text-sm leading-relaxed text-sage-400">
      {article.authorName ? "By " : null}
      {article.authorName && article.authorUrl ? (
        <a
          href={article.authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sage-200 underline decoration-sage-500 underline-offset-4 hover:text-paper"
        >
          {name}
        </a>
      ) : (
        <span className="font-semibold text-sage-200">{name}</span>
      )}
      {article.authorTitle ? `, ${article.authorTitle}` : null}
      <span aria-hidden> · </span>
      <time dateTime={article.publishedAt} className="whitespace-nowrap">
        {formatDate(article.publishedAt)}
      </time>
      {article.readTime ? (
        <>
          <span aria-hidden> · </span>
          <span className="whitespace-nowrap">{article.readTime}</span>
        </>
      ) : null}
    </p>
  );
}

export function NewsArticleView({ article, related }: { article: NewsArticle; related: NewsArticle[] }) {
  return (
    <>
      <article className="px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-sm text-sage-400">
            <Link href="/news" className="underline-offset-4 hover:text-paper hover:underline">
              News
            </Link>
            <span aria-hidden> / </span>
            <Link href={newsListPath(1, article.category)} className="font-semibold text-mint-400 hover:text-mint-300">
              {article.category}
            </Link>
          </nav>
          <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-[-0.02em] sm:text-[2.6rem]">{article.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-sage-300">{article.summary}</p>
          <Byline article={article} />

          {article.image ? (
            <figure className="mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element -- CMS images can be hosted anywhere, so they skip the image optimizer. */}
              <img
                src={article.image}
                alt={article.imageAlt ?? ""}
                fetchPriority="high"
                className="aspect-[16/9] w-full rounded-xl border border-forest-700 object-cover"
              />
            </figure>
          ) : null}

          <div
            className="prose-site mt-10 border-t border-forest-700 pt-10"
            dangerouslySetInnerHTML={{ __html: normalizeBrandText(article.content) }}
          />

          <ArticleCta />
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-forest-700 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold">More market news</h2>
            <ul className="mt-5 divide-y divide-forest-700 border-y border-forest-700">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/news/${item.slug}`} className="block py-4 hover:text-mint-300">
                    <span className="text-sm text-sage-400">{formatDate(item.publishedAt)}</span>
                    <span className="mt-1 block font-semibold">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <NewsletterSignup source="news_article" />
    </>
  );
}
