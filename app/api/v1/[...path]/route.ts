import { NextResponse } from "next/server";
import {
  getMockContentBlock,
  getMockHomeBlocks,
  getMockSignals,
  getMockSiteConfig,
  getMockTrades,
  isMockApiEnabled,
  mockAiIntelligence,
  mockBlogDetails,
  mockBlogPosts,
  mockCommunityMessages,
  mockFaqItems,
  mockNewsDetails,
  mockNewsArticles,
  mockPerformanceStats,
  mockTradeAccuracy,
} from "../../../lib/mockData";

type RouteContext = { params: Promise<{ path: string[] }> };

function joinPath(segments: string[]): string {
  return segments.join("/");
}

function parseLimit(searchParams: URLSearchParams): number | undefined {
  const raw = searchParams.get("limit");
  if (!raw) return undefined;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}

function handleGet(pathKey: string, searchParams: URLSearchParams): unknown | null {
  if (pathKey === "site-config") {
    return getMockSiteConfig();
  }

  if (pathKey === "stats/performance") {
    return mockPerformanceStats;
  }

  if (pathKey === "trades/accuracy") {
    return mockTradeAccuracy;
  }

  if (pathKey === "trades") {
    return getMockTrades(parseLimit(searchParams));
  }

  if (pathKey === "signals/live" || pathKey === "signals") {
    return getMockSignals(parseLimit(searchParams));
  }

  if (pathKey === "content/ai-intelligence") {
    return mockAiIntelligence;
  }

  if (pathKey === "content/blocks") {
    const prefix = searchParams.get("prefix") ?? undefined;
    return getMockHomeBlocks(prefix);
  }

  if (pathKey.startsWith("content/blocks/")) {
    const blockKey = pathKey.replace("content/blocks/", "");
    return getMockContentBlock(blockKey);
  }

  if (pathKey === "faq") {
    return { results: mockFaqItems };
  }

  if (pathKey === "community/messages") {
    const limit = parseLimit(searchParams) ?? 5;
    return { results: mockCommunityMessages.slice(0, limit) };
  }

  if (pathKey === "blog") {
    return { count: mockBlogPosts.length, results: mockBlogPosts };
  }

  if (pathKey.startsWith("blog/")) {
    const slug = pathKey.replace("blog/", "");
    return mockBlogDetails[slug] ?? null;
  }

  if (pathKey === "news") {
    return { count: mockNewsArticles.length, results: mockNewsArticles };
  }

  if (pathKey.startsWith("news/")) {
    const slug = pathKey.replace("news/", "");
    return mockNewsDetails[slug] ?? null;
  }

  return null;
}

async function handlePost(pathKey: string, request: Request): Promise<unknown | null> {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    // empty body is fine for some endpoints
  }

  if (pathKey === "contact") {
    return {
      id: `contact-${Date.now()}`,
      message: "Thank you for your message. We'll get back to you shortly.",
    };
  }

  if (pathKey === "leads") {
    return {
      id: `lead-${Date.now()}`,
      message: "Thanks! A member of our team will reach out soon.",
    };
  }

  void body;
  return null;
}

export async function GET(request: Request, context: RouteContext) {
  if (!isMockApiEnabled()) {
    return NextResponse.json({ detail: "Not found." }, { status: 404 });
  }

  const { path } = await context.params;
  const pathKey = joinPath(path);
  const { searchParams } = new URL(request.url);
  const data = handleGet(pathKey, searchParams);

  if (data === null) {
    return NextResponse.json({ detail: "Not found." }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request, context: RouteContext) {
  if (!isMockApiEnabled()) {
    return NextResponse.json({ detail: "Not found." }, { status: 404 });
  }

  const { path } = await context.params;
  const pathKey = joinPath(path);
  const data = await handlePost(pathKey, request);

  if (data === null) {
    return NextResponse.json({ detail: "Not found." }, { status: 404 });
  }

  return NextResponse.json(data);
}
