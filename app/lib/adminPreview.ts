export type PostType = "news" | "blog";

/** Unsaved editor state handed to the preview tab through localStorage. */
export type PreviewDraft = {
  type: PostType;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  published_at: string;
  updated_at: string;
  category?: string;
  author_name?: string;
  author_title?: string;
  author_url?: string;
  image_url?: string;
  image_alt?: string;
};

export function previewStorageKey(type: PostType, id: string): string {
  return `pipsangel-admin-preview:${type}:${id}`;
}

export function previewWindowName(type: PostType, id: string): string {
  return `pipsangel-preview-${type}-${id}`;
}
