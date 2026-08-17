export const AUTOMATION_PATH = "/automated-forex-trading";

export const HOME_MARKETS = [
  { symbol: "EUR/USD", category: "Major" },
  { symbol: "GBP/USD", category: "Major" },
  { symbol: "USD/JPY", category: "Major" },
  { symbol: "XAU/USD", category: "Metal" },
] as const;

export const HOME_LAYERS = [
  {
    step: "01",
    title: "AI Market Intelligence",
    body: "Analyze market conditions and identify potential opportunities.",
  },
  {
    step: "02",
    title: "Professional Trading Expertise",
    body: "Evaluate opportunities using professional trading knowledge.",
  },
  {
    step: "03",
    title: "Risk Management",
    body: "Control exposure before an automated trade is executed.",
  },
] as const;

export const HOME_AI_FACTORS = [
  "Trend",
  "Momentum",
  "Volatility",
  "Price Action",
] as const;

export const HOME_AI_READS = [
  { label: "Opportunity Score", value: "Contextual" },
  { label: "Market Bias", value: "Directional" },
  { label: "Risk Conditions", value: "Evaluated" },
  { label: "Trade Context", value: "Filtered" },
] as const;

export const FOREX_POINTS = [
  {
    title: "Global Market",
    body: "Forex operates across major financial centres around the world.",
  },
  {
    title: "Deep Liquidity",
    body: "Major currency pairs are among the most actively traded instruments globally.",
  },
  {
    title: "24/5 Trading",
    body: "The global FX market operates across major trading sessions during the business week.",
  },
  {
    title: "Continuous Price Discovery",
    body: "Currency prices respond continuously to economic data, interest rates, geopolitical events and global capital flows.",
  },
] as const;

export const FX_SESSIONS = ["Asia", "Europe", "United States"] as const;

export const DASHBOARD_CONTROLS = [
  "Pause Automation",
  "Resume Automation",
  "Adjust Risk",
  "View Trades",
  "Disconnect Account",
] as const;
