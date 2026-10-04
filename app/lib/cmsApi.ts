import { safeApiGet } from "./api";
import { normalizeBrandText } from "./brand";
import type { FaqItem, ListResponse } from "./types";

/**
 * Seed-era CMS answers describe products PipsAngel no longer offers (signals, MT4,
 * any broker, a $29 Starter plan). They're dropped until staff rewrite them.
 */
const OUTDATED_ANSWER = /signal|\bmt4\b|metatrader 4|starter|\$29|any (major )?(forex )?broker|pipangel\.com/i;

export async function fetchFaqFromApi(): Promise<FaqItem[]> {
  const data = await safeApiGet<ListResponse<FaqItem>>("/faq/", 300);
  return (data?.results ?? [])
    .filter((item) => !OUTDATED_ANSWER.test(`${item.question} ${item.answer}`))
    .map((item) => ({
      ...item,
      question: normalizeBrandText(item.question),
      answer: normalizeBrandText(item.answer),
    }));
}
