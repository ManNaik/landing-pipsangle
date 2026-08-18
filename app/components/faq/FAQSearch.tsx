import { SearchField } from "../editorial/SearchField";

type FAQSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function FAQSearch({ value, onChange }: FAQSearchProps) {
  return (
    <div className="flex items-center gap-3">
      <SearchField
        value={value}
        onChange={onChange}
        placeholder="Search questions..."
        label="Search questions"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="shrink-0 text-sm text-zinc-500 transition-colors duration-200 hover:text-white"
        >
          Clear search
        </button>
      ) : null}
    </div>
  );
}
