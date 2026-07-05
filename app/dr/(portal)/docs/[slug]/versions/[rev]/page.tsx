import DrDocVersionViewer from '@/components/dr/dr-doc-version-viewer';

// /dr/docs/[slug]/versions/[rev] — read-only view of a historical revision.
// Next 16: `params` is a Promise; the client viewer validates `rev` and fetches.
export default async function DrDocVersionPage({ params }: { params: Promise<{ slug: string; rev: string }> }) {
  const { slug, rev } = await params;
  return <DrDocVersionViewer slug={slug} rev={rev} />;
}
