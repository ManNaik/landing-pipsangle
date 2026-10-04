import { PostEditor } from "../../_components/posts/PostEditor";

export default async function AdminEditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PostEditor key={id} type="news" id={id} />;
}
