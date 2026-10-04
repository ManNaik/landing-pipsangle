import type { MetadataRoute } from "next";
import { getSiteUrl } from "./lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = await getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/signup",
          "/dashboard",
          "/onboarding",
          "/trades",
          "/store",
          "/control",
          "/subscription",
          "/admin",
          "/preview",
          "/api/",
        ],
      },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/news-sitemap.xml`],
  };
}
