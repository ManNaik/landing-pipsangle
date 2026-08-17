import { CategoryPills } from "../editorial/CategoryPills";
import { NEWS_CATEGORIES } from "../../lib/newsContent";

export function NewsCategoryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (category: string) => void;
}) {
  return <CategoryPills categories={NEWS_CATEGORIES} active={active} onChange={onChange} />;
}
