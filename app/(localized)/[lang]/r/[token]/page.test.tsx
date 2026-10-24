import { beforeEach, describe, expect, it, vi } from 'vitest';

const lookup = vi.hoisted(() => vi.fn());
vi.mock('@/lib/share/sharedResult', async (orig) => ({
  ...(await orig<typeof import('@/lib/share/sharedResult')>()),
  lookupShareCached: lookup,
}));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

import { generateMetadata } from './page';
import SharedResultPage from './page';

const share = {
  kind: 'image', fileName: 'result.png', sizeBytes: 1, mime: 'image/png', tool: 'compress-image',
  expiresAt: '2026-10-27T09:00:00Z', downloadUrl: '/api/share/T/file?download=1', thumbnailUrl: '/api/share/T/file',
};
const params = (lang = 'en') => ({ params: Promise.resolve({ lang, token: 'T' }) });

beforeEach(() => lookup.mockReset());

describe('/r/[token] metadata', () => {
  it('is noindex,nofollow with an OG image from the thumbnail', async () => {
    lookup.mockResolvedValue({ status: 'ok', share });
    const m = await generateMetadata(params());
    expect(m.robots).toEqual({ index: false, follow: false });
    const images = (m.openGraph as { images?: string[] }).images ?? [];
    expect(images[0]).toMatch(/\/share\/T\/file$/);
    expect(images[0]).not.toMatch(/\/api\/api\//);
  });
  it('falls back to the site card without a thumbnail', async () => {
    lookup.mockResolvedValue({ status: 'ok', share: { ...share, thumbnailUrl: undefined, kind: 'video' } });
    const m = await generateMetadata(params());
    expect((m.openGraph as { images?: string[] }).images?.[0]).toMatch(/MMOpenGraph/);
  });
  it('stays noindex when the link is gone, or the API is down', async () => {
    lookup.mockResolvedValue({ status: 'not_found' });
    expect((await generateMetadata(params())).robots).toEqual({ index: false, follow: false });
    lookup.mockReturnValue({ catch: (fn: () => unknown) => Promise.resolve(fn()) });
    expect((await generateMetadata(params())).robots).toEqual({ index: false, follow: false });
  });
  it('renders the not-found boundary for a 404 descriptor', async () => {
    lookup.mockResolvedValue({ status: 'not_found' });
    await expect(SharedResultPage(params())).rejects.toThrow('NEXT_NOT_FOUND');
  });
});
