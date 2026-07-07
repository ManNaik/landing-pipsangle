export type PlanName = "Basic" | "Premium";

export type TradingSettings = {
  capitalUtilization: number;
  autoTradeEnabled: boolean;
};

export type PlanLimits = {
  capital: {
    min: number;
    max: number;
    default: number;
    adjustable: boolean;
    step: number;
  };
  autoTrade: {
    controllable: boolean;
  };
};

export const SETTINGS_STORAGE_KEY = "pipangel-trading-settings";

export const DEFAULT_TRADING_SETTINGS: TradingSettings = {
  capitalUtilization: 25,
  autoTradeEnabled: true,
};

const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  Basic: {
    capital: {
      min: 10,
      max: 40,
      default: 25,
      adjustable: false,
      step: 5,
    },
    autoTrade: {
      controllable: true,
    },
  },
  Premium: {
    capital: {
      min: 10,
      max: 100,
      default: 75,
      adjustable: true,
      step: 5,
    },
    autoTrade: {
      controllable: true,
    },
  },
};

export function getPlanLimits(plan: string | null): PlanLimits {
  if (plan === "Premium") return PLAN_LIMITS.Premium;
  return PLAN_LIMITS.Basic;
}

export function getDefaultSettingsForPlan(plan: string | null): TradingSettings {
  const limits = getPlanLimits(plan);
  return {
    capitalUtilization: limits.capital.default,
    autoTradeEnabled: true,
  };
}

export function clampSettings(
  settings: TradingSettings,
  plan: string | null
): TradingSettings {
  const limits = getPlanLimits(plan);

  const capital = limits.capital.adjustable
    ? Math.min(
        limits.capital.max,
        Math.max(limits.capital.min, settings.capitalUtilization)
      )
    : limits.capital.default;

  return {
    capitalUtilization: capital,
    autoTradeEnabled: settings.autoTradeEnabled,
  };
}

export function loadTradingSettings(plan: string | null): TradingSettings {
  if (typeof window === "undefined") {
    return getDefaultSettingsForPlan(plan);
  }

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return getDefaultSettingsForPlan(plan);
    const parsed = JSON.parse(raw) as Partial<TradingSettings>;
    return clampSettings(
      {
        ...getDefaultSettingsForPlan(plan),
        capitalUtilization:
          typeof parsed.capitalUtilization === "number"
            ? parsed.capitalUtilization
            : getDefaultSettingsForPlan(plan).capitalUtilization,
        autoTradeEnabled:
          typeof parsed.autoTradeEnabled === "boolean"
            ? parsed.autoTradeEnabled
            : getDefaultSettingsForPlan(plan).autoTradeEnabled,
      },
      plan
    );
  } catch {
    return getDefaultSettingsForPlan(plan);
  }
}

export function saveTradingSettings(settings: TradingSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
