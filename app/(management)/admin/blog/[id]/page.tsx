import { PostEditor } from "../../_components/posts/PostEditor";

export default async function AdminEditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PostEditor key={id} type="blog" id={id} />;
}
