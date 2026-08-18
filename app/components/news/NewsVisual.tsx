import type { NewsVisualId } from "../../lib/newsContent";

const accents: Record<NewsVisualId, string> = {
  dollar: "from-emerald-500/15",
  euro: "from-sky-500/12",
  yen: "from-zinc-400/12",
  gold: "from-amber-500/15",
  rates: "from-emerald-400/12",
  grid: "from-white/[0.06]",
};

function Candles({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 80" fill="none" aria-hidden>
      {[
        [12, 48, 22],
        [32, 36, 28],
        [52, 42, 18],
        [72, 24, 32],
        [92, 30, 26],
        [112, 18, 30],
        [132, 28, 22],
      ].map(([x, y, h], i) => (
        <g key={x} className={i % 2 === 0 ? "stroke-emerald-400/70" : "stroke-red-400/55"}>
          <line x1={x + 5} y1={y - 8} x2={x + 5} y2={y + h + 8} strokeWidth="1" />
          <rect x={x} y={y} width="10" height={h} fill="currentColor" className="fill-transparent" strokeWidth="1.25" />
        </g>
      ))}
    </svg>
  );
}

export function NewsVisual({
  visual,
  className = "",
  featured = false,
}: {
  visual: NewsVisualId;
  className?: string;
  featured?: boolean;
}) {
  const label =
    visual === "dollar"
      ? "USD"
      : visual === "euro"
        ? "EUR"
        : visual === "yen"
          ? "JPY"
          : visual === "gold"
            ? "XAU"
            : visual === "rates"
              ? "RATES"
              : "FX";

  return (
    <div
      className={`relative overflow-hidden border border-white/[0.06] bg-[#080808] ${className}`}
      aria-hidden
    >
      <div
        className={`absolute inset-0 bg-[linear-gradient(to_bottom_right,var(--tw-gradient-stops))] ${accents[visual]} via-transparent to-transparent`}
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute left-4 top-4 text-[11px] font-medium tracking-[0.18em] text-zinc-500">
        {label}
      </div>
      <div className={`absolute bottom-0 right-0 ${featured ? "w-[85%]" : "w-full"} p-3`}>
        <Candles className={featured ? "h-24 w-full" : "h-16 w-full"} />
      </div>
    </div>
  );
}
