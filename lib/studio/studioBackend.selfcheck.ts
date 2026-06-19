import { createMmBackend, createCreatvBackend } from '@/lib/studio/studioBackend';
import { isOriginAllowed, parseAllowedOrigins } from '@/lib/studio/embedProtocol';

/**
 * studioBackend contract self-check.
 *
 * No test runner is configured in this repo, so this is an importable, env-free
 * assertion of the two invariants that matter for the embed work:
 *
 *  1. The MM backend produces the EXACT URLs/bodies the studio hooks built
 *     before the StudioBackend abstraction existed (so the standalone site is
 *     byte-identical).
 *  2. The CreaTV backend maps the shared request shapes onto the
 *     /darkroom/studio/* envelope (snake_case user_id/channel_id, draftId key,
 *     assetId echo) correctly.
 *
 * Call runStudioBackendSelfCheck() from a dev console / future test to verify.
 * Asserts here avoid env-dependent calls (getSessionId reads IndexedDB) so it
 * can run anywhere.
 */
function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(`studioBackend contract: ${msg}`);
}

export function runStudioBackendSelfCheck(): { ok: true } {
  // --- MM backend: byte-identical to pre-abstraction requests ---
  const mm = createMmBackend();
  const base = mm.baseUrl;

  assert(mm.ecosystem === 'mm', 'mm ecosystem');
  assert(mm.path('/projects') === `${base}/studio/projects`, 'mm list/create projects path');
  assert(mm.path('/projects/p1') === `${base}/studio/projects/p1`, 'mm get/save project path');
  assert(mm.path('/projects/p1/assets') === `${base}/studio/projects/p1/assets`, 'mm assets path');
  assert(mm.path('/assets/presign') === `${base}/studio/assets/presign`, 'mm presign path');
  assert(mm.path('/assets/complete') === `${base}/studio/assets/complete`, 'mm complete path');
  assert(mm.path('/projects/p1/export') === `${base}/studio/projects/p1/export`, 'mm export path');
  assert(
    mm.path('/projects/p1/captions/generate') === `${base}/studio/projects/p1/captions/generate`,
    'mm captions path',
  );
  assert(mm.jobUrl('j1') === `${base}/job/j1`, 'mm job poll url');
  assert(mm.jobEventsUrl?.('j1') === `${base}/job/j1/events`, 'mm job sse url');
  assert(mm.downloadUrl('j1') === `${base}/download/j1`, 'mm download url');
  assert(mm.proxyUrl('a1') === `${base}/studio/assets/a1/proxy`, 'mm proxy url');
  assert(mm.spriteUrl('a1') === `${base}/studio/assets/a1/sprite`, 'mm sprite url');
  assert(mm.peaksUrl?.('a1') === `${base}/studio/assets/a1/peaks`, 'mm peaks url');
  assert(mm.assetFileUrl?.('a1') === `${base}/studio/assets/a1/file`, 'mm file url');
  assert(mm.scopeQuery() === '', 'mm scope query empty');
  assert(mm.capabilities.exportTarget === 'download' && !mm.capabilities.publish, 'mm capabilities');

  const createReq = { name: 'x', fps: 30, width: 1920, height: 1080 };
  assert(
    JSON.stringify(mm.adaptCreateProject(createReq)) === JSON.stringify(createReq),
    'mm create-project adapter is identity',
  );
  const saveReq = { name: 'x', fps: 30, width: 1920, height: 1080, tracks: [] };
  assert(
    JSON.stringify(mm.adaptSaveProject(saveReq)) === JSON.stringify(saveReq),
    'mm save-project adapter is identity',
  );
  const mmComplete = mm.adaptComplete({
    projectId: 'p1', s3Key: 'k', fileName: 'f.mp4', contentType: 'video/mp4', fileSizeBytes: 10,
  }) as Record<string, unknown>;
  assert(
    mmComplete.projectId === 'p1' && mmComplete.s3Key === 'k' && !('assetId' in mmComplete),
    'mm complete adapter shape',
  );
  assert(
    JSON.stringify(mm.adaptExport({ fileName: 'o.mp4', preset: 'high', loudness: 'streaming' })) ===
      JSON.stringify({ fileName: 'o.mp4', preset: 'high', loudness: 'streaming' }),
    'mm export adapter is identity',
  );

  // --- CreaTV backend: envelope mapping ---
  const cre = createCreatvBackend({
    apiBaseUrl: 'https://api.example.test/transcoding/',
    scope: { userId: 7, channelId: 99, draftId: 1234 },
    getToken: () => 'tok',
  });
  const cbase = 'https://api.example.test/transcoding';
  assert(cre.baseUrl === cbase, 'creatv base trims trailing slash');
  assert(cre.path('/projects') === `${cbase}/darkroom/studio/projects`, 'creatv projects path');
  assert(cre.path('/projects/1234/export') === `${cbase}/darkroom/studio/projects/1234/export`, 'creatv export path');
  assert(cre.scopeQuery() === '?user_id=7&channel_id=99', 'creatv scope query');
  assert(cre.jobUrl('j1') === `${cbase}/darkroom/studio/jobs/j1?user_id=7&channel_id=99`, 'creatv job url');
  assert(cre.jobEventsUrl === undefined, 'creatv has no SSE');
  assert(cre.proxyUrl('a1') === `${cbase}/darkroom/studio/assets/a1/proxy`, 'creatv proxy url');
  assert(cre.spriteUrl('a1') === `${cbase}/darkroom/studio/assets/a1/sprite`, 'creatv sprite url');
  assert(cre.peaksUrl?.('a1') === `${cbase}/darkroom/studio/assets/a1/peaks`, 'creatv peaks url (v2)');
  assert(cre.assetFileUrl?.('a1') === `${cbase}/darkroom/studio/assets/a1/file`, 'creatv LUT file url (v2)');
  assert(
    cre.capabilities.exportTarget === 'draft' &&
      cre.capabilities.publish &&
      cre.capabilities.captions &&
      cre.capabilities.peaks &&
      cre.capabilities.lut,
    'creatv capabilities (full v2)',
  );
  assert(JSON.stringify(cre.authHeaders()) === JSON.stringify({ Authorization: 'Bearer tok' }), 'creatv auth header');

  const cCreate = cre.adaptCreateProject(createReq) as Record<string, unknown>;
  assert(cCreate.user_id === 7 && cCreate.channel_id === 99 && cCreate.name === 'x', 'creatv create envelope');
  const cPresign = cre.adaptPresign({ projectId: '1234', fileName: 'f.mp4', contentType: 'video/mp4', fileSizeBytes: 10 }) as Record<string, unknown>;
  assert(cPresign.draftId === 1234 && cPresign.user_id === 7 && cPresign.channel_id === 99, 'creatv presign envelope');
  const cComplete = cre.adaptComplete({ projectId: '1234', s3Key: 'k', fileName: 'f.mp4', contentType: 'video/mp4', fileSizeBytes: 10, assetId: 'A1' }) as Record<string, unknown>;
  assert(cComplete.assetId === 'A1' && cComplete.draftId === 1234, 'creatv complete echoes assetId + draftId');
  const cExport = cre.adaptExport({ fileName: 'o.mp4', preset: 'high', loudness: 'streaming' }) as Record<string, unknown>;
  assert(cExport.user_id === 7 && cExport.fileName === 'o.mp4' && cExport.loudness === 'streaming', 'creatv export envelope carries loudness');
  assert(cre.parseExport({ job_id: 'JX' }).jobId === 'JX', 'creatv export parses job_id alias');

  // --- Origin allowlist: scheme-tolerant matching (the env footgun) ---
  // event.origin always has a scheme; a scheme-less env value must still match.
  const schemeless = parseAllowedOrigins('creatv.io www.creatv.io localhost:8080', []);
  assert(isOriginAllowed('http://localhost:8080', schemeless), 'scheme-less localhost matches http origin');
  assert(isOriginAllowed('https://creatv.io', schemeless), 'scheme-less host matches https origin');
  assert(isOriginAllowed('https://localhost:8080', schemeless), 'scheme-less host matches https variant');
  assert(!isOriginAllowed('https://evil.example', schemeless), 'unlisted origin rejected');
  // Comma OR space delimited both parse.
  assert(parseAllowedOrigins('a.io, b.io', []).length === 2, 'comma-delimited allowlist parses');
  // Full scheme entries match exactly.
  const full = parseAllowedOrigins('https://creatv.io', []);
  assert(isOriginAllowed('https://creatv.io', full), 'full https entry matches');
  assert(!isOriginAllowed('http://creatv.io', full), 'full https entry does NOT match http (strict)');

  return { ok: true };
}
