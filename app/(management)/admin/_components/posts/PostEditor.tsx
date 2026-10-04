"use client";

import { ArrowLeft, Eye, ExternalLink, Image as ImageIcon, LoaderCircle, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Separator } from "@/app/components/ui/separator";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Textarea } from "@/app/components/ui/textarea";
import { cn } from "@/app/lib/utils";
import { adminDelete, adminGet, adminPatch, adminPost } from "../../../../lib/adminApi";
import { previewStorageKey, previewWindowName, type PreviewDraft } from "../../../../lib/adminPreview";
import { isValidSlug, slugify } from "../../../../lib/slug";
import type { AdminPost } from "../../../../lib/types";
import { PostStatusBadges } from "./PostStatusBadges";
import { POST_TYPES, SEO_LIMITS, formatAdminDate, type PostType, type PostTypeConfig } from "./postTypes";
import { RichTextEditor } from "./RichTextEditor";
import { SeoPreview } from "./SeoPreview";

type PostForm = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  published_at: string;
  category: string;
  author_name: string;
  author_title: string;
  author_url: string;
  image_url: string;
  image_alt: string;
};

type FieldErrors = Partial<Record<keyof PostForm, string>>;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyForm(config: PostTypeConfig): PostForm {
  return {
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    published: false,
    published_at: today(),
    category: config.categories?.[0] ?? "",
    author_name: "",
    author_title: "",
    author_url: "",
    image_url: "",
    image_alt: "",
  };
}

function formFromPost(post: AdminPost, config: PostTypeConfig): PostForm {
  return {
    ...emptyForm(config),
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    published: post.published,
    published_at: post.published_at,
    category: post.category ?? config.categories?.[0] ?? "",
    author_name: post.author_name ?? "",
    author_title: post.author_title ?? "",
    author_url: post.author_url ?? "",
    image_url: post.image_url ?? "",
    image_alt: post.image_alt ?? "",
  };
}

function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

/** WordPress-style automatic excerpt: the opening of the article, cut at a word boundary. */
function autoExcerpt(html: string): string {
  const text = plainText(html);
  if (text.length <= SEO_LIMITS.excerpt[1]) return text;
  return `${text.slice(0, SEO_LIMITS.excerpt[1] - 1).replace(/\s+\S*$/, "")}…`;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\/\S+$/i.test(value);
}

function payload(form: PostForm, config: PostTypeConfig, published: boolean) {
  const base = {
    title: form.title.trim(),
    slug: form.slug,
    content: form.content,
    excerpt: form.excerpt.trim() || autoExcerpt(form.content),
    published,
    published_at: form.published_at,
  };
  if (config.type !== "news") return base;
  return {
    ...base,
    category: form.category,
    author_name: form.author_name.trim(),
    author_title: form.author_title.trim(),
    author_url: form.author_url.trim(),
    image_url: form.image_url.trim(),
    image_alt: form.image_alt.trim(),
  };
}

function validate(form: PostForm, config: PostTypeConfig): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.title.trim()) errors.title = "Add a title.";
  if (!isValidSlug(form.slug)) errors.slug = "Use lowercase letters, numbers and single hyphens.";
  if (!plainText(form.content)) errors.content = "The article is empty.";
  if (!form.published_at) errors.published_at = "Pick a publish date.";
  if (config.categories && !form.category) errors.category = "Choose a category.";
  if (form.author_url.trim() && !isHttpUrl(form.author_url.trim())) errors.author_url = "Use a full https:// address.";
  if (form.image_url.trim() && !isHttpUrl(form.image_url.trim())) errors.image_url = "Use a full https:// address.";
  return errors;
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-destructive">{message}</p> : null;
}

export function PostEditor({ type, id }: { type: PostType; id?: string }) {
  const config = POST_TYPES[type];
  const router = useRouter();
  const isNew = !id;

  const [post, setPost] = useState<AdminPost | null>(null);
  const [form, setForm] = useState<PostForm>(() => emptyForm(config));
  const [snapshot, setSnapshot] = useState(() => JSON.stringify(emptyForm(config)));
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [editingSlug, setEditingSlug] = useState(false);

  const dirty = JSON.stringify(form) !== snapshot;
  const words = plainText(form.content).split(" ").filter(Boolean).length;

  useEffect(() => {
    if (!id) return;
    let active = true;
    adminGet<AdminPost>(`${config.apiPath}${id}/`)
      .then((loaded) => {
        if (!active) return;
        const next = formFromPost(loaded, config);
        setPost(loaded);
        setForm(next);
        setSnapshot(JSON.stringify(next));
      })
      .catch((error) => active && setLoadError(error instanceof Error ? error.message : "Couldn't load this post."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [config, id]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update<K extends keyof PostForm>(key: K, value: PostForm[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "title" && !slugEdited) next.slug = slugify(String(value));
      return next;
    });
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function save(publish: boolean): Promise<AdminPost | null> {
    const problems = validate(form, config);
    setErrors(problems);
    if (Object.keys(problems).length > 0) {
      toast.error("Fix the highlighted fields first.");
      return null;
    }
    setSaving(true);
    try {
      const body = payload(form, config, publish);
      const result = isNew
        ? await adminPost<AdminPost>(config.apiPath, body)
        : await adminPatch<AdminPost>(`${config.apiPath}${id}/`, body);
      const next = formFromPost(result, config);
      setPost(result);
      setForm(next);
      setSnapshot(JSON.stringify(next));
      toast.success(publish ? (post?.published ? "Changes are live." : "Published.") : post?.published ? "Moved to drafts." : "Draft saved.");
      if (isNew) router.replace(`${config.adminPath}/${result.id}`);
      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Saving failed.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  const onShortcut = useEffectEvent((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      if (!saving) void save(form.published);
    }
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => onShortcut(event);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  function openPreview() {
    const previewId = id ?? "new";
    const draft: PreviewDraft = {
      type,
      ...payload(form, config, form.published),
      updated_at: post?.updated_at ?? new Date().toISOString(),
    };
    localStorage.setItem(previewStorageKey(type, previewId), JSON.stringify(draft));
    window.open(`/preview/${type}/${previewId}?draft=1`, previewWindowName(type, previewId));
  }

  async function remove() {
    if (!id) return;
    setDeleting(true);
    try {
      await adminDelete(`${config.apiPath}${id}/`);
      setSnapshot(JSON.stringify(form));
      toast.success(`"${form.title}" deleted.`);
      router.push(config.adminPath);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Deleting failed.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto grid max-w-6xl gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto grid max-w-6xl gap-3">
        <p className="text-sm text-destructive">{loadError}</p>
        <Button variant="outline" size="sm" className="w-fit" asChild>
          <Link href={config.adminPath}>
            <ArrowLeft />
            Back to {config.plural.toLowerCase()}
          </Link>
        </Button>
      </div>
    );
  }

  const live = Boolean(post?.published);
  const publicUrl = config.publicPath(form.slug || "your-slug");

  return (
    <div className="mx-auto grid max-w-6xl gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" className="-ml-2" asChild>
          <Link href={config.adminPath}>
            <ArrowLeft />
            {config.plural}
          </Link>
        </Button>
        <h1 className="text-xl font-semibold tracking-tight">{isNew ? `Add ${config.singular.toLowerCase()}` : `Edit ${config.singular.toLowerCase()}`}</h1>
        {post ? <PostStatusBadges published={post.published} source={post.created_via} /> : null}
        {dirty ? <span className="text-xs text-amber-300">Unsaved changes</span> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid min-w-0 content-start gap-5">
          <div className="grid gap-2">
            <Label htmlFor="post-title" className="sr-only">
              Title
            </Label>
            <Textarea
              id="post-title"
              rows={1}
              value={form.title}
              onChange={(event) => update("title", event.target.value.replace(/\n/g, " "))}
              onKeyDown={(event) => event.key === "Enter" && event.preventDefault()}
              placeholder="Add title"
              aria-invalid={Boolean(errors.title)}
              className="min-h-0 resize-none border-0 bg-transparent px-0 py-1 text-2xl leading-tight font-semibold shadow-none field-sizing-content focus-visible:ring-0 md:text-3xl dark:bg-transparent"
            />
            <FieldError message={errors.title} />
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Permalink:</span>
              {editingSlug ? (
                <form
                  className="flex items-center gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    update("slug", slugify(form.slug));
                    setEditingSlug(false);
                  }}
                >
                  <span>pipsangel.com{config.publicPath("").replace(/\/$/, "")}/</span>
                  <Input
                    autoFocus
                    value={form.slug}
                    onChange={(event) => {
                      setSlugEdited(true);
                      update(
                        "slug",
                        event.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-")
                      );
                    }}
                    className="h-7 w-64 text-sm"
                    aria-label="Slug"
                  />
                  <Button type="submit" size="sm" variant="secondary" className="h-7">
                    OK
                  </Button>
                </form>
              ) : (
                <>
                  {live && !dirty ? (
                    <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-foreground underline-offset-4 hover:underline">
                      pipsangel.com{publicUrl}
                    </a>
                  ) : (
                    <span className="text-foreground">pipsangel.com{publicUrl}</span>
                  )}
                  <Button type="button" variant="outline" size="sm" className="h-7" onClick={() => setEditingSlug(true)}>
                    Edit
                  </Button>
                </>
              )}
            </div>
            <FieldError message={errors.slug} />
          </div>

          <div className="grid gap-2">
            <RichTextEditor value={form.content} onChange={(html) => update("content", html)} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <FieldError message={errors.content} />
              <span className="ml-auto tabular-nums">
                {words} words · {Math.max(1, Math.round(words / 220))} min read
              </span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Excerpt</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Textarea
                value={form.excerpt}
                onChange={(event) => update("excerpt", event.target.value)}
                placeholder="One or two sentences shown in article lists, search results and social previews. Left empty, the opening of the article is used."
                className="min-h-20"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Search preview</CardTitle>
            </CardHeader>
            <CardContent>
              <SeoPreview title={form.title} excerpt={form.excerpt.trim() || autoExcerpt(form.content)} path={publicUrl} />
            </CardContent>
          </Card>
        </div>

        <aside className="grid content-start gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Publish</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">{live ? "Published" : "Draft"}</span>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="post-date" className="text-muted-foreground">
                  Publish date
                </Label>
                <Input
                  id="post-date"
                  type="date"
                  value={form.published_at}
                  onChange={(event) => update("published_at", event.target.value)}
                  aria-invalid={Boolean(errors.published_at)}
                />
                <FieldError message={errors.published_at} />
              </div>
              {post ? (
                <div className="grid gap-1 text-xs text-muted-foreground">
                  <span>Last updated {formatAdminDate(post.updated_at)}</span>
                  {post.created_via === "pipeline" ? <span>Created by the content pipeline</span> : null}
                </div>
              ) : null}
              <Button type="button" variant="outline" size="sm" onClick={openPreview}>
                <Eye />
                {live ? "Preview changes" : "Preview"}
              </Button>
              <Separator />
              <div className="flex items-center justify-between gap-2">
                {!isNew ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="ghost" size="sm" className="-ml-2 text-destructive hover:text-destructive">
                        <Trash />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete &ldquo;{form.title || "this post"}&rdquo;?</AlertDialogTitle>
                        <AlertDialogDescription>
                          It will be removed from the site and can&apos;t be recovered. Switch it to a draft instead if you only want to hide it.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={deleting}
                          className="bg-destructive text-white hover:bg-destructive/90"
                          onClick={(event) => {
                            event.preventDefault();
                            void remove();
                          }}
                        >
                          Delete permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" size="sm" disabled={saving} onClick={() => void save(false)}>
                    {live ? "Switch to draft" : "Save draft"}
                  </Button>
                  <Button type="button" size="sm" disabled={saving} onClick={() => void save(true)}>
                    {saving ? <LoaderCircle className="animate-spin" /> : null}
                    {live ? "Update" : "Publish"}
                  </Button>
                </div>
              </div>
              {live && !dirty ? (
                <a
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                  View on site
                </a>
              ) : null}
              <p className="text-xs text-muted-foreground">Ctrl or ⌘ + S saves without changing the status.</p>
            </CardContent>
          </Card>

          {config.categories ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Category</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <RadioGroup value={form.category} onValueChange={(value) => update("category", value)} className="gap-2.5">
                  {config.categories.map((name) => (
                    <div key={name} className="flex items-center gap-2">
                      <RadioGroupItem value={name} id={`category-${name}`} />
                      <Label htmlFor={`category-${name}`} className="font-normal">
                        {name}
                      </Label>
                    </div>
                  ))}
                  {form.category && !config.categories.includes(form.category) ? (
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={form.category} id="category-legacy" />
                      <Label htmlFor="category-legacy" className="font-normal text-muted-foreground">
                        {form.category} (old category)
                      </Label>
                    </div>
                  ) : null}
                </RadioGroup>
                <FieldError message={errors.category} />
              </CardContent>
            </Card>
          ) : null}

          {config.hasImage ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Featured image</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {isHttpUrl(form.image_url.trim()) ? (
                  // eslint-disable-next-line @next/next/no-img-element -- previewing an arbitrary CMS URL.
                  <img src={form.image_url.trim()} alt="" className="aspect-[16/9] w-full rounded-md border object-cover" />
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center rounded-md border border-dashed text-muted-foreground">
                    <ImageIcon className="size-6" />
                  </div>
                )}
                <div className="grid gap-1.5">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    value={form.image_url}
                    onChange={(event) => update("image_url", event.target.value)}
                    placeholder="https://"
                    aria-invalid={Boolean(errors.image_url)}
                  />
                  <FieldError message={errors.image_url} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="image-alt">Description for screen readers</Label>
                  <Input id="image-alt" value={form.image_alt} onChange={(event) => update("image_alt", event.target.value)} />
                </div>
                <p className="text-xs text-muted-foreground">At least 1200 px wide. Also used in social previews.</p>
              </CardContent>
            </Card>
          ) : null}

          {config.hasAuthor ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Author</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="author-name">Name</Label>
                  <Input
                    id="author-name"
                    value={form.author_name}
                    onChange={(event) => update("author_name", event.target.value)}
                    placeholder="Shown as PipsAngel when empty"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="author-title">Role or credentials</Label>
                  <Input id="author-title" value={form.author_title} onChange={(event) => update("author_title", event.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="author-url">Profile URL</Label>
                  <Input
                    id="author-url"
                    value={form.author_url}
                    onChange={(event) => update("author_url", event.target.value)}
                    placeholder="https://"
                    aria-invalid={Boolean(errors.author_url)}
                  />
                  <FieldError message={errors.author_url} />
                </div>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
      <div className={cn("text-xs text-muted-foreground", isNew && "hidden")}>Post ID {id}</div>
    </div>
  );
}
