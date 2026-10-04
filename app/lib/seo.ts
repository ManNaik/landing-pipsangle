import type { Metadata } from "next";
import { safeApiGet } from "./api";
import { BRAND_NAME, SITE_URL, normalizeSiteUrl } from "./brand";
import { sanitizeSiteConfig } from "./defaultSiteConfig";
import type { SiteConfig } from "./types";

const DEFAULT_SITE_URL = SITE_URL;
const DEFAULT_BRAND = BRAND_NAME;

/** Active site config from the CMS, merged over defaults and repaired. Never null. */
export async function getSiteConfig(): Promise<SiteConfig> {
  const config = await safeApiGet<Partial<SiteConfig>>("/site-config/", 3600);
  return sanitizeSiteConfig(config);
}

export function resolveSiteUrl(config?: SiteConfig | null): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || config?.site_url);
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
  /** Lets crawlers follow links on a page kept out of the index. Defaults to the opposite of noIndex. */
  follow?: boolean;
  image?: string;
  authors?: string[];
  feed?: { url: string; title: string };
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
  follow,
  image,
  authors,
  feed,
}: PageMetadataOptions): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = normalizedPath;
  const fullTitle = title.includes(brandName) ? title : `${title} | ${brandName}`;
  const ogImage = image ?? "/opengraph-image";

  const openGraph = {
    title: fullTitle,
    description,
    type,
    url: canonical,
    siteName: brandName,
    images: [{ url: ogImage }],
    ...(type === "article" && publishedTime
      ? {
          publishedTime,
          ...(modifiedTime ? { modifiedTime } : {}),
          ...(authors?.length ? { authors } : {}),
        }
      : {}),
  } satisfies Metadata["openGraph"];

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
      ...(feed ? { types: { "application/rss+xml": [{ url: feed.url, title: feed.title }] } } : {}),
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: follow ?? !noIndex,
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
  // CMS text ends up in these blocks; escape "<" so it can't close the script tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildOrganizationSchema(siteUrl: string, config: SiteConfig) {
  const sameAs = [
    ...(config.social_links ?? []).map((link) => link.url),
    config.telegram_url,
    config.whatsapp_url,
  ].filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.brand_name,
    ...(config.legal_name ? { legalName: config.legal_name } : {}),
    url: siteUrl,
    logo: absoluteUrl(siteUrl, "/brand/pipsangel-mark-512.png"),
    ...(config.registered_address ? { address: config.registered_address } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      email: config.support_email,
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
    originalPrice?: number;
    url: string;
  }
) {
  const offers: Record<string, unknown> = {
    "@type": "Offer",
    price: plan.price,
    priceCurrency: "USD",
    url: absoluteUrl(siteUrl, plan.url),
    availability: "https://schema.org/InStock",
  };

  if (plan.originalPrice != null && plan.originalPrice > plan.price) {
    offers.priceSpecification = [
      {
        "@type": "UnitPriceSpecification",
        price: plan.originalPrice,
        priceCurrency: "USD",
        priceType: "https://schema.org/ListPrice",
      },
      {
        "@type": "UnitPriceSpecification",
        price: plan.price,
        priceCurrency: "USD",
        priceType: "https://schema.org/SalePrice",
      },
    ];
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: plan.name,
    description: plan.description,
    brand: { "@type": "Brand", name: brandName },
    offers,
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
      logo: { "@type": "ImageObject", url: absoluteUrl(siteUrl, "/brand/pipsangel-mark-512.png") },
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
    category?: string;
    image?: string | null;
    author?: { name: string; title?: string; url?: string | null };
  }
) {
  const url = absoluteUrl(siteUrl, `/news/${article.slug}`);
  const author = article.author
    ? {
        "@type": "Person",
        name: article.author.name,
        ...(article.author.title ? { jobTitle: article.author.title } : {}),
        ...(article.author.url ? { url: article.author.url } : {}),
        worksFor: { "@type": "Organization", name: brandName, url: siteUrl },
      }
    : { "@type": "Organization", name: brandName, url: siteUrl };

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.updatedAt ?? article.date,
    author,
    publisher: {
      "@type": "Organization",
      name: brandName,
      logo: { "@type": "ImageObject", url: absoluteUrl(siteUrl, "/brand/pipsangel-mark-512.png") },
    },
    image: [article.image ?? absoluteUrl(siteUrl, "/opengraph-image")],
    ...(article.category ? { articleSection: article.category } : {}),
    inLanguage: "en",
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

/** Archive and category pages: a collection page listing the articles shown on it. */
export function buildNewsListSchema(
  siteUrl: string,
  page: { name: string; description: string; path: string },
  articles: Array<{ slug: string; title: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.name,
    description: page.description,
    url: absoluteUrl(siteUrl, page.path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(siteUrl, `/news/${article.slug}`),
        name: article.title,
      })),
    },
  };
}

