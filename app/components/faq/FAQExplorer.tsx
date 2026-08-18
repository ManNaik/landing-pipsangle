"use client";

import { useEffect, useMemo, useState } from "react";
import {
  filterFaqSections,
  type FaqCategoryId,
  type FaqSection,
} from "../../lib/faqContent";
import { FAQCategories } from "./FAQCategories";
import { FAQHero } from "./FAQHero";
import { FAQSection } from "./FAQSection";
import { FAQSidebar } from "./FAQSidebar";
import { FAQTrustCTA } from "./FAQTrustCTA";
import { RiskDisclosure } from "./RiskDisclosure";

export function FAQExplorer({ sections }: { sections: FaqSection[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<FaqCategoryId>(sections[0]?.id ?? "getting-started");

  const visible = useMemo(() => filterFaqSections(sections, query), [sections, query]);

  useEffect(() => {
    if (visible.length === 0) return;
    if (!visible.some((section) => section.id === active)) {
      setActive(visible[0].id);
    }
  }, [visible, active]);

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
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  return (
    <div className="min-w-0 bg-[#050505]">
      <FAQHero query={query} onQueryChange={setQuery} />
      <FAQCategories sections={sections} active={active} onChange={scrollToSection} />

      <div className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          <FAQSidebar sections={visible} active={active} onSelect={scrollToSection} />
          <div className="mx-auto w-full max-w-3xl space-y-12 lg:mx-0 lg:max-w-none">
            {visible.length === 0 ? (
              <div className="py-10">
                <p className="text-base font-medium text-white">No questions found</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Try another search term or contact PipAngel support.
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-4 text-sm font-medium text-emerald-400 transition-colors duration-200 hover:text-emerald-300"
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

      <FAQTrustCTA />
      <RiskDisclosure />
    </div>
  );
}
