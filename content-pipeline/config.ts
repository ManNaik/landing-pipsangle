export type PublishMode = "publish" | "draft";

export const DEFAULT_DISCLOSURE =
  "This article was researched and written with the help of AI tools, checked against the sources listed above, and reviewed before publishing.";

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const trimmed = (value: string | undefined) => (value ?? "").trim();
  return {
    apiBase: (trimmed(env.CONTENT_API_BASE) || "https://api.pipsangel.com").replace(/\/+$/, ""),
    siteUrl: (trimmed(env.CONTENT_SITE_URL) || "https://pipsangel.com").replace(/\/+$/, ""),
    token: trimmed(env.CONTENT_PIPELINE_TOKEN),
    publishMode: (trimmed(env.CONTENT_PUBLISH_MODE) === "draft" ? "draft" : "publish") as PublishMode,
    author: {
      name: trimmed(env.CONTENT_AUTHOR_NAME),
      title: trimmed(env.CONTENT_AUTHOR_TITLE),
      url: trimmed(env.CONTENT_AUTHOR_URL),
    },
    disclosure: env.CONTENT_DISCLOSURE === undefined ? DEFAULT_DISCLOSURE : env.CONTENT_DISCLOSURE.trim(),
  };
}

export type PipelineConfig = ReturnType<typeof loadConfig>;
