export const AUTOMATION_PIPELINE = [
  {
    step: "01",
    title: "AI + Market Analysis",
    shortTitle: "AI Analysis",
    description:
      "The system evaluates market conditions, price action and relevant trading factors to identify potential opportunities.",
    icon: "brain" as const,
  },
  {
    step: "02",
    title: "Professional Trader Validation",
    shortTitle: "Trader Validation",
    description:
      "Trading opportunities are reviewed and validated using professional trading expertise before execution.",
    icon: "check" as const,
  },
  {
    step: "03",
    title: "Risk Engine",
    shortTitle: "Risk Engine",
    description:
      "The system calculates position size according to the configured risk parameters before an order can be executed.",
    icon: "shield" as const,
  },
  {
    step: "04",
    title: "MT5 Execution",
    shortTitle: "MT5 Execution",
    description:
      "Once the trade passes the required conditions, PipAngel automatically sends the order through MT5.",
    icon: "terminal" as const,
  },
  {
    step: "05",
    title: "Trade Management",
    shortTitle: "Trade Management",
    description:
      "Configured trade parameters and risk controls remain active while the position is managed.",
    icon: "chart" as const,
  },
] as const;

export const FEATURE_LARGE = [
  {
    id: "execution",
    title: "Automated MT5 Execution",
    headline: "No manual order placement.",
    description:
      "Once a trade passes validation and risk checks, PipAngel automatically executes it through MT5.",
  },
  {
    id: "sizing",
    title: "Intelligent Position Sizing",
    headline: "Position size is calculated for the configured risk.",
    description:
      "Exposure is derived from account balance and your configured risk parameters, not fixed lot sizes.",
  },
] as const;

export const FEATURE_SMALL = [
  {
    title: "Trade Validation",
    description:
      "Multiple layers of analysis and professional validation before execution.",
    icon: "brain" as const,
  },
  {
    title: "Risk Controls",
    description:
      "Trades are checked against configured risk parameters before execution.",
    icon: "shield" as const,
  },
  {
    title: "Trade Monitoring",
    description:
      "Monitor active and completed executions from your dashboard.",
    icon: "chart" as const,
  },
  {
    title: "Automation Control",
    description:
      "Pause or disable automated execution whenever you choose.",
    icon: "power" as const,
  },
] as const;

export const ONBOARDING_STEPS = [
  {
    step: "01",
    label: "CREATE",
    description: "Create your PipAngel account.",
  },
  {
    step: "02",
    label: "CONNECT",
    description: "Connect your MT5 trading account.",
  },
  {
    step: "03",
    label: "ACTIVATE",
    description: "Configure risk and enable automation.",
  },
] as const;

export const CONTROL_ITEMS = [
  { label: "Pause Automation", description: "Stop new trades." },
  { label: "Adjust Risk", description: "Update configured risk parameters." },
  { label: "Monitor Trades", description: "Track execution." },
  { label: "Disconnect Account", description: "Remove the MT5 connection." },
] as const;

export const RISK_FLOW = [
  { label: "Account Balance", value: "$10,000" },
  { label: "Risk Configuration", value: "1.0%" },
  { label: "Calculated Risk", value: "$100" },
  { label: "Position Size", value: "Automatically calculated" },
  { label: "Stop Loss", value: "Defined before execution" },
] as const;

export const CONNECTION_STATUS = [
  { label: "IC Markets", status: "ONLINE" },
  { label: "MetaTrader 5", status: "ONLINE" },
  { label: "Execution", status: "READY" },
  { label: "Automation", status: "ACTIVE" },
  { label: "Account", status: "CONNECTED" },
] as const;
