import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Article, Brief, Review, RunContext } from "./types";

export const PIPELINE_DIR = path.join(process.cwd(), "content-pipeline");
export const RUNS_DIR = path.join(PIPELINE_DIR, "runs");

export function resolveRunDir(arg: string | undefined): string {
  if (!arg) throw new Error("Pass the run folder, for example content-pipeline/runs/2026-10-03-0215-k3f9.");
  for (const candidate of [path.resolve(arg), path.join(RUNS_DIR, arg)]) {
    if (existsSync(path.join(candidate, "context.json"))) return candidate;
  }
  throw new Error(`No run found at ${arg}. Start one with: npm run content -- new-run`);
}

export function readJson<T>(file: string): T | null {
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

export function writeJson(file: string, data: unknown): void {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

export function loadRun(runDir: string) {
  const context = readJson<RunContext>(path.join(runDir, "context.json"));
  const brief = readJson<Brief>(path.join(runDir, "brief.json"));
  const article = readJson<Article>(path.join(runDir, "article.json"));
  const review = readJson<Review>(path.join(runDir, "review.json"));

  const sourceTexts: Record<string, string> = {};
  for (const source of brief?.sources ?? []) {
    const file = source.text_file ? path.resolve(runDir, source.text_file) : "";
    if (file.startsWith(path.resolve(runDir)) && existsSync(file)) sourceTexts[source.id] = readFileSync(file, "utf8");
  }
  return { context, brief, article, review, sourceTexts };
}
