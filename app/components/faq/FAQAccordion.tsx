"use client";

import Link from "next/link";
import { useState } from "react";
import { ReadArrow } from "../editorial/ReadArrow";
import type { FaqItem } from "../../lib/faqContent";

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set());

  function toggle(id: string) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
      {items.map((item) => {
        const open = openIds.has(item.id);
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
              >
                <span className="text-sm font-medium text-white sm:text-[15px]">
                  {item.question}
                </span>
                <span
                  className={`shrink-0 text-lg leading-none text-zinc-500 transition-transform duration-200 motion-reduce:transition-none ${
                    open ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
            </h3>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-2 text-sm leading-relaxed text-zinc-400">{item.answer}</p>
                {item.links?.length ? (
                  <div className="flex flex-wrap gap-3 pb-4">
                    {item.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm font-medium text-emerald-400 transition-colors duration-200 hover:text-emerald-300"
                      >
                        {link.label}
                        <ReadArrow />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="pb-2" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
