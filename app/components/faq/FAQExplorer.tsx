"use client";

import { useEffect, useMemo, useState } from "react";
import { filterFaqSections, type FaqCategoryId, type FaqSection } from "../../lib/faqContent";
import { FAQCategories } from "./FAQCategories";
import { FAQHero } from "./FAQHero";
import { FAQSection } from "./FAQSection";
import { FAQSidebar } from "./FAQSidebar";

export function FAQExplorer({ sections, supportEmail }: { sections: FaqSection[]; supportEmail: string }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<FaqCategoryId>(sections[0]?.id ?? "getting-started");

  const visible = useMemo(() => filterFaqSections(sections, query), [sections, query]);

  if (visible.length > 0 && !visible.some((section) => section.id === active)) {
    setActive(visible[0].id);
  }

  useEffect(() => {
    const nodes = visible
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const id = visibleEntries[0]?.target.id as FaqCategoryId | undefined;
        if (id) setActive(id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [visible]);

  function scrollToSection(id: FaqCategoryId) {
    setQuery("");
    setActive(id);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  return (
    <>
      <FAQHero query={query} onQueryChange={setQuery} />
      <FAQCategories sections={sections} active={active} onChange={scrollToSection} />

      <div className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[200px_minmax(0,1fr)]">
          <FAQSidebar sections={visible} active={active} onSelect={scrollToSection} />
          <div className="w-full max-w-3xl space-y-14">
            {visible.length === 0 ? (
              <div>
                <p className="text-lg font-semibold">No questions match &ldquo;{query}&rdquo;</p>
                <p className="mt-2 text-sage-300">
                  Try a different word, or email{" "}
                  <a href={`mailto:${supportEmail}`} className="font-semibold text-mint-400 underline underline-offset-4">
                    {supportEmail}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-4 font-semibold text-mint-400 underline underline-offset-4"
                >
                  Clear search
                </button>
              </div>
            ) : (
              visible.map((section) => <FAQSection key={section.id} section={section} />)
            )}
          </div>
        </div>
      </div>
    </>
  );
}
