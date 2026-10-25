import { afterEach, describe, expect, it, vi } from 'vitest';

import { deleteVectorProject, fetchVectorProjects } from './accountApi';

afterEach(() => vi.unstubAllGlobals());

function stubFetch(body: unknown) {
  const f = vi.fn(async () => new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } }));
  vi.stubGlobal('fetch', f);
  return f;
}

describe('vector project account API', () => {
  it('fetchVectorProjects GETs /vector/projects with the bearer token', async () => {
    const f = stubFetch({ projects: [{ id: 'v1', name: 'Logo' }] });
    const out = await fetchVectorProjects('tok');
    expect(out).toHaveLength(1);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/vector\/projects$/);
    expect(JSON.stringify(init.headers)).toContain('Bearer tok');
  });

  it('deleteVectorProject DELETEs the encoded id', async () => {
    const f = stubFetch({ deleted: { objects: 1, bytes: 2 }, pending: 0 });
    await deleteVectorProject('tok', 'v 1');
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/vector\/projects\/v%201$/);
    expect(init.method).toBe('DELETE');
  });
});
