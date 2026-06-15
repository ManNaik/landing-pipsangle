export type Broker = {
  id: string;
  name: string;
  logo: string;
};

function broker(id: string, name: string): Broker {
  return { id, name, logo: `/brokers/${id}.svg` };
}

export const BROKER_SETS: Record<string, Broker[]> = {
  platforms: [
    broker("mt4", "MetaTrader 4"),
    broker("mt5", "MetaTrader 5"),
    broker("ctrader", "cTrader"),
  ],
  tier1: [
    broker("icmarkets", "IC Markets"),
    broker("pepperstone", "Pepperstone"),
    broker("xm", "XM"),
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
