import { apiGetClient, safeApiGet } from "./api";
import { isMockApiEnabled } from "./env";
import { getMockSignals } from "./mockData";
import type { ListResponse, Signal } from "./types";

export async function fetchLiveSignals(limit = 20): Promise<Signal[]> {
  if (isMockApiEnabled()) {
    return getMockSignals(limit).results;
  }

  try {
    const data = await apiGetClient<ListResponse<Signal>>(
      `/signals/live/?limit=${limit}`
    );
    return data.results ?? [];
  } catch {
    const fallback = await safeApiGet<ListResponse<Signal>>("/signals/", 30);
    return (fallback?.results ?? []).slice(0, limit);
  }
}

export async function fetchSignalHistory(limit = 100): Promise<Signal[]> {
  if (isMockApiEnabled()) {
    return getMockSignals(limit).results;
  }

  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const data = await safeApiGet<ListResponse<Signal>>(
    `/signals/?limit=${safeLimit}`,
    30
  );
  return data?.results ?? [];
}

export async function fetchLiveSignalsServer(limit = 20): Promise<Signal[]> {
  if (isMockApiEnabled()) {
    return getMockSignals(limit).results;
  }
  const data = await safeApiGet<ListResponse<Signal>>(
    `/signals/live/?limit=${limit}`,
    30
  );
  return data?.results ?? [];
}
