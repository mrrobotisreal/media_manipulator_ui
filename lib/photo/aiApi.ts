/**
 * Client for MM96's AI routes used by MM98 (route contract D5 in
 * `.scratch/mm96-mm98/NOTES.md`; the routes are 501 stubs until MM96 deploys):
 *
 *   POST /photo/projects/:id/masks/subject   {} | {base}        → {maskId, maskRef, url, width, height}
 *   POST /photo/masks/subject                multipart file     → image/png
 *   POST /photo/projects/:id/heal            multipart mask+base → 202 {jobId}
 *   POST /photo/heal                         multipart file+mask → 202 {jobId}
 *   GET  /job/:id                            heal completion payload {baseHash, baseRef, proxyRef, maskRef, width, height}
 *   GET  /result/:id                         the stateless heal result image
 *
 * One `ai_ops` per press is charged by the server; a 429 surfaces as
 * `QuotaExceededError` from `authedFetch` (the existing upgrade sheet).
 */
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import { PhotoApiError, type FetchLike } from '@/lib/photo/projectsApi';

const base = () => `${getBaseURL()}/photo`;
const s = (v: unknown, d = '') => (typeof v === 'string' ? v : d);
const n = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

async function failure(res: Response): Promise<PhotoApiError> {
  const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  return new PhotoApiError(res.status, s(body?.error), body);
}
async function send(fetchImpl: FetchLike, url: string, init: RequestInit): Promise<Response> {
  let res: Response;
  try {
    res = await fetchImpl(url, init);
  } catch (e) {
    if (e instanceof Error && e.name === 'QuotaExceededError') throw e;
    throw new PhotoApiError(0, 'network');
  }
  if (!res.ok) throw await failure(res);
  return res;
}

export interface SubjectMaskResult {
  /** `masks/<id>.png` for a server project; a local marker for a guest. */
  maskRef: string;
  /** The mask PNG (kept locally for guests, fetched for the renderer otherwise). */
  blob: Blob | null;
  width: number;
  height: number;
}

/** Signed-in: select the subject of the project's current base (or `baseHash`). */
export async function requestSubjectMask(projectId: string, baseHash?: string, fetchImpl: FetchLike = authedFetch): Promise<SubjectMaskResult> {
  const res = await send(fetchImpl, `${base()}/projects/${encodeURIComponent(projectId)}/masks/subject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(baseHash ? { base: baseHash } : {}),
  });
  const b = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const maskRef = s(b.maskRef);
  if (!maskRef) throw new PhotoApiError(200, 'photo_mask_no_ref');
  return { maskRef, blob: null, width: n(b.width), height: n(b.height) };
}

/** Signed-out: the stateless route with the local base; the PNG is kept in the local project. */
export async function requestSubjectMaskStateless(file: Blob, fileName: string, newId: () => string, fetchImpl: FetchLike = authedFetch): Promise<SubjectMaskResult> {
  const form = new FormData();
  form.append('file', file, fileName);
  const res = await send(fetchImpl, `${base()}/masks/subject`, { method: 'POST', body: form });
  const blob = await res.blob();
  return { maskRef: `masks/${newId()}.png`, blob, width: 0, height: 0 };
}

export interface HealOutcome {
  baseRef: string;
  maskRef?: string;
  /** Server base hash (project form). */
  baseHash?: string;
  proxyRef?: string;
  /** Guest form: the healed image. */
  blob?: Blob;
  width?: number;
  height?: number;
}

export async function startHeal(
  input: { projectId: string | null; mask: Blob; baseHash?: string; file?: Blob; fileName?: string },
  fetchImpl: FetchLike = authedFetch,
): Promise<string> {
  const form = new FormData();
  let url: string;
  if (input.projectId) {
    form.append('mask', input.mask, 'mask.png');
    form.append('base', input.baseHash ?? '');
    url = `${base()}/projects/${encodeURIComponent(input.projectId)}/heal`;
  } else {
    form.append('file', input.file as Blob, input.fileName ?? 'photo');
    form.append('mask', input.mask, 'mask.png');
    url = `${base()}/heal`;
  }
  const res = await send(fetchImpl, url, { method: 'POST', body: form });
  const b = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const id = s(b.jobId);
  if (!id) throw new PhotoApiError(200, 'photo_heal_no_job');
  return id;
}

/** The heal completion payload, wherever the job body carries it (`result`, `payload`, `heal` or the root). */
export function healPayloadOf(job: Record<string, unknown>): Record<string, unknown> {
  for (const k of ['healResult', 'result', 'payload', 'heal']) {
    const v = job[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>;
  }
  return job;
}

export type HealStatus = { state: 'running'; progress: number } | { state: 'failed'; error: string } | { state: 'done'; payload: Record<string, unknown> };

export async function checkHeal(jobId: string, fetchImpl: FetchLike = authedFetch): Promise<HealStatus> {
  const res = await send(fetchImpl, `${getBaseURL()}/job/${encodeURIComponent(jobId)}`, { method: 'GET' });
  const j = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (j.status === 'failed') return { state: 'failed', error: s(j.error, 'failed') };
  if (j.status === 'completed') return { state: 'done', payload: healPayloadOf(j) };
  return { state: 'running', progress: n(j.progress) };
}

/** Poll a heal job to completion. `sleep` and `check` are injectable for tests. */
export async function waitForHeal(
  jobId: string,
  opts: { onProgress?: (p: number) => void; intervalMs?: number; timeoutMs?: number; check?: (id: string) => Promise<HealStatus>; sleep?: (ms: number) => Promise<void>; signal?: AbortSignal } = {},
): Promise<Record<string, unknown>> {
  const check = opts.check ?? ((id: string) => checkHeal(id));
  const sleep = opts.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  const deadline = Date.now() + (opts.timeoutMs ?? 10 * 60_000);
  for (;;) {
    if (opts.signal?.aborted) throw new PhotoApiError(0, 'aborted');
    const st = await check(jobId);
    if (st.state === 'done') return st.payload;
    if (st.state === 'failed') throw new PhotoApiError(500, st.error);
    opts.onProgress?.(st.progress);
    if (Date.now() > deadline) throw new PhotoApiError(504, 'heal_timeout');
    await sleep(opts.intervalMs ?? 1500);
  }
}

/** Normalise a project-form completion payload into the doc entry fields. */
export function outcomeFromPayload(p: Record<string, unknown>): HealOutcome {
  const baseHash = s(p.baseHash);
  const baseRef = s(p.baseRef) || (baseHash ? `bases/${baseHash}.png` : '');
  if (!baseRef) throw new PhotoApiError(200, 'photo_heal_no_base');
  return { baseRef, baseHash: baseHash || undefined, maskRef: s(p.maskRef) || undefined, proxyRef: s(p.proxyRef) || undefined, width: n(p.width) || undefined, height: n(p.height) || undefined };
}

/** Guest form: download the healed image of the finished job. */
export async function fetchHealResult(jobId: string, fetchImpl: FetchLike = authedFetch): Promise<Blob> {
  const res = await send(fetchImpl, `${getBaseURL()}/result/${encodeURIComponent(jobId)}`, { method: 'GET' });
  return res.blob();
}

/** Fetch a project file (`masks/<id>.png`, `bases/<hash>.proxy.jpg`) from the files route. */
export async function fetchProjectFile(projectId: string, rel: string, fetchImpl: FetchLike = authedFetch): Promise<Blob> {
  const res = await send(fetchImpl, `${base()}/projects/${encodeURIComponent(projectId)}/files/${rel}`, { method: 'GET' });
  return res.blob();
}

/** The proxy path for a base ref: `bases/<hash>.png` → `bases/<hash>.proxy.jpg` (png fallback tried by the caller). */
export const proxyCandidates = (baseRef: string): string[] => {
  const stem = baseRef.replace(/\.png$/, '');
  return [`${stem}.proxy.jpg`, `${stem}.proxy.png`];
};
