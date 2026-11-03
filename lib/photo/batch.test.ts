import { unzipSync } from 'fflate';
import { describe, expect, it, vi } from 'vitest';

import { BatchError, buildBatchZip, defaultBatchDeps, planBatch, retryFailed, runBatch, type BatchDeps, type BatchRow } from './batch';
import { PhotoApiError } from './projectsApi';
import { newPhotoDoc } from './photoTypes';

const file = (name: string) => new File([name], name, { type: 'image/jpeg' });
const opts = { format: 'jpg', quality: 90, metadataMode: 'keep' } as const;

function fakeDeps(over: Partial<BatchDeps> = {}) {
  const order: string[] = [];
  let n = 0;
  const deps: BatchDeps = {
    createProject: vi.fn(async (f: File) => {
      order.push(`create:${f.name}`);
      n += 1;
      return { id: `p${n}` };
    }),
    startBatch: vi.fn(async (ids: string[]) => {
      order.push(`batch:${ids.join(',')}`);
      return ids.map((id) => ({ projectId: id, jobId: `j-${id}` }));
    }),
    jobStatus: vi.fn(async (jobId: string) => ({ status: 'completed', resultFileName: `${jobId}.jpg` })),
    fetchResult: vi.fn(async (jobId: string) => new Blob([`bytes-${jobId}`])),
    sleep: vi.fn(async () => undefined),
    ...over,
  };
  return { deps, order };
}

describe('batch apply', () => {
  it('creates projects sequentially, posts ONE batch with projectIds, tracks each job, then zips the downloaded blobs', async () => {
    const { deps, order } = fakeDeps();
    const files = [file('a.jpg'), file('b.jpg'), file('c.jpg')];
    const updates: BatchRow[][] = [];
    const rows = await runBatch(files, newPhotoDoc(10, 10), opts, deps, (r) => updates.push(r));
    expect(order).toEqual(['create:a.jpg', 'create:b.jpg', 'create:c.jpg', 'batch:p1,p2,p3']);
    expect(deps.startBatch).toHaveBeenCalledTimes(1);
    expect((deps.startBatch as ReturnType<typeof vi.fn>).mock.calls[0][2]).toEqual(opts);
    expect(rows.map((r) => r.status)).toEqual(['done', 'done', 'done']);
    expect(rows.map((r) => r.jobId)).toEqual(['j-p1', 'j-p2', 'j-p3']);
    expect(deps.jobStatus).toHaveBeenCalledTimes(3);
    // project names are "<source name> (batch)"
    expect((deps.createProject as ReturnType<typeof vi.fn>).mock.calls.map((c) => c[1])).toEqual(['a (batch)', 'b (batch)', 'c (batch)']);
    const zip = await buildBatchZip(rows, deps);
    expect(zip.count).toBe(3);
    const entries = unzipSync(new Uint8Array(await zip.blob.arrayBuffer()));
    expect(Object.keys(entries).sort()).toEqual(['j-p1.jpg', 'j-p2.jpg', 'j-p3.jpg']);
    expect(new TextDecoder().decode(entries['j-p2.jpg'])).toBe('bytes-j-p2');
    expect(updates.length).toBeGreaterThan(3);
  });

  it('polls until a running job completes and reports progress', async () => {
    let calls = 0;
    const { deps } = fakeDeps({ jobStatus: vi.fn(async () => (++calls < 3 ? { status: 'processing', progress: 0.5 } : { status: 'completed' })) });
    const seen: number[] = [];
    await runBatch([file('a.jpg')], newPhotoDoc(10, 10), opts, deps, (r) => r[0].progress !== undefined && seen.push(r[0].progress));
    expect(calls).toBe(3);
    expect(seen).toContain(0.5);
  });

  it('a failed creation fails only that row; the others still run and the failed row can be retried', async () => {
    let first = true;
    const { deps } = fakeDeps({
      createProject: vi.fn(async (f: File) => {
        if (f.name === 'b.jpg' && first) {
          first = false;
          throw new PhotoApiError(500, 'photo_upload_failed');
        }
        return { id: `id-${f.name}` };
      }),
    });
    const files = [file('a.jpg'), file('b.jpg')];
    const rows = await runBatch(files, newPhotoDoc(10, 10), opts, deps, () => undefined);
    expect(rows.map((r) => r.status)).toEqual(['done', 'failed']);
    expect(rows[1].error).toBe('photo_upload_failed');
    const retried = await runBatch(files, newPhotoDoc(10, 10), opts, deps, () => undefined, retryFailed(rows));
    expect(retried.map((r) => r.status)).toEqual(['done', 'done']);
    // second batch carried only the retried project
    expect((deps.startBatch as ReturnType<typeof vi.fn>).mock.calls[1][0]).toEqual(['id-b.jpg']);
  });

  it('a failed job marks its row failed; the ZIP holds only finished rows', async () => {
    const { deps } = fakeDeps({ jobStatus: vi.fn(async (id: string) => ({ status: id === 'j-p2' ? 'failed' : 'completed' })) });
    const rows = await runBatch([file('a.jpg'), file('b.jpg')], newPhotoDoc(10, 10), opts, deps, () => undefined);
    expect(rows.map((r) => r.status)).toEqual(['done', 'failed']);
    expect((await buildBatchZip(rows, deps)).count).toBe(1);
  });

  it('403 photo_batch_limit surfaces as the neutral BatchError with the limit', async () => {
    const { deps } = fakeDeps({ startBatch: vi.fn(async () => { throw new PhotoApiError(403, 'photo_batch_limit', { limit: 3, upgradePath: 'premium' }); }) });
    await expect(runBatch([file('a.jpg')], newPhotoDoc(10, 10), opts, deps, () => undefined)).rejects.toMatchObject({ code: 'photo_batch_limit', limit: 3, upgradePath: 'premium' });
    const { deps: d2 } = fakeDeps({ startBatch: vi.fn(async () => { throw new PhotoApiError(403, 'sign_in_required', { upgradePath: 'signup' }); }) });
    await expect(runBatch([file('a.jpg')], newPhotoDoc(10, 10), opts, d2, () => undefined)).rejects.toBeInstanceOf(BatchError);
  });

  it('respects the cap from capabilities: anonymous (0) is a sign-in wall, a signed-in 0 is the limit line, extra files are dropped', () => {
    const fs = [file('1'), file('2'), file('3'), file('4'), file('5')];
    expect(planBatch(fs, 0, false)).toMatchObject({ blocked: 'sign_in', accepted: [] });
    expect(planBatch(fs, 0, true)).toMatchObject({ blocked: 'limit', accepted: [] });
    const p = planBatch(fs, 3, true);
    expect(p.blocked).toBeNull();
    expect(p.accepted).toHaveLength(3);
    expect(p.dropped).toBe(2);
  });

  it('default deps POST /photo/batch with {projectIds, doc, format, quality, metadataMode}', async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ jobs: [{ projectId: 'p1', jobId: 'j1' }] }), { status: 202 }));
    const deps = defaultBatchDeps(fetchImpl);
    const jobs = await deps.startBatch(['p1'], newPhotoDoc(10, 10), opts);
    expect(jobs).toEqual([{ projectId: 'p1', jobId: 'j1' }]);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/photo\/batch$/);
    const body = JSON.parse(String(init.body));
    expect(Object.keys(body).sort()).toEqual(['doc', 'format', 'metadataMode', 'projectIds', 'quality']);
  });
});
