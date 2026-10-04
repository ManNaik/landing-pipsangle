import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { hostMatches } from "./text";
import { CATEGORIES, PRIMARY_SOURCE_DOMAINS, type Brief } from "./types";

export const MIN_CANDIDATES = 3;
export const MIN_FACTS = 5;
export const MIN_BRIEF_SOURCES = 3;
const MIN_SOURCE_TEXT_CHARS = 200;

/** Problems that would stop the writer from producing a well-sourced article. */
export function briefProblems(brief: Brief | null, runDir: string): string[] {
  if (!brief) return ["brief.json is missing or isn't valid JSON."];
  const problems: string[] = [];

  const candidates = Array.isArray(brief.candidates) ? brief.candidates : [];
  if (candidates.length < MIN_CANDIDATES) {
    problems.push(`List at least ${MIN_CANDIDATES} ranked topic candidates; found ${candidates.length}.`);
  }
  candidates.forEach((candidate, index) => {
    if (!candidate.topic || !candidate.target_keyword) problems.push(`Candidate ${index} needs a topic and target_keyword.`);
    if (!Array.isArray(candidate.demand_evidence) || candidate.demand_evidence.length === 0) {
      problems.push(`Candidate ${index} needs demand_evidence explaining why people search for it.`);
    }
  });

  const selected = brief.selected;
  if (!selected || !Number.isInteger(selected.candidate_index) || !candidates[selected.candidate_index]) {
    problems.push("selected.candidate_index must point at one of the candidates.");
  }
  if (!selected || !(CATEGORIES as readonly string[]).includes(selected.category)) {
    problems.push(`selected.category must be one of: ${CATEGORIES.join(", ")}.`);
  }

  const sources = Array.isArray(brief.sources) ? brief.sources : [];
  const ids = new Set<string>();
  sources.forEach((source) => {
    if (!source.id || ids.has(source.id)) problems.push(`Source ids must be unique and non-empty (problem with "${source.id}").`);
    ids.add(source.id);
    if (!/^https:\/\//.test(source.url ?? "")) problems.push(`Source ${source.id} needs an https URL.`);
    if (!source.title || !source.publisher || !source.accessed) problems.push(`Source ${source.id} needs title, publisher and accessed date.`);
    const file = source.text_file ? path.resolve(runDir, source.text_file) : "";
    if (!file || !file.startsWith(path.resolve(runDir)) || !existsSync(file)) {
      problems.push(`Source ${source.id} needs its text saved in the run folder (text_file).`);
    } else if (readFileSync(file, "utf8").trim().length < MIN_SOURCE_TEXT_CHARS) {
      problems.push(`Saved text for source ${source.id} is nearly empty.`);
    }
  });
  if (sources.length < MIN_BRIEF_SOURCES) {
    problems.push(`Collect at least ${MIN_BRIEF_SOURCES} sources; found ${sources.length}.`);
  }
  if (!sources.some((source) => hostMatches(source.url, PRIMARY_SOURCE_DOMAINS))) {
    problems.push("Include at least one official source (central bank, statistics agency or data owner).");
  }

  const facts = Array.isArray(selected?.facts) ? selected.facts : [];
  if (facts.length < MIN_FACTS) {
    problems.push(`Record at least ${MIN_FACTS} sourced facts for the writer; found ${facts.length}.`);
  }
  facts.forEach((fact, index) => {
    if (!fact.claim || !ids.has(fact.source_id)) problems.push(`Fact ${index} needs a claim and a source_id from sources.`);
  });

  return problems;
}
