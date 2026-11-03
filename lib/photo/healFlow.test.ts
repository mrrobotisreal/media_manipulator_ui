import { describe, expect, it, vi } from 'vitest';

import { checkHeal, healPayloadOf, outcomeFromPayload, requestSubjectMask, requestSubjectMaskStateless, startHeal, waitForHeal, proxyCandidates } from './aiApi';
import { runHeal, type HealDeps } from './healFlow';
import { appendHeal, baseHashOf, currentBaseRef, HealStrokes } from './healOps';
import { canonicalPhotoDoc, geometrySchema, newPhotoDoc, parsePhotoDoc } from './photoTypes';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('heal flow (fake fetch)', () => {
  it('project form: posts mask + base multipart, polls the job, reads the completion payload, entry carries baseRef + maskRef', async () => {
    const calls: { url: string; body?: FormData }[] = [];
    const f = vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, body: init?.body as FormData });
      if (url.endsWith('/heal')) return json({ jobId: 'j1' }, 202);
      return json({ status: 'completed', result: { baseHash: 'abc123', baseRef: 'bases/abc123.png', proxyRef: 'bases/abc123.proxy.jpg', maskRef: 'masks/m1.png', width: 4000, height: 3000 } });
    });
    const mask = new Blob(['m'], { type: 'image/png' });
    const id = await startHeal({ projectId: 'p1', mask, baseHash: 'prev' }, f as never);
    expect(id).toBe('j1');
    const form = calls[0].body as FormData;
    expect(calls[0].url).toMatch(/\/photo\/projects\/p1\/heal$/);
    expect(form.get('base')).toBe('prev');
    expect(form.get('mask')).toBeInstanceOf(Blob);
    const status = await checkHeal('j1', f as never);
    expect(status.state).toBe('done');
    const out = outcomeFromPayload(status.state === 'done' ? status.payload : {});
    expect(out).toMatchObject({ baseRef: 'bases/abc123.png', maskRef: 'masks/m1.png', baseHash: 'abc123' });
    const doc = appendHeal(newPhotoDoc(4000, 3000), { baseRef: out.baseRef, maskRef: out.maskRef });
    expect(doc.heals).toEqual([{ id: 'heal-1', baseRef: 'bases/abc123.png', maskRef: 'masks/m1.png' }]);
    expect(currentBaseRef(doc)).toBe('bases/abc123.png');
    expect(parsePhotoDoc(canonicalPhotoDoc(doc)).ok).toBe(true);
    expect(proxyCandidates('bases/abc123.png')).toEqual(['bases/abc123.proxy.jpg', 'bases/abc123.proxy.png']);
  });

  it('runHeal (project): appends nothing itself, returns the outcome and reports progress', async () => {
    const progress: number[] = [];
    const deps: HealDeps = {
      startHeal: vi.fn(async () => 'j2'),
      waitForHeal: vi.fn(async (_id, o) => {
        o?.onProgress?.(40);
        return { baseHash: 'h2' };
      }),
      fetchHealResult: vi.fn(),
    };
    const out = await runHeal({ projectId: 'p', mask: new Blob(['x']), onProgress: (p) => progress.push(p) }, deps);
    expect(out.baseRef).toBe('bases/h2.png');
    expect(progress).toEqual([40]);
  });

  it('guest form: stateless heal downloads the result and marks the base local:<id>', async () => {
    const deps: HealDeps = {
      startHeal: vi.fn(async () => 'j3'),
      waitForHeal: vi.fn(async () => ({})),
      fetchHealResult: vi.fn(async () => new Blob(['img'])),
    };
    const out = await runHeal({ projectId: null, mask: new Blob(['m']), file: new Blob(['f']), fileName: 'a.jpg', newLocalId: () => 'zz9' }, deps);
    expect(out.baseRef).toBe('local:zz9');
    expect(out.blob).toBeInstanceOf(Blob);
    expect(baseHashOf('local:zz9')).toBe('zz9');
    expect(baseHashOf('bases/ab.png')).toBe('ab');
    const doc = appendHeal(newPhotoDoc(10, 10), { baseRef: out.baseRef });
    expect(doc.heals[0]).toEqual({ id: 'heal-1', baseRef: 'local:zz9' });
    expect(parsePhotoDoc(canonicalPhotoDoc(doc)).ok).toBe(true);
  });

  it('a 429 on heal rethrows QuotaExceededError (the existing sheet), other failures become PhotoApiError', async () => {
    const quota = Object.assign(new Error('quota'), { name: 'QuotaExceededError' });
    await expect(startHeal({ projectId: 'p', mask: new Blob(['x']) }, (async () => { throw quota; }) as never)).rejects.toBe(quota);
    await expect(startHeal({ projectId: 'p', mask: new Blob(['x']) }, (async () => json({ error: 'heal_unavailable' }, 503)) as never)).rejects.toMatchObject({ status: 503, code: 'heal_unavailable' });
  });

  it('waitForHeal polls until done and surfaces a failed job', async () => {
    const seq = [{ state: 'running', progress: 10 }, { state: 'running', progress: 60 }, { state: 'done', payload: { baseHash: 'q' } }] as const;
    let i = 0;
    const got = await waitForHeal('j', { check: async () => seq[i++] as never, sleep: async () => undefined });
    expect(got).toEqual({ baseHash: 'q' });
    await expect(waitForHeal('j', { check: async () => ({ state: 'failed', error: 'boom' }), sleep: async () => undefined })).rejects.toMatchObject({ code: 'boom' });
    expect(healPayloadOf({ status: 'completed', payload: { a: 1 } })).toEqual({ a: 1 });
  });

  it('subject mask: project form returns the ref; stateless keeps the PNG', async () => {
    const f = vi.fn(async () => json({ maskId: 'm9', maskRef: 'masks/m9.png', url: '/x', width: 10, height: 8 }));
    const r = await requestSubjectMask('p1', undefined, f as never);
    expect(r.maskRef).toBe('masks/m9.png');
    const g = vi.fn(async () => new Response(new Blob(['png'], { type: 'image/png' })));
    const s = await requestSubjectMaskStateless(new Blob(['f']), 'a.jpg', () => 'ab1', g as never);
    expect(s.maskRef).toBe('masks/ab1.png');
    expect(s.blob).toBeInstanceOf(Blob);
  });
});

describe('heal strokes map through the geometry into source space', () => {
  it('a stroke on a flipped + rotated display lands on the right source pixels', () => {
    const geo = geometrySchema.parse({ rotate: 90 });
    const s = new HealStrokes(geo, 400, 200, 200, 400);
    // display (0.5, 0.25) of a 200x400 canvas = x100,y100; rotate 90 cw: source (x, y) -> (199 - y, x) so source = (100, 99.5)
    s.addStroke([{ x: 0.5, y: 0.25 }], 10);
    const { width, data } = s.maskRgba();
    const at = (x: number, y: number) => data[(y * width + x) * 4];
    expect(at(100, 100)).toBe(255);
    expect(at(300, 100)).toBe(0);
    expect(s.count).toBe(1);
    s.clear();
    expect(s.count).toBe(0);
  });
});
