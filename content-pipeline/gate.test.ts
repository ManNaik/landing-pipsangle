import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { runBenchmark } from "./benchmark";
import { BRIEF, CONTEXT, SOURCE_TEXTS, goodArticle, passingReview } from "./fixtures";
import { evaluateGate } from "./gate";
import { RISK_NOTE, articleHash, renderPublishedHtml } from "./render";
import type { Brief } from "./types";
import { briefProblems } from "./validate";

const article = goodArticle();
const hash = articleHash(article);
const benchmark = runBenchmark({ article, brief: BRIEF, context: CONTEXT, sourceTexts: SOURCE_TEXTS });

test("benchmark plus a passing review of this exact version opens the gate", () => {
  assert.deepEqual(evaluateGate(benchmark, passingReview(hash), hash), { ok: true, reasons: [] });
});

test("the gate stays shut without a review or after the article changes", () => {
  assert.equal(evaluateGate(benchmark, null, hash).ok, false);
  const edited = articleHash(goodArticle({ excerpt: `${article.excerpt} ` }));
  assert.notEqual(edited, hash);
  assert.equal(evaluateGate(benchmark, passingReview(hash), edited).ok, false);
});

test("accuracy and compliance must be perfect, the rest at least 4", () => {
  const accuracy = passingReview(hash, { scores: { ...passingReview(hash).scores, accuracy: 4 } });
  assert.equal(evaluateGate(benchmark, accuracy, hash).ok, false);
  const engagement = passingReview(hash, { scores: { ...passingReview(hash).scores, engagement: 3 } });
  assert.equal(evaluateGate(benchmark, engagement, hash).ok, false);
});

test("every checked claim must be verified, and enough claims must be checked", () => {
  const review = passingReview(hash);
  const unverifiable = { ...review, fact_checks: [...review.fact_checks, { claim: "Rates rose", status: "unverifiable" as const, source_url: "" }] };
  assert.equal(evaluateGate(benchmark, unverifiable, hash).ok, false);
  assert.equal(evaluateGate(benchmark, { ...review, fact_checks: review.fact_checks.slice(0, 2) }, hash).ok, false);
});

test("blocking issues, a fail verdict or a failed benchmark shut the gate", () => {
  const major = passingReview(hash, { issues: [{ severity: "major", location: "h2", problem: "Wrong date", fix: "Fix it" }] });
  assert.equal(evaluateGate(benchmark, major, hash).ok, false);
  assert.equal(evaluateGate(benchmark, passingReview(hash, { verdict: "fail" }), hash).ok, false);
  assert.equal(evaluateGate({ ...benchmark, passed: false, failures: 1 }, passingReview(hash), hash).ok, false);
});

test("published HTML adds sources, the risk note and the disclosure", () => {
  const brief: Brief = { ...BRIEF, sources: [{ ...BRIEF.sources[0], title: "Jobs <report> & more" }, ...BRIEF.sources.slice(1)] };
  const html = renderPublishedHtml(article, brief, "Made with AI help.");
  assert.match(html, /<h2>Sources<\/h2>\s*<ul><li><a href="https:\/\/www\.bls\.gov\/news\.release\/empsit\.toc\.htm">Jobs &lt;report&gt; &amp; more<\/a>, U\.S\. Bureau of Labor Statistics \(accessed 3 Oct 2026\)<\/li>/);
  assert.ok(html.includes(RISK_NOTE));
  assert.ok(html.endsWith("<p><em>Made with AI help.</em></p>"));
  assert.ok(!renderPublishedHtml(article, BRIEF, "").includes("AI help"));
});

test("brief validation requires saved source text, an official source and sourced facts", () => {
  const runDir = mkdtempSync(path.join(tmpdir(), "pipeline-brief-"));
  mkdirSync(path.join(runDir, "sources"));
  for (const [id, text] of Object.entries(SOURCE_TEXTS)) writeFileSync(path.join(runDir, "sources", `${id}.md`), text.repeat(2));
  const candidate = {
    topic: "NFP",
    angle: "Explainer",
    target_keyword: "nonfarm payrolls",
    secondary_keywords: [],
    search_intent: "informational",
    demand_evidence: ["Release this week"],
    timeliness: "2 Oct",
    traffic_potential: "high" as const,
    score: 80,
  };
  const brief: Brief = {
    ...BRIEF,
    candidates: [candidate, candidate, candidate],
    selected: {
      ...BRIEF.selected,
      facts: Array.from({ length: 5 }, (_, index) => ({ claim: `Fact ${index}`, source_id: "s1", quote: "q", as_of: "2026-10-02" })),
    },
  };
  assert.deepEqual(briefProblems(brief, runDir), []);
  assert.ok(briefProblems({ ...brief, sources: brief.sources.map((source) => ({ ...source, url: "https://www.example-news.com/x" })) }, runDir).length > 0);
  assert.ok(briefProblems({ ...brief, sources: [...brief.sources, { ...brief.sources[0], id: "s4", text_file: "sources/missing.md" }] }, runDir).length > 0);
  assert.ok(briefProblems({ ...brief, sources: [{ ...brief.sources[0], text_file: "../../etc/passwd" }, ...brief.sources.slice(1)] }, runDir).length > 0);
});
