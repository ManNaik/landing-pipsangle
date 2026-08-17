import { NEWS_WHY_BLOCKS } from "../../lib/newsContent";

export function NewsWhy() {
  return (
    <section className="border-t border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          Why Forex News Matters
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
          Currency markets respond to changes in interest rate expectations, economic
          data, central bank policy, geopolitical developments, and broader market
          sentiment. Trading involves market risk. Past information does not guarantee
          future results.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {NEWS_WHY_BLOCKS.map((block) => (
            <article key={block.title} className="border-t border-white/[0.08] pt-4">
              <h3 className="text-sm font-medium text-white">{block.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{block.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
