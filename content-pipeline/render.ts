import { createHash } from "node:crypto";
import type { Article, Brief } from "./types";

export const RISK_NOTE =
  "Trading forex and CFDs carries a high risk of losing money. This article is for information only and is not financial advice.";

/** Fingerprint of everything the reviewer approves. Any edit after review changes it. */
export function articleHash(article: Article): string {
  const canonical = JSON.stringify([
    article.slug,
    article.title,
    article.category,
    article.excerpt,
    article.target_keyword,
    article.content_html,
    article.sources,
    article.image_url ?? "",
    article.image_alt ?? "",
  ]);
  return createHash("sha256").update(canonical).digest("hex");
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function displayDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** The article body as published: the writer's HTML plus sources, risk note and disclosure. */
export function renderPublishedHtml(article: Article, brief: Brief, disclosure: string): string {
  const byId = new Map(brief.sources.map((source) => [source.id, source]));
  const sourceItems = article.sources
    .map((id) => byId.get(id))
    .filter((source) => source !== undefined)
    .map(
      (source) =>
        `<li><a href="${escapeHtml(source.url)}">${escapeHtml(source.title)}</a>, ${escapeHtml(source.publisher)} (accessed ${displayDate(source.accessed)})</li>`
    );

  return [
    article.content_html.trim(),
    "<h2>Sources</h2>",
    `<ul>${sourceItems.join("")}</ul>`,
    `<p><em>${RISK_NOTE}</em></p>`,
    ...(disclosure ? [`<p><em>${escapeHtml(disclosure)}</em></p>`] : []),
  ].join("\n");
}
