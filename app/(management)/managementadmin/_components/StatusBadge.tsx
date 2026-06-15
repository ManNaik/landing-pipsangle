export function StatusBadge({
  active,
  label,
}: {
  active: boolean;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-zinc-700/50 text-zinc-400"
      }`}
    >
      {label ?? (active ? "Active" : "Inactive")}
    </span>
  );
}
