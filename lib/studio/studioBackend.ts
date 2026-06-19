import {
  studioProjectSchema,
  studioAssetSchema,
  studioAssetPresignResponseSchema,
  studioAssetCompleteResponseSchema,
  type StudioProject,
  type StudioAsset,
  type StudioCreateProjectRequest,
  type StudioSaveProjectRequest,
  type StudioAssetCompleteResponse,
  type StudioExportRequest,
} from '@/lib/studioTypes';
import { getBaseURL } from '@/lib/utils';
import { getSessionId } from '@/lib/firstPartyAnalytics';

/**
 * StudioBackend — the pluggable transport the Content Studio editor talks to.
 *
 * The standalone Media-Manipulator site uses `createMmBackend()` (the default):
 * `getBaseURL()` + the `X-MM-Session-ID` header, exactly as the hooks did before
 * this abstraction existed. When the editor is embedded inside CreaTV's Darkroom
 * (the iframe at /embed/content-studio) it uses `createCreatvBackend()` instead,
 * which targets CreaTV's `/darkroom/studio/*` API with a Supabase bearer token
 * and maps the snake_case `video_drafts` envelope onto the shared EDL contract.
 *
 * The EDL itself (lib/studioTypes.ts) is identical across ecosystems — only the
 * request/response envelope differs, and every one of those differences is
 * absorbed by the per-ecosystem adapters below so the hooks stay generic.
 */

// --- Live job progress (normalized across ecosystems) ----------------------
export interface StudioJobProgress {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  resultUrl?: string;
  error?: string;
}

// --- Adapter input shapes (ecosystem-neutral; hooks pass these) -------------
export interface PresignInput {
  projectId: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
}
export interface CompleteInput {
  projectId: string;
  s3Key: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  /** CreaTV presign returns an assetId that must be echoed back on complete. */
  assetId?: string;
}
export interface StudioPresignResult {
  uploadUrl: string;
  s3Key: string;
  bucket: string;
  expiresAt: string;
  /** CreaTV-only: the asset UUID the backend minted at presign time. */
  assetId?: string;
}

export interface StudioBackendCapabilities {
  /** 'download' = render → file download (MM). 'draft' = render attaches to a video_draft (CreaTV). */
  exportTarget: 'download' | 'draft';
  /** Job progress via SSE (/job/:id/events). CreaTV polls only. */
  supportsSSE: boolean;
  /** CreaTV-only: show the Publish button (hands off via cs:publish-request). */
  publish: boolean;
  /** Backend exposes captions/generate (hide the generate button if false). */
  captions: boolean;
  /** Backend serves /peaks (hide/skip waveforms if false). */
  peaks: boolean;
  /** Backend serves the LUT /file route (hide LUT effect picker if false). */
  lut: boolean;
}

export interface StudioBackendScope {
  userId?: number;
  channelId?: number;
  draftId?: number;
}

export interface StudioBackend {
  ecosystem: 'mm' | 'creatv';
  /** Base API origin (MM: getBaseURL(); CreaTV: VITE_TRANSCODING_API_URL). */
  baseUrl: string;
  /** Extra identity some endpoints require (CreaTV needs user_id/channel_id/draftId). */
  scope?: StudioBackendScope;
  capabilities: StudioBackendCapabilities;

  /** Build headers for a JSON studio request (auth only — callers add Content-Type). */
  authHeaders: () => Record<string, string>;
  /** Build the full URL for a studio path suffix (e.g. '/projects', '/assets/presign'). */
  path: (suffix: string) => string;
  /** Query string (incl. leading '?') some GET routes need; '' for MM. */
  scopeQuery: () => string;

  /** fetch wrapper. CreaTV attaches the bearer + does a one-shot 401→refresh retry. */
  fetch: (url: string, init?: RequestInit) => Promise<Response>;

  // Asset passthrough URLs (origin differs per ecosystem).
  proxyUrl: (assetId: string) => string;
  spriteUrl: (assetId: string) => string;
  peaksUrl?: (assetId: string) => string;
  /** Raw original-file passthrough used to load .cube LUT assets (MM only today). */
  assetFileUrl?: (assetId: string) => string;

  // Job watch + result download.
  jobUrl: (jobId: string) => string;
  /** SSE endpoint; undefined ⇒ poll only. */
  jobEventsUrl?: (jobId: string) => string;
  downloadUrl: (jobId: string) => string;

  // Request adapters (ecosystem-neutral input → wire body). Identity on MM.
  adaptCreateProject: (req: StudioCreateProjectRequest) => unknown;
  adaptSaveProject: (req: StudioSaveProjectRequest) => unknown;
  adaptPresign: (input: PresignInput) => unknown;
  adaptComplete: (input: CompleteInput) => unknown;
  adaptExport: (req: StudioExportRequest) => unknown;
  adaptCaptionsGenerate: (language?: string) => unknown;

  // Response parsers (wire JSON → shared EDL types). Validate with the zod schemas.
  parseProject: (json: unknown) => StudioProject;
  parseProjects: (json: unknown) => StudioProject[];
  parseAssets: (json: unknown) => StudioAsset[];
  parsePresign: (json: unknown) => StudioPresignResult;
  parseComplete: (json: unknown) => StudioAssetCompleteResponse;
  parseExport: (json: unknown) => { jobId: string };
  parseJob: (json: unknown) => StudioJobProgress;
}

// ---------------------------------------------------------------------------
// MM backend — the default. Byte-identical to the pre-abstraction behavior:
// getBaseURL() + X-MM-Session-ID, /studio/* paths, /job/:id(+/events),
// /download/:id, zod-validated responses, identity request adapters.
// ---------------------------------------------------------------------------
export function createMmBackend(): StudioBackend {
  const base = () => getBaseURL();
  return {
    ecosystem: 'mm',
    get baseUrl() {
      return base();
    },
    capabilities: {
      exportTarget: 'download',
      supportsSSE: true,
      publish: false,
      captions: true,
      peaks: true,
      lut: true,
    },
    authHeaders: () => ({ 'X-MM-Session-ID': getSessionId() }),
    path: (suffix) => `${base()}/studio${suffix}`,
    scopeQuery: () => '',
    fetch: (url, init) => fetch(url, init),

    proxyUrl: (assetId) => `${base()}/studio/assets/${assetId}/proxy`,
    spriteUrl: (assetId) => `${base()}/studio/assets/${assetId}/sprite`,
    peaksUrl: (assetId) => `${base()}/studio/assets/${assetId}/peaks`,
    assetFileUrl: (assetId) => `${base()}/studio/assets/${assetId}/file`,

    jobUrl: (jobId) => `${base()}/job/${jobId}`,
    jobEventsUrl: (jobId) => `${base()}/job/${jobId}/events`,
    downloadUrl: (jobId) => `${base()}/download/${jobId}`,

    adaptCreateProject: (req) => req,
    adaptSaveProject: (req) => req,
    adaptPresign: (input) => ({
      projectId: input.projectId,
      fileName: input.fileName,
      contentType: input.contentType,
      fileSizeBytes: input.fileSizeBytes,
      sessionId: getSessionId(),
    }),
    adaptComplete: (input) => ({
      projectId: input.projectId,
      s3Key: input.s3Key,
      fileName: input.fileName,
      contentType: input.contentType,
      fileSizeBytes: input.fileSizeBytes,
    }),
    adaptExport: (req) => req,
    adaptCaptionsGenerate: (language) => ({ language: language || undefined }),

    parseProject: (json) => studioProjectSchema.parse(json),
    parseProjects: (json) => {
      const parsed = (json ?? {}) as { projects?: unknown };
      const arr = Array.isArray(parsed.projects) ? parsed.projects : [];
      return arr.map((p) => studioProjectSchema.parse(p));
    },
    parseAssets: (json) => {
      const parsed = (json ?? {}) as { assets?: unknown };
      const arr = Array.isArray(parsed.assets) ? parsed.assets : [];
      return arr.map((a) => studioAssetSchema.parse(a));
    },
    parsePresign: (json) => studioAssetPresignResponseSchema.parse(json),
    parseComplete: (json) => studioAssetCompleteResponseSchema.parse(json),
    parseExport: (json) => {
      const j = (json ?? {}) as { jobId?: string };
      if (!j.jobId) throw new Error('export response missing jobId');
      return { jobId: j.jobId };
    },
    parseJob: (json) => {
      const d = (json ?? {}) as Partial<StudioJobProgress> & { status?: string };
      return {
        status: (d.status as StudioJobProgress['status']) || 'processing',
        progress: typeof d.progress === 'number' ? d.progress : 0,
        resultUrl: d.resultUrl,
        error: d.error,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// CreaTV backend — targets the existing /darkroom/studio/* API in the
// `transcoding` service. Maps the snake_case `video_drafts` envelope onto the
// shared EDL types. Auth is a Supabase bearer forwarded by the embed host via
// postMessage (Phase 3); the token is ONLY ever attached to requests to this
// backend's own baseUrl.
// ---------------------------------------------------------------------------
export interface CreatvBackendOptions {
  apiBaseUrl: string;
  scope: { userId: number; channelId: number; draftId: number };
  /** Returns the current Supabase access token (live ref — read per request). */
  getToken: () => string | null;
  /** Called on a 401: ask the host for a fresh token, resolve with it (or null). */
  requestToken?: () => Promise<string | null>;
  capabilities?: Partial<StudioBackendCapabilities>;
}

export function createCreatvBackend(opts: CreatvBackendOptions): StudioBackend {
  const { apiBaseUrl, scope, getToken, requestToken } = opts;
  const trimmedBase = apiBaseUrl.replace(/\/$/, '');
  const ownsUrl = (url: string) => url.startsWith(trimmedBase);
  const scopeQ = `?user_id=${scope.userId}&channel_id=${scope.channelId}`;

  const capabilities: StudioBackendCapabilities = {
    exportTarget: 'draft',
    supportsSSE: false,
    publish: true,
    // Full EDL v2 parity: the Darkroom backend now serves peaks + LUT /file and
    // exposes whisper caption generation.
    captions: true,
    peaks: true,
    lut: true,
    ...opts.capabilities,
  };

  const withAuth = (init: RequestInit | undefined, token: string | null): RequestInit => {
    const headers = new Headers(init?.headers);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return { ...init, headers };
  };

  return {
    ecosystem: 'creatv',
    baseUrl: trimmedBase,
    scope,
    capabilities,

    // Auth header is applied inside fetch() (so the 401-retry can replace it and
    // so it never leaks to non-baseUrl requests). authHeaders() is kept for
    // parity but returns the current token best-effort.
    authHeaders: (): Record<string, string> => {
      const t = getToken();
      return t ? { Authorization: `Bearer ${t}` } : {};
    },
    path: (suffix) => `${trimmedBase}/darkroom/studio${suffix}`,
    scopeQuery: () => scopeQ,

    fetch: async (url, init) => {
      // Security: only attach the CreaTV bearer to CreaTV's own API.
      if (!ownsUrl(url)) return fetch(url, init);
      const res = await fetch(url, withAuth(init, getToken()));
      if (res.status !== 401 || !requestToken) return res;
      const fresh = await requestToken();
      if (!fresh) return res;
      return fetch(url, withAuth(init, fresh));
    },

    proxyUrl: (assetId) => `${trimmedBase}/darkroom/studio/assets/${assetId}/proxy`,
    spriteUrl: (assetId) => `${trimmedBase}/darkroom/studio/assets/${assetId}/sprite`,
    peaksUrl: (assetId) => `${trimmedBase}/darkroom/studio/assets/${assetId}/peaks`,
    assetFileUrl: (assetId) => `${trimmedBase}/darkroom/studio/assets/${assetId}/file`,

    jobUrl: (jobId) => `${trimmedBase}/darkroom/studio/jobs/${jobId}${scopeQ}`,
    // jobEventsUrl undefined ⇒ poll only.
    downloadUrl: () => '', // CreaTV download is host-driven via useExportDraft.

    adaptCreateProject: (req) => ({
      user_id: scope.userId,
      channel_id: scope.channelId,
      name: req.name,
      fps: req.fps,
      width: req.width,
      height: req.height,
    }),
    adaptSaveProject: (req) => ({
      user_id: scope.userId,
      channel_id: scope.channelId,
      name: req.name,
      fps: req.fps,
      width: req.width,
      height: req.height,
      tracks: req.tracks,
      schemaVersion: req.schemaVersion,
      captions: req.captions,
      captionStyle: req.captionStyle,
      captionsEnabled: req.captionsEnabled,
      audio: req.audio,
    }),
    adaptPresign: (input) => ({
      draftId: scope.draftId,
      user_id: scope.userId,
      channel_id: scope.channelId,
      fileName: input.fileName,
      contentType: input.contentType,
      fileSizeBytes: input.fileSizeBytes,
    }),
    adaptComplete: (input) => ({
      assetId: input.assetId,
      draftId: scope.draftId,
      user_id: scope.userId,
      channel_id: scope.channelId,
      s3Key: input.s3Key,
      fileName: input.fileName,
      contentType: input.contentType,
      fileSizeBytes: input.fileSizeBytes,
    }),
    adaptExport: (req) => ({
      user_id: scope.userId,
      channel_id: scope.channelId,
      fileName: req.fileName,
      preset: req.preset,
      loudness: req.loudness,
    }),
    adaptCaptionsGenerate: (language) => ({
      user_id: scope.userId,
      channel_id: scope.channelId,
      language: language || undefined,
    }),

    parseProject: (json) => parseCreatvProject(json),
    parseProjects: (json) => {
      const arr = ((json ?? {}) as { projects?: unknown[] }).projects ?? [];
      return arr.map(parseCreatvProject);
    },
    parseAssets: (json) => {
      const arr = ((json ?? {}) as { assets?: unknown[] }).assets ?? [];
      return arr.map(parseCreatvAsset);
    },
    parsePresign: (json) => {
      const j = (json ?? {}) as Record<string, unknown>;
      return {
        uploadUrl: String(j.uploadUrl ?? ''),
        s3Key: String(j.s3Key ?? ''),
        bucket: String(j.bucket ?? ''),
        expiresAt: String(j.expiresAt ?? ''),
        assetId: j.assetId != null ? String(j.assetId) : undefined,
      };
    },
    parseComplete: (json) => {
      const j = (json ?? {}) as { asset?: unknown; jobId?: string };
      return {
        asset: parseCreatvAsset(j.asset),
        jobId: String(j.jobId ?? ''),
      };
    },
    parseExport: (json) => {
      const j = (json ?? {}) as { jobId?: string; job_id?: string };
      const jobId = j.jobId || j.job_id;
      if (!jobId) throw new Error('export response missing jobId');
      return { jobId };
    },
    parseJob: (json) => parseCreatvJob(json),
  };
}

// --- CreaTV envelope → shared EDL mappers ----------------------------------
function parseCreatvProject(json: unknown): StudioProject {
  const j = (json ?? {}) as Record<string, unknown>;
  const draftId = j.draftId ?? j.id;
  const mapped = {
    id: String(draftId ?? ''),
    name: typeof j.name === 'string' ? j.name : 'Untitled project',
    schemaVersion: typeof j.schemaVersion === 'number' && j.schemaVersion > 0 ? j.schemaVersion : 2,
    fps: typeof j.fps === 'number' ? j.fps : 30,
    width: typeof j.width === 'number' ? j.width : 1920,
    height: typeof j.height === 'number' ? j.height : 1080,
    durationSeconds: typeof j.durationSeconds === 'number' ? j.durationSeconds : 0,
    tracks: Array.isArray(j.tracks) ? j.tracks : [],
    // EDL v2 project-level fields round-trip identically across ecosystems.
    captions: Array.isArray(j.captions) ? j.captions : [],
    captionStyle: j.captionStyle != null ? j.captionStyle : undefined,
    captionsEnabled: typeof j.captionsEnabled === 'boolean' ? j.captionsEnabled : true,
    audio: j.audio != null ? j.audio : undefined,
    createdAt: typeof j.createdAt === 'string' ? j.createdAt : new Date(0).toISOString(),
    updatedAt: typeof j.updatedAt === 'string' ? j.updatedAt : new Date(0).toISOString(),
  };
  return studioProjectSchema.parse(mapped);
}

function parseCreatvAsset(json: unknown): StudioAsset {
  const j = (json ?? {}) as Record<string, unknown>;
  const draftId = j.draftId ?? j.projectId;
  const mapped = {
    id: String(j.id ?? ''),
    projectId: String(draftId ?? ''),
    originalFileName: String(j.originalFileName ?? ''),
    s3KeyOriginal: String(j.s3KeyOriginal ?? ''),
    s3KeyProxy: j.s3KeyProxy != null ? String(j.s3KeyProxy) : undefined,
    thumbnailSpriteUrl: j.thumbnailSpriteUrl != null ? String(j.thumbnailSpriteUrl) : undefined,
    mediaKind: j.mediaKind === 'audio' ? 'audio' : j.mediaKind === 'lut' ? 'lut' : 'video',
    durationSeconds: typeof j.durationSeconds === 'number' ? j.durationSeconds : 0,
    width: typeof j.width === 'number' ? j.width : undefined,
    height: typeof j.height === 'number' ? j.height : undefined,
    fps: typeof j.fps === 'number' ? j.fps : undefined,
    videoCodec: j.videoCodec != null ? String(j.videoCodec) : undefined,
    audioCodec: j.audioCodec != null ? String(j.audioCodec) : undefined,
    hasAudio: Boolean(j.hasAudio),
    sampleRate: typeof j.sampleRate === 'number' ? j.sampleRate : undefined,
    channels: typeof j.channels === 'number' ? j.channels : undefined,
    probeJson: j.probeJson ?? null,
    createdAt: typeof j.createdAt === 'string' ? j.createdAt : new Date(0).toISOString(),
  };
  return studioAssetSchema.parse(mapped);
}

function parseCreatvJob(json: unknown): StudioJobProgress {
  const j = (json ?? {}) as Record<string, unknown>;
  const rawStatus = String(j.status ?? 'processing');
  const status: StudioJobProgress['status'] =
    rawStatus === 'completed'
      ? 'completed'
      : rawStatus === 'failed' || rawStatus === 'cancelled'
        ? 'failed'
        : rawStatus === 'pending'
          ? 'pending'
          : 'processing';
  const progress =
    typeof j.progress === 'number'
      ? j.progress
      : typeof j.progress_percent === 'number'
        ? (j.progress_percent as number)
        : 0;
  return {
    status,
    progress,
    resultUrl: typeof j.resultUrl === 'string' && j.resultUrl ? j.resultUrl : undefined,
    error: typeof j.error === 'string' && j.error ? j.error : undefined,
  };
}

// ---------------------------------------------------------------------------
// Module-level active backend — read by the pure (non-React) URL builders in
// previewEngine.ts. The provider keeps this in sync so the WebGL decoder pool,
// waveforms, and LUT loads hit the correct origin. Defaults to MM so the
// standalone site (and any code path that runs before a provider mounts) is
// unchanged.
// ---------------------------------------------------------------------------
let activeBackend: StudioBackend | null = null;
export function setActiveStudioBackend(backend: StudioBackend): void {
  activeBackend = backend;
}
export function getActiveStudioBackend(): StudioBackend {
  // Lazy default so the pure URL builders (previewEngine) work before any
  // provider mounts and on the standalone MM site.
  if (!activeBackend) activeBackend = createMmBackend();
  return activeBackend;
}
