import DrDocViewer from '@/components/dr/dr-doc-viewer';

// /dr/docs/[slug] — document viewer. Next 16: `params` is a Promise and must be
// awaited in the server route file; the slug is then handed to the client view
// which fetches + renders it.
export default async function DrDocSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DrDocViewer slug={slug} />;
}
