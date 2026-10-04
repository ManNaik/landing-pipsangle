import type { BenchmarkReport } from "./benchmark";
import { REVIEW_DIMENSIONS, type Review, type ReviewDimension } from "./types";

/** Accuracy and compliance must be perfect: one wrong number or advice-like line blocks publishing. */
export const REVIEW_THRESHOLDS: Record<ReviewDimension, number> = {
  accuracy: 5,
  compliance: 5,
  originality: 4,
  helpfulness: 4,
  engagement: 4,
  seo: 4,
};

export const MIN_FACT_CHECKS = 5;

export function reviewProblems(review: Review | null, articleHash: string): string[] {
  if (!review) return ["No review.json yet: the independent review hasn't run."];

  const problems: string[] = [];
  if (review.article_sha256 !== articleHash) {
    problems.push("The review is for a different version of the article. Run a fresh review of the final version.");
  }
  if (review.verdict !== "pass") {
    problems.push("The reviewer's verdict is fail.");
  }
  for (const dimension of REVIEW_DIMENSIONS) {
    const score = review.scores?.[dimension];
    if (typeof score !== "number" || score < REVIEW_THRESHOLDS[dimension]) {
      problems.push(`${dimension} scored ${score ?? "nothing"}; publishing needs ${REVIEW_THRESHOLDS[dimension]}.`);
    }
  }
  const factChecks = Array.isArray(review.fact_checks) ? review.fact_checks : [];
  if (factChecks.length < MIN_FACT_CHECKS) {
    problems.push(`Only ${factChecks.length} claims were fact-checked; check at least ${MIN_FACT_CHECKS}.`);
  }
  const unverified = factChecks.filter((check) => check.status !== "verified");
  if (unverified.length > 0) {
    problems.push(`${unverified.length} claim(s) are incorrect or unverifiable: ${unverified.map((check) => check.claim).slice(0, 3).join("; ")}`);
  }
  const blocking = (Array.isArray(review.issues) ? review.issues : []).filter(
    (issue) => issue.severity === "blocker" || issue.severity === "major"
  );
  if (blocking.length > 0) {
    problems.push(`${blocking.length} blocker/major issue(s) remain: ${blocking.map((issue) => issue.problem).slice(0, 3).join("; ")}`);
  }
  return problems;
}

export function evaluateGate(benchmark: BenchmarkReport, review: Review | null, articleHash: string) {
  const reasons = [
    ...(benchmark.passed ? [] : [`The benchmark failed ${benchmark.failures} check(s).`]),
    ...reviewProblems(review, articleHash),
  ];
  return { ok: reasons.length === 0, reasons };
}
