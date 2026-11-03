/**
 * Batch apply (design §5.5 / §6.2, MM99 decision 6): the current stack applied
 * to more photos. Flow: one project per file (sequential
 * `POST /api/photo/projects`), ONE `POST /api/photo/batch {projectIds, doc,
 * format, quality, metadataMode}` (MM96; answers `{jobs:[{projectId, jobId}]}`),
 * then each job id is tracked through `GET /api/job/:id` and the finished
 * results are zipped client-side with fflate. Everything the network does is
 * injected (`BatchDeps`) so the flow is unit-testable with a fake fetch.
 *
 * Errors: 403 `photo_batch_limit {limit, upgradePath}` and `sign_in_required`
 * surface as `BatchError` with the same codes; the UI shows the neutral limit
 * line and MM101's gating seam (`onBatchStarted(n)` is the analytics seam).
 */
import { zipSync } from 'fflate';

import { authedFetch } from '@/lib/auth/authedFetch';
import { checkJobStatus } from '@/lib/useGetJobStatus';
import { getBaseURL } from '@/lib/utils';
import { PhotoApiError, createPhotoProject, type ExportOptions, type FetchLike } from '@/lib/photo/projectsApi';
import type { PhotoDoc } from '@/lib/photo/photoTypes';

export type BatchRowStatus = 'queued' | 'creating' | 'created' | 'exporting' | 'done' | 'failed';

export interface BatchRow {
  key: string;
  fileName: string;
  status: BatchRowStatus;
  projectId?: string;
  jobId?: string;
  /** 0..1 while exporting. */
  progress?: number;
  /** Error code of the failure ('network', 'photo_not_ready', 'failed'...). */
  error?: string;
  /** Output file name from the job, when known. */
  resultName?: string;
}

export class BatchError extends Error {
  constructor(
    readonly code: 'sign_in_required' | 'photo_batch_limit' | 'photo_batch_invalid' | 'failed',
    readonly limit?: number,
    readonly upgradePath?: string,
  ) {
    super(code);
    this.name = 'BatchError';
  }
}

export interface BatchDeps {
  createProject: (file: File, name: string) => Promise<{ id: string }>;
  startBatch: (projectIds: string[], doc: PhotoDoc, opts: BatchExportOptions) => Promise<{ projectId: string; jobId: string }[]>;
  jobStatus: (jobId: string) => Promise<{ status: string; progress?: number; error?: string; resultFileName?: string }>;
  fetchResult: (jobId: string) => Promise<Blob>;
  sleep: (ms: number) => Promise<void>;
}

export type BatchExportOptions = Pick<ExportOptions, 'format' | 'quality' | 'metadataMode'>;

export const BATCH_POLL_MS = 1500;
export const BATCH_POLL_TIMEOUT_MS = 20 * 60_000;

const batchName = (fileName: string): string => `${fileName.replace(/\.[^.]+$/, '') || 'photo'} (batch)`.slice(0, 80);

export const rowKey = (file: File, i: number): string => `${i}:${file.name}:${file.size}`;

/** Parse the batch route's JSON error body into a BatchError. */
export function batchErrorFrom(e: unknown): BatchError {
  if (e instanceof BatchError) return e;
  if (e instanceof PhotoApiError) {
    const body = (e.body ?? {}) as { limit?: unknown; upgradePath?: unknown };
    const code = e.code === 'sign_in_required' || e.code === 'photo_batch_limit' || e.code === 'photo_batch_invalid' ? e.code : 'failed';
    return new BatchError(code, typeof body.limit === 'number' ? body.limit : undefined, typeof body.upgradePath === 'string' ? body.upgradePath : undefined);
  }
  return new BatchError('failed');
}

/** The real network dependencies. */
export function defaultBatchDeps(fetchImpl: FetchLike = authedFetch): BatchDeps {
  return {
    createProject: async (file, name) => {
      const p = await createPhotoProject({ file, fileName: file.name, name }, { fetchImpl });
      return { id: p.id };
    },
    startBatch: async (projectIds, doc, opts) => {
      let res: Response;
      try {
        res = await fetchImpl(`${getBaseURL()}/photo/batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectIds, doc, format: opts.format, quality: opts.quality, metadataMode: opts.metadataMode }),
        });
      } catch {
        throw new PhotoApiError(0, 'network');
      }
      const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
      if (!res.ok) throw new PhotoApiError(res.status, typeof body?.error === 'string' ? body.error : '', body);
      const jobs = Array.isArray(body?.jobs) ? (body?.jobs as Record<string, unknown>[]) : [];
      return jobs.filter((j) => typeof j.projectId === 'string' && typeof j.jobId === 'string').map((j) => ({ projectId: j.projectId as string, jobId: j.jobId as string }));
    },
    jobStatus: async (jobId) => {
      const j = await checkJobStatus(jobId);
      return { status: j.status, progress: j.progress, error: j.error, resultFileName: j.resultFileName };
    },
    fetchResult: async (jobId) => {
      const res = await fetchImpl(`${getBaseURL()}/download/${encodeURIComponent(jobId)}`);
      if (!res.ok) throw new Error(`download ${res.status}`);
      return res.blob();
    },
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
  };
}

export interface BatchPlan {
  /** Files accepted (capped), in order. */
  accepted: File[];
  /** Files over the cap. */
  dropped: number;
  /** Why nothing can run, or null. */
  blocked: 'sign_in' | 'limit' | null;
}

/** Cap handling for the picker: anonymous (0) → sign in; a signed-in tier at its cap → the neutral limit line. */
export function planBatch(files: File[], photoBatch: number, signedIn: boolean): BatchPlan {
  if (photoBatch <= 0) return { accepted: [], dropped: files.length, blocked: signedIn ? 'limit' : 'sign_in' };
  const accepted = files.slice(0, photoBatch);
  return { accepted, dropped: files.length - accepted.length, blocked: null };
}

type Update = (rows: BatchRow[]) => void;

/**
 * Create the projects (sequentially), start the batch and track every job.
 * Resolves with the final rows. `retryRows` re-runs only the given rows
 * (creation for rows with no project, a one-project batch for the rest).
 */
export async function runBatch(
  files: File[],
  doc: PhotoDoc,
  opts: BatchExportOptions,
  deps: BatchDeps,
  onUpdate: Update,
  existing?: BatchRow[],
  signal?: { aborted: boolean },
  seam?: { onBatchStarted?: (n: number) => void },
): Promise<BatchRow[]> {
  const rows: BatchRow[] = existing ?? files.map((f, i) => ({ key: rowKey(f, i), fileName: f.name, status: 'queued' as const }));
  const emit = () => onUpdate(rows.map((r) => ({ ...r })));
  const set = (i: number, patch: Partial<BatchRow>) => {
    rows[i] = { ...rows[i], ...patch };
    emit();
  };
  emit();

  // 1. projects, one at a time
  for (let i = 0; i < rows.length; i += 1) {
    if (signal?.aborted) break;
    const r = rows[i];
    if (r.status === 'done' || r.projectId) continue;
    set(i, { status: 'creating', error: undefined });
    try {
      const p = await deps.createProject(files[i], batchName(files[i].name));
      set(i, { status: 'created', projectId: p.id });
    } catch (e) {
      set(i, { status: 'failed', error: e instanceof PhotoApiError && e.code ? e.code : 'failed' });
    }
  }

  // 2. one batch request for every row that has a project and is not finished
  const ready = rows.map((r, i) => ({ r, i })).filter(({ r }) => !!r.projectId && r.status === 'created');
  if (ready.length === 0 || signal?.aborted) return rows;
  let jobs: { projectId: string; jobId: string }[];
  seam?.onBatchStarted?.(ready.length);
  try {
    jobs = await deps.startBatch(ready.map(({ r }) => r.projectId as string), doc, opts);
  } catch (e) {
    const be = batchErrorFrom(e);
    ready.forEach(({ i }) => set(i, { status: 'failed', error: be.code }));
    throw be;
  }
  for (const { r, i } of ready) {
    const job = jobs.find((j) => j.projectId === r.projectId);
    if (job) set(i, { status: 'exporting', jobId: job.jobId, progress: 0, error: undefined });
    else set(i, { status: 'failed', error: 'failed' });
  }

  // 3. track every job
  const started = Date.now();
  const open = () => rows.map((r, i) => ({ r, i })).filter(({ r }) => r.status === 'exporting' && r.jobId);
  while (open().length > 0 && !signal?.aborted) {
    for (const { r, i } of open()) {
      try {
        const s = await deps.jobStatus(r.jobId as string);
        if (s.status === 'completed') set(i, { status: 'done', progress: 1, resultName: s.resultFileName });
        else if (s.status === 'failed') set(i, { status: 'failed', error: 'failed' });
        else set(i, { progress: typeof s.progress === 'number' ? s.progress : r.progress });
      } catch {
        // transient poll failure: keep trying until the timeout
      }
    }
    if (open().length === 0) break;
    if (Date.now() - started > BATCH_POLL_TIMEOUT_MS) {
      open().forEach(({ i }) => set(i, { status: 'failed', error: 'timeout' }));
      break;
    }
    await deps.sleep(BATCH_POLL_MS);
  }
  return rows;
}

/** Re-run the failed rows only. Rows with a project start a one-project batch; rows without one are created first. */
export function retryFailed(rows: BatchRow[]): BatchRow[] {
  return rows.map((r) => (r.status === 'failed' ? { ...r, status: r.projectId ? ('created' as const) : ('queued' as const), jobId: undefined, error: undefined, progress: undefined } : r));
}

const zipName = (row: BatchRow, used: Set<string>): string => {
  const base = (row.resultName || `${row.fileName.replace(/\.[^.]+$/, '')}.jpg`).replace(/[\\/]/g, '_');
  let name = base;
  for (let n = 2; used.has(name); n += 1) name = base.replace(/(\.[^.]*)?$/, `-${n}$1`);
  used.add(name);
  return name;
};

/** Download every finished result and pack them into one ZIP (already-compressed images are stored, not deflated). */
export async function buildBatchZip(rows: BatchRow[], deps: Pick<BatchDeps, 'fetchResult'>): Promise<{ blob: Blob; count: number; failed: number }> {
  const files: Record<string, Uint8Array> = {};
  const used = new Set<string>();
  let failed = 0;
  for (const r of rows) {
    if (r.status !== 'done' || !r.jobId) continue;
    try {
      const b = await deps.fetchResult(r.jobId);
      files[zipName(r, used)] = new Uint8Array(await b.arrayBuffer());
    } catch {
      failed += 1;
    }
  }
  const count = Object.keys(files).length;
  const zipped = zipSync(files, { level: 0 });
  return { blob: new Blob([zipped as BlobPart], { type: 'application/zip' }), count, failed };
}
