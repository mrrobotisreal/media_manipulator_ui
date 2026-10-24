import { describe, expect, it, vi } from 'vitest';
import { UploadQueue, type UploadJobContext } from './uploadQueue';

const meta = (name: string) => ({ projectId: 'p', name, size: 1 });

/** A job we can settle by hand. */
function deferred() {
  let resolve!: (v: string) => void;
  let reject!: (e: Error) => void;
  const promise = new Promise<string>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

const statuses = (q: UploadQueue) => q.getSnapshot().map((i) => i.status);

describe('UploadQueue', () => {
  it('runs at most 3 uploads at once and starts the next as slots free', async () => {
    const q = new UploadQueue(3);
    const jobs = Array.from({ length: 5 }, () => deferred());
    const started: number[] = [];
    jobs.forEach((d, i) => {
      void q.enqueue(meta(`f${i}`), () => {
        started.push(i);
        return d.promise;
      });
    });
    expect(started).toEqual([0, 1, 2]);
    expect(statuses(q)).toEqual(['uploading', 'uploading', 'uploading', 'queued', 'queued']);

    jobs[0].resolve('ok');
    await vi.waitFor(() => expect(started).toEqual([0, 1, 2, 3]));
    jobs[1].resolve('ok');
    await vi.waitFor(() => expect(started).toEqual([0, 1, 2, 3, 4]));
    expect(q.getSnapshot().filter((i) => i.status === 'uploading').length).toBeLessThanOrEqual(3);
  });

  it('10 files drain through the cap of 3 with fake timers', async () => {
    vi.useFakeTimers();
    try {
      const q = new UploadQueue(3);
      let running = 0;
      let peak = 0;
      const all = Array.from({ length: 10 }, (_, i) =>
        q.enqueue(meta(`f${i}`), async () => {
          running++;
          peak = Math.max(peak, running);
          await new Promise((r) => setTimeout(r, 100));
          running--;
          return i;
        }),
      );
      await vi.runAllTimersAsync();
      await Promise.all(all);
      expect(peak).toBe(3);
      expect(statuses(q).every((s) => s === 'done')).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('reports progress and the processing phase per file', async () => {
    const q = new UploadQueue(3);
    const gate = deferred();
    let ctx!: UploadJobContext;
    void q.enqueue(meta('a'), (c) => {
      ctx = c;
      return gate.promise;
    });
    ctx.setProgress(42.4);
    expect(q.getSnapshot()[0]).toMatchObject({ status: 'uploading', progress: 42 });
    ctx.setProcessing();
    expect(q.getSnapshot()[0]).toMatchObject({ status: 'processing', progress: 100 });
    gate.resolve('x');
    await vi.waitFor(() => expect(statuses(q)).toEqual(['done']));
  });

  it('a failure frees its slot, keeps the row, and retries individually', async () => {
    const q = new UploadQueue(1);
    let attempts = 0;
    const flaky = q.enqueue(meta('flaky'), async () => {
      attempts++;
      if (attempts === 1) throw new Error('boom');
      return 'ok';
    });
    const other = q.enqueue(meta('other'), async () => 'fine');
    await expect(flaky).rejects.toThrow('boom');
    await other;
    expect(q.getSnapshot().map((i) => [i.name, i.status, i.error])).toEqual([
      ['flaky', 'failed', 'boom'],
      ['other', 'done', undefined],
    ]);

    q.retry(q.getSnapshot()[0].id);
    await vi.waitFor(() => expect(q.getSnapshot()[0].status).toBe('done'));
    expect(attempts).toBe(2);
    expect(q.getSnapshot()[1].status).toBe('done'); // untouched
  });

  it('retry ignores non-failed rows; dismiss removes only finished rows', async () => {
    const q = new UploadQueue(1);
    const gate = deferred();
    void q.enqueue(meta('a'), () => gate.promise);
    const id = q.getSnapshot()[0].id;
    q.retry(id);
    q.dismiss(id);
    expect(q.getSnapshot()).toHaveLength(1);
    gate.resolve('x');
    await vi.waitFor(() => expect(statuses(q)).toEqual(['done']));
    q.dismiss(id);
    expect(q.getSnapshot()).toHaveLength(0);
  });

  it('notifies subscribers and hands out stable snapshots between changes', () => {
    const q = new UploadQueue(3);
    const fn = vi.fn();
    const off = q.subscribe(fn);
    const before = q.getSnapshot();
    expect(q.getSnapshot()).toBe(before);
    void q.enqueue(meta('a'), () => new Promise(() => undefined));
    expect(fn).toHaveBeenCalled();
    expect(q.getSnapshot()).not.toBe(before);
    off();
  });
});
