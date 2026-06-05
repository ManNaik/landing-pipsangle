import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "../lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles and guides on forex signals, automation, and trading.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-w-0">
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:mt-6 sm:text-lg">
            Guides and updates on forex signals and automated trading.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl min-w-0">
          <ul className="space-y-6 sm:space-y-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 transition hover:border-zinc-700 hover:bg-zinc-900/50 sm:p-6 min-h-[3rem]"
                >
                  <h2 className="text-lg font-semibold text-white sm:text-xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-500">{post.date}</p>
                  <p className="mt-2 text-sm text-zinc-400 sm:text-base">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
