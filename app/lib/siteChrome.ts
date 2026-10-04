import { getBlogArticles } from "./blog";
import { getLiveMarketEvents, getPublishedNews } from "./news";
import { HOW_IT_WORKS_PATH } from "./paths";
import { getPublishedStats } from "./performance";
import type { SiteConfig } from "./types";

export { HOW_IT_WORKS_PATH, IC_MARKETS_GUIDE_PATH, SIGNUP_PATH } from "./paths";

export type NavItem = { name: string; href: string };

export type SiteChrome = {
  nav: NavItem[];
  showResults: boolean;
  showBlog: boolean;
  /** /news exists: there are articles, a live calendar, or both. */
  showNews: boolean;
  newsLabel: string;
};

/** Pages without real content (results, blog, news) stay out of the navigation. */
export async function getSiteChrome(config: SiteConfig): Promise<SiteChrome> {
  const [stats, posts, news, events] = await Promise.all([
    getPublishedStats(),
    getBlogArticles(),
    getPublishedNews(),
    getLiveMarketEvents(),
  ]);

  const showResults = Boolean(stats || config.track_record_url);
  const showBlog = posts.length > 0;
  const hasArticles = news.length > 0;
  const showNews = hasArticles || events.length > 0;

  const nav: NavItem[] = [
    { name: "How it works", href: HOW_IT_WORKS_PATH },
    { name: "Pricing", href: "/pricing" },
    { name: "Security", href: "/security" },
    ...(showResults ? [{ name: "Results", href: "/trading-performance" }] : []),
    ...(hasArticles ? [{ name: "News", href: "/news" }] : []),
    { name: "FAQ", href: "/faq" },
  ];

  return { nav, showResults, showBlog, showNews, newsLabel: hasArticles ? "News" : "Economic calendar" };
}
