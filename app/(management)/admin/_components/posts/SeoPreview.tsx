import { cn } from "@/app/lib/utils";
import { SEO_LIMITS } from "./postTypes";

function LengthHint({ label, length, range }: { label: string; length: number; range: readonly [number, number] }) {
  const [min, max] = range;
  const good = length >= min && length <= max;
  return (
    <p className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn("size-2 rounded-full", good ? "bg-primary" : "bg-amber-400")} aria-hidden />
      {label}: {length} characters
      <span className="text-muted-foreground/70">
        (aim for {min}-{max})
      </span>
    </p>
  );
}

export function SeoPreview({ title, excerpt, path }: { title: string; excerpt: string; path: string }) {
  const crumbs = path.split("/").filter(Boolean);
  return (
    <div className="grid gap-3">
      <div className="rounded-md border bg-background p-4">
        <p className="truncate text-xs text-muted-foreground">
          pipsangel.com{crumbs.map((crumb) => ` › ${crumb}`).join("")}
        </p>
        <p className="mt-1 line-clamp-1 text-lg leading-snug text-sky-300">{title || "Article title"}</p>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {excerpt || "The excerpt appears here as the search result description."}
        </p>
      </div>
      <LengthHint label="Title" length={title.length} range={SEO_LIMITS.title} />
      <LengthHint label="Excerpt" length={excerpt.length} range={SEO_LIMITS.excerpt} />
    </div>
  );
}
