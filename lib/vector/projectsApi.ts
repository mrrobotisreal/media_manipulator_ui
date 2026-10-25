/**
 * Client for MM43's Motion project routes (`VectorHandler` in
 * `media_manipulator_api/internal/handlers/vector.go`; ticket MM44 decision 10).
 *
 *   GET    /vector/projects                {projects:[summary]} (never `document`)
 *   POST   /vector/projects                {name?, document} → 201 project, revision 1
 *   GET    /vector/projects/:id            project with `document` (owner only, else 404)
 *   PUT    /vector/projects/:id            If-Match: <revision>; {name?, document?, thumbnailKey?}
 *                                          → 200 revision+1 | 409 {error:"revision_conflict",currentRevision,updatedAt}
 *   DELETE /vector/projects/:id            {deleted:{objects,bytes},pending}
 *   POST   /vector/projects/:id/thumbnail  {sizeBytes, contentType:"image/png"} → 201 {uploadUrl, thumbnailKey, …}
 *
 * Every route needs a signed-in caller (401 otherwise: anonymous projects stay
 * in the browser, MM42's IndexedDB drafts). The ID token is passed in; this
 * module does not import Firebase.
 */
import { getBaseURL } from '@/lib/utils';
import { parseVectorDoc, type VectorDoc } from '@/lib/vector/vectorTypes';

export interface VectorProjectSummary {
  id: string;
  name: string;
  revision: number;
  thumbnailKey?: string;
  documentBytes: number;
  createdAt: string;
  updatedAt: string;
}

export interface VectorProject extends VectorProjectSummary {
  document: VectorDoc;
}

/** A refused or failed call. `status` 0 = network failure (fetch threw). */
export class VectorApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly body: Record<string, unknown> | null;
  constructor(status: number, code: string, body: Record<string, unknown> | null = null) {
    super(`vector projects request failed (${status}${code ? `: ${code}` : ''})`);
    this.name = 'VectorApiError';
    this.status = status;
    this.code = code;
    this.body = body;
  }
  /** 409 revision_conflict body. */
  get conflict(): { currentRevision: number; updatedAt: string } | null {
    if (this.status !== 409 || this.code !== 'revision_conflict' || !this.body) return null;
    const rev = this.body.currentRevision;
    return typeof rev === 'number' && Number.isInteger(rev) && rev > 0
      ? { currentRevision: rev, updatedAt: typeof this.body.updatedAt === 'string' ? this.body.updatedAt : '' }
      : null;
  }
  /** Network failure or 5xx: worth retrying. */
  get retryable(): boolean {
    return this.status === 0 || this.status >= 500;
  }
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const base = () => `${getBaseURL()}/vector/projects`;

async function call(fetchImpl: FetchLike, url: string, init: RequestInit, token: string): Promise<Record<string, unknown>> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init.body !== undefined) headers.set('Content-Type', 'application/json');
  let response: Response;
  try {
    response = await fetchImpl(url, { ...init, headers });
  } catch {
    throw new VectorApiError(0, 'network');
  }
  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok) throw new VectorApiError(response.status, typeof body?.error === 'string' ? body.error : '', body);
  return body ?? {};
}

function summary(raw: Record<string, unknown>): VectorProjectSummary {
  const s = (v: unknown) => (typeof v === 'string' ? v : '');
  const n = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
  return {
    id: s(raw.id),
    name: s(raw.name),
    revision: n(raw.revision),
    ...(typeof raw.thumbnailKey === 'string' && raw.thumbnailKey ? { thumbnailKey: raw.thumbnailKey } : {}),
    documentBytes: n(raw.documentBytes),
    createdAt: s(raw.createdAt),
    updatedAt: s(raw.updatedAt),
  };
}

function project(raw: Record<string, unknown>): VectorProject {
  const parsed = parseVectorDoc(raw.document);
  // A document this build cannot read (newer version, corrupt): refuse to open it rather than edit a guess.
  if (!parsed.ok) throw new VectorApiError(200, 'vector_doc_unreadable', { message: parsed.error });
  return { ...summary(raw), document: parsed.doc };
}

export async function listVectorProjects(token: string, fetchImpl: FetchLike = fetch): Promise<VectorProjectSummary[]> {
  const body = await call(fetchImpl, base(), { method: 'GET' }, token);
  return Array.isArray(body.projects) ? (body.projects as Record<string, unknown>[]).map(summary) : [];
}

export async function createVectorProject(
  token: string,
  input: { name: string; document: VectorDoc },
  fetchImpl: FetchLike = fetch,
): Promise<VectorProject> {
  return project(await call(fetchImpl, base(), { method: 'POST', body: JSON.stringify({ name: input.name, document: input.document }) }, token));
}

export async function getVectorProject(token: string, id: string, fetchImpl: FetchLike = fetch): Promise<VectorProject> {
  return project(await call(fetchImpl, `${base()}/${encodeURIComponent(id)}`, { method: 'GET' }, token));
}

export interface VectorSavePatch {
  name?: string;
  document?: VectorDoc;
  /** The server-built key from the presign (or "" to clear). */
  thumbnailKey?: string;
}

/** Save with `If-Match: <revision>` (the revision the edit is based on). */
export async function saveVectorProject(
  token: string,
  id: string,
  revision: number,
  patch: VectorSavePatch,
  fetchImpl: FetchLike = fetch,
): Promise<VectorProject> {
  return project(
    await call(
      fetchImpl,
      `${base()}/${encodeURIComponent(id)}`,
      { method: 'PUT', headers: { 'If-Match': String(revision) }, body: JSON.stringify(patch) },
      token,
    ),
  );
}

export async function deleteVectorProject(
  token: string,
  id: string,
  fetchImpl: FetchLike = fetch,
): Promise<{ deleted: { objects: number; bytes: number }; pending: number }> {
  const body = await call(fetchImpl, `${base()}/${encodeURIComponent(id)}`, { method: 'DELETE' }, token);
  const deleted = (body.deleted ?? {}) as { objects?: number; bytes?: number };
  return { deleted: { objects: deleted.objects ?? 0, bytes: deleted.bytes ?? 0 }, pending: typeof body.pending === 'number' ? body.pending : 0 };
}

/** MM43 thumbnail cap (512 KB). */
export const VECTOR_THUMBNAIL_MAX_BYTES = 512 * 1024;

export interface ThumbnailPresign {
  uploadUrl: string;
  thumbnailKey: string;
  contentType: string;
  maxBytes: number;
  expiresAt: string;
}

export async function presignVectorThumbnail(token: string, id: string, sizeBytes: number, fetchImpl: FetchLike = fetch): Promise<ThumbnailPresign> {
  const body = await call(
    fetchImpl,
    `${base()}/${encodeURIComponent(id)}/thumbnail`,
    { method: 'POST', body: JSON.stringify({ sizeBytes, contentType: 'image/png' }) },
    token,
  );
  const s = (v: unknown) => (typeof v === 'string' ? v : '');
  return {
    uploadUrl: s(body.uploadUrl),
    thumbnailKey: s(body.thumbnailKey),
    contentType: s(body.contentType) || 'image/png',
    maxBytes: typeof body.maxBytes === 'number' ? body.maxBytes : VECTOR_THUMBNAIL_MAX_BYTES,
    expiresAt: s(body.expiresAt),
  };
}

/**
 * PUT the PNG to the presigned S3 URL. No auth headers (the URL is the
 * credential); the signature pins Content-Type and the exact length.
 */
export async function uploadVectorThumbnail(presign: ThumbnailPresign, png: Blob, fetchImpl: FetchLike = fetch): Promise<void> {
  let response: Response;
  try {
    response = await fetchImpl(presign.uploadUrl, { method: 'PUT', headers: { 'Content-Type': presign.contentType }, body: png });
  } catch {
    throw new VectorApiError(0, 'network');
  }
  if (!response.ok) throw new VectorApiError(response.status, 'thumbnail_upload_failed');
}
