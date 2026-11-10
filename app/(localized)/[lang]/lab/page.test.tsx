import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const cookieValue = vi.hoisted(() => ({ v: undefined as string | undefined }));
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: (name: string) => (cookieValue.v && name === 'mm_lab_t' ? { value: cookieValue.v } : undefined) }),
}));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));
vi.mock('@/components/lab/lab-console', () => ({ LabConsole: () => null }));

import LabPage, { dynamic, metadata } from './page';

const params = (lang = 'en') => ({ params: Promise.resolve({ lang }) });
const body = { notice: 'n', burstConfigured: false, models: [] };
const fetchMock = vi.fn();

beforeEach(() => {
  cookieValue.v = 'tok';
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('/lab server gate', () => {
  it('is dynamic and noindex', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
  it('404s without a cookie and never calls the API', async () => {
    cookieValue.v = undefined;
    await expect(LabPage(params())).rejects.toThrow('NEXT_NOT_FOUND');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('404s when the fetch throws', async () => {
    fetchMock.mockRejectedValue(new Error('down'));
    await expect(LabPage(params())).rejects.toThrow('NEXT_NOT_FOUND');
  });
  it('404s on a 404 and on a 500', async () => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 404 }));
    await expect(LabPage(params())).rejects.toThrow('NEXT_NOT_FOUND');
    fetchMock.mockResolvedValue(new Response('{}', { status: 500 }));
    await expect(LabPage(params())).rejects.toThrow('NEXT_NOT_FOUND');
  });
  it('404s for a non-English lang before touching the API', async () => {
    await expect(LabPage(params('ru'))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it('renders the console on a 200, sending the bearer token with no-store', async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));
    const el = await LabPage(params());
    expect(el).toBeTruthy();
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/lab\/models$/);
    expect(init.headers.Authorization).toBe('Bearer tok');
    expect(init.cache).toBe('no-store');
  });
});
