import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { NewsListPage, newsListMetadata } from "../../../../components/news/NewsListPage";
import { getPublishedNews } from "../../../../lib/news";
import { NEWS_PAGE_SIZE, parsePageParam } from "../../../../lib/newsArchive";

type Props = { params: Promise<{ page: string }> };

export async function generateStaticParams() {
  const articles = await getPublishedNews();
  const totalPages = Math.ceil(articles.length / NEWS_PAGE_SIZE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parsePageParam((await params).page);
  return page && page > 1 ? newsListMetadata(page, null) : {};
}

export default async function NewsArchivePage({ params }: Props) {
  const page = parsePageParam((await params).page);
  if (page === 1) permanentRedirect("/news");
  if (!page) notFound();
  return <NewsListPage page={page} category={null} />;
}
