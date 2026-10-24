/**
 * Bounded-concurrency upload queue (part 21). Pure and framework-free: jobs are
 * closures, so it knows nothing about presign/S3/complete. The editor keeps ONE
 * module-level instance so uploads (and their progress rows) survive the media
 * bin unmounting, e.g. switching mobile tabs.
 */

export type UploadItemStatus = 'queued' | 'uploading' | 'processing' | 'done' | 'failed';

export interface UploadItem {
  id: string;
  projectId: string;
  /** Display name only (never sent to analytics). */
  name: string;
  size: number;
  status: UploadItemStatus;
  /** 0..100 over the S3 PUT. */
  progress: number;
  error?: string;
}

export interface UploadJobContext {
  setProgress: (percent: number) => void;
  /** Flip to the post-PUT phase (complete call in flight). */
  setProcessing: () => void;
}

export type UploadJob<R> = (ctx: UploadJobContext) => Promise<R>;

interface Entry {
  item: UploadItem;
  run: UploadJob<unknown>;
  resolve: (r: unknown) => void;
  reject: (e: unknown) => void;
  /** Re-queued after a failure: the first rejection already settled the promise. */
  settled: boolean;
}

export const DEFAULT_UPLOAD_CONCURRENCY = 3;

export class UploadQueue {
  private entries: Entry[] = [];
  private listeners = new Set<() => void>();
  private snapshot: readonly UploadItem[] = [];
  private seq = 0;

  constructor(private readonly concurrency: number = DEFAULT_UPLOAD_CONCURRENCY) {}

  /** useSyncExternalStore-compatible. */
  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  getSnapshot = (): readonly UploadItem[] => this.snapshot;

  /** Queue a job. The promise settles with the first attempt's outcome. */
  enqueue<R>(meta: { projectId: string; name: string; size: number }, run: UploadJob<R>): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const item: UploadItem = {
        id: `up-${++this.seq}`,
        projectId: meta.projectId,
        name: meta.name,
        size: meta.size,
        status: 'queued',
        progress: 0,
      };
      this.entries.push({
        item,
        run: run as UploadJob<unknown>,
        resolve: resolve as (r: unknown) => void,
        reject,
        settled: false,
      });
      this.emit();
      this.pump();
    });
  }

  /** Retry one failed item individually. */
  retry(id: string): void {
    const e = this.entries.find((x) => x.item.id === id);
    if (!e || e.item.status !== 'failed') return;
    e.item = { ...e.item, status: 'queued', progress: 0, error: undefined };
    this.emit();
    this.pump();
  }

  /** Drop a finished or failed row. Active rows cannot be dismissed. */
  dismiss(id: string): void {
    const before = this.entries.length;
    this.entries = this.entries.filter(
      (x) => !(x.item.id === id && (x.item.status === 'done' || x.item.status === 'failed')),
    );
    if (this.entries.length !== before) this.emit();
  }

  /** Drop every finished row. */
  clearDone(): void {
    const before = this.entries.length;
    this.entries = this.entries.filter((x) => x.item.status !== 'done');
    if (this.entries.length !== before) this.emit();
  }

  private active(): number {
    return this.entries.filter((e) => e.item.status === 'uploading' || e.item.status === 'processing').length;
  }

  private pump(): void {
    while (this.active() < this.concurrency) {
      const next = this.entries.find((e) => e.item.status === 'queued');
      if (!next) return;
      this.start(next);
    }
  }

  private patch(entry: Entry, patch: Partial<UploadItem>): void {
    entry.item = { ...entry.item, ...patch };
    this.emit();
  }

  private start(entry: Entry): void {
    this.patch(entry, { status: 'uploading', progress: 0, error: undefined });
    const ctx: UploadJobContext = {
      setProgress: (p) => {
        if (entry.item.status === 'uploading') this.patch(entry, { progress: Math.max(0, Math.min(100, Math.round(p))) });
      },
      setProcessing: () => {
        if (entry.item.status === 'uploading') this.patch(entry, { status: 'processing', progress: 100 });
      },
    };
    entry.run(ctx).then(
      (result) => {
        this.patch(entry, { status: 'done', progress: 100 });
        if (!entry.settled) {
          entry.settled = true;
          entry.resolve(result);
        }
        this.pump();
      },
      (err) => {
        this.patch(entry, { status: 'failed', error: err instanceof Error ? err.message : String(err) });
        if (!entry.settled) {
          entry.settled = true;
          entry.reject(err);
        }
        this.pump();
      },
    );
  }

  private emit(): void {
    this.snapshot = this.entries.map((e) => e.item);
    for (const l of this.listeners) l();
  }
}

/** The editor-wide queue. */
export const studioUploadQueue = new UploadQueue();
