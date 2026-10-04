import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Section } from "../../components/site/ui";
import { getBlogArticles } from "../../lib/blog";
import { formatDate } from "../../lib/format";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Blog",
    description: "Articles from PipsAngel about copy trading, MT5 and managing trading risk.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const [articles, siteConfig] = await Promise.all([getBlogArticles(), getSiteConfig()]);
  if (articles.length === 0) notFound();

  const siteUrl = resolveSiteUrl(siteConfig);
  const breadcrumb = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumb) }} />
      <PageHero title="Blog" />
      <Section className="pt-10 sm:pt-12">
        <ul className="max-w-3xl divide-y divide-forest-700 border-y border-forest-700">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link href={`/blog/${article.slug}`} className="group block py-6">
                <span className="text-sm text-sage-400">
                  {article.category}, {formatDate(article.publishedAt)}
                </span>
                <span className="mt-1 block text-xl font-bold group-hover:text-mint-300">{article.title}</span>
                <span className="mt-2 block leading-relaxed text-sage-300">{article.excerpt}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
