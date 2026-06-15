import { safeApiGet } from "./api";
import type {
  AiIntelligence,
  ContentBlock,
  ListResponse,
  PaginatedResponse,
  PerformanceStats,
  Signal,
  Trade,
  TradeAccuracy,
} from "./types";

export async function getHomeData() {
  const [
    performanceStats,
    trades,
    accuracy,
    liveSignals,
    aiIntelligence,
    homeBlocks,
  ] = await Promise.all([
    safeApiGet<PerformanceStats>("/stats/performance/", 60),
    safeApiGet<PaginatedResponse<Trade>>("/trades/?limit=10", 60),
    safeApiGet<TradeAccuracy>("/trades/accuracy/?last_n=10", 60),
    safeApiGet<ListResponse<Signal>>("/signals/live/", 60),
    safeApiGet<AiIntelligence>("/content/ai-intelligence/", 3600),
    safeApiGet<PaginatedResponse<ContentBlock>>("/content/blocks/?prefix=home.", 3600),
  ]);

  const blocksByKey = Object.fromEntries(
    (homeBlocks?.results ?? []).map((b) => [b.key, b])
  );

  return {
    performanceStats,
    trades: trades?.results ?? [],
    accuracy,
    liveSignals: liveSignals?.results ?? [],
    aiIntelligence,
    blocks: blocksByKey,
  };
}

export function getBlockMeta(
  block: ContentBlock | undefined,
  fallback: Record<string, unknown> = {}
): Record<string, unknown> {
  if (!block?.metadata) return fallback;
  return { ...fallback, ...block.metadata };
}
