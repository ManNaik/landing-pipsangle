import { FAQSearch } from "./FAQSearch";

type FAQHeroProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function FAQHero({ query, onQueryChange }: FAQHeroProps) {
  return (
    <section className="border-b border-white/[0.06] bg-[#050505] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="editorial-fade-up mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-500/85">
          PipAngel FAQ
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Everything You Need to Know Before You Start
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          Clear answers about PipAngel, automated trading, MT5, pricing, risk
          controls, performance, account setup, and support.
        </p>
        <div className="mx-auto mt-6 max-w-xl text-left">
          <FAQSearch value={query} onChange={onQueryChange} />
        </div>
      </div>
    </section>
  );
}
