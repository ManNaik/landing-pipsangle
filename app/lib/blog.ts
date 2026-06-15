import { safeApiGet } from "./api";
import type { BlogPostDetail, BlogPostListItem, PaginatedResponse } from "./types";

export type BlogPost = BlogPostListItem;

export async function getBlogPosts(): Promise<BlogPostListItem[]> {
  const data = await safeApiGet<PaginatedResponse<BlogPostListItem>>("/blog/", 300);
  return data?.results ?? [];
}

export async function getBlogPost(slug: string): Promise<BlogPostDetail | null> {
  return safeApiGet<BlogPostDetail>(`/blog/${slug}/`, 300);
}

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map((p) => p.slug);
}
