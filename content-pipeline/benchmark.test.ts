import assert from "node:assert/strict";
import { test } from "node:test";
import { runBenchmark, type BenchmarkReport } from "./benchmark";
import { BRIEF, CONTEXT, SOURCE_TEXTS, goodArticle } from "./fixtures";
import type { Article, Brief } from "./types";

function bench(article: Article, brief: Brief = BRIEF, sourceTexts = SOURCE_TEXTS): BenchmarkReport {
  return runBenchmark({ article, brief, context: CONTEXT, sourceTexts });
}

function status(report: BenchmarkReport, id: string) {
  return report.checks.find((check) => check.id === id)?.status;
}

function withParagraph(html: string): Article {
  const article = goodArticle();
  return { ...article, content_html: article.content_html.replace("<h2>What to watch next</h2>", `${html}<h2>What to watch next</h2>`) };
}

test("a well-formed article passes", () => {
  const report = bench(goodArticle());
  assert.equal(report.passed, true, JSON.stringify(report.checks.filter((check) => check.status === "fail")));
  assert.equal(report.stats.sourceCitations, 2);
  assert.equal(report.stats.internalLinks, 1);
});

test("the title must carry the target keyword and fit search results", () => {
  assert.equal(status(bench(goodArticle({ title: "What the jobs report means for forex traders" })), "title-keyword"), "fail");
  assert.equal(status(bench(goodArticle({ title: "Nonfarm payrolls" })), "title-length"), "fail");
});

test("only article HTML is allowed", () => {
  assert.equal(status(bench(withParagraph("<script>alert(1)</script>")), "html-tags"), "fail");
  assert.equal(status(bench(withParagraph('<p class="lead">Styled</p>')), "html-tags"), "fail");
  assert.equal(status(bench(withParagraph('<p><a href="https://www.bls.gov/" target="_blank">x</a></p>')), "html-tags"), "fail");
});

test("text copied from a source fails, attributed quotes don't", () => {
  const copied = "<p>Currency markets often move sharply in the minutes after major United States labour data.</p>";
  assert.equal(status(bench(withParagraph(copied)), "originality"), "fail");
  const quoted = "<blockquote>Currency markets often move sharply in the minutes after major United States labour data.</blockquote>";
  assert.equal(status(bench(withParagraph(quoted)), "originality"), "pass");
});

test("long quotation is not a way around the originality check", () => {
  const longQuote = `<blockquote>${"word ".repeat(90)}</blockquote>`;
  assert.equal(status(bench(withParagraph(longQuote)), "quotes"), "fail");
});

test("promotional or advice-like claims fail", () => {
  assert.equal(status(bench(withParagraph("<p>This setup is risk-free for patient traders.</p>")), "compliance"), "fail");
  assert.equal(status(bench(withParagraph("<p>Buy now before the release.</p>")), "compliance"), "fail");
  assert.equal(status(bench(withParagraph("<p>The ECB signalled a pause, so euro traders reassessed.</p>")), "compliance"), "pass");
});

test("stock AI phrasing warns once and fails when it piles up", () => {
  assert.equal(status(bench(withParagraph("<p>Let's delve into the details.</p>")), "voice"), "warn");
  const heavy = "<p>Let's delve into the ever-evolving market. It's important to note that this is a game-changer.</p>";
  assert.equal(status(bench(withParagraph(heavy)), "voice"), "fail");
});

test("site links must exist and at least one is required", () => {
  assert.equal(status(bench(withParagraph('<p>See <a href="/blog/missing-post">this</a>.</p>')), "links-internal"), "fail");
  const article = goodArticle();
  const noInternal = { ...article, content_html: article.content_html.replace('<a href="/automated-forex-trading">copy trading</a>', "copy trading") };
  assert.equal(status(bench(noInternal), "links-internal"), "fail");
  assert.equal(status(bench(withParagraph('<p>Older <a href="/news/older-article">coverage</a>.</p>')), "links-internal"), "pass");
});

test("sources must be cited inline and include an official publisher", () => {
  const article = goodArticle();
  const oneCitation = {
    ...article,
    content_html: article.content_html.replace(
      '<a href="https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm">Federal Reserve calendar</a>',
      "Federal Reserve calendar"
    ),
  };
  assert.equal(status(bench(oneCitation), "citations"), "fail");

  const secondaryOnly: Brief = {
    ...BRIEF,
    sources: BRIEF.sources.map((source) => ({ ...source, url: `https://www.example-news.com/${source.id}` })),
  };
  assert.equal(status(bench(goodArticle(), secondaryOnly), "sources"), "fail");
  assert.equal(status(bench(goodArticle({ sources: ["s1", "s9"] })), "sources"), "fail");
});

test("duplicates, stuffing and a hand-written sources section fail", () => {
  assert.equal(status(bench(goodArticle({ slug: "older-article" })), "slug"), "fail");
  assert.equal(status(bench(goodArticle({ slug: "page" })), "slug"), "fail");
  const stuffed = withParagraph(`<p>${"nonfarm payrolls ".repeat(30)}</p>`);
  assert.equal(status(bench(stuffed), "keyword-density"), "fail");
  assert.equal(status(bench(withParagraph("<h2>Sources</h2><ul><li>BLS</li></ul>")), "headings"), "fail");
});

test("missing source text is reported rather than silently skipped", () => {
  const report = bench(goodArticle(), BRIEF, { s1: SOURCE_TEXTS.s1 });
  assert.equal(status(report, "originality-coverage"), "warn");
  assert.equal(report.passed, true);
});
