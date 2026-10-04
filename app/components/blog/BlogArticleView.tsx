import Link from "next/link";
import type { BlogArticle } from "../../lib/blogContent";
import { formatDate } from "../../lib/format";

export function BlogArticleView({ article, related }: { article: BlogArticle; related: BlogArticle[] }) {
  const showUpdated = article.updatedAt && article.updatedAt.slice(0, 10) !== article.publishedAt.slice(0, 10);

  return (
    <>
      <article className="px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" className="text-sm font-semibold text-sage-300 underline underline-offset-4 hover:text-paper">
            All articles
          </Link>
          <p className="mt-8 text-sm font-semibold text-mint-400">{article.category}</p>
          <h1 className="mt-2 text-[2rem] font-bold leading-tight tracking-[-0.02em] sm:text-[2.6rem]">{article.title}</h1>
          {article.intro ? <p className="mt-5 text-lg leading-relaxed text-sage-300">{article.intro}</p> : null}
          <p className="mt-5 text-sm text-sage-400">
            {article.author}, {formatDate(article.publishedAt)}
            {showUpdated ? ` (updated ${formatDate(article.updatedAt)})` : ""}
            {article.readTime ? `, ${article.readTime}` : ""}
          </p>

          <div className="mt-10 border-t border-forest-700 pt-10">
            {article.sections.length > 0 ? (
              <div className="space-y-10">
                {article.sections.map((section) => (
                  <section key={section.id} id={section.id}>
                    <h2 className="text-xl font-bold">{section.heading}</h2>
                    <div className="prose-site mt-3" dangerouslySetInnerHTML={{ __html: section.body }} />
                  </section>
                ))}
              </div>
            ) : (
              <div className="prose-site" dangerouslySetInnerHTML={{ __html: article.contentHtml ?? "" }} />
            )}
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-forest-700 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold">More articles</h2>
            <ul className="mt-5 divide-y divide-forest-700 border-y border-forest-700">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/blog/${item.slug}`} className="block py-4 hover:text-mint-300">
                    <span className="text-sm text-sage-400">{item.category}</span>
                    <span className="mt-1 block font-semibold">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
