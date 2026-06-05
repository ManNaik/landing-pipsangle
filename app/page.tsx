import type { Metadata } from "next";
import Link from "next/link";
import { MarketHours } from "./components/MarketHours";
import { CommunityChats } from "./components/CommunityChats";

const stats = [
  { label: "Active Traders", value: "1200+" },
  { label: "Trades Executed", value: "15000+" },
  { label: "Win Rate", value: "72%" },
  { label: "Years Tested", value: "3+" },
];

const sections = [
  {
    title: "Professional Forex Signals",
    description:
      "Receive daily trade setups with entry, stop loss and take profit.",
    url: "#forex-signals",
  },
  {
    title: "Automated Trading System",
    description:
      "Connect your trading account and let the system execute trades automatically.",
    url: "#automation",
  },
  {
    title: "Transparent Trading Performance",
    description: "View real trading results and performance statistics.",
    url: "/trading-performance",
  },
];

const aiIntelligence = {
  title: "AI Market Intelligence Engine",
  description:
    "Our AI analyzes market conditions and risk factors to identify better trading opportunities.",
  modules: [
    {
      name: "AI Market Researcher",
      description:
        "Scans forex markets using technical indicators and market data to detect potential trading setups.",
      features: [
        "Trend detection",
        "Pattern recognition",
        "Support and resistance analysis",
        "Market sentiment tracking",
        "Multi timeframe analysis",
      ],
      exampleInsight: {
        pair: "EURUSD",
        bias: "BUY",
        confidence: "78%",
        timeframe: "H1",
      },
    },
    {
      name: "AI Risk Assessment",
      description:
        "Evaluates market volatility and calculates optimal risk parameters before trade execution.",
      features: [
        "Volatility analysis",
        "Dynamic position sizing",
        "Risk reward validation",
        "Drawdown protection",
        "Trade filtering",
      ],
      exampleRiskReport: {
        riskLevel: "LOW",
        recommendedRisk: "1%",
        volatility: "NORMAL",
      },
    },
  ],
};

const recentTrades = {
  title: "Recent Trade Performance",
  description: "Here are some of our most recent forex trades.",
  trades: [
    {
      pair: "EURUSD",
      direction: "BUY",
      entry: "1.0842",
      stopLoss: "1.0820",
      takeProfit: "1.0890",
      pips: 48,
      result: "profit",
    },
    {
      pair: "GBPUSD",
      direction: "BUY",
      entry: "1.2670",
      stopLoss: "1.2645",
      takeProfit: "1.2725",
      pips: 55,
      result: "profit",
    },
    {
      pair: "USDJPY",
      direction: "SELL",
      entry: "150.20",
      stopLoss: "150.80",
      takeProfit: "149.40",
      pips: -30,
      result: "loss",
    },
    {
      pair: "XAUUSD",
      direction: "BUY",
      entry: "2020",
      stopLoss: "2010",
      takeProfit: "2040",
      pips: 20,
      result: "profit",
    },
    {
      pair: "EURJPY",
      direction: "SELL",
      entry: "162.50",
      stopLoss: "163.20",
      takeProfit: "161.70",
      pips: -18,
      result: "loss",
    },
    {
      pair: "AUDUSD",
      direction: "BUY",
      entry: "0.6520",
      stopLoss: "0.6500",
      takeProfit: "0.6570",
      pips: 50,
      result: "profit",
    },
    {
      pair: "USDCAD",
      direction: "SELL",
      entry: "1.3580",
      stopLoss: "1.3610",
      takeProfit: "1.3520",
      pips: 60,
      result: "profit",
    },
    {
      pair: "NZDUSD",
      direction: "BUY",
      entry: "0.6080",
      stopLoss: "0.6055",
      takeProfit: "0.6120",
      pips: -25,
      result: "loss",
    },
    {
      pair: "EURUSD",
      direction: "SELL",
      entry: "1.0920",
      stopLoss: "1.0950",
      takeProfit: "1.0860",
      pips: 60,
      result: "profit",
    },
    {
      pair: "GBPJPY",
      direction: "BUY",
      entry: "190.50",
      stopLoss: "190.00",
      takeProfit: "191.50",
      pips: 100,
      result: "profit",
    },
  ],
};

// Accuracy of last N trades (for display; replace with live data source later)
const LAST_N_TRADES = 10;
function getAccuracyLast10(trades: typeof recentTrades.trades): number {
  const last10 = trades.slice(0, LAST_N_TRADES);
  const wins = last10.filter((t) => t.result === "profit").length;
  return last10.length ? Math.round((wins / last10.length) * 100) : 0;
}

// Live accuracy / message — replace this with your API or real-time source
const LIVE_ACCURACY_PERCENT = getAccuracyLast10(recentTrades.trades);
const LIVE_MESSAGE = `Accuracy (last ${LAST_N_TRADES} trades): ${LIVE_ACCURACY_PERCENT}%`;

export const metadata: Metadata = {
  title: "Best Forex Signals & Automated Trading Platform",
  description:
    "Start trading with professional forex signals or automate your trading with our smart trading system.",
  keywords: [
    "forex signals",
    "forex trading automation",
    "automated forex trading",
    "AI forex trading",
    "AI forex signals",
    "AI trading bot",
    "AI trading system",
  ],
};

export default function Home() {
  return (
    <div className="min-w-0">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.15),transparent)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Forex Signals & Automated Trading
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:mt-6 sm:text-lg">
            Trade smarter with professional signals or automate your trading
            account.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <Link
              href="#forex-signals"
              className="rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-medium text-white transition hover:bg-emerald-600 min-h-[3rem] flex items-center justify-center sm:min-h-0"
            >
              View Signals
            </Link>
            <Link
              href="#automation"
              className="rounded-lg border border-zinc-600 bg-transparent px-6 py-3.5 text-base font-medium text-white transition hover:border-zinc-500 hover:bg-zinc-800/50 min-h-[3rem] flex items-center justify-center sm:min-h-0"
            >
              Automate Trading
            </Link>
          </div>
        </div>
      </section>

      {/* Integrated Forex Signals Overview */}
      <section
        id="forex-signals"
        className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl min-w-0">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-500/80">
              Forex Signals
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Done‑for‑you trade ideas, delivered in real time.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Get institutional‑grade forex signals with clear entry, stop loss
              and take profit levels so you never second‑guess a trade again.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_minmax(0,1fr)] lg:items-start">
            {/* Left: example signal feed */}
            <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/80">
                    Live signal stream (sample)
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
                    Signals are pushed in real time with full trade plan.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/40">
                  ● Live feed
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs sm:text-sm font-mono">
                {[
                  {
                    pair: "EURUSD",
                    direction: "BUY",
                    entry: "1.0842",
                    sl: "1.0820",
                    tp: "1.0890",
                    rr: "1 : 2.2",
                    status: "active",
                  },
                  {
                    pair: "GBPUSD",
                    direction: "SELL",
                    entry: "1.2705",
                    sl: "1.2735",
                    tp: "1.2640",
                    rr: "1 : 2.0",
                    status: "active",
                  },
                  {
                    pair: "XAUUSD",
                    direction: "BUY",
                    entry: "2020",
                    sl: "2010",
                    tp: "2040",
                    rr: "1 : 2.0",
                    status: "hit tp",
                  },
                ].map((s) => (
                  <div
                    key={`${s.pair}-${s.entry}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2.5"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-zinc-200 sm:text-sm">
                        {s.pair}{" "}
                        <span
                          className={
                            s.direction === "BUY"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }
                        >
                          {s.direction}
                        </span>
                      </p>
                      <p className="text-[11px] text-zinc-400 sm:text-xs">
                        Entry {s.entry} · SL {s.sl} · TP {s.tp}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[11px] text-zinc-500 sm:text-xs">
                        R:R {s.rr}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-xs ${
                          s.status === "hit tp"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {s.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[11px] text-zinc-500 sm:text-xs">
                This is illustrative data. Connect your preferred channel
                (Telegram, email, app) to receive real‑time signals from your
                live account.
              </p>
            </div>

            {/* Right: benefits */}
            <div className="min-w-0 space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-white sm:text-base">
                  What you get with our signals
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                  <li>• Clear entries, stop loss and take profit for every idea</li>
                  <li>• Risk‑first approach with predefined position sizing</li>
                  <li>• Multiple timeframes so intraday and swing traders fit</li>
                  <li>• Transparent tracking so you can see historic performance</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                  How it works
                </p>
                <ol className="mt-2 space-y-1.5 text-sm text-zinc-300">
                  <li>1. Choose your risk per trade and preferred pairs.</li>
                  <li>2. Receive signals instantly on your chosen channel.</li>
                  <li>3. Manually place trades or let automation handle them.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Trade Performance + Market Hours (two columns) */}
      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl min-w-0">
          <h2 className="text-center text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
            {recentTrades.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-zinc-400 sm:mt-4 sm:text-base">
            {recentTrades.description}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8 sm:mt-8 items-start">
            {/* Left column: Recent trades (bigger — 3/5 on lg) */}
            <div className="lg:col-span-3 min-w-0">
              {/* Live accuracy showcase */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-4 sm:px-5 sm:py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      Live
                    </span>
                    <span className="text-sm text-zinc-400 sm:text-base">
                      Accuracy updates as new trades are added.
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums text-emerald-400 sm:text-3xl">
                      {LIVE_ACCURACY_PERCENT}%
                    </span>
                    <span className="text-sm text-zinc-500">last {LAST_N_TRADES} trades</span>
                  </div>
                </div>
                <p className="mt-3 border-t border-zinc-800/80 pt-3 text-sm text-zinc-400">
                  {LIVE_MESSAGE}
                </p>
              </div>

              <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800 -mx-4 px-4 sm:mx-0 sm:px-0 overscroll-x-contain min-w-0">
                <table className="w-full min-w-[520px] text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/50">
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Pair</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Direction</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Entry</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3 hidden sm:table-cell">Stop Loss</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3 hidden sm:table-cell">Take Profit</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Pips</th>
                      <th className="px-3 py-2.5 font-medium text-zinc-400 sm:px-4 sm:py-3">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTrades.trades.map((t) => (
                      <tr
                        key={`${t.pair}-${t.entry}`}
                        className="border-b border-zinc-800/80 hover:bg-zinc-800/30"
                      >
                        <td className="px-3 py-2.5 font-medium sm:px-4 sm:py-3">{t.pair}</td>
                        <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3">{t.direction}</td>
                        <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3">{t.entry}</td>
                        <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3 hidden sm:table-cell">{t.stopLoss}</td>
                        <td className="px-3 py-2.5 text-zinc-400 sm:px-4 sm:py-3 hidden sm:table-cell">{t.takeProfit}</td>
                        <td
                          className={`px-3 py-2.5 font-medium sm:px-4 sm:py-3 ${
                            t.pips >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {t.pips >= 0 ? `+${t.pips}` : t.pips}
                        </td>
                        <td className="px-3 py-2.5 sm:px-4 sm:py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              t.result === "profit"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {t.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center sm:text-left">
                <Link
                  href="/trading-performance"
                  className="text-sm font-medium text-emerald-400 hover:text-emerald-300 inline-block py-2"
                >
                  View full performance →
                </Link>
              </div>
            </div>

            {/* Right column: Market Hours + Community Chats (2/5 on lg) */}
            <div className="lg:col-span-2 min-w-0 space-y-0">
              <MarketHours />
              <CommunityChats />
            </div>
          </div>
        </div>
      </section>

      {/* Integrated Automation Overview */}
      <section
        id="automation"
        className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mx-auto max-w-6xl min-w-0">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-500/80">
              Trading Automation
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Let the system execute the signals for you.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Connect your trading account once and let the automation engine
              mirror the same risk‑managed strategies 24/5 without you watching
              every tick.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
            {/* Left: simple automation flow */}
            <div className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Automation flow (concept)
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "Signal received",
                    body: "AI + traders validate a setup in real time.",
                  },
                  {
                    label: "Risk calculated",
                    body: "Position size adjusted to your configured risk %.",
                  },
                  {
                    label: "Trade executed",
                    body: "Order placed automatically on your connected broker.",
                  },
                ].map((step, idx) => (
                  <div
                    key={step.label}
                    className="relative flex flex-col rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-4"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/40">
                      {idx + 1}
                    </span>
                    <h3 className="mt-3 text-sm font-semibold text-white">
                      {step.label}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">{step.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-xs sm:text-sm">
                <p className="font-medium text-emerald-300">
                  Connect once. Trade automatically.
                </p>
                <p className="mt-1 text-zinc-300">
                  Integrate via investor password, copy‑trading bridge or API
                  (MT4/MT5, cTrader, or compatible platforms). You stay in
                  control: pause, adjust risk or disconnect at any time.
                </p>
              </div>
            </div>

            {/* Right: safeguards */}
            <div className="min-w-0 space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-white sm:text-base">
                  Built‑in risk controls
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                  <li>• Dynamic lot size based on account balance and risk %</li>
                  <li>• Daily and weekly loss limits to protect your capital</li>
                  <li>• Trade filters for news events and high‑volatility windows</li>
                  <li>• One‑click pause if you ever want to stop automation</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5 text-xs text-zinc-400 sm:text-sm">
                <p>
                  This section shows how the automation works conceptually. When
                  you are ready, you can plug in your broker and choose between
                  signals‑only mode or full hands‑off automation from the same
                  dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Market Intelligence Engine */}
      <section className="relative border-b border-zinc-800 px-4 py-12 sm:px-6 sm:py-20 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(16,185,129,0.04),transparent)] pointer-events-none" />
        <div className="relative mx-auto max-w-6xl min-w-0">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-widest uppercase text-emerald-500/80">
              Intelligence
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {aiIntelligence.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              {aiIntelligence.description}
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16">
            {aiIntelligence.modules.map((module, idx) => {
              const isResearcher = "exampleInsight" in module && module.exampleInsight;
              const isRisk = "exampleRiskReport" in module && module.exampleRiskReport;
              return (
                <div
                  key={module.name}
                  className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8"
                >
                  <div
                    className={`absolute top-0 left-0 w-full h-px rounded-t-2xl ${
                      idx === 0
                        ? "bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"
                        : "bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"
                    }`}
                  />
                  <h3 className="text-lg font-semibold text-white sm:text-xl">
                    {module.name}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                    {module.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {module.features.map((f) => (
                      <span
                        key={f}
                        className="inline-flex items-center rounded-md bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-400 border border-zinc-700/50"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                  {isResearcher && (
                    <div className="mt-6 rounded-xl bg-zinc-950/80 border border-zinc-800 p-4 font-mono text-xs">
                      <p className="text-zinc-500">Sample output</p>
                      <p className="mt-2 text-zinc-300">
                        <span className="text-white">{module.exampleInsight.pair}</span>
                        <span className="text-zinc-500 mx-1.5">→</span>
                        <span className="text-cyan-400">{module.exampleInsight.bias}</span>
                        <span className="text-zinc-500 ml-1.5">
                          ({module.exampleInsight.confidence})
                        </span>
                      </p>
                      <p className="mt-1 text-zinc-600">{module.exampleInsight.timeframe}</p>
                    </div>
                  )}
                  {isRisk && module.exampleRiskReport && (
                    <div className="mt-6 rounded-xl bg-zinc-950/80 border border-zinc-800 p-4">
                      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Current read</p>
                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <span className="text-zinc-400">
                          Level{" "}
                          <span className="font-medium text-amber-400/90">
                            {module.exampleRiskReport.riskLevel}
                          </span>
                        </span>
                        <span className="text-zinc-400">
                          Size{" "}
                          <span className="font-medium text-white">
                            {module.exampleRiskReport.recommendedRisk}
                          </span>
                        </span>
                        <span className="text-zinc-400">
                          Vol{" "}
                          <span className="text-zinc-300">{module.exampleRiskReport.volatility}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 text-center sm:p-6"
              >
                <p className="text-xl font-bold text-emerald-400 sm:text-2xl lg:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="border-b border-zinc-800 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-3">
            {sections.map((sec) => (
              <Link
                key={sec.title}
                href={sec.url}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 transition hover:border-emerald-500/30 hover:bg-zinc-900/50 sm:p-6"
              >
                <h2 className="font-semibold text-white group-hover:text-emerald-400 text-base sm:text-lg">
                  {sec.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-400">{sec.description}</p>
                <span className="mt-4 inline-block text-sm font-medium text-emerald-400">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

       {/* CTA */}
      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-12">
          <h2 className="text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
            Start Trading Smarter Today
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:mt-4 sm:text-base">
            Join traders using our signals and automation platform.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <Link
              href="#forex-signals"
              className="rounded-lg bg-emerald-500 px-6 py-3.5 text-base font-medium text-white transition hover:bg-emerald-600 min-h-[3rem] flex items-center justify-center sm:min-h-0"
            >
              View Signals
            </Link>
            <Link
              href="#automation"
              className="rounded-lg border border-zinc-600 px-6 py-3.5 text-base font-medium text-white transition hover:bg-zinc-800 min-h-[3rem] flex items-center justify-center sm:min-h-0"
            >
              Automate Trading
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
