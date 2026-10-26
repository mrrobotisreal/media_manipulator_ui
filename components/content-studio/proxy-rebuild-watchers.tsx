'use client';

import React from 'react';
import { toast } from 'sonner';
import { useLocalization } from '@/i18n/useLocalization';
import { useStudioStore } from '@/lib/studioStore';
import { useStudioJobProgress } from '@/lib/useStudioJob';
import { useReverseProxy } from '@/lib/useStudioAsset';
import { isReversed } from '@/lib/studio/speed';

/**
 * Watches every in-flight proxy rebuild job (MM71). On completion the asset
 * switches to its new proxy generation: the proxy URL changes (`?v=g<N>`), so
 * the preview pool reloads that source through its fresh-src path. The server
 * cleared the asset's reversed proxy (it was built from the old proxy), so a
 * reverse used by a clip is requested again. Mounted by the preview surface,
 * like ReverseWatchers, so it survives the media bin unmounting. Renders nothing.
 */
const ProxyRebuildWatcher: React.FC<{ assetId: string; jobId: string; generation: number }> = ({ assetId, jobId, generation }) => {
  const applyProxyRebuilt = useStudioStore((s) => s.applyProxyRebuilt);
  const setAssetProxyRebuild = useStudioStore((s) => s.setAssetProxyRebuild);
  const reverseProxy = useReverseProxy();
  const { t } = useLocalization('interface');
  const job = useStudioJobProgress(jobId, {
    onComplete: () => {
      applyProxyRebuilt(assetId, generation);
      const tracks = useStudioStore.getState().project?.tracks ?? [];
      const reversedInUse = tracks.some((tr) => tr.clips.some((c) => c.assetId === assetId && isReversed(c)));
      if (reversedInUse && reverseProxy.available) void reverseProxy.request(assetId);
    },
    onError: (msg) => {
      setAssetProxyRebuild(assetId, { state: 'failed' });
      toast.error(t('contentStudio.mediaBin.rebuildFailed'), { description: msg });
    },
  });
  const progress = job?.status === 'processing' ? job.progress : undefined;
  React.useEffect(() => {
    if (progress === undefined) return;
    const cur = useStudioStore.getState().assets[assetId]?.proxyRebuild;
    if (cur?.state === 'processing' && cur.jobId === jobId && cur.progress !== progress) {
      setAssetProxyRebuild(assetId, { ...cur, progress });
    }
  }, [assetId, jobId, progress, setAssetProxyRebuild]);
  return null;
};

const ProxyRebuildWatchers: React.FC = () => {
  const assets = useStudioStore((s) => s.assets);
  const pending = React.useMemo(
    () =>
      Object.values(assets).filter(
        (e) => e.proxyRebuild?.state === 'processing' && e.proxyRebuild.jobId && typeof e.proxyRebuild.generation === 'number',
      ),
    [assets],
  );
  return (
    <>
      {pending.map((e) => (
        <ProxyRebuildWatcher
          key={`${e.asset.id}:${e.proxyRebuild!.jobId}`}
          assetId={e.asset.id}
          jobId={e.proxyRebuild!.jobId!}
          generation={e.proxyRebuild!.generation!}
        />
      ))}
    </>
  );
};

export default ProxyRebuildWatchers;
