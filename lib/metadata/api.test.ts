import { beforeEach, describe, expect, it, vi } from 'vitest';

const authedFetch = vi.fn();
vi.mock('@/lib/auth/authedFetch', () => ({ authedFetch: (...a: unknown[]) => authedFetch(...a) }));
vi.mock('@/lib/utils', () => ({ getBaseURL: () => 'https://api.test/api' }));

import { fetchJobMetadata, fetchJobMetadataDiff, inspectFile, metadataBinaryUrl, MetadataApiError } from './api';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const doc = { schemaVersion: 1, file: { name: 'a.jpg', sizeBytes: 1, mime: 'image/jpeg', kind: 'image' }, entries: null };

beforeEach(() => authedFetch.mockReset());

describe('metadata api', () => {
  it('inspects a file with multipart through authedFetch', async () => {
    authedFetch.mockResolvedValue(json(doc));
    const out = await inspectFile(new File(['x'], 'a.jpg'));
    expect(out.entries).toEqual([]);
    const [url, init] = authedFetch.mock.calls[0];
    expect(url).toBe('https://api.test/api/metadata/inspect');
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(FormData);
    expect((init.body as FormData).get('file')).toBeInstanceOf(File);
  });

  it('requests the job document for a side', async () => {
    authedFetch.mockResolvedValue(json(doc));
    await fetchJobMetadata('j1', 'result');
    expect(authedFetch.mock.calls[0][0]).toBe('https://api.test/api/job/j1/metadata?side=result');
  });

  it('parses the diff and defaults null slices', async () => {
    authedFetch.mockResolvedValue(json({ removed: null, added: [], changed: [{ id: 'a:b', before: 1, after: 2 }], unchanged: 3, byCategory: { file: { removed: 0, added: 0, changed: 1, unchanged: 3 } } }));
    const d = await fetchJobMetadataDiff('j1');
    expect(d.removed).toEqual([]);
    expect(d.changed).toHaveLength(1);
    expect(authedFetch.mock.calls[0][0]).toBe('https://api.test/api/job/j1/metadata/diff');
  });

  it('turns a 409 into a typed error carrying the server message', async () => {
    authedFetch.mockResolvedValue(json({ error: 'Job not completed' }, 409));
    await expect(fetchJobMetadataDiff('j1')).rejects.toMatchObject({ status: 409, message: 'Job not completed' });
    await expect(fetchJobMetadataDiff('j1')).rejects.toBeInstanceOf(MetadataApiError);
  });

  it('rejects a malformed document', async () => {
    authedFetch.mockResolvedValue(json({ nope: true }));
    await expect(fetchJobMetadata('j1', 'original')).rejects.toBeTruthy();
  });

  it('builds binary urls with side and inline', () => {
    expect(metadataBinaryUrl('j1', 'IFD1:ThumbnailImage', 'result', true)).toBe(
      'https://api.test/api/job/j1/metadata/binary/IFD1%3AThumbnailImage?side=result&inline=1',
    );
  });
});
