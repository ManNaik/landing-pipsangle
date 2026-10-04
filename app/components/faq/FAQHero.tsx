import { FAQSearch } from "./FAQSearch";

type FAQHeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function FAQHero({ query, onQueryChange }: FAQHeroProps) {
  return (
    <section className="border-b border-forest-700 px-5 pb-12 pt-14 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-sage-300">
          Straight answers about connecting your IC Markets account, what we can and can&apos;t do in it, the
          free trial, billing and risk.
        </p>
        <div className="mt-8 max-w-xl">
          <FAQSearch value={query} onChange={onQueryChange} />
        </div>
      </div>
    </section>
  );
}
