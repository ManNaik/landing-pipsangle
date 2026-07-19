import type { TradingSettings } from "./settingsData";
import { userGet, userPatch } from "./userApi";

type PlanLimitsResponse = {
  min: number;
  max: number;
  default: number;
  adjustable: boolean;
  step: number;
};

type TradingSettingsResponse = {
  capital_utilization: number;
  auto_trade_enabled: boolean;
  plan_limits: PlanLimitsResponse;
};

export type TradingSettingsApiResult = TradingSettings & {
  planLimits: {
    min: number;
    max: number;
    default: number;
    adjustable: boolean;
    step: number;
  };
};

export function mapTradingSettings(data: TradingSettingsResponse): TradingSettingsApiResult {
  return {
    capitalUtilization: data.capital_utilization,
    autoTradeEnabled: data.auto_trade_enabled,
    planLimits: data.plan_limits,
  };
}

export async function fetchTradingSettings(): Promise<TradingSettingsApiResult> {
  const data = await userGet<TradingSettingsResponse>("/me/trading-settings/");
  return mapTradingSettings(data);
}

export async function patchTradingSettings(
  settings: Partial<TradingSettings>
): Promise<TradingSettingsApiResult> {
  const body: Record<string, unknown> = {};
  if (typeof settings.capitalUtilization === "number") {
    body.capital_utilization = settings.capitalUtilization;
  }
  if (typeof settings.autoTradeEnabled === "boolean") {
    body.auto_trade_enabled = settings.autoTradeEnabled;
  }
  const data = await userPatch<TradingSettingsResponse>("/me/trading-settings/", body);
  return mapTradingSettings(data);
}
