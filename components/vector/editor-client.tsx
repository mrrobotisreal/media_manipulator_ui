'use client';

import dynamic from 'next/dynamic';

import { PanelLoading } from '@/components/darkroom/panel-loading';
import { useLocalization } from '@/i18n/useLocalization';
import { withToolShards } from '@/lib/i18n/ensureShard';

// The editor is browser-only (DOMParser, IndexedDB, pointer maths). It loads
// with ssr:false and pulls the lazy `panels` shard (where the `vector.*` copy
// lives) before rendering, so no raw keys flash.
const MotionEditor = dynamic(() => withToolShards(() => import('@/components/vector/editor')), {
  ssr: false,
  loading: () => <EditorLoading />,
});

function EditorLoading() {
  const { t } = useLocalization('interface');
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <PanelLoading label={t('common.loading')} className="w-full max-w-md" />
    </div>
  );
}

export default function MotionEditorClient({ projectId }: { projectId: string }) {
  return <MotionEditor projectId={projectId} />;
}
