import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsListPage, newsListMetadata } from "../../../../components/news/NewsListPage";
import { getPublishedNews } from "../../../../lib/news";
import { categoriesInUse, categoryFromSlug } from "../../../../lib/newsArchive";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return categoriesInUse(await getPublishedNews()).map((entry) => ({ category: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categoryFromSlug((await params).category);
  return category ? newsListMetadata(1, category) : {};
}

export default async function NewsCategoryPage({ params }: Props) {
  const category = categoryFromSlug((await params).category);
  if (!category) notFound();
  return <NewsListPage page={1} category={category} />;
}
