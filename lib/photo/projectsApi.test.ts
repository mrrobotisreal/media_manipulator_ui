import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CAPABILITIES_TTL_MS,
  PhotoApiError,
  createPhotoProject,
  deletePhotoProject,
  estimateExportBytes,
  exportProject,
  exportStateless,
  getPhotoCapabilities,
  getPhotoProject,
  isSizeLocked,
  listPhotoProjects,
  resetCapabilitiesCache,
  savePhotoProject,
  type FetchLike,
} from './projectsApi';
import { canonicalPhotoDoc, newPhotoDoc } from './photoTypes';

const doc = newPhotoDoc(400, 300);
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const project = { id: 'p1', name: 'Beach', revision: 3, width: 400, height: 300, thumbUrl: '/t', updatedAt: '2026-11-03T00:00:00Z' };

beforeEach(() => resetCapabilitiesCache());
afterEach(() => vi.restoreAllMocks());

describe('projects API client', () => {
  it('lists, gets (parses the doc), creates (multipart) and deletes', async () => {
    const f = vi.fn<FetchLike>();
    f.mockResolvedValueOnce(json(200, { projects: [project] }));
    expect(await listPhotoProjects(f)).toEqual([project]);
    expect(f.mock.calls[0][0]).toMatch(/\/photo\/projects$/);

    f.mockResolvedValueOnce(json(200, { project, doc: JSON.parse(canonicalPhotoDoc(doc)) }));
    const got = await getPhotoProject('p1', f);
    expect(got.revision).toBe(3);
    expect(got.doc.source).toMatchObject({ width: 400, height: 300 });

    f.mockResolvedValueOnce(json(201, { project: { ...project, revision: 1 } }));
    const created = await createPhotoProject({ file: new Blob(['x']), fileName: 'a.jpg', name: 'Beach', doc }, { fetchImpl: f });
    const init = f.mock.calls[2][1] as RequestInit;
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(FormData);
    expect((init.body as FormData).get('name')).toBe('Beach');
    expect(JSON.parse((init.body as FormData).get('doc') as string).version).toBe(1);
    expect(created.id).toBe('p1');

    f.mockResolvedValueOnce(json(200, {}));
    await deletePhotoProject('p1', f);
    expect((f.mock.calls[3][1] as RequestInit).method).toBe('DELETE');
  });

  it('refuses a document it cannot read', async () => {
    const f = vi.fn<FetchLike>().mockResolvedValue(json(200, { project, doc: { version: 2 } }));
    await expect(getPhotoProject('p1', f)).rejects.toMatchObject({ code: 'photo_doc_unreadable' });
  });

  it('saves with If-Match and surfaces the 409 revision', async () => {
    const f = vi.fn<FetchLike>();
    f.mockResolvedValueOnce(json(200, { project: { ...project, revision: 4 } }));
    const saved = await savePhotoProject('p1', 3, { doc }, f);
    expect(saved.revision).toBe(4);
    expect((f.mock.calls[0][1] as RequestInit).headers).toMatchObject({ 'If-Match': '3' });
    f.mockResolvedValueOnce(json(409, { error: 'revision_conflict', revision: 7 }));
    const err = await savePhotoProject('p1', 3, { doc }, f).catch((e) => e as PhotoApiError);
    expect(err).toBeInstanceOf(PhotoApiError);
    expect((err as PhotoApiError).conflict).toEqual({ revision: 7 });
  });

  it('maps a thrown fetch to a retryable network error', async () => {
    const f = vi.fn<FetchLike>().mockRejectedValue(new TypeError('x'));
    const err = (await listPhotoProjects(f).catch((e) => e)) as PhotoApiError;
    expect(err.status).toBe(0);
    expect(err.retryable).toBe(true);
  });

  it('caches capabilities for 5 minutes and degrades to export-off on failure', async () => {
    const f = vi.fn<FetchLike>().mockResolvedValue(json(200, { enabled: true, render: false, formats: ['jpg', 'bogus', 'png'], maxMegapixels: 12, photoProjects: 5, tier: 'free' }));
    const a = await getPhotoCapabilities(f, 1000);
    expect(a).toMatchObject({ enabled: true, render: false, formats: ['jpg', 'png'], photoProjects: 5, tier: 'free' });
    await getPhotoCapabilities(f, 1000 + CAPABILITIES_TTL_MS - 1);
    expect(f).toHaveBeenCalledTimes(1);
    await getPhotoCapabilities(f, 1000 + CAPABILITIES_TTL_MS + 1);
    expect(f).toHaveBeenCalledTimes(2);
    resetCapabilitiesCache();
    const bad = await getPhotoCapabilities(vi.fn<FetchLike>().mockRejectedValue(new Error('no')));
    expect(bad).toMatchObject({ enabled: false, render: false });
  });
});

describe('export request bodies', () => {
  it('signed-in: JSON body to the project route with the doc', async () => {
    const f = vi.fn<FetchLike>().mockResolvedValue(json(202, { jobId: 'job-1' }));
    const id = await exportProject('p1', doc, { format: 'jpg', quality: 92, metadataMode: 'keep', maxMegapixels: 24 }, f);
    expect(id).toBe('job-1');
    expect(f.mock.calls[0][0]).toMatch(/\/photo\/projects\/p1\/export$/);
    const body = JSON.parse((f.mock.calls[0][1] as RequestInit).body as string);
    expect(body).toMatchObject({ format: 'jpg', quality: 92, metadataMode: 'keep', maxMegapixels: 24 });
    expect(body.doc.version).toBe(1);
  });
  it('signed-out: stateless multipart (file + doc) to /photo/export', async () => {
    const f = vi.fn<FetchLike>().mockResolvedValue(json(202, { jobId: 'job-2' }));
    const id = await exportStateless(new Blob(['pixels']), 'a.png', doc, { format: 'png', quality: 90, metadataMode: 'strip' }, f);
    expect(id).toBe('job-2');
    expect(f.mock.calls[0][0]).toMatch(/\/photo\/export$/);
    const fd = (f.mock.calls[0][1] as RequestInit).body as FormData;
    expect(fd.get('file')).toBeInstanceOf(Blob);
    expect(fd.get('format')).toBe('png');
    expect(fd.get('metadataMode')).toBe('strip');
    expect(JSON.parse(fd.get('doc') as string).version).toBe(1);
  });
  it('estimates bytes and locks sizes above the plan cap', () => {
    expect(estimateExportBytes('jpg', 90, 12)).toBeGreaterThan(estimateExportBytes('jpg', 50, 12));
    expect(estimateExportBytes('png', 90, 1)).toBeGreaterThan(estimateExportBytes('webp', 90, 1));
    expect([12, 24, 64, 120].map((m) => isSizeLocked(m as 12, 12))).toEqual([false, true, true, true]);
    expect([12, 24, 64, 120].map((m) => isSizeLocked(m as 12, 120))).toEqual([false, false, false, false]);
    expect(isSizeLocked(0, 12, 20)).toBe(true);
    expect(isSizeLocked(0, 12, 8)).toBe(false);
  });
});
