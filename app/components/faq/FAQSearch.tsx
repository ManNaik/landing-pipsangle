import { SearchField } from "../editorial/SearchField";

type FAQSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function FAQSearch({ value, onChange }: FAQSearchProps) {
  return (
    <div className="flex items-center gap-3">
      <SearchField value={value} onChange={onChange} placeholder="Search, for example “withdraw” or “trial”" label="Search questions" />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="shrink-0 text-sm font-semibold text-sage-300 underline underline-offset-4 hover:text-paper"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
