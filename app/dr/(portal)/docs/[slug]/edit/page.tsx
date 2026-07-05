import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import EditDocFlow from '@/components/dr/editor/edit-doc-flow';

// /dr/docs/[slug]/edit — the edit flow. Next 16: `params` is a Promise. The flow
// reads the ?fromRevision search param (restore path), so it sits under a
// Suspense boundary.
export default async function DrEditDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Opening editor…
        </div>
      }
    >
      <EditDocFlow slug={slug} />
    </Suspense>
  );
}
