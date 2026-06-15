import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "../../../lib/blog";
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
    const posts = await getBlogPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post, config] = await Promise.all([getBlogPost(slug), getSiteConfig()]);
  if (!post) return { title: "Post Not Found" };

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    siteUrl: resolveSiteUrl(config),
    brandName: config?.brand_name,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated_at,
  });
}

const RELATED_LINKS = [
  { href: "/forex-signals", label: "Forex Signals" },
  { href: "/automated-forex-trading", label: "Automated Trading" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, config] = await Promise.all([getBlogPost(slug), getSiteConfig()]);
  if (!post) notFound();

  const siteUrl = resolveSiteUrl(config);
  const brandName = config?.brand_name ?? "PipAngel";

  const blogSchema = buildBlogPostingSchema(siteUrl, brandName, {
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    date: post.date,
    updatedAt: post.updated_at,
  });
  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${slug}` },
  ]);

  return (
    <div className="min-w-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([blogSchema, breadcrumbSchema]),
        }}
      />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <Link
          href="/blog"
          className="mb-6 inline-block min-h-[2.5rem] text-sm text-zinc-500 hover:text-white sm:mb-8"
        >
          ← Back to Blog
        </Link>
        <header className="mb-8 sm:mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-zinc-500 sm:mt-4">{post.date}</p>
        </header>
        <div
          className="space-y-4 text-sm text-zinc-400 [&_p]:leading-relaxed [&_ul]:list-inside [&_ul]:list-disc [&_ol]:list-inside [&_ol]:list-decimal [&_li]:mt-1 [&_strong]:text-white sm:text-base"
          dangerouslySetInnerHTML={{ __html: post.content.trim() }}
        />
        <footer className="mt-12 border-t border-zinc-800 pt-8">
          <p className="text-sm font-medium text-zinc-300">Related</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {RELATED_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-emerald-500/50 hover:text-emerald-400"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      </article>
    </div>
  );
}
