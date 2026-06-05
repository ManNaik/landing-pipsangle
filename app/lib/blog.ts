export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

const posts: BlogPost[] = [
  {
    slug: "best-forex-signals",
    title: "What Are the Best Forex Signals?",
    date: "2025-02-15",
    excerpt:
      "How to evaluate forex signal providers and what to look for in transparency and performance.",
    content: `
      <p>Choosing a forex signal provider can feel overwhelming. The best forex signals share a few traits: clear entry, stop loss, and take profit levels; a track record you can verify; and risk management rules that protect your capital.</p>
      <p>At PipAngel we publish daily signals with full transparency. You can review our performance history and decide whether our style fits your goals. We recommend starting with a signal-only plan before moving to automation.</p>
      <p>Always remember that past performance does not guarantee future results. Trade only with capital you can afford to lose.</p>
    `,
  },
  {
    slug: "how-forex-automation-works",
    title: "How Forex Automation Works",
    date: "2025-02-10",
    excerpt:
      "A simple explanation of automated forex trading and how our system executes trades.",
    content: `
      <p>Forex automation connects your trading account to a system that can place and manage trades based on predefined rules. Here’s a simplified flow:</p>
      <ol>
        <li><strong>Signal generated:</strong> Our strategy produces a trade setup (pair, direction, entry, stop loss, take profit).</li>
        <li><strong>Engine processes:</strong> The automation engine checks risk limits and lot size.</li>
        <li><strong>Trade executed:</strong> The order is sent to your broker via MT4 or MT5.</li>
        <li><strong>Risk management:</strong> Stop loss and take profit are managed automatically.</li>
      </ol>
      <p>You stay in control: you can pause or disable automation at any time. Our system is designed to follow strict risk management so that no single trade can overexpose your account.</p>
    `,
  },
  {
    slug: "forex-trading-performance",
    title: "Understanding Forex Trading Performance",
    date: "2025-02-01",
    excerpt:
      "Key metrics to look at when evaluating a signal or automation provider.",
    content: `
      <p>When reviewing a forex signal or automation provider, focus on metrics that reflect both returns and risk.</p>
      <ul>
        <li><strong>Win rate:</strong> The percentage of trades that are profitable. High win rate alone isn’t enough without good risk:reward.</li>
        <li><strong>Average pips / risk:reward:</strong> How much you aim to gain per trade versus how much you risk.</li>
        <li><strong>Max drawdown:</strong> The largest peak-to-trough decline. Lower is generally better for capital preservation.</li>
      </ul>
      <p>We publish these stats and recent trades so you can make an informed decision. Past performance does not guarantee future results.</p>
    `,
  },
];

export async function getBlogPosts(): Promise<BlogPost[]> {
  return posts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return posts.find((p) => p.slug === slug) ?? null;
}
