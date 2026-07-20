import { FREE_TRIAL_LABEL } from "../lib/trial";

type FreeTrialBadgeProps = {
  /** Visual emphasis: default pill, compact for header, highlighted for hero, editorial for pricing */
  variant?: "default" | "highlight" | "compact" | "editorial";
  className?: string;
};

export function FreeTrialBadge({
  variant = "default",
  className = "",
}: FreeTrialBadgeProps) {
  const base = "inline-flex items-center font-medium";

  const styles = {
    default:
      "gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-900/50 px-3.5 py-1.5 text-xs text-zinc-300 sm:text-sm",
    highlight:
      "gap-2 rounded-full border border-zinc-700/50 bg-zinc-950/60 px-4 py-2 text-sm text-zinc-200 backdrop-blur-sm sm:text-[15px]",
    compact:
      "gap-1 rounded-md border border-zinc-700/50 bg-zinc-900/40 px-2 py-0.5 text-[10px] tracking-wide text-zinc-400 sm:text-xs",
    editorial:
      "gap-2 text-[11px] tracking-[0.15em] text-zinc-500 uppercase",
  };

  const showDot = variant !== "editorial";

  return (
    <span className={`${base} ${styles[variant]} ${className}`}>
      {showDot ? (
        <span
          className={`shrink-0 rounded-full bg-emerald-500/80 ${
            variant === "compact" ? "h-1 w-1" : "h-1.5 w-1.5"
          }`}
          aria-hidden
        />
      ) : null}
      {FREE_TRIAL_LABEL}
    </span>
  );
}
