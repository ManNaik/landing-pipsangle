type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
};

export function SearchField({ value, onChange, placeholder, label }: SearchFieldProps) {
  return (
    <label className="relative block min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m1.1-5.4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] pl-10 pr-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors duration-200 focus:border-emerald-500/40"
      />
    </label>
  );
}
