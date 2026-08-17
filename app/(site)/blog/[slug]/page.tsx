import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticleView } from "../../../components/blog/BlogArticleView";
import { getBlogArticle, getBlogArticles } from "../../../lib/blog";
import { getRelatedBlog } from "../../../lib/blogContent";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildPageMetadata,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../../lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const posts = await getBlogArticles();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post, config] = await Promise.all([getBlogArticle(slug), getSiteConfig()]);
  if (!post) return { title: "Post Not Found" };

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    siteUrl: resolveSiteUrl(config),
    brandName: config?.brand_name,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    image: post.image ?? "/opengraph-image",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, all, config] = await Promise.all([
    getBlogArticle(slug),
    getBlogArticles(),
    getSiteConfig(),
  ]);
  if (!post) notFound();

  const siteUrl = resolveSiteUrl(config);
  const brandName = config?.brand_name ?? "PipAngel";
  const related = getRelatedBlog(all, slug);

  const blogSchema = buildBlogPostingSchema(siteUrl, brandName, {
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    date: post.publishedAt,
    updatedAt: post.updatedAt,
  });
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([blogSchema, breadcrumbSchema]),
        }}
      />
      <BlogArticleView article={post} related={related} />
    </>
  );
}
