import {
  ArrowLeftRight,
  Blocks,
  ChartLine,
  CircleQuestionMark,
  FileText,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Mail,
  MessageSquare,
  MessagesSquare,
  Newspaper,
  Radio,
  Settings,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };
export type AdminNavGroup = { label: string; items: AdminNavItem[] };

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/news", label: "News", icon: Newspaper },
      { href: "/admin/blog", label: "Blog posts", icon: FileText },
      { href: "/admin/faq", label: "FAQ", icon: CircleQuestionMark },
      { href: "/admin/content", label: "Content blocks", icon: Blocks },
      { href: "/admin/pricing", label: "Pricing", icon: Tag },
      { href: "/admin/site-config", label: "Site config", icon: Settings },
    ],
  },
  {
    label: "Audience",
    items: [
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
      { href: "/admin/contact-leads", label: "Contact leads", icon: Inbox },
      { href: "/admin/chatbot-leads", label: "Chatbot leads", icon: MessageSquare },
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/onboarding", label: "Onboarding", icon: KeyRound },
    ],
  },
  {
    label: "Trading",
    items: [
      { href: "/admin/stats", label: "Track record", icon: ChartLine },
      { href: "/admin/trades", label: "Trades", icon: ArrowLeftRight },
      { href: "/admin/signals", label: "Signals", icon: Radio },
      { href: "/admin/community", label: "Community", icon: MessagesSquare },
    ],
  },
];

export function isNavItemActive(item: AdminNavItem, pathname: string): boolean {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/** Breadcrumb trail for an admin path, e.g. Dashboard / News / Edit. */
export function adminBreadcrumbs(pathname: string): Array<{ label: string; href: string }> {
  const items = ADMIN_NAV.flatMap((group) => group.items);
  const trail = [{ label: "Dashboard", href: "/admin" }];
  const section = items.find((item) => !item.exact && isNavItemActive(item, pathname));
  if (!section) return trail;
  trail.push({ label: section.label, href: section.href });
  const rest = pathname.slice(section.href.length).replace(/^\/+/, "");
  if (rest) trail.push({ label: rest === "new" ? "Add new" : "Edit", href: pathname });
  return trail;
}
