import { Badge } from "@/app/components/ui/badge";

export function PostStatusBadges({ published, source }: { published: boolean; source?: "admin" | "pipeline" }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {published ? (
        <Badge className="border-transparent bg-primary/15 text-primary">Published</Badge>
      ) : (
        <Badge variant="secondary">Draft</Badge>
      )}
      {source === "pipeline" ? (
        <Badge variant="outline" className="border-sky-500/40 text-sky-300">
          Pipeline
        </Badge>
      ) : null}
    </div>
  );
}
