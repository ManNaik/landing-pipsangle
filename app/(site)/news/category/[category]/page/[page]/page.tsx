import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { NewsListPage, newsListMetadata } from "../../../../../../components/news/NewsListPage";
import { getPublishedNews } from "../../../../../../lib/news";
import {
  NEWS_PAGE_SIZE,
  categoriesInUse,
  categoryFromSlug,
  newsListPath,
  parsePageParam,
} from "../../../../../../lib/newsArchive";

type Props = { params: Promise<{ category: string; page: string }> };

export async function generateStaticParams() {
  return categoriesInUse(await getPublishedNews()).flatMap((entry) => {
    const totalPages = Math.ceil(entry.count / NEWS_PAGE_SIZE);
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
      category: entry.slug,
      page: String(index + 2),
    }));
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug, page: rawPage } = await params;
  const category = categoryFromSlug(slug);
  const page = parsePageParam(rawPage);
  return category && page && page > 1 ? newsListMetadata(page, category) : {};
}

export default async function NewsCategoryArchivePage({ params }: Props) {
  const { category: slug, page: rawPage } = await params;
  const category = categoryFromSlug(slug);
  const page = parsePageParam(rawPage);
  if (!category || !page) notFound();
  if (page === 1) permanentRedirect(newsListPath(1, category));
  return <NewsListPage page={page} category={category} />;
}
