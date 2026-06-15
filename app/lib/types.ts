export interface PaginatedResponse<T> {
  count: number;
  results: T[];
}

export interface ListResponse<T> {
  results: T[];
}

export interface NavLink {
  name: string;
  url: string;
}

export interface FooterLinks {
  company: NavLink[];
  product: NavLink[];
  resources: NavLink[];
  legal: NavLink[];
}

export interface SiteConfig {
  brand_name: string;
  site_url: string;
  default_title: string;
  title_template: string;
  default_description: string;
  keywords: string[];
  risk_disclaimer: string;
  navigation: NavLink[];
  footer_links: FooterLinks;
  header_cta_label: string;
  header_cta_action: string;
}

export type TradeDirection = "BUY" | "SELL";
export type TradeResult = "profit" | "loss";

export interface Trade {
  id: string;
  pair: string;
  direction: TradeDirection;
  entry: string;
  stop_loss: string;
  take_profit: string;
  pips: number;
  result: TradeResult;
  closed_at: string;
}

export interface TradeAccuracy {
  percent: number;
  last_n: number;
  wins: number;
  losses: number;
  message: string;
  calculated_at: string;
}

export interface PerformanceStats {
  trades_executed: number;
  trades_executed_display: string;
  win_rate_percent: number;
  average_pips: number;
  max_drawdown_percent: number;
  years_tested: number;
  years_tested_display: string;
  updated_at: string;
}

export type SignalStatus = "active" | "hit_tp" | "hit_sl" | "cancelled" | "expired";

export interface Signal {
  id: string;
  pair: string;
  direction: TradeDirection;
  entry: string;
  stop_loss: string;
  take_profit: string;
  risk_reward: string;
  status: SignalStatus;
  issued_at: string;
  closed_at: string | null;
}

export interface BlogPostListItem {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

export interface BlogPostDetail extends BlogPostListItem {
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsArticleListItem {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export interface NewsArticleDetail extends NewsArticleListItem {
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  slug: string;
  price: number;
  price_display: string;
  billing_period: string;
  features: string[];
  is_popular: boolean;
  cta_label: string;
  cta_url: string;
  sort_order: number;
  is_active: boolean;
}

export interface CommunityMessage {
  id: string;
  username: string;
  message: string;
  created_at: string;
}

export interface ContentBlock {
  key: string;
  title: string;
  subtitle: string;
  body: string;
  metadata: Record<string, unknown>;
  updated_at: string;
}

export interface AiIntelligenceModule {
  name: string;
  description: string;
  features: string[];
  example_insight?: {
    pair: string;
    bias: string;
    confidence: string;
    timeframe: string;
  };
  example_risk_report?: {
    risk_level: string;
    recommended_risk: string;
    volatility: string;
  };
}

export interface AiIntelligence {
  title: string;
  description: string;
  modules: AiIntelligenceModule[];
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  plan: string | null;
  is_staff: boolean;
}

export interface AdminPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AdminDashboardStats {
  blog_total: number;
  blog_unpublished: number;
  news_total: number;
  news_unpublished: number;
  faq_total: number;
  pricing_plans: number;
  content_blocks: number;
  trades_total: number;
  signals_active: number;
  signals_total: number;
  community_messages: number;
  contact_unhandled: number;
  contact_total: number;
  leads_uncontacted: number;
  leads_total: number;
  users_total: number;
}

export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminNewsArticle extends AdminBlogPost {
  category: string;
}

export interface AdminFaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

export interface AdminContentBlock {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  body: string;
  metadata: Record<string, unknown>;
  updated_at: string;
}

export interface AdminSiteConfig {
  id: string;
  brand_name: string;
  site_url: string;
  default_title: string;
  title_template: string;
  default_description: string;
  keywords: string[];
  risk_disclaimer: string;
  navigation: NavLink[];
  footer_links: FooterLinks;
  header_cta_label: string;
  header_cta_action: string;
  is_active: boolean;
  updated_at: string;
}

export interface AdminTrade {
  id: string;
  pair: string;
  direction: TradeDirection;
  entry: string;
  stop_loss: string;
  take_profit: string;
  pips: number;
  result: TradeResult;
  closed_at: string;
  is_published: boolean;
  created_at: string;
}

export interface AdminSignal {
  id: string;
  pair: string;
  direction: TradeDirection;
  entry: string;
  stop_loss: string;
  take_profit: string;
  risk_reward: string;
  status: SignalStatus;
  issued_at: string;
  closed_at: string | null;
  is_published: boolean;
  created_at: string;
}

export interface AdminPerformanceStats {
  id: string;
  trades_executed: number;
  trades_executed_display: string;
  win_rate_percent: number;
  average_pips: number;
  max_drawdown_percent: number;
  years_tested: number;
  years_tested_display: string;
  is_active: boolean;
  updated_at: string;
}

export interface AdminCommunityMessage {
  id: string;
  username: string;
  message: string;
  created_at: string;
  is_published: boolean;
}

export interface AdminContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_handled: boolean;
  created_at: string;
}

export interface AdminLeadSubmission {
  id: string;
  name: string;
  email: string;
  interest: string;
  experience: string;
  plan_interest: string;
  source: string;
  is_contacted: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  plan: string | null;
  plan_slug: string | null;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface ApiError {
  detail: string;
  errors?: Record<string, string[]>;
}

export interface LeadSubmissionPayload {
  name: string;
  email: string;
  interest: string;
  experience: string;
  plan_interest: string;
  source: "homepage_chatbot";
}

export interface LeadSubmissionResponse {
  id: string;
  message: string;
}
