import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "../../lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="min-w-0">
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
      </article>
    </div>
  );
}
