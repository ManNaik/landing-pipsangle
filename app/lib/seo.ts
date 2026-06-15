import type { Metadata } from "next";
import { safeApiGet } from "./api";
import type { SiteConfig } from "./types";

const DEFAULT_SITE_URL = "https://pipangel.com";
const DEFAULT_BRAND = "PipAngel";

export async function getSiteConfig(): Promise<SiteConfig | null> {
  return safeApiGet<SiteConfig>("/site-config/", 3600);
}

export function resolveSiteUrl(config?: SiteConfig | null): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    config?.site_url ??
    DEFAULT_SITE_URL
  ).replace(/\/$/, "");
}

export async function getSiteUrl(): Promise<string> {
  const config = await getSiteConfig();
  return resolveSiteUrl(config);
}

export type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  siteUrl?: string;
  brandName?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  siteUrl = DEFAULT_SITE_URL,
  brandName = DEFAULT_BRAND,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = normalizedPath;
  const fullTitle = title.includes(brandName) ? title : `${title} | ${brandName}`;

  const openGraph = {
    title: fullTitle,
    description,
    type,
    url: canonical,
    siteName: brandName,
    ...(type === "article" && publishedTime
      ? {
          publishedTime,
          ...(modifiedTime ? { modifiedTime } : {}),
        }
      : {}),
  } satisfies Metadata["openGraph"];

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: { canonical },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}

export async function buildPageMetadataFromConfig(
  options: Omit<PageMetadataOptions, "siteUrl" | "brandName">
): Promise<Metadata> {
  const config = await getSiteConfig();
  return buildPageMetadata({
    ...options,
    siteUrl: resolveSiteUrl(config),
    brandName: config?.brand_name ?? DEFAULT_BRAND,
  });
}

export function absoluteUrl(siteUrl: string, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl.replace(/\/$/, "")}${normalizedPath}`;
}

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return JSON.stringify(data);
}

export function buildOrganizationSchema(siteUrl: string, brandName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: siteUrl,
    logo: absoluteUrl(siteUrl, "/icon"),
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@pipangel.com",
      contactType: "customer support",
    },
  };
}

export function buildWebSiteSchema(siteUrl: string, brandName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brandName,
    url: siteUrl,
  };
}

export function buildFAQPageSchema(
  items: Array<{ question: string; answer: string }>,
  siteUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    url: absoluteUrl(siteUrl, "/faq"),
  };
}

export function buildBreadcrumbSchema(
  siteUrl: string,
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(siteUrl, item.path),
    })),
  };
}

export function buildServiceSchema(
  siteUrl: string,
  brandName: string,
  options: {
    name: string;
    description: string;
    path: string;
    serviceType: string;
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: options.name,
    description: options.description,
    serviceType: options.serviceType,
    url: absoluteUrl(siteUrl, options.path),
    provider: {
      "@type": "Organization",
      name: brandName,
      url: siteUrl,
    },
  };
}

export function buildHowToSchema(
  siteUrl: string,
  options: {
    name: string;
    description: string;
    path: string;
    steps: string[];
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: options.name,
    description: options.description,
    url: absoluteUrl(siteUrl, options.path),
    step: options.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: text,
      text,
    })),
  };
}

export function buildProductOfferSchema(
  siteUrl: string,
  brandName: string,
  plan: {
    name: string;
    description: string;
    price: number;
    url: string;
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: plan.name,
    description: plan.description,
    brand: { "@type": "Brand", name: brandName },
    offers: {
      "@type": "Offer",
      price: plan.price,
      priceCurrency: "USD",
      url: absoluteUrl(siteUrl, plan.url),
      availability: "https://schema.org/InStock",
    },
  };
}

export function buildBlogPostingSchema(
  siteUrl: string,
  brandName: string,
  post: {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    updatedAt?: string;
  }
) {
  const url = absoluteUrl(siteUrl, `/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: { "@type": "Organization", name: brandName },
    publisher: {
      "@type": "Organization",
      name: brandName,
      logo: { "@type": "ImageObject", url: absoluteUrl(siteUrl, "/icon") },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

export function buildNewsArticleSchema(
  siteUrl: string,
  brandName: string,
  article: {
    title: string;
    excerpt: string;
    slug: string;
    date: string;
    updatedAt?: string;
  }
) {
  const url = absoluteUrl(siteUrl, `/news/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.updatedAt ?? article.date,
    author: { "@type": "Organization", name: brandName },
    publisher: {
      "@type": "Organization",
      name: brandName,
      logo: { "@type": "ImageObject", url: absoluteUrl(siteUrl, "/icon") },
    },
    image: absoluteUrl(siteUrl, "/opengraph-image"),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

