import Link from "next/link";
import { formatDate } from "../../lib/format";
import type { NewsArticle } from "../../lib/newsContent";

export function NewsList({ articles }: { articles: NewsArticle[] }) {
  return (
    <ul className="divide-y divide-forest-700 border-y border-forest-700">
      {articles.map((article) => (
        <li key={article.slug}>
          <article className="flex gap-5 py-6 sm:gap-8">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-sage-400">
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                <span aria-hidden> · </span>
                {article.category}
                {article.authorName ? (
                  <>
                    <span aria-hidden> · </span>
                    {article.authorName}
                  </>
                ) : null}
              </p>
              <h2 className="mt-1.5 text-xl font-bold leading-snug">
                <Link href={`/news/${article.slug}`} className="hover:text-mint-300">
                  {article.title}
                </Link>
              </h2>
              <p className="mt-2 max-w-3xl leading-relaxed text-sage-300">{article.summary}</p>
            </div>
            {article.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- CMS images can be hosted anywhere, so they skip the image optimizer.
              <img
                src={article.image}
                alt=""
                loading="lazy"
                className="hidden aspect-[4/3] w-40 shrink-0 rounded-lg border border-forest-700 object-cover sm:block"
              />
            ) : null}
          </article>
        </li>
      ))}
    </ul>
  );
}
