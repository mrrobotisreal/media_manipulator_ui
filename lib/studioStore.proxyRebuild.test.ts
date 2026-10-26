import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached from store unit tests');
  },
}));

import { useStudioStore } from '@/lib/studioStore';
import type { StudioAsset } from '@/lib/studioTypes';

const store = () => useStudioStore.getState();
const asset = (extra: Partial<StudioAsset> = {}): StudioAsset => ({
  id: 'a1', projectId: 'p1', originalFileName: 'a1.mp4', s3KeyOriginal: 'k', s3KeyProxy: 'k_proxy.mp4', mediaKind: 'video',
  durationSeconds: 30, hasAudio: true, probeJson: null, createdAt: '2026-01-01T00:00:00Z', ...extra,
});

// MM71: the rebuild is server state, never in the EDL or the undo history.
describe('proxy rebuild store actions', () => {
  it('tracks the job, then switches the asset to the new generation and drops the old reverse', () => {
    store().setAssets([asset({ proxyGeneration: 0, s3KeyProxyReversed: 'k_proxy_reversed.mp4' })]);
    expect(store().assets.a1.reversed).toBe('ready');
    const pastBefore = store().past.length;

    store().setAssetProxyRebuild('a1', { state: 'processing', jobId: 'j1', generation: 1, progress: 0 });
    expect(store().assets.a1.proxyRebuild).toEqual({ state: 'processing', jobId: 'j1', generation: 1, progress: 0 });

    store().applyProxyRebuilt('a1', 1);
    const e = store().assets.a1;
    expect(e.asset.proxyGeneration).toBe(1);
    expect(e.asset.s3KeyProxyReversed).toBeUndefined();
    expect(e.reversed).toBeUndefined();
    expect(e.proxyRebuild).toBeUndefined();
    expect(e.status).toBe('ready');
    expect(store().past.length).toBe(pastBefore);
  });

  it('a failure keeps the asset on its old proxy', () => {
    store().setAssets([asset({ proxyGeneration: 0 })]);
    store().setAssetProxyRebuild('a1', { state: 'failed' });
    expect(store().assets.a1.asset.proxyGeneration).toBe(0);
    expect(store().assets.a1.proxyRebuild?.state).toBe('failed');
    store().setAssetProxyRebuild('a1', undefined);
    expect(store().assets.a1.proxyRebuild).toBeUndefined();
  });

  it('ignores unknown assets', () => {
    store().setAssets([]);
    store().applyProxyRebuilt('nope', 2);
    store().setAssetProxyRebuild('nope', { state: 'failed' });
    expect(store().assets).toEqual({});
  });
});
