import { Suspense } from "react";
import { PostsList } from "../_components/posts/PostsList";

export default function AdminBlogPage() {
  return (
    <Suspense>
      <PostsList type="blog" />
    </Suspense>
  );
}
