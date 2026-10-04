import { Suspense } from "react";
import { PostsList } from "../_components/posts/PostsList";

export default function AdminNewsPage() {
  return (
    <Suspense>
      <PostsList type="news" />
    </Suspense>
  );
}
