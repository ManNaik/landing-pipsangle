import { BlogCTA } from "../../components/blog/BlogCTA";
import { BlogExplorer } from "../../components/blog/BlogExplorer";
import { BlogHero } from "../../components/blog/BlogHero";
import { getBlogArticles } from "../../lib/blog";
import {
  buildBreadcrumbSchema,
  buildPageMetadataFromConfig,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Forex Trading Guides and Education",
    description:
      "Forex education, trading guides, risk management, automation, MT5 resources, and PipAngel tutorials.",
    path: "/blog",
    keywords: [
      "forex trading blog",
      "forex education",
      "trading risk management",
      "MT5 automation",
      "PipAngel guides",
    ],
  });
}

export default async function BlogPage() {
  const [posts, siteConfig] = await Promise.all([getBlogArticles(), getSiteConfig()]);
  const siteUrl = resolveSiteUrl(siteConfig);

  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  return (
    <div className="min-w-0 bg-[#050505]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema) }}
      />
      <BlogHero />
      <BlogExplorer articles={posts} />
      <BlogCTA />
    </div>
  );
}
