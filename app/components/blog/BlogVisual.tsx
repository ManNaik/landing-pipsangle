import type { BlogVisualId } from "../../lib/blogContent";

const labels: Record<BlogVisualId, string> = {
  pairs: "PAIRS",
  chart: "MARKET",
  risk: "RISK",
  automation: "AUTO",
  mt5: "MT5",
  journal: "GUIDE",
  psychology: "PROCESS",
  drawdown: "EQUITY",
};

export function BlogVisual({
  visual,
  className = "",
}: {
  visual: BlogVisualId;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-white/[0.06] bg-[#080808] ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <svg className="absolute inset-x-4 bottom-3 h-16 w-[calc(100%-2rem)]" viewBox="0 0 200 60" fill="none">
        <path
          d="M0 42 C20 40 28 22 48 24 C68 26 76 48 98 36 C118 26 128 12 148 16 C168 20 176 34 200 18"
          stroke="rgb(16 185 129 / 0.7)"
          strokeWidth="1.5"
        />
        <path
          d="M0 48 C24 46 40 38 60 40 C86 43 96 52 120 44 C144 36 160 30 200 28"
          stroke="rgb(161 161 170 / 0.35)"
          strokeWidth="1"
        />
      </svg>
      <p className="absolute left-4 top-4 text-[11px] font-medium tracking-[0.18em] text-zinc-500">
        {labels[visual]}
      </p>
      {visual === "mt5" ? (
        <p className="absolute right-4 top-4 text-[11px] tracking-[0.14em] text-zinc-600">IC MARKETS</p>
      ) : null}
    </div>
  );
}
