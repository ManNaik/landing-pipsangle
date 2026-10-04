"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
} from "@/app/components/ui/alert-dialog";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { cn } from "@/app/lib/utils";
import { adminDelete, adminGet, adminPatch } from "../../../../lib/adminApi";
import type { AdminPostListResponse, AdminPostSummary } from "../../../../lib/types";
import { PostStatusBadges } from "./PostStatusBadges";
import { POST_TYPES, formatAdminDate, type PostType } from "./postTypes";

const PAGE_SIZE = 20;
const ALL = "all";

type StatusTab = "all" | "published" | "draft" | "pipeline";
type BulkAction = "publish" | "draft" | "delete";

export function PostsList({ type }: { type: PostType }) {
  const config = POST_TYPES[type];
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const status = (["published", "draft", "pipeline"].includes(params.get("status") ?? "") ? params.get("status") : ALL) as StatusTab;
  const search = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const ordering = params.get("ordering") ?? "-date";
  const page = Math.max(1, Number(params.get("page")) || 1);

  const [data, setData] = useState<AdminPostListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<BulkAction | "">("");
  const [pendingDelete, setPendingDelete] = useState<AdminPostSummary[] | null>(null);
  const [working, setWorking] = useState(false);

  const setQuery = useCallback(
    (changes: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value);
        else next.delete(key);
      }
      if (!("page" in changes)) next.delete("page");
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  const load = useCallback(async () => {
    setLoading(true);
    const query = new URLSearchParams({
      limit: String(PAGE_SIZE),
      offset: String((page - 1) * PAGE_SIZE),
      ordering,
    });
    if (status === "published" || status === "draft") query.set("status", status);
    if (status === "pipeline") query.set("source", "pipeline");
    if (search) query.set("search", search);
    if (category) query.set("category", category);
    try {
      setData(await adminGet<AdminPostListResponse>(`${config.apiPath}?${query}`));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load posts.");
    } finally {
      setLoading(false);
      setSelected(new Set());
    }
  }, [config.apiPath, page, ordering, status, search, category]);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = data?.results ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / PAGE_SIZE));
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));
  const someSelected = rows.some((row) => selected.has(row.id));
  const filtered = Boolean(search || category || status !== ALL);
  const columnCount = 4 + (config.hasAuthor ? 1 : 0) + (config.categories ? 1 : 0);

  function toggleRow(id: string, checked: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function runAction(targets: AdminPostSummary[], action: BulkAction) {
    setWorking(true);
    const results = await Promise.allSettled(
      targets.map((row) =>
        action === "delete"
          ? adminDelete(`${config.apiPath}${row.id}/`)
          : adminPatch(`${config.apiPath}${row.id}/`, { published: action === "publish" })
      )
    );
    const failed = results.filter((result) => result.status === "rejected").length;
    const done = targets.length - failed;
    const verb = action === "delete" ? "deleted" : action === "publish" ? "published" : "moved to drafts";
    if (done > 0) toast.success(`${done} ${done === 1 ? "item" : "items"} ${verb}.`);
    if (failed > 0) toast.error(`${failed} ${failed === 1 ? "item" : "items"} couldn't be ${verb}.`);
    setWorking(false);
    setBulkAction("");
    setPendingDelete(null);
    await load();
  }

  function applyBulk() {
    const targets = rows.filter((row) => selected.has(row.id));
    if (!bulkAction || targets.length === 0) return;
    if (bulkAction === "delete") setPendingDelete(targets);
    else void runAction(targets, bulkAction);
  }

  const counts = data?.counts;
  const tabs: Array<{ key: StatusTab; label: string; count?: number }> = [
    { key: "all", label: "All", count: counts?.all },
    { key: "published", label: "Published", count: counts?.published },
    { key: "draft", label: "Drafts", count: counts?.draft },
    ...(config.hasSource ? [{ key: "pipeline" as const, label: "Pipeline", count: counts?.pipeline }] : []),
  ];

  function SortButton({ label, field }: { label: string; field: "title" | "date" }) {
    const active = ordering.replace(/^-/, "") === field;
    const descending = ordering.startsWith("-");
    const next = active ? (descending ? field : `-${field}`) : field === "date" ? "-date" : field;
    const Icon = !active ? ArrowUpDown : descending ? ArrowDown : ArrowUp;
    return (
      <button
        type="button"
        onClick={() => setQuery({ ordering: next === "-date" ? null : next })}
        className="inline-flex items-center gap-1 hover:text-foreground"
      >
        {label}
        <Icon className={cn("size-3.5", !active && "opacity-40")} />
      </button>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{config.plural}</h1>
        <Button size="sm" asChild>
          <Link href={`${config.adminPath}/new`}>
            <Plus />
            Add new
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Filter by status" className="flex flex-wrap items-center gap-1 text-sm">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={status === tab.key ? "secondary" : "ghost"}
              size="sm"
              className="h-8"
              aria-current={status === tab.key ? "page" : undefined}
              onClick={() => setQuery({ status: tab.key === ALL ? null : tab.key })}
            >
              {tab.label}
              <span className="tabular-nums text-muted-foreground">{tab.count ?? "–"}</span>
            </Button>
          ))}
        </nav>
        <form
          key={search}
          role="search"
          className="flex w-full gap-2 sm:w-auto"
          onSubmit={(event) => {
            event.preventDefault();
            const value = String(new FormData(event.currentTarget).get("q") ?? "").trim();
            setQuery({ q: value || null });
          }}
        >
          <Input name="q" defaultValue={search} placeholder={`Search ${config.plural.toLowerCase()}`} className="h-9 sm:w-64" />
          <Button type="submit" variant="outline" size="sm" className="h-9">
            <Search />
            <span className="sr-only sm:not-sr-only">Search</span>
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={bulkAction} onValueChange={(value) => setBulkAction(value as BulkAction)}>
          <SelectTrigger size="sm" className="w-40" aria-label="Bulk actions">
            <SelectValue placeholder="Bulk actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="publish">Publish</SelectItem>
            <SelectItem value="draft">Move to drafts</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" disabled={!bulkAction || !someSelected || working} onClick={applyBulk}>
          Apply
        </Button>
        {config.categories ? (
          <Select value={category || ALL} onValueChange={(value) => setQuery({ category: value === ALL ? null : value })}>
            <SelectTrigger size="sm" className="w-44" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {config.categories.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        {filtered ? (
          <Button variant="ghost" size="sm" onClick={() => router.replace(pathname)}>
            Clear filters
          </Button>
        ) : null}
        <span className="ml-auto text-sm text-muted-foreground tabular-nums">
          {data ? `${data.count} ${data.count === 1 ? "item" : "items"}` : ""}
        </span>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Card className="gap-0 overflow-hidden py-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected ? true : someSelected ? "indeterminate" : false}
                  onCheckedChange={(checked) => setSelected(checked === true ? new Set(rows.map((row) => row.id)) : new Set())}
                  aria-label="Select all on this page"
                />
              </TableHead>
              <TableHead>
                <SortButton label="Title" field="title" />
              </TableHead>
              {config.hasAuthor ? <TableHead className="hidden md:table-cell">Author</TableHead> : null}
              {config.categories ? <TableHead className="hidden md:table-cell">Category</TableHead> : null}
              <TableHead>Status</TableHead>
              <TableHead className="w-40">
                <SortButton label="Date" field="date" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && !data
              ? Array.from({ length: 6 }, (_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={columnCount}>
                      <Skeleton className="h-9 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : null}
            {!loading && rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="py-14 text-center text-muted-foreground">
                  {filtered ? `No ${config.plural.toLowerCase()} match these filters.` : `No ${config.plural.toLowerCase()} yet.`}
                  <div className="mt-3">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`${config.adminPath}/new`}>
                        <Plus />
                        Add new
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
            {rows.map((row) => {
              const editHref = `${config.adminPath}/${row.id}`;
              return (
                <TableRow key={row.id} data-state={selected.has(row.id) ? "selected" : undefined} className={cn("group", loading && "opacity-60")}>
                  <TableCell className="align-top">
                    <Checkbox
                      checked={selected.has(row.id)}
                      onCheckedChange={(checked) => toggleRow(row.id, checked === true)}
                      aria-label={`Select ${row.title}`}
                      className="mt-0.5"
                    />
                  </TableCell>
                  <TableCell className="max-w-[28rem] align-top whitespace-normal">
                    <Link href={editHref} className="font-medium leading-snug hover:text-primary">
                      {row.title || "(no title)"}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                      <Link href={editHref} className="hover:text-foreground">
                        Edit
                      </Link>
                      <span aria-hidden>|</span>
                      {row.published ? (
                        <a href={config.publicPath(row.slug)} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                          View
                        </a>
                      ) : (
                        <a href={`/preview/${type}/${row.id}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                          Preview
                        </a>
                      )}
                      <span aria-hidden>|</span>
                      <button type="button" className="text-destructive hover:underline" onClick={() => setPendingDelete([row])}>
                        Delete
                      </button>
                    </div>
                  </TableCell>
                  {config.hasAuthor ? (
                    <TableCell className="hidden align-top text-muted-foreground md:table-cell">{row.author_name || "PipsAngel"}</TableCell>
                  ) : null}
                  {config.categories ? <TableCell className="hidden align-top md:table-cell">{row.category}</TableCell> : null}
                  <TableCell className="align-top">
                    <PostStatusBadges published={row.published} source={row.created_via} />
                  </TableCell>
                  <TableCell className="align-top text-sm">
                    <div className="text-muted-foreground">{row.published ? "Published" : "Last modified"}</div>
                    <div className="tabular-nums">{formatAdminDate(row.published ? row.published_at : row.updated_at)}</div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="text-muted-foreground tabular-nums">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="icon" className="size-8" disabled={page <= 1} onClick={() => setQuery({ page: String(page - 1) })} aria-label="Previous page">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon" className="size-8" disabled={page >= totalPages} onClick={() => setQuery({ page: String(page + 1) })} aria-label="Next page">
            <ChevronRight />
          </Button>
        </div>
      ) : null}

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {pendingDelete?.length === 1 ? `"${pendingDelete[0].title}"` : `${pendingDelete?.length ?? 0} items`}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This removes {pendingDelete?.length === 1 ? "it" : "them"} from the site and can&apos;t be undone. Move to drafts instead
              if you only want to hide {pendingDelete?.length === 1 ? "it" : "them"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={working}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={working}
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                if (pendingDelete) void runAction(pendingDelete, "delete");
              }}
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
