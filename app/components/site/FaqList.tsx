import Link from "next/link";
import type { FaqItem } from "../../lib/faqContent";

/** Native disclosure elements: keyboard and screen-reader friendly with no script. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-forest-700 border-y border-forest-700">
      {items.map((item) => (
        <details key={item.id} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[1.0625rem] font-semibold [&::-webkit-details-marker]:hidden">
            {item.question}
            <span className="shrink-0 text-xl leading-none text-sage-400 transition-transform group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <div className="pb-5 pr-8 leading-relaxed text-sage-300">
            <p>{item.answer}</p>
            {item.links?.length ? (
              <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {item.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-semibold text-mint-400 underline decoration-mint-400/40 underline-offset-4 hover:decoration-mint-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </p>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}
