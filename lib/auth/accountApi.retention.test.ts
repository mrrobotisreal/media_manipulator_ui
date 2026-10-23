import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/utils', async (orig) => ({ ...(await orig<typeof import('@/lib/utils')>()), getBaseURL: () => 'https://api.test/api' }));
vi.mock('@/lib/analytics/session', () => ({ getSessionId: () => 's1' }));
vi.mock('@/lib/analytics/identity', () => ({ getVisitorId: () => 'v1' }));

import {
  AccountApiError,
  deleteAccount,
  deleteAllData,
  deleteJob,
  deleteProject,
  exportData,
  fetchSettings,
  fetchStudioProjects,
  keepJobLonger,
  patchSettings,
  previewRetention,
  revokeSessions,
} from './accountApi';

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers });

function stub(res: Response) {
  const fn = vi.fn(async () => res);
  vi.stubGlobal('fetch', fn);
  return fn;
}
const call = (fn: ReturnType<typeof vi.fn>) => {
  const [url, init] = fn.mock.calls[0] as unknown as [string, RequestInit];
  return { url, init, headers: init.headers as Record<string, string> };
};

afterEach(() => vi.unstubAllGlobals());

describe('accountApi retention client', () => {
  it('fetchSettings sends the bearer token', async () => {
    const fn = stub(json({ retentionHours: 4320 }));
    await fetchSettings('tok');
    const c = call(fn);
    expect(c.url).toBe('https://api.test/api/account/settings');
    expect(c.headers.Authorization).toBe('Bearer tok');
  });

  it('patchSettings PATCHes a JSON subset', async () => {
    const fn = stub(json({ retentionHours: 24, restamped: 3 }));
    const out = await patchSettings('tok', { retentionHours: 24 });
    const c = call(fn);
    expect(c.init.method).toBe('PATCH');
    expect(c.init.body).toBe('{"retentionHours":24}');
    expect(out.restamped).toBe(3);
  });

  it('previewRetention hits the preview route', async () => {
    const fn = stub(json({ wouldDelete: { results: 2, projects: 1, other: 0, bytes: 5 }, earliestDeletionAt: null }));
    const out = await previewRetention('tok', 168);
    expect(call(fn).url).toBe('https://api.test/api/account/settings/preview?retentionHours=168');
    expect(out.wouldDelete.results).toBe(2);
  });

  it('deleteJob and deleteProject use DELETE on their routes', async () => {
    let fn = stub(json({ deleted: { objects: 1, bytes: 2 }, pending: 0 }));
    await deleteJob('tok', 'job/1');
    expect(call(fn).url).toBe('https://api.test/api/jobs/job%2F1');
    expect(call(fn).init.method).toBe('DELETE');
    fn = stub(json({ deleted: { objects: 1, bytes: 2 }, pending: 0 }));
    await deleteProject('tok', 'p1');
    expect(call(fn).url).toBe('https://api.test/api/studio/projects/p1');
  });

  it('keepJobLonger sends keepForHours and surfaces nothing_to_keep', async () => {
    let fn = stub(json({ keepForHours: 168, expiresAt: 'x', keptLonger: true, updated: 1 }));
    await keepJobLonger('tok', 'j1', 168);
    expect(call(fn).url).toBe('https://api.test/api/jobs/j1/retention');
    expect(call(fn).init.body).toBe('{"keepForHours":168}');
    fn = stub(json({ error: 'nothing_to_keep', message: 'gone' }, 409));
    await expect(keepJobLonger('tok', 'j1', 168)).rejects.toMatchObject({ status: 409, code: 'nothing_to_keep' });
  });

  it('deleteAllData posts the confirm string', async () => {
    const fn = stub(json({ deleted: { objects: 0, bytes: 0, projects: 0, jobs: 0 }, pending: 0 }));
    await deleteAllData('tok', 'DELETE');
    expect(call(fn).url).toBe('https://api.test/api/account/data/delete-all');
    expect(call(fn).init.body).toBe('{"confirm":"DELETE"}');
  });

  it('exportData returns the blob and the server file name; 429 carries retryAfterSeconds', async () => {
    stub(new Response('zip', { status: 200, headers: { 'Content-Disposition': 'attachment; filename="mm-data-export-2026-10-23.zip"' } }));
    const out = await exportData('tok');
    expect(out.fileName).toBe('mm-data-export-2026-10-23.zip');
    expect(out.blob.size).toBe(3);
    stub(json({ error: 'export_rate_limited', retryAfterSeconds: 90 }, 429, { 'Retry-After': '90' }));
    const err = await exportData('tok').catch((e) => e);
    expect(err).toBeInstanceOf(AccountApiError);
    expect(err).toMatchObject({ status: 429, code: 'export_rate_limited', retryAfterSeconds: 90 });
  });

  it('deleteAccount surfaces reauth_required and a retryable 502 report', async () => {
    stub(json({ error: 'reauth_required', message: 'again' }, 401));
    await expect(deleteAccount('tok', 'DELETE MY ACCOUNT')).rejects.toMatchObject({ status: 401, code: 'reauth_required' });
    const report = { status: 'incomplete', steps: [{ step: 'stripe', status: 'ok' }], deleted: {}, stripe: 'ok', analytics: 'ok', retryable: true };
    stub(json(report, 502));
    const err = await deleteAccount('tok', 'DELETE MY ACCOUNT').catch((e) => e);
    expect(err.status).toBe(502);
    expect(err.retryable).toBe(true);
    expect(err.report.steps).toHaveLength(1);
  });

  it('revokeSessions and fetchStudioProjects', async () => {
    let fn = stub(json({ revokedAt: 'now' }));
    await revokeSessions('tok');
    expect(call(fn).url).toBe('https://api.test/api/account/sessions/revoke');
    fn = stub(json({ projects: [{ id: 'p', name: 'n' }] }));
    expect(await fetchStudioProjects('tok')).toHaveLength(1);
    stub(json({}));
    expect(await fetchStudioProjects('tok')).toEqual([]);
  });
});
