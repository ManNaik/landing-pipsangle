"use client";

import { useState } from "react";
import { PRICING_FAQ } from "../../lib/pricing";

export function PricingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-white/[0.06] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Pricing Questions
        </h2>
        <div className="mt-8 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {PRICING_FAQ.map((item, index) => {
            const open = openIndex === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white sm:text-[15px]">
                    {item.question}
                  </span>
                  <span
                    className={`shrink-0 text-zinc-500 transition-transform duration-200 motion-reduce:transition-none ${
                      open ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 text-sm leading-relaxed text-zinc-400">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
