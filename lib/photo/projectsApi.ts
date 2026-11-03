/**
 * Client for MM95's photo routes (`internal/handlers/photo.go`, design §6.2).
 *
 *   POST   /photo/projects               multipart file, name?, doc? → 201 {project}
 *   GET    /photo/projects               {projects:[summary]}
 *   GET    /photo/projects/:id           {project, doc}
 *   PUT    /photo/projects/:id           If-Match: <revision>; {name?, doc} → {project, doc?}
 *                                        409 {error:"revision_conflict", revision}
 *   DELETE /photo/projects/:id
 *   GET    /photo/projects/:id/{original,proxy,thumb}
 *   GET    /photo/capabilities           {enabled, render, formats, maxMegapixels, photoProjects, photoBatch, aiMasks, heal, tier}
 *
 * Every project route needs a signed-in caller; anonymous users keep one
 * browser-local project (`localProject.ts`). Identity is attached by
 * `authedFetch`; tests inject a fetch.
 */
import { authedFetch } from '@/lib/auth/authedFetch';
import { getBaseURL } from '@/lib/utils';
import { PHOTO_FORMATS, parsePhotoDoc, type PhotoDoc } from '@/lib/photo/photoTypes';

export interface PhotoProjectSummary {
  id: string;
  name: string;
  revision: number;
  width: number;
  height: number;
  thumbUrl: string;
  updatedAt: string;
}
export interface PhotoProject extends PhotoProjectSummary {
  doc: PhotoDoc;
}

export class PhotoApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly body: Record<string, unknown> | null;
  constructor(status: number, code: string, body: Record<string, unknown> | null = null) {
    super(`photo request failed (${status}${code ? `: ${code}` : ''})`);
    this.name = 'PhotoApiError';
    this.status = status;
    this.code = code;
    this.body = body;
  }
  /** 409 revision_conflict: the server's current revision. */
  get conflict(): { revision: number } | null {
    if (this.status !== 409 || this.code !== 'revision_conflict' || !this.body) return null;
    const rev = this.body.revision ?? this.body.currentRevision;
    return typeof rev === 'number' && Number.isInteger(rev) && rev > 0 ? { revision: rev } : null;
  }
  get retryable(): boolean {
    return this.status === 0 || this.status >= 500;
  }
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;
const base = () => `${getBaseURL()}/photo`;
const s = (v: unknown, d = '') => (typeof v === 'string' ? v : d);
const n = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

async function call(fetchImpl: FetchLike, url: string, init: RequestInit = {}): Promise<Record<string, unknown>> {
  let res: Response;
  try {
    res = await fetchImpl(url, init);
  } catch (e) {
    if (e instanceof Error && e.name === 'QuotaExceededError') throw e;
    throw new PhotoApiError(0, 'network');
  }
  const body = (await res.json().catch(() => null)) as Record<string, unknown> | null;
  if (!res.ok) throw new PhotoApiError(res.status, s(body?.error), body);
  return body ?? {};
}

export function summaryOf(raw: Record<string, unknown>): PhotoProjectSummary {
  return {
    id: s(raw.id),
    name: s(raw.name),
    revision: n(raw.revision),
    width: n(raw.width),
    height: n(raw.height),
    thumbUrl: s(raw.thumbUrl),
    updatedAt: s(raw.updatedAt),
  };
}

function projectOf(body: Record<string, unknown>, fallbackDoc?: PhotoDoc): PhotoProject {
  const p = (body.project ?? body) as Record<string, unknown>;
  const docRaw = body.doc ?? p.doc;
  let doc = fallbackDoc;
  if (docRaw !== undefined) {
    const parsed = parsePhotoDoc(docRaw);
    // A document this build cannot read (newer version, corrupt): refuse rather than edit a guess.
    if (!parsed.ok) throw new PhotoApiError(200, 'photo_doc_unreadable', { message: parsed.error });
    doc = parsed.doc;
  }
  if (!doc) throw new PhotoApiError(200, 'photo_doc_missing');
  return { ...summaryOf(p), doc };
}

export async function listPhotoProjects(fetchImpl: FetchLike = authedFetch): Promise<PhotoProjectSummary[]> {
  const body = await call(fetchImpl, `${base()}/projects`, { method: 'GET' });
  return Array.isArray(body.projects) ? (body.projects as Record<string, unknown>[]).map(summaryOf) : [];
}

export interface CreateInput {
  file: Blob;
  fileName: string;
  name?: string;
  doc?: PhotoDoc;
}

/** Create a project from a file. XHR so the upload reports progress; falls back to fetch. */
export async function createPhotoProject(
  input: CreateInput,
  opts: { onProgress?: (fraction: number) => void; fetchImpl?: FetchLike; signal?: AbortSignal } = {},
): Promise<PhotoProject> {
  const form = new FormData();
  form.append('file', input.file, input.fileName);
  if (input.name) form.append('name', input.name);
  if (input.doc) form.append('doc', JSON.stringify(input.doc));
  // authedFetch does not report progress; the progress callback is a coarse start/end signal.
  opts.onProgress?.(0);
  const body = await call(opts.fetchImpl ?? authedFetch, `${base()}/projects`, { method: 'POST', body: form, signal: opts.signal });
  opts.onProgress?.(1);
  return projectOf(body, input.doc);
}

export async function getPhotoProject(id: string, fetchImpl: FetchLike = authedFetch): Promise<PhotoProject> {
  return projectOf(await call(fetchImpl, `${base()}/projects/${encodeURIComponent(id)}`, { method: 'GET' }));
}

/** Save with `If-Match: <revision>`. */
export async function savePhotoProject(
  id: string,
  revision: number,
  patch: { name?: string; doc: PhotoDoc },
  fetchImpl: FetchLike = authedFetch,
): Promise<PhotoProject> {
  const body = await call(fetchImpl, `${base()}/projects/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'If-Match': String(revision), 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  return projectOf(body, patch.doc);
}

export async function deletePhotoProject(id: string, fetchImpl: FetchLike = authedFetch): Promise<void> {
  await call(fetchImpl, `${base()}/projects/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export const projectFileUrl = (id: string, kind: 'original' | 'proxy' | 'thumb') => `${base()}/projects/${encodeURIComponent(id)}/${kind}`;

/** Fetch a project's image bytes with identity (the routes are owner-only). */
export async function fetchProjectImage(id: string, kind: 'original' | 'proxy', fetchImpl: FetchLike = authedFetch): Promise<Blob> {
  const res = await fetchImpl(projectFileUrl(id, kind));
  if (!res.ok) throw new PhotoApiError(res.status, 'photo_file_unavailable');
  return res.blob();
}

// ---------------------------------------------------------------------------
// capabilities
// ---------------------------------------------------------------------------

export interface PhotoCapabilities {
  enabled: boolean;
  /** True only when MM96's renderer is configured; false → "Export is being set up". */
  render: boolean;
  formats: string[];
  maxMegapixels: number;
  photoProjects: number;
  photoBatch: number;
  aiMasks: boolean;
  heal: boolean;
  tier: string;
}

export const CAPABILITIES_TTL_MS = 5 * 60_000;
let capsCache: { at: number; value: PhotoCapabilities } | null = null;
export function resetCapabilitiesCache(): void {
  capsCache = null;
}

const DEFAULT_CAPS: PhotoCapabilities = {
  enabled: false,
  render: false,
  formats: [],
  maxMegapixels: 12,
  photoProjects: 0,
  photoBatch: 0,
  aiMasks: false,
  heal: false,
  tier: 'anonymous',
};

export async function getPhotoCapabilities(fetchImpl: FetchLike = authedFetch, now = Date.now()): Promise<PhotoCapabilities> {
  if (capsCache && now - capsCache.at < CAPABILITIES_TTL_MS) return capsCache.value;
  try {
    const b = await call(fetchImpl, `${base()}/capabilities`, { method: 'GET' });
    const known = PHOTO_FORMATS as readonly string[];
    const value: PhotoCapabilities = {
      enabled: b.enabled === true,
      render: b.render === true,
      formats: Array.isArray(b.formats) ? (b.formats as unknown[]).filter((f): f is string => typeof f === 'string' && known.includes(f)) : [],
      maxMegapixels: n(b.maxMegapixels, 12),
      photoProjects: n(b.photoProjects),
      photoBatch: n(b.photoBatch),
      aiMasks: b.aiMasks === true,
      heal: b.heal === true,
      tier: s(b.tier, 'anonymous'),
    };
    capsCache = { at: now, value };
    return value;
  } catch {
    return DEFAULT_CAPS;
  }
}

// ---------------------------------------------------------------------------
// export
// ---------------------------------------------------------------------------

export interface ExportOptions {
  format: (typeof PHOTO_FORMATS)[number];
  quality: number;
  metadataMode: 'keep' | 'strip';
  /** 0 = original size. */
  maxMegapixels?: number;
  name?: string;
}

/** Signed-in: `POST /photo/projects/:id/export` (the doc rides along and is saved first). → job id. */
export async function exportProject(projectId: string, doc: PhotoDoc, opts: ExportOptions, fetchImpl: FetchLike = authedFetch): Promise<string> {
  const payload: Record<string, unknown> = { doc, format: opts.format, quality: opts.quality, metadataMode: opts.metadataMode };
  if (opts.maxMegapixels) payload.maxMegapixels = opts.maxMegapixels;
  if (opts.name) payload.name = opts.name;
  const body = await call(fetchImpl, `${base()}/projects/${encodeURIComponent(projectId)}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const id = s(body.jobId);
  if (!id) throw new PhotoApiError(200, 'photo_export_no_job');
  return id;
}

/** Signed-out: stateless `POST /photo/export` (multipart file + doc). → job id. */
export async function exportStateless(file: Blob, fileName: string, doc: PhotoDoc, opts: ExportOptions, fetchImpl: FetchLike = authedFetch): Promise<string> {
  const form = new FormData();
  form.append('file', file, fileName);
  form.append('doc', JSON.stringify(doc));
  form.append('format', opts.format);
  form.append('quality', String(opts.quality));
  form.append('metadataMode', opts.metadataMode);
  if (opts.maxMegapixels) form.append('maxMegapixels', String(opts.maxMegapixels));
  const body = await call(fetchImpl, `${base()}/export`, { method: 'POST', body: form });
  const id = s(body.jobId);
  if (!id) throw new PhotoApiError(200, 'photo_export_no_job');
  return id;
}

/** Bytes-per-megapixel estimates per format (MM81-style table). */
export const BYTES_PER_MP: Record<(typeof PHOTO_FORMATS)[number], (quality: number) => number> = {
  jpg: (q) => 60_000 + q * 9_000,
  webp: (q) => 40_000 + q * 6_000,
  avif: (q) => 25_000 + q * 3_500,
  png: () => 1_900_000,
  tiff: () => 3_000_000,
};

export function estimateExportBytes(format: (typeof PHOTO_FORMATS)[number], quality: number, megapixels: number): number {
  return Math.round(BYTES_PER_MP[format](quality) * megapixels);
}

/** Max-size options of the export dialog; MP 0 = original. */
export const MAX_SIZE_OPTIONS = [0, 12, 24, 64, 120] as const;
export type MaxSizeOption = (typeof MAX_SIZE_OPTIONS)[number];

/**
 * Anonymous and free: 12 MP; premium and pro: all (design §9). `capMegapixels`
 * is the plan's ceiling; "Original" is locked when the photo itself is above it.
 */
export function isSizeLocked(option: MaxSizeOption, capMegapixels: number, originalMegapixels = 0): boolean {
  if (option === 0) return originalMegapixels > capMegapixels;
  return option > capMegapixels;
}
