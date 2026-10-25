/**
 * MM44 acceptance 6: the save flow against a mocked MM43.
 *   - the first save creates (POST); later saves PUT with If-Match: <revision>
 *   - 409 revision_conflict → conflict state; "Keep mine" re-saves with the
 *     409's currentRevision; "Reload theirs" returns the server copy
 *   - offline / failed saves keep the draft (onSaved is never called)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSaveController, type SaveControllerOptions } from './saveController';
import { uploadThumbnail, thumbnailSize } from './thumbnail';
import { VectorApiError, listVectorProjects } from './projectsApi';
import { parseVectorDoc, type VectorDoc } from './vectorTypes';

const doc = (x = 0): VectorDoc => {
  const r = parseVectorDoc({ version: 1, layers: [{ type: 'rect', id: 'a', x, y: 0, width: 1, height: 1 }] });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const project = (id: string, revision: number, d: VectorDoc = doc()) => ({
  id,
  name: 'Bounce',
  revision,
  documentBytes: 10,
  createdAt: '2026-10-25T00:00:00Z',
  updatedAt: '2026-10-25T00:00:00Z',
  document: d,
});

let current: { doc: VectorDoc; name: string };
let fetchMock: ReturnType<typeof vi.fn<(url: string, init?: RequestInit) => Promise<Response>>>;
const ID = '0b9e8a9c-6a7f-4d0e-9a51-2f7f6d2c1e10';

function setup(extra: Partial<SaveControllerOptions> = {}) {
  const onSaved = vi.fn();
  const onCreated = vi.fn();
  const onConflict = vi.fn();
  const c = createSaveController({
    source: { read: () => current },
    getToken: async () => 'tok',
    server: null,
    fetchImpl: fetchMock,
    onSaved,
    onCreated,
    onConflict,
    isOnline: () => true,
    baseDelayMs: 10,
    ...extra,
  });
  return { c, onSaved, onCreated, onConflict };
}

const call = (i: number) => {
  const [url, init] = fetchMock.mock.calls[i];
  const body = typeof init?.body === 'string' ? JSON.parse(init.body) : init?.body;
  return { url, method: init?.method, ifMatch: new Headers(init?.headers).get('If-Match'), auth: new Headers(init?.headers).get('Authorization'), body };
};

beforeEach(() => {
  current = { doc: doc(), name: 'Bounce' };
  fetchMock = vi.fn();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('Motion save flow', () => {
  it('first save creates, subsequent saves send If-Match', async () => {
    fetchMock.mockResolvedValueOnce(json(201, project(ID, 1))).mockResolvedValueOnce(json(200, project(ID, 2)));
    const { c, onCreated, onSaved } = setup();
    expect(await c.save()).toBe(true);
    expect(call(0)).toMatchObject({ method: 'POST', ifMatch: null, auth: 'Bearer tok' });
    expect(call(0).url).toMatch(/\/vector\/projects$/);
    expect(call(0).body).toEqual({ name: 'Bounce', document: current.doc });
    expect(onCreated).toHaveBeenCalledWith(expect.objectContaining({ id: ID, revision: 1 }));
    current = { doc: doc(5), name: 'Bounce' };
    c.edited();
    expect(await c.save()).toBe(true);
    expect(call(1)).toMatchObject({ method: 'PUT', ifMatch: '1' });
    expect(call(1).url).toMatch(new RegExp(`/vector/projects/${ID}$`));
    expect(c.server()).toEqual({ id: ID, revision: 2 });
    expect(onSaved).toHaveBeenCalledTimes(2);
    expect(c.getSnapshot().state).toBe('saved');
  });

  it('409 shows the conflict; "Keep mine" re-saves with currentRevision', async () => {
    fetchMock
      .mockResolvedValueOnce(json(409, { error: 'revision_conflict', currentRevision: 7, updatedAt: '2026-10-25T23:59:02Z' }))
      .mockResolvedValueOnce(json(200, project(ID, 8)));
    const { c, onConflict, onSaved } = setup({ server: { id: ID, revision: 3 } });
    c.edited();
    expect(await c.save()).toBe(false);
    expect(call(0).ifMatch).toBe('3');
    expect(c.getSnapshot().state).toBe('conflict');
    expect(onConflict).toHaveBeenCalledWith({ currentRevision: 7, updatedAt: '2026-10-25T23:59:02Z' });
    expect(onSaved).not.toHaveBeenCalled();
    // Autosave is blocked while the banner is open.
    c.edited();
    expect(await c.save()).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(await c.keepMine()).toBe(true);
    expect(call(1)).toMatchObject({ method: 'PUT', ifMatch: '7' });
    expect(call(1).body.document).toEqual(current.doc);
    expect(c.server()?.revision).toBe(8);
    expect(c.getSnapshot().state).toBe('saved');
  });

  it('"Reload theirs" fetches the server copy and leaves the conflict', async () => {
    const theirs = doc(99);
    fetchMock
      .mockResolvedValueOnce(json(409, { error: 'revision_conflict', currentRevision: 4, updatedAt: 'x' }))
      .mockResolvedValueOnce(json(200, project(ID, 4, theirs)));
    const { c } = setup({ server: { id: ID, revision: 2 } });
    await c.save();
    const p = await c.reloadTheirs();
    expect(call(1)).toMatchObject({ method: 'GET' });
    expect(p?.document).toEqual(theirs);
    expect(c.server()).toEqual({ id: ID, revision: 4 });
    expect(c.getSnapshot().state).toBe('saved');
  });

  it('a second 409 during "Keep mine" re-opens the conflict with the newer revision', async () => {
    fetchMock
      .mockResolvedValueOnce(json(409, { error: 'revision_conflict', currentRevision: 4, updatedAt: 'x' }))
      .mockResolvedValueOnce(json(409, { error: 'revision_conflict', currentRevision: 5, updatedAt: 'y' }));
    const { c } = setup({ server: { id: ID, revision: 2 } });
    await c.save();
    expect(await c.keepMine()).toBe(false);
    expect(c.getSnapshot().state).toBe('conflict');
    expect(c.conflict()?.currentRevision).toBe(5);
  });

  it('offline / network failure keeps the draft and retries with backoff', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('offline')).mockResolvedValueOnce(json(201, project(ID, 1)));
    const { c, onSaved } = setup();
    c.edited();
    expect(await c.save()).toBe(false);
    expect(c.getSnapshot().state).toBe('retrying');
    expect(onSaved).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(20);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(onSaved).toHaveBeenCalledTimes(1);
    expect(c.getSnapshot().state).toBe('saved');
  });

  it('5xx retries, 4xx parks in failed; neither drops the draft', async () => {
    fetchMock.mockResolvedValueOnce(json(503, { error: 'Failed to save project' }));
    const a = setup({ server: { id: ID, revision: 1 } });
    await a.c.save();
    expect(a.c.getSnapshot().state).toBe('retrying');
    a.c.dispose();

    fetchMock.mockReset();
    fetchMock.mockResolvedValueOnce(json(422, { error: 'vector_doc_invalid', code: 'invalid_doc', path: 'layers[0]', message: 'x' }));
    const b = setup({ server: { id: ID, revision: 1 } });
    await b.c.save();
    expect(b.c.getSnapshot().state).toBe('failed');
    expect(b.onSaved).not.toHaveBeenCalled();
  });

  it('a refused first save (403 project limit) reports it and stays local', async () => {
    fetchMock.mockResolvedValueOnce(json(403, { error: 'vector_projects_limit', limit: 3, used: 3, upgradePath: 'premium' }));
    const onRefused = vi.fn();
    const { c, onCreated } = setup({ onRefused });
    await c.save();
    expect(onRefused).toHaveBeenCalledWith(expect.objectContaining({ status: 403, code: 'vector_projects_limit' }));
    expect(onCreated).not.toHaveBeenCalled();
    expect(c.server()).toBeNull();
  });

  it('signed out: no request, nothing lost', async () => {
    const { c, onSaved } = setup({ getToken: async () => null });
    await c.save();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });

  it('a pending thumbnail key rides along with the next save only', async () => {
    fetchMock.mockResolvedValueOnce(json(200, project(ID, 2))).mockResolvedValueOnce(json(200, project(ID, 3)));
    const { c } = setup({ server: { id: ID, revision: 1 } });
    c.setPendingThumbnail(`vector/u1/${ID}/thumb.png`);
    await c.save();
    expect(call(0).body.thumbnailKey).toBe(`vector/u1/${ID}/thumb.png`);
    await c.save();
    expect(call(1).body).not.toHaveProperty('thumbnailKey');
  });

  it('an edit during an in-flight save queues one follow-up save', async () => {
    let release!: (r: Response) => void;
    fetchMock
      .mockImplementationOnce(() => new Promise<Response>((r) => (release = r)))
      .mockResolvedValueOnce(json(200, project(ID, 3)));
    const { c } = setup({ server: { id: ID, revision: 1 } });
    const first = c.save();
    current = { doc: doc(1), name: 'Bounce' };
    const second = c.save();
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    release(json(200, project(ID, 2)));
    await Promise.all([first, second]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(call(1).ifMatch).toBe('2');
    expect(call(1).body.document).toEqual(current.doc);
  });
});

describe('projects API + thumbnail', () => {
  it('lists without documents', async () => {
    fetchMock.mockResolvedValueOnce(json(200, { projects: [{ id: ID, name: 'A', revision: 2, documentBytes: 3, createdAt: 'c', updatedAt: 'u' }] }));
    expect(await listVectorProjects('tok', fetchMock)).toEqual([{ id: ID, name: 'A', revision: 2, documentBytes: 3, createdAt: 'c', updatedAt: 'u' }]);
  });

  it('a 409 without a usable revision is not treated as a conflict', () => {
    expect(new VectorApiError(409, 'revision_conflict', { currentRevision: 'x' }).conflict).toBeNull();
    expect(new VectorApiError(409, 'revision_conflict', { currentRevision: 3, updatedAt: 'u' }).conflict).toEqual({ currentRevision: 3, updatedAt: 'u' });
  });

  it('presigns the exact size, PUTs image/png to S3 without auth, and returns the key', async () => {
    const png = new Blob([new Uint8Array(1234)], { type: 'image/png' });
    fetchMock
      .mockResolvedValueOnce(json(201, { uploadUrl: 'https://s3.example/put?sig', thumbnailKey: `vector/u1/${ID}/thumb.png`, contentType: 'image/png', maxBytes: 524288, expiresAt: 'e' }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    expect(await uploadThumbnail('tok', ID, png, fetchMock)).toBe(`vector/u1/${ID}/thumb.png`);
    expect(call(0)).toMatchObject({ method: 'POST', body: { sizeBytes: 1234, contentType: 'image/png' } });
    expect(call(0).url).toMatch(new RegExp(`/vector/projects/${ID}/thumbnail$`));
    expect(call(1)).toMatchObject({ url: 'https://s3.example/put?sig', method: 'PUT', auth: null });
    expect(new Headers(fetchMock.mock.calls[1][1]?.headers).get('Content-Type')).toBe('image/png');
  });

  it('skips oversize thumbnails and swallows failures', async () => {
    expect(await uploadThumbnail('tok', ID, new Blob([new Uint8Array(600 * 1024)]), fetchMock)).toBeNull();
    fetchMock.mockResolvedValueOnce(json(413, { error: 'thumbnail_too_large' }));
    expect(await uploadThumbnail('tok', ID, new Blob([new Uint8Array(10)]), fetchMock)).toBeNull();
  });

  it('thumbnails are 320 px on the longest side', () => {
    expect(thumbnailSize(512, 512)).toEqual({ width: 320, height: 320 });
    expect(thumbnailSize(1920, 1080)).toEqual({ width: 320, height: 180 });
    expect(thumbnailSize(100, 400)).toEqual({ width: 80, height: 320 });
  });
});
