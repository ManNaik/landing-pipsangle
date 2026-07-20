export type Broker = {
  id: string;
  name: string;
  logo: string;
};

/** Broker + platform available for account connection (dashboard onboarding). */
export const CONNECTABLE_BROKER = broker("icmarkets", "IC Markets", "icmarkets.png");

export const CONNECTABLE_PLATFORM = {
  id: "mt5",
  name: "MetaTrader 5",
} as const;

export function getConnectableBrokerLabel(): string {
  return `${CONNECTABLE_BROKER.name} (${CONNECTABLE_PLATFORM.name})`;
}

function broker(id: string, name: string, file = `${id}.svg`): Broker {
  return { id, name, logo: `/brokers/${file}` };
}

export const BROKER_SETS: Record<string, Broker[]> = {
  featured: [
    broker("icmarkets", "IC Markets", "icmarkets.png"),
    broker("pepperstone", "Pepperstone"),
    broker("eightcap", "Eightcap"),
    broker("fpmarkets", "FP Markets"),
    broker("xm", "XM", "xm.png"),
    broker("exness", "Exness"),
    broker("fxtm", "FXTM"),
    broker("tickmill", "Tickmill"),
  ],
  platforms: [
    broker("mt4", "MetaTrader 4"),
    broker("mt5", "MetaTrader 5"),
    broker("ctrader", "cTrader"),
  ],
  tier1: [
    broker("icmarkets", "IC Markets", "icmarkets.png"),
    broker("pepperstone", "Pepperstone"),
    broker("xm", "XM", "xm.png"),
    broker("exness", "Exness"),
  ],
  global: [
    broker("oanda", "OANDA"),
    broker("fxcm", "FXCM"),
    broker("ig", "IG"),
    broker("fbs", "FBS"),
  ],
  more: [
    broker("roboforex", "RoboForex"),
    broker("tickmill", "Tickmill"),
    broker("fpmarkets", "FP Markets"),
    broker("vantage", "Vantage"),
  ],
};

export type BrokerTickerVariant = keyof typeof BROKER_SETS;
