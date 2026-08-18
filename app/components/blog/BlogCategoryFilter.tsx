import { CategoryPills } from "../editorial/CategoryPills";
import { BLOG_CATEGORIES } from "../../lib/blogContent";

export function BlogCategoryFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (category: string) => void;
}) {
  return <CategoryPills categories={BLOG_CATEGORIES} active={active} onChange={onChange} />;
}
