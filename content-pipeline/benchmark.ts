import {
  comparableUrl,
  countOccurrences,
  escapeRegExp,
  hostMatches,
  htmlToText,
  nGrams,
  normalize,
  sentences,
  words,
} from "./text";
import {
  CATEGORIES,
  INTERNAL_PAGES,
  PRIMARY_SOURCE_DOMAINS,
  RESERVED_SLUGS,
  type Article,
  type Brief,
  type RunContext,
} from "./types";

export const LIMITS = {
  titleChars: [30, 65],
  excerptChars: [120, 170],
  words: [700, 2200],
  minH2: 3,
  keywordWindowWords: 100,
  maxKeywordDensity: 0.03,
  minSources: 3,
  minSourceCitations: 2,
  maxInternalLinks: 3,
  copyWindowWords: 12,
  maxQuotedWords: 80,
  maxParagraphWords: 120,
  maxAvgSentenceWords: 24,
  maxBrandMentions: 3,
} as const;

const ALLOWED_TAGS = new Set(["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "a", "blockquote", "br"]);

export const BANNED_CLAIMS: Array<[RegExp, string]> = [
  [/\bguarantee[sd]?\s+(?:a\s+)?(?:profits?|returns?|gains?|income|results)\b/i, "promises guaranteed returns"],
  [/\brisk[-\s]free\b/i, 'says "risk-free"'],
  [/\bno risk\b/i, 'says "no risk"'],
  [/\bcan(?:no|['’])t lose\b/i, "says you can't lose"],
  [/\b100\s?% (?:accurate|accuracy|win|success|guaranteed|safe)\b/i, "makes a 100% claim"],
  [/\bsure[-\s]shot\b/i, 'says "sure-shot"'],
  [/\bget rich\b/i, 'says "get rich"'],
  [/\bdouble your (?:money|account|capital)\b/i, 'says "double your money"'],
  [/\bfinancial freedom\b/i, 'says "financial freedom"'],
  [/\bpassive income\b/i, 'says "passive income"'],
  [/\b(?:will|is going to) (?:definitely|certainly|surely) (?:rise|fall|rally|drop|climb|go)\b/i, "states a price move as certain"],
  [/\binsider (?:tip|information)\b/i, 'mentions "insider" tips'],
  [/\bsecret (?:strategy|system|formula)\b/i, 'mentions a "secret strategy"'],
  [/\b(?:buy|sell) (?:it )?now\b/i, "tells readers to buy or sell"],
];

/** Phrases that make copy read as generic machine writing. */
export const AI_CLICHES = [
  "delve",
  "fast-paced world",
  "ever-evolving",
  "ever-changing landscape",
  "navigating the",
  "navigate the complexities",
  "it's important to note",
  "it is important to note",
  "it's worth noting",
  "it is worth noting",
  "in conclusion",
  "game-changer",
  "game changer",
  "tapestry",
  "embark on",
  "in the realm of",
  "unlock the",
  "harness the power",
  "dive into",
  "deep dive",
  "buckle up",
  "look no further",
  "rest assured",
  "a testament to",
  "pivotal role",
  "crucial role",
  "the world of forex",
  "whether you're a seasoned",
  "elevate your",
  "unleash",
  "supercharge",
  "skyrocket",
  "landscape of",
];

const RELATIVE_TIME = /\b(today|tonight|yesterday|tomorrow|this week|next week|last week|this month)\b/i;
const ABSOLUTE_DATE =
  /\b\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\b|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2}\b|\b\d{4}-\d{2}-\d{2}\b/i;

export type CheckStatus = "pass" | "warn" | "fail";
export type Check = { id: string; status: CheckStatus; message: string };
export type BenchmarkStats = {
  words: number;
  h2: number;
  keywordUses: number;
  keywordDensity: number;
  sourceCitations: number;
  internalLinks: number;
  avgSentenceWords: number;
  quotedWords: number;
};
export type BenchmarkReport = {
  passed: boolean;
  failures: number;
  warnings: number;
  checks: Check[];
  stats: BenchmarkStats;
};

export type BenchmarkInput = {
  article: Article;
  brief: Brief;
  context: RunContext;
  sourceTexts: Record<string, string>;
};

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hrefs(html: string): string[] {
  return [...html.matchAll(/<a\s+href="([^"]*)"\s*>/gi)].map((match) => match[1].trim());
}

/** Text inside blockquotes and quotation marks: allowed as attributed quotes, so excluded from the copy check. */
function splitQuotes(html: string): { unquoted: string; quotedWords: number } {
  let quotedWords = 0;
  const withoutBlockquotes = html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, (_, inner: string) => {
    quotedWords += words(htmlToText(inner)).length;
    return " ";
  });
  const text = htmlToText(withoutBlockquotes).replace(/[“"]([^”"]{10,400})[”"]/g, (_, inner: string) => {
    quotedWords += words(inner).length;
    return " ";
  });
  return { unquoted: text, quotedWords };
}

function copiedPhrase(articleText: string, sourceText: string, size: number): string | null {
  const sourceGrams = nGrams(normalize(sourceText).split(" "), size);
  if (sourceGrams.size === 0) return null;
  for (const gram of nGrams(normalize(articleText).split(" "), size)) {
    if (sourceGrams.has(gram)) return gram;
  }
  return null;
}

export function runBenchmark({ article, brief, context, sourceTexts }: BenchmarkInput): BenchmarkReport {
  const checks: Check[] = [];
  const add = (id: string, status: CheckStatus, message: string) => checks.push({ id, status, message });

  const html = isText(article.content_html) ? article.content_html : "";
  const text = htmlToText(html);
  const allWords = words(text);
  const normText = normalize(text);
  const keyword = normalize(article.target_keyword ?? "");
  const keywordWords = keyword ? keyword.split(" ").length : 1;

  const missing = (["slug", "title", "category", "excerpt", "target_keyword", "content_html"] as const).filter(
    (field) => !isText(article[field])
  );
  if (missing.length > 0 || !Array.isArray(article.sources)) {
    add("schema", "fail", `article.json is missing ${[...missing, ...(Array.isArray(article.sources) ? [] : ["sources"])].join(", ")}.`);
  } else {
    add("schema", "pass", "article.json has every required field.");
  }

  const slug = article.slug ?? "";
  const published = context.published_articles ?? [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3 || slug.length > 80) {
    add("slug", "fail", `Slug "${slug}" must be 3-80 lowercase letters, digits and single hyphens.`);
  } else if (RESERVED_SLUGS.has(slug)) {
    add("slug", "fail", `Slug "${slug}" is reserved by the news archive.`);
  } else if (published.some((item) => item.slug === slug)) {
    add("slug", "fail", `An article with the slug "${slug}" is already published.`);
  } else {
    add("slug", "pass", "Slug is valid and unused.");
  }

  const title = article.title ?? "";
  const [minTitle, maxTitle] = LIMITS.titleChars;
  if (title.length < minTitle || title.length > maxTitle) {
    add("title-length", "fail", `Title is ${title.length} characters; keep it between ${minTitle} and ${maxTitle} so it isn't cut off in search results.`);
  } else {
    add("title-length", "pass", `Title is ${title.length} characters.`);
  }
  if (keyword && countOccurrences(normalize(title), keyword) === 0) {
    add("title-keyword", "fail", `Title must contain the target keyword "${article.target_keyword}".`);
  } else {
    add("title-keyword", "pass", "Title contains the target keyword.");
  }
  if (published.some((item) => item.title.trim().toLowerCase() === title.trim().toLowerCase())) {
    add("title-duplicate", "fail", "An article with this exact title is already published.");
  }

  const excerpt = article.excerpt ?? "";
  const [minExcerpt, maxExcerpt] = LIMITS.excerptChars;
  if (excerpt.length < minExcerpt || excerpt.length > maxExcerpt) {
    add("excerpt-length", "fail", `Excerpt is ${excerpt.length} characters; it doubles as the search snippet, so keep it between ${minExcerpt} and ${maxExcerpt}.`);
  } else {
    add("excerpt-length", "pass", `Excerpt is ${excerpt.length} characters.`);
  }
  if (keyword && countOccurrences(normalize(excerpt), keyword) === 0) {
    add("excerpt-keyword", "warn", "Excerpt doesn't contain the target keyword.");
  }

  if (!(CATEGORIES as readonly string[]).includes(article.category)) {
    add("category", "fail", `Category must be one of: ${CATEGORIES.join(", ")}.`);
  } else {
    add("category", "pass", `Category is ${article.category}.`);
  }

  const badTags = new Set<string>();
  const badAttributes = new Set<string>();
  for (const match of html.matchAll(/<\s*(\/)?\s*([a-zA-Z0-9]+)([^>]*)>/g)) {
    const tag = match[2].toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      badTags.add(tag);
      continue;
    }
    if (match[1]) continue;
    const attributes = match[3].trim().replace(/\/$/, "").trim();
    if (tag === "a" ? !/^href="[^"]*"$/.test(attributes) : attributes.length > 0) {
      badAttributes.add(`<${tag} ${attributes}>`);
    }
  }
  if (badTags.size > 0) {
    add("html-tags", "fail", `Only ${[...ALLOWED_TAGS].join(", ")} are allowed. Found: ${[...badTags].join(", ")}.`);
  } else if (badAttributes.size > 0) {
    add("html-tags", "fail", `Remove attributes other than href on links: ${[...badAttributes].slice(0, 3).join(" ")}`);
  } else {
    add("html-tags", "pass", "HTML uses allowed tags only.");
  }

  const [minWords, maxWords] = LIMITS.words;
  if (allWords.length < minWords || allWords.length > maxWords) {
    add("length", "fail", `Article is ${allWords.length} words; aim for ${minWords}-${maxWords}.`);
  } else {
    add("length", "pass", `Article is ${allWords.length} words.`);
  }

  const h2Texts = [...html.matchAll(/<h2>([\s\S]*?)<\/h2>/gi)].map((match) => htmlToText(match[1]).toLowerCase());
  if (/<h1[\s>]/i.test(html)) {
    add("headings", "fail", "Don't use <h1> in the body; the title is the page's only H1.");
  } else if (h2Texts.length < LIMITS.minH2) {
    add("headings", "fail", `Use at least ${LIMITS.minH2} <h2> subheadings; found ${h2Texts.length}.`);
  } else if (h2Texts.some((heading) => /^(sources|references|disclaimer)$/.test(heading.trim()))) {
    add("headings", "fail", "Remove the Sources/Disclaimer section; the publish step adds it from the brief.");
  } else {
    add("headings", "pass", `${h2Texts.length} subheadings.`);
  }

  const opening = normalize(allWords.slice(0, LIMITS.keywordWindowWords).join(" "));
  if (keyword && countOccurrences(opening, keyword) === 0) {
    add("keyword-opening", "fail", `Use the target keyword within the first ${LIMITS.keywordWindowWords} words.`);
  } else {
    add("keyword-opening", "pass", "Target keyword appears early.");
  }
  const keywordUses = keyword ? countOccurrences(normText, keyword) : 0;
  const keywordDensity = allWords.length ? (keywordUses * keywordWords) / allWords.length : 0;
  if (keywordDensity > LIMITS.maxKeywordDensity) {
    add("keyword-density", "fail", `Target keyword makes up ${(keywordDensity * 100).toFixed(1)}% of the text; above ${LIMITS.maxKeywordDensity * 100}% reads as keyword stuffing.`);
  } else {
    add("keyword-density", "pass", `Target keyword used ${keywordUses} times (${(keywordDensity * 100).toFixed(1)}%).`);
  }
  const secondary = (article.secondary_keywords ?? []).filter((term) => countOccurrences(normText, normalize(term)) > 0);
  if ((article.secondary_keywords ?? []).length > 0 && secondary.length === 0) {
    add("secondary-keywords", "warn", "None of the secondary keywords appear in the text.");
  }

  const links = hrefs(html);
  const internal = links.filter((href) => href.startsWith("/"));
  const external = links.filter((href) => !href.startsWith("/"));
  const knownInternal = new Set<string>([
    ...INTERNAL_PAGES.map((page) => page.path),
    ...(context.internal_pages ?? []).map((page) => page.path),
    ...published.map((item) => `/news/${item.slug}`),
  ]);
  const unknownInternal = internal.filter((href) => !knownInternal.has(href.replace(/[#?].*$/, "").replace(/\/+$/, "") || "/"));
  const insecure = external.filter((href) => !href.startsWith("https://"));
  if (insecure.length > 0) {
    add("links-https", "fail", `External links must use https: ${insecure.slice(0, 3).join(", ")}`);
  }
  if (unknownInternal.length > 0) {
    add("links-internal", "fail", `These site links may 404; use paths from context.json: ${unknownInternal.join(", ")}`);
  } else if (internal.length === 0) {
    add("links-internal", "fail", "Link to at least one relevant page on the site (see internal_pages in context.json).");
  } else if (internal.length > LIMITS.maxInternalLinks) {
    add("links-internal", "warn", `${internal.length} site links; more than ${LIMITS.maxInternalLinks} starts to read as promotion.`);
  } else {
    add("links-internal", "pass", `${internal.length} site link(s).`);
  }

  const sourcesById = new Map((brief.sources ?? []).map((source) => [source.id, source]));
  const articleSources = Array.isArray(article.sources) ? article.sources : [];
  const unknownSources = articleSources.filter((id) => !sourcesById.has(id));
  const citedSources = articleSources.map((id) => sourcesById.get(id)).filter((source) => source !== undefined);
  const sourceUrls = new Set(citedSources.map((source) => comparableUrl(source.url)));
  const citations = external.filter((href) => sourceUrls.has(comparableUrl(href))).length;
  const uncited = external.filter((href) => !sourceUrls.has(comparableUrl(href)));
  if (unknownSources.length > 0) {
    add("sources", "fail", `Unknown source ids (not in brief.json): ${unknownSources.join(", ")}`);
  } else if (citedSources.length < LIMITS.minSources) {
    add("sources", "fail", `List at least ${LIMITS.minSources} sources from the brief; found ${citedSources.length}.`);
  } else if (!citedSources.some((source) => hostMatches(source.url, PRIMARY_SOURCE_DOMAINS))) {
    add("sources", "fail", "At least one source must be an official publisher (central bank, statistics agency or data owner).");
  } else {
    add("sources", "pass", `${citedSources.length} sources, including an official one.`);
  }
  if (citations < LIMITS.minSourceCitations) {
    add("citations", "fail", `Link to listed sources inline at least ${LIMITS.minSourceCitations} times where their facts are used; found ${citations}.`);
  } else {
    add("citations", "pass", `${citations} inline source citations.`);
  }
  if (uncited.length > 0) {
    add("links-external", "warn", `Links not in the source list: ${uncited.slice(0, 3).join(", ")}`);
  }

  const { unquoted, quotedWords } = splitQuotes(html);
  if (quotedWords > LIMITS.maxQuotedWords) {
    add("quotes", "fail", `${quotedWords} words are direct quotes; keep quotes under ${LIMITS.maxQuotedWords} words and write the rest in your own words.`);
  }
  const copyHits: string[] = [];
  const unchecked: string[] = [];
  for (const source of citedSources) {
    const sourceText = sourceTexts[source.id];
    if (!sourceText) {
      unchecked.push(source.id);
      continue;
    }
    const phrase = copiedPhrase(unquoted, sourceText, LIMITS.copyWindowWords);
    if (phrase) copyHits.push(`${source.id}: "${phrase}"`);
  }
  if (copyHits.length > 0) {
    add("originality", "fail", `Text copied from sources (rewrite in your own words or quote with attribution): ${copyHits.slice(0, 3).join("; ")}`);
  } else {
    add("originality", "pass", `No ${LIMITS.copyWindowWords}-word passages shared with the sources.`);
  }
  if (unchecked.length > 0) {
    add("originality-coverage", "warn", `No saved text for ${unchecked.join(", ")}, so copying couldn't be checked against them.`);
  }

  const claimText = `${title}\n${excerpt}\n${text}`;
  const claims = BANNED_CLAIMS.filter(([pattern]) => pattern.test(claimText)).map(([, label]) => label);
  if (claims.length > 0) {
    add("compliance", "fail", `Remove promotional or advice-like wording: the text ${claims.join("; ")}.`);
  } else {
    add("compliance", "pass", "No guarantees, hype or buy/sell instructions.");
  }

  const lowered = claimText.toLowerCase().replace(/[’‘]/g, "'");
  const cliches = AI_CLICHES.filter((phrase) => new RegExp(`(?<![a-z])${escapeRegExp(phrase)}`).test(lowered));
  if (cliches.length >= 3) {
    add("voice", "fail", `Reads like generic AI copy: ${cliches.join(", ")}. Say it plainly instead.`);
  } else if (cliches.length > 0) {
    add("voice", "warn", `Generic phrasing to replace: ${cliches.join(", ")}.`);
  } else {
    add("voice", "pass", "No stock AI phrasing.");
  }

  const sentenceList = sentences(text);
  const avgSentenceWords = sentenceList.length ? allWords.length / sentenceList.length : 0;
  if (avgSentenceWords > LIMITS.maxAvgSentenceWords) {
    add("readability", "warn", `Sentences average ${avgSentenceWords.toFixed(1)} words; aim for under ${LIMITS.maxAvgSentenceWords}.`);
  }
  const longParagraphs = [...html.matchAll(/<p>([\s\S]*?)<\/p>/gi)].filter(
    (match) => words(htmlToText(match[1])).length > LIMITS.maxParagraphWords
  ).length;
  if (longParagraphs > 0) {
    add("paragraphs", "warn", `${longParagraphs} paragraph(s) over ${LIMITS.maxParagraphWords} words; split them for phone readers.`);
  }
  if ((text.match(/!/g) ?? []).length > 1) {
    add("tone", "warn", "More than one exclamation mark; keep the tone calm.");
  }
  if (RELATIVE_TIME.test(text) && !ABSOLUTE_DATE.test(text)) {
    add("dates", "warn", 'Uses words like "this week" without an actual date; articles stay online, so give the date.');
  }
  const brandMentions = (text.match(/PipsAngel/g) ?? []).length;
  if (brandMentions > LIMITS.maxBrandMentions) {
    add("promotion", "warn", `PipsAngel is mentioned ${brandMentions} times; keep the article informational.`);
  }
  if ((article.revision ?? 1) > 1 && !(article.changelog ?? []).length) {
    add("changelog", "warn", "Revised article has no changelog of what changed.");
  }

  const failures = checks.filter((check) => check.status === "fail").length;
  const warnings = checks.filter((check) => check.status === "warn").length;
  return {
    passed: failures === 0,
    failures,
    warnings,
    checks,
    stats: {
      words: allWords.length,
      h2: h2Texts.length,
      keywordUses,
      keywordDensity: Number(keywordDensity.toFixed(4)),
      sourceCitations: citations,
      internalLinks: internal.length,
      avgSentenceWords: Number(avgSentenceWords.toFixed(1)),
      quotedWords,
    },
  };
}

export function formatReport(report: BenchmarkReport): string {
  const icon: Record<CheckStatus, string> = { pass: "PASS", warn: "WARN", fail: "FAIL" };
  const lines = report.checks
    .filter((check) => check.status !== "pass")
    .map((check) => `${icon[check.status]}  ${check.id}: ${check.message}`);
  const head = report.passed
    ? `Benchmark passed (${report.warnings} warning${report.warnings === 1 ? "" : "s"}).`
    : `Benchmark failed: ${report.failures} failing check${report.failures === 1 ? "" : "s"}, ${report.warnings} warning${report.warnings === 1 ? "" : "s"}.`;
  return [head, ...lines].join("\n");
}
