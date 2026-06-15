import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-w-0 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-500">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-base text-zinc-400">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-[3rem] items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            Go to Home
          </Link>
          <Link
            href="/faq"
            className="inline-flex min-h-[3rem] items-center justify-center rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            View FAQ
          </Link>
          <Link
            href="/blog"
            className="inline-flex min-h-[3rem] items-center justify-center rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Read Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
