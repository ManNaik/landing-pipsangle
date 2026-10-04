import Link from "next/link";

export function NotFoundContent() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold text-sage-400">Error 404</p>
        <h1 className="mt-2 text-[2.2rem] font-bold leading-tight tracking-[-0.02em] sm:text-5xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-sage-300">
          It may have moved, or the link may be wrong. These pages are a good place to start:
        </p>
        <ul className="mt-6 space-y-2 text-lg">
          <li>
            <Link href="/" className="font-semibold text-mint-400 underline underline-offset-4">
              Home
            </Link>
          </li>
          <li>
            <Link href="/automated-forex-trading" className="font-semibold text-mint-400 underline underline-offset-4">
              How copy trading works
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="font-semibold text-mint-400 underline underline-offset-4">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/faq" className="font-semibold text-mint-400 underline underline-offset-4">
              FAQ
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
