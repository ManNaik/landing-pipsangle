import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fetchPublishedArticles, postArticle, type PublishPayload } from "./api";
import { formatReport, runBenchmark } from "./benchmark";
import { loadConfig } from "./config";
import { evaluateGate } from "./gate";
import { articleHash, renderPublishedHtml } from "./render";
import { PIPELINE_DIR, RUNS_DIR, loadRun, resolveRunDir, writeJson } from "./runs";
import { CATEGORIES, INTERNAL_PAGES, type InternalPage, type PublishedArticleSummary, type RunContext } from "./types";
import { briefProblems } from "./validate";

const USAGE = `Content pipeline commands (run from the landing-pipsangle folder):
  npm run content -- new-run               Create a run folder with context.json
  npm run content -- check-brief <run>     Validate the researcher's brief.json
  npm run content -- benchmark <run>       Score article.json against the benchmark
  npm run content -- hash <run>            Print the article fingerprint for review.json
  npm run content -- gate <run>            Check benchmark + review without publishing
  npm run content -- publish <run>         Publish if the gate passes (--draft, --dry-run)`;

const envFile = path.join(PIPELINE_DIR, ".env");
if (existsSync(envFile)) process.loadEnvFile(envFile);
const config = loadConfig();

function categorySlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function newRun(): Promise<number> {
  const now = new Date();
  const iso = now.toISOString();
  const runId = `${iso.slice(0, 10)}-${iso.slice(11, 16).replace(":", "")}-${randomBytes(2).toString("hex")}`;
  const runDir = path.join(RUNS_DIR, runId);
  mkdirSync(path.join(runDir, "sources"), { recursive: true });

  let published: PublishedArticleSummary[] = [];
  try {
    published = await fetchPublishedArticles(config.apiBase);
  } catch (error) {
    console.warn(`Couldn't load published articles from ${config.apiBase} (${(error as Error).message}). Duplicate checks will be limited.`);
  }

  const categoryPages: InternalPage[] = CATEGORIES.filter((category) => published.some((item) => item.category === category)).map(
    (category) => ({ path: `/news/category/${categorySlug(category)}`, title: `${category} news`, useWhen: `linking to more ${category} coverage` })
  );
  const context: RunContext = {
    run_id: runId,
    created_at: iso,
    date: iso.slice(0, 10),
    site_url: config.siteUrl,
    publish_mode: config.publishMode,
    categories: CATEGORIES,
    internal_pages: [...INTERNAL_PAGES, ...categoryPages],
    published_articles: published,
  };
  writeJson(path.join(runDir, "context.json"), context);
  console.log(`Run folder: ${path.relative(process.cwd(), runDir)}`);
  console.log(`Published articles on the site: ${published.length}. Publish mode: ${config.publishMode}.`);
  return 0;
}

function checkBrief(runDir: string): number {
  const { brief } = loadRun(runDir);
  const problems = briefProblems(brief, runDir);
  if (problems.length > 0) {
    console.log(`Brief has ${problems.length} problem(s):\n${problems.map((problem) => `- ${problem}`).join("\n")}`);
    return 1;
  }
  console.log("Brief is complete.");
  return 0;
}

function benchmarkRun(runDir: string) {
  const { context, brief, article, review, sourceTexts } = loadRun(runDir);
  if (!context || !brief || !article) {
    throw new Error("The run needs context.json, brief.json and article.json before it can be benchmarked.");
  }
  const report = runBenchmark({ article, brief, context, sourceTexts });
  writeJson(path.join(runDir, "benchmark.json"), { article_sha256: articleHash(article), ...report });
  return { context, brief, article, review, report };
}

function benchmarkCommand(runDir: string): number {
  const { report } = benchmarkRun(runDir);
  console.log(formatReport(report));
  return report.passed ? 0 : 1;
}

function hashCommand(runDir: string): number {
  const { article } = loadRun(runDir);
  if (!article) throw new Error("article.json is missing or isn't valid JSON.");
  console.log(articleHash(article));
  return 0;
}

async function gateOrPublish(runDir: string, options: { publish: boolean; draft: boolean; dryRun: boolean }): Promise<number> {
  const { context, brief, article, review, report } = benchmarkRun(runDir);
  const hash = articleHash(article);
  const gate = evaluateGate(report, review, hash);
  if (!gate.ok) {
    if (options.publish) writeJson(path.join(runDir, "publish.json"), { status: "blocked", reasons: gate.reasons, at: new Date().toISOString() });
    console.log(`Not publishable:\n${gate.reasons.map((reason) => `- ${reason}`).join("\n")}`);
    if (!report.passed) console.log(`\n${formatReport(report)}`);
    return 1;
  }
  if (!options.publish) {
    console.log("Gate passed: benchmark and independent review both clear this version.");
    return 0;
  }

  const published = options.draft ? false : config.publishMode === "publish";
  const payload: PublishPayload = {
    slug: article.slug,
    title: article.title,
    category: article.category,
    excerpt: article.excerpt,
    content: renderPublishedHtml(article, brief, config.disclosure),
    published,
    published_at: context.date,
    author_name: config.author.name,
    author_title: config.author.title,
    author_url: config.author.url,
    image_url: article.image_url ?? "",
    image_alt: article.image_alt ?? "",
  };

  if (options.dryRun) {
    writeFileSync(path.join(runDir, "publish-preview.html"), payload.content);
    console.log(`Dry run: would ${published ? "publish" : "save as a draft"} "${payload.title}" at ${config.siteUrl}/news/${payload.slug}.`);
    console.log(`Rendered body saved to ${path.relative(process.cwd(), path.join(runDir, "publish-preview.html"))}.`);
    return 0;
  }
  if (!config.token) throw new Error("Set CONTENT_PIPELINE_TOKEN in content-pipeline/.env before publishing.");

  const { status, body } = await postArticle(config.apiBase, config.token, payload);
  const url = `${config.siteUrl}/news/${payload.slug}`;
  if (status !== 201) {
    writeJson(path.join(runDir, "publish.json"), { status: "error", http_status: status, response: body, at: new Date().toISOString() });
    console.log(`Publishing failed (HTTP ${status}): ${JSON.stringify(body)}`);
    return 2;
  }
  writeJson(path.join(runDir, "publish.json"), {
    status: published ? "published" : "draft",
    url,
    article_sha256: hash,
    response: body,
    at: new Date().toISOString(),
  });
  console.log(published ? `Published: ${url}` : `Saved as a draft. Publish it from the admin when ready: ${payload.slug}`);
  return 0;
}

async function main(): Promise<number> {
  const [command, ...args] = process.argv.slice(2);
  const flags = new Set(args.filter((arg) => arg.startsWith("--")));
  const runArg = args.find((arg) => !arg.startsWith("--"));

  switch (command) {
    case "new-run":
      return newRun();
    case "check-brief":
      return checkBrief(resolveRunDir(runArg));
    case "benchmark":
      return benchmarkCommand(resolveRunDir(runArg));
    case "hash":
      return hashCommand(resolveRunDir(runArg));
    case "gate":
      return gateOrPublish(resolveRunDir(runArg), { publish: false, draft: false, dryRun: false });
    case "publish":
      return gateOrPublish(resolveRunDir(runArg), {
        publish: true,
        draft: flags.has("--draft"),
        dryRun: flags.has("--dry-run"),
      });
    default:
      console.log(USAGE);
      return command && command !== "help" ? 2 : 0;
  }
}

main().then(
  (code) => process.exit(code),
  (error: Error) => {
    console.error(error.message);
    process.exit(2);
  }
);
