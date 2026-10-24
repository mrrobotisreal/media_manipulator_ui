'use client';

import React from 'react';
import { toast } from 'sonner';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { useStudioJobProgress } from '@/lib/useStudioJob';

/**
 * Watches every in-flight reverse_proxy job (part 17) and flips the asset's
 * `reversed` state to ready/failed. Mounted by the preview surface (always
 * present in the editor, unlike the media bin which unmounts on mobile tabs).
 * Renders nothing.
 */
const ReverseWatcher: React.FC<{ assetId: string; jobId: string }> = ({ assetId, jobId }) => {
  const setAssetReversed = useStudioStore((s) => s.setAssetReversed);
  const { t } = useLocalization('interface');
  useStudioJobProgress(jobId, {
    onComplete: () => setAssetReversed(assetId, 'ready'),
    onError: (msg) => {
      setAssetReversed(assetId, 'failed');
      toast.error(t('contentStudio.speed.reverseFailed'), { description: msg });
    },
  });
  return null;
};

const ReverseWatchers: React.FC = () => {
  const assets = useStudioStore((s) => s.assets);
  const pending = React.useMemo(
    () =>
      Object.values(assets).filter((e) => e.reversed === 'processing' && e.reverseJobId),
    [assets],
  );
  return (
    <>
      {pending.map((e) => (
        <ReverseWatcher key={`${e.asset.id}:${e.reverseJobId}`} assetId={e.asset.id} jobId={e.reverseJobId!} />
      ))}
    </>
  );
};

export default ReverseWatchers;
