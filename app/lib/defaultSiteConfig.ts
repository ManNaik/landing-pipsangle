import {
  BRAND_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
  normalizeBrandName,
  normalizeBrandText,
  normalizeEmail,
  normalizeSiteUrl,
  safeExternalUrl,
} from "./brand";
import type { SiteConfig, SocialLink, TeamMember } from "./types";

export const DEFAULT_RISK_DISCLAIMER =
  "Trading forex and CFDs on margin carries a high level of risk and is not suitable for everyone. You could lose some or all of the money in your trading account. Past performance does not guarantee future results. PipsAngel is not a broker, does not hold client money and does not give personal financial advice. PipsAngel is independent of IC Markets and MetaQuotes; IC Markets and MetaTrader are trademarks of their owners.";

export const defaultSiteConfig: SiteConfig = {
  brand_name: BRAND_NAME,
  site_url: SITE_URL,
  default_title: "Automated copy trading for IC Markets MT5 accounts",
  title_template: `%s | ${BRAND_NAME}`,
  default_description:
    "PipsAngel copies trades to your own IC Markets MetaTrader 5 account. Every trade has a stop loss, your money stays with IC Markets, and you can pause copying at any time. Free for 4 days once your account is connected.",
  keywords: [
    "forex copy trading",
    "IC Markets MT5",
    "MT5 copy trading",
    "automated forex trading",
    "forex trading automation",
  ],
  risk_disclaimer: DEFAULT_RISK_DISCLAIMER,
  navigation: [],
  footer_links: { company: [], product: [], resources: [], legal: [] },
  header_cta_label: "Start free trial",
  header_cta_action: "signup",
  support_email: SUPPORT_EMAIL,
  support_hours: "",
  support_response_time: "",
  whatsapp_url: "",
  telegram_url: "",
  social_links: [],
  legal_name: "",
  registration_number: "",
  registered_address: "",
  governing_law: "",
  team_members: [],
  track_record_url: "",
  track_record_provider: "",
  broker_signup_url: "",
  broker_affiliate_disclosure: "",
};

const LEGACY_DISCLAIMER_MARKERS = ["not indicative of future results", "may not be suitable for all investors"];
const RETIRED_PRODUCT = /signal/i;

function cleanText(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed ? normalizeBrandText(trimmed) : fallback;
}

/** CMS copy that still sells the retired signals product falls back to the default. */
function currentText(value: unknown, fallback: string): string {
  const text = cleanText(value);
  return text && !RETIRED_PRODUCT.test(text) ? text : fallback;
}

function cleanKeywords(value: unknown): string[] {
  if (!Array.isArray(value)) return defaultSiteConfig.keywords;
  const keywords = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item && !RETIRED_PRODUCT.test(item) && !/\bai\b/i.test(item));
  return keywords.length > 0 ? keywords : defaultSiteConfig.keywords;
}

function cleanSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const name = cleanText((item as SocialLink).name);
    const url = safeExternalUrl((item as SocialLink).url);
    return name && url ? [{ name, url }] : [];
  });
}

function cleanTeam(value: unknown): TeamMember[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const member = item as TeamMember;
    const name = cleanText(member.name);
    const role = cleanText(member.role);
    if (!name || !role) return [];
    return [
      {
        name,
        role,
        bio: cleanText(member.bio),
        photo_url: safeExternalUrl(member.photo_url) ?? "",
        linkedin_url: safeExternalUrl(member.linkedin_url) ?? "",
      },
    ];
  });
}

/**
 * Merge CMS values over the defaults and repair legacy values (old brand spelling,
 * the unregistered pipangel.com domain and its mailbox, the generic disclaimer).
 */
export function sanitizeSiteConfig(config: Partial<SiteConfig> | null | undefined): SiteConfig {
  const source = config ?? {};
  const disclaimer = cleanText(source.risk_disclaimer);
  const isLegacyDisclaimer =
    !disclaimer || LEGACY_DISCLAIMER_MARKERS.some((marker) => disclaimer.toLowerCase().includes(marker));

  return {
    ...defaultSiteConfig,
    brand_name: normalizeBrandName(source.brand_name),
    site_url: normalizeSiteUrl(source.site_url),
    default_title: currentText(source.default_title, defaultSiteConfig.default_title),
    title_template: `%s | ${normalizeBrandName(source.brand_name)}`,
    default_description: currentText(source.default_description, defaultSiteConfig.default_description),
    keywords: cleanKeywords(source.keywords),
    risk_disclaimer: isLegacyDisclaimer ? DEFAULT_RISK_DISCLAIMER : disclaimer,
    support_email: normalizeEmail(source.support_email),
    support_hours: cleanText(source.support_hours),
    support_response_time: cleanText(source.support_response_time),
    whatsapp_url: safeExternalUrl(source.whatsapp_url) ?? "",
    telegram_url: safeExternalUrl(source.telegram_url) ?? "",
    social_links: cleanSocialLinks(source.social_links),
    legal_name: cleanText(source.legal_name),
    registration_number: cleanText(source.registration_number),
    registered_address: cleanText(source.registered_address),
    governing_law: cleanText(source.governing_law),
    team_members: cleanTeam(source.team_members),
    track_record_url: safeExternalUrl(source.track_record_url) ?? "",
    track_record_provider: cleanText(source.track_record_provider),
    broker_signup_url: safeExternalUrl(source.broker_signup_url) ?? "",
    broker_affiliate_disclosure: cleanText(source.broker_affiliate_disclosure),
  };
}
