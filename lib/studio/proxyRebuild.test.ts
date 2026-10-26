import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCreatvBackend, createMmBackend } from './studioBackend';
import {
  isProxyRebuildCandidate,
  isReversedSrcKey,
  proxyGenerationOf,
  proxyRebuildAvailable,
  proxyRebuildCandidates,
  proxySrcKey,
  rebuildOutcomeForStatus,
  versionedProxyUrl,
} from './proxyRebuild';
import { studioAssetSchema } from '@/lib/studioTypes';

const creatv = (capabilities?: Record<string, boolean>) =>
  createCreatvBackend({
    apiBaseUrl: 'https://api.example',
    scope: { userId: 1, channelId: 2, draftId: 3 },
    getToken: () => 't',
    capabilities,
  });

afterEach(() => vi.unstubAllEnvs());

// MM71: the "Rebuild preview" actions are a backend capability. The embed
// backend has no route, so the action never shows there; the embed contract
// only gains an optional field.
describe('proxy rebuild capability', () => {
  it('is on for MM, with the route', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    const mm = createMmBackend();
    expect(mm.capabilities.proxyRebuild).toBe(true);
    expect(mm.rebuildProxyUrl?.('a1')).toBe(`${mm.baseUrl}/studio/assets/a1/rebuild-proxy`);
    expect(proxyRebuildAvailable(mm)).toBe(true);
  });

  it('is off for the CreaTV embed backend, even if a host sets the flag (no route)', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', '');
    expect(creatv().capabilities.proxyRebuild).toBe(false);
    expect(creatv().rebuildProxyUrl).toBeUndefined();
    expect(proxyRebuildAvailable(creatv())).toBe(false);
    expect(proxyRebuildAvailable(creatv({ proxyRebuild: true }))).toBe(false);
  });

  it('is hidden on translator deployments (MM52)', () => {
    vi.stubEnv('NEXT_PUBLIC_DEPLOY_ROLE', 'translator');
    expect(proxyRebuildAvailable(createMmBackend())).toBe(false);
  });
});

describe('proxy generations', () => {
  it('parses proxyGeneration additively (absent from older APIs)', () => {
    const base = { id: 'a', projectId: 'p', originalFileName: 'a.mp4', s3KeyOriginal: 'k', mediaKind: 'video', durationSeconds: 1, hasAudio: true, probeJson: null, createdAt: 'x' };
    expect(studioAssetSchema.parse(base).proxyGeneration).toBeUndefined();
    expect(studioAssetSchema.parse({ ...base, proxyGeneration: 0 }).proxyGeneration).toBe(0);
    expect(studioAssetSchema.parse({ ...base, proxyGeneration: 3 }).proxyGeneration).toBe(3);
  });

  it('reads only sane generations', () => {
    expect(proxyGenerationOf({})).toBeUndefined();
    expect(proxyGenerationOf({ proxyGeneration: 0 })).toBe(0);
    expect(proxyGenerationOf({ proxyGeneration: 2 })).toBe(2);
    expect(proxyGenerationOf({ proxyGeneration: -1 })).toBeUndefined();
    expect(proxyGenerationOf({ proxyGeneration: 1.5 })).toBeUndefined();
  });

  it('versions the proxy URL per generation, so a rebuilt proxy is never served from the old cache', () => {
    expect(versionedProxyUrl('https://x/studio/assets/a/proxy', undefined)).toBe('https://x/studio/assets/a/proxy');
    expect(versionedProxyUrl('https://x/studio/assets/a/proxy', 0)).toBe('https://x/studio/assets/a/proxy');
    expect(versionedProxyUrl('https://x/studio/assets/a/proxy', 2)).toBe('https://x/studio/assets/a/proxy?v=g2');
    expect(versionedProxyUrl('https://x/p?user_id=1', 1)).toBe('https://x/p?user_id=1&v=g1');
    expect(versionedProxyUrl('', 2)).toBe('');
  });

  it('gives each generation its own pool source key, so the slot reloads its src', () => {
    expect(proxySrcKey('a', undefined, false)).toBe('a');
    expect(proxySrcKey('a', 0, false)).toBe('a');
    expect(proxySrcKey('a', 0, true)).toBe('a:r');
    expect(proxySrcKey('a', 2, false)).toBe('a@g2');
    expect(proxySrcKey('a', 2, true)).toBe('a@g2:r');
    expect(proxySrcKey('a', 1, false)).not.toBe(proxySrcKey('a', 2, false));
    expect(isReversedSrcKey('a@g2:r')).toBe(true);
    expect(isReversedSrcKey('a@g2')).toBe(false);
  });
});

describe('rebuild candidates', () => {
  const entry = (over: { mediaKind?: string; status?: string; proxyGeneration?: number; rebuilding?: boolean } = {}) => ({
    asset: { id: 'a', mediaKind: over.mediaKind ?? 'video', proxyGeneration: 'proxyGeneration' in over ? over.proxyGeneration : 0 },
    status: over.status ?? 'ready',
    proxyRebuild: over.rebuilding ? ({ state: 'processing' } as const) : undefined,
  });

  it('offers the rebuild only for ready videos with a pre-MM71 proxy', () => {
    expect(isProxyRebuildCandidate(entry())).toBe(true);
    expect(isProxyRebuildCandidate(entry({ proxyGeneration: 1 }))).toBe(false);
    expect(isProxyRebuildCandidate(entry({ proxyGeneration: undefined }))).toBe(false); // older API
    expect(isProxyRebuildCandidate(entry({ mediaKind: 'audio' }))).toBe(false);
    expect(isProxyRebuildCandidate(entry({ mediaKind: 'image' }))).toBe(false);
    expect(isProxyRebuildCandidate(entry({ status: 'processing' }))).toBe(false);
    expect(isProxyRebuildCandidate(entry({ rebuilding: true }))).toBe(false);
  });

  it('lists candidates in order', () => {
    const a = entry();
    const b = { ...entry({ proxyGeneration: 1 }), asset: { id: 'b', mediaKind: 'video', proxyGeneration: 1 } };
    const c = { ...entry(), asset: { id: 'c', mediaKind: 'video', proxyGeneration: 0 } };
    expect(proxyRebuildCandidates([a, b, c])).toEqual(['a', 'c']);
  });

  it('maps HTTP statuses: an older API (no route) is "unavailable", not a failure', () => {
    expect(rebuildOutcomeForStatus(200)).toBe('started');
    expect(rebuildOutcomeForStatus(404)).toBe('unavailable');
    expect(rebuildOutcomeForStatus(405)).toBe('unavailable');
    expect(rebuildOutcomeForStatus(429)).toBe('rate-limited');
    expect(rebuildOutcomeForStatus(409)).toBe('failed');
    expect(rebuildOutcomeForStatus(500)).toBe('failed');
  });
});
