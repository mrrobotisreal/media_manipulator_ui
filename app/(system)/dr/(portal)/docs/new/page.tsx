import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import NewDocFlow from '@/components/dr/editor/new-doc-flow';

// /dr/docs/new — the in-portal "Create Doc" editor. NewDocFlow reads the
// `?draft=` search param, so it must sit under a Suspense boundary (Next 16
// requires useSearchParams consumers to be Suspense-wrapped for prerendering).
export default function DrNewDocPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Preparing editor…
        </div>
      }
    >
      <NewDocFlow />
    </Suspense>
  );
}
