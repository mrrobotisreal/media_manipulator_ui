import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { FakeIDBFactory } from '@/lib/vector/testing/fakeIndexedDb';
import { listUserPresets, saveUserPreset } from '@/lib/photo/presets/userStore';
import { usePhotoStore } from '@/lib/photo/photoStore';
import { newPhotoDoc } from '@/lib/photo/photoTypes';
import { useSnapshotStore } from '@/lib/photo/history';
import { setMm99Listener } from '@/lib/photo/seams';
import { SHORTCUTS } from '@/lib/photo/shortcuts';
import type { BatchDeps } from '@/lib/photo/batch';
import type { PhotoCapabilities } from '@/lib/photo/projectsApi';
import { Wrap } from './test-utils';
import { DetailPanel } from './panels/detail-panel';
import { PresetsPanel } from './panels/presets-panel';
import { HistoryPanel } from './panels/history-panel';
import { LayersPanel } from './layers-panel';
import { ShortcutsSheet } from './shortcuts-sheet';
import { ExportDialog } from './export-dialog';
import { PhotoSessionProvider, type PhotoSession } from './session-context';

vi.mock('next/navigation', () => ({ usePathname: () => '/photo/x', useRouter: () => ({ push: vi.fn() }) }));

const original = globalThis.indexedDB;
beforeEach(() => {
  localStorage.clear();
  (globalThis as { indexedDB: unknown }).indexedDB = new FakeIDBFactory();
  usePhotoStore.getState().load('p', newPhotoDoc(400, 300), 'Test');
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
});
afterEach(() => {
  cleanup();
  usePhotoStore.getState().close();
  useSnapshotStore.getState().clear();
  (globalThis as { indexedDB: unknown }).indexedDB = original;
  vi.unstubAllGlobals();
});

const layers = () => usePhotoStore.getState().doc!.layers;
const session = (over: Partial<PhotoSession> = {}): PhotoSession => ({
  projectId: null, signedIn: false, capabilities: null, source: { width: 400, height: 300 }, currentFile: () => null, thumb: null, histogram: null,
  requestPick: () => undefined, picked: null, keepLocalMask: () => undefined, onHealed: async () => undefined, ...over,
});
const thumb = () => {
  const data = new Float32Array(8 * 6 * 4);
  for (let i = 0; i < 48; i += 1) data.set([0.8, 0.3, 0.2, 1], i * 4);
  return { width: 8, height: 6, data };
};

describe('detail panel', () => {
  it('creates one layer of its type on first touch and edits it in place', () => {
    render(<Wrap><DetailPanel /></Wrap>);
    const amount = screen.getAllByRole('spinbutton', { name: 'Amount' })[0];
    fireEvent.change(amount, { target: { value: '200' } });
    expect(layers().filter((l) => l.type === 'sharpen')).toHaveLength(1);
    fireEvent.change(amount, { target: { value: '250' } });
    const s = layers().filter((l) => l.type === 'sharpen');
    expect(s).toHaveLength(1);
    expect((s[0].params as { amount: number }).amount).toBe(250);
  });
  it('"Judge at 100%" zooms the canvas to 100%', () => {
    const zoom100 = vi.fn();
    render(<Wrap><PhotoSessionProvider value={session({ zoom100 })}><DetailPanel /></PhotoSessionProvider></Wrap>);
    fireEvent.click(screen.getByTestId('detail-zoom100'));
    expect(zoom100).toHaveBeenCalled();
  });
});

describe('presets panel', () => {
  it('lists the built-ins; applying one appends its layers as one group and reports the seam', () => {
    const seen: [string, string][] = [];
    const off = setMm99Listener({ onPresetApplied: (id, sc) => seen.push([id, sc]) });
    render(<Wrap><PhotoSessionProvider value={session({ thumb: thumb() })}><PresetsPanel /></PhotoSessionProvider></Wrap>);
    expect(screen.getByTestId('preset-grid').querySelectorAll('button')).toHaveLength(19);
    fireEvent.click(screen.getByTestId('preset-vivid'));
    expect(layers()).toHaveLength(2);
    expect(layers().every((l) => l.group === 'Preset: Vivid')).toBe(true);
    fireEvent.click(screen.getByTestId('preset-vintage'));
    expect(layers()).toHaveLength(5);
    expect(new Set(layers().map((l) => l.group))).toEqual(new Set(['Preset: Vivid', 'Preset: Vintage']));
    expect(seen).toEqual([['vivid', 'builtin'], ['vintage', 'builtin']]);
    expect(usePhotoStore.getState().past.map((e) => e.label)).toEqual(['Preset|builtin:vivid', 'Preset|builtin:vintage']);
    off();
  });

  it('Auto is disabled until a histogram exists and then writes explicit levels + white balance', () => {
    const { rerender } = render(<Wrap><PhotoSessionProvider value={session()}><PresetsPanel /></PhotoSessionProvider></Wrap>);
    expect((screen.getByTestId('preset-auto') as HTMLButtonElement).disabled).toBe(true);
    const bins = (v: number) => { const a = new Uint32Array(256); a[v] = 1000; return a; };
    const h = { r: bins(120), g: bins(100), b: bins(80), luma: bins(100), max: 1000 };
    rerender(<Wrap><PhotoSessionProvider value={session({ histogram: h })}><PresetsPanel /></PhotoSessionProvider></Wrap>);
    fireEvent.click(screen.getByTestId('preset-auto'));
    expect(layers().map((l) => l.type)).toEqual(['levels', 'whiteBalance']);
  });

  it('saves the current stack as a user preset, lists it, exports, deletes and re-imports it', async () => {
    render(<Wrap><PhotoSessionProvider value={session({ thumb: thumb() })}><PresetsPanel /></PhotoSessionProvider></Wrap>);
    fireEvent.click(screen.getByTestId('preset-vivid'));
    fireEvent.click(screen.getByTestId('preset-save-open'));
    fireEvent.change(screen.getByLabelText('Preset name'), { target: { value: 'My look' } });
    fireEvent.click(screen.getByTestId('preset-save-confirm'));
    await waitFor(() => expect(screen.getByTestId('my-presets').textContent).toContain('My look'));
    expect(screen.getByText('Saved in this browser.')).toBeTruthy();
    // apply the user preset: appended under a "Preset: My look" group
    fireEvent.click(screen.getByText('My look'));
    expect(layers().some((l) => l.group === 'Preset: My look')).toBe(true);
    fireEvent.click(screen.getAllByLabelText('Delete preset')[0]);
    await waitFor(() => expect(screen.queryByTestId('my-presets')?.textContent ?? '').not.toContain('My look'));
  });
});

describe('history panel', () => {
  it('shows labelled steps, jumps, takes snapshots (undoable jump) and clears', async () => {
    render(<Wrap><PhotoSessionProvider value={session({ thumb: thumb() })}><><PresetsPanel /><HistoryPanel /></></PhotoSessionProvider></Wrap>);
    fireEvent.click(screen.getByTestId('preset-vivid'));
    fireEvent.click(screen.getByTestId('preset-warm'));
    const list = screen.getByTestId('history-list');
    expect(list.textContent).toContain('Preset: Vivid');
    expect(list.textContent).toContain('Preset: Warm');
    fireEvent.click(screen.getByTestId('snapshot-open'));
    fireEvent.click(screen.getByTestId('snapshot-confirm'));
    fireEvent.click(screen.getByTestId('history-step-1'));
    expect(layers()).toHaveLength(2);
    fireEvent.click(screen.getByTestId('history-step-0'));
    expect(layers()).toHaveLength(0);
    const snap = screen.getByTestId('snapshot-list').querySelector('button[data-testid^="snapshot-snap"]') as HTMLButtonElement;
    fireEvent.click(snap);
    expect(layers()).toHaveLength(4);
    usePhotoStore.getState().undo();
    expect(layers()).toHaveLength(0);
    fireEvent.click(screen.getByTestId('history-clear'));
    expect(usePhotoStore.getState().past).toHaveLength(0);
  });
});

describe('layers panel groups', () => {
  it('shows a collapsible "Preset" header over the group', () => {
    render(<Wrap><PhotoSessionProvider value={session({ thumb: thumb() })}><><PresetsPanel /><LayersPanel onOpenPanel={() => undefined} /></></PhotoSessionProvider></Wrap>);
    fireEvent.click(screen.getByTestId('preset-vivid'));
    const header = screen.getByTestId('layer-group-header');
    expect(header.textContent).toContain('Preset: Vivid');
    expect(document.querySelectorAll('[data-testid^="layer-row-"]')).toHaveLength(2);
    fireEvent.click(header.querySelector('button[aria-expanded]') as HTMLButtonElement);
    expect(document.querySelectorAll('[data-testid^="layer-row-"]')).toHaveLength(0);
  });
});

describe('shortcuts sheet', () => {
  it('lists every shortcut in the registry', () => {
    render(<Wrap><ShortcutsSheet open onOpenChange={() => undefined} /></Wrap>);
    for (const s of SHORTCUTS) expect(screen.getByTestId(`shortcut-${s.id}`), s.id).toBeTruthy();
    expect(document.querySelectorAll('[data-testid^="shortcut-"]')).toHaveLength(SHORTCUTS.length);
  });
});

describe('export dialog: size estimates and batch', () => {
  const caps = (over: Partial<PhotoCapabilities> = {}): PhotoCapabilities => ({ enabled: true, render: true, formats: ['jpg', 'png', 'webp', 'avif', 'tiff'], maxMegapixels: 12, photoProjects: 5, photoBatch: 3, aiMasks: false, heal: false, tier: 'free', ...over });
  const dlg = (c: PhotoCapabilities, extra: Partial<React.ComponentProps<typeof ExportDialog>> = {}) => (
    <Wrap>
      <ExportDialog open onOpenChange={() => undefined} doc={newPhotoDoc(4000, 3000)} projectName="P" projectId="p1" file={null} signedIn capabilities={c} originalFile={null} {...extra} />
    </Wrap>
  );

  it('shows bytes-per-megapixel estimates on every format and the estimate note', () => {
    render(dlg(caps()));
    // 12 MP at q92 JPEG ~ 0.45 MB/MP -> 5.4 MB
    expect(screen.getByTestId('format-jpg').textContent).toContain('5.4 MB');
    expect(screen.getByTestId('format-webp').textContent).toContain('3.6 MB');
    expect(screen.getByTestId('format-avif').textContent).toContain('2.4 MB');
    expect(screen.getByTestId('format-tiff').textContent).toContain('36.0 MB');
    expect(screen.getByTestId('export-estimate').textContent).toContain('estimate');
    fireEvent.click(screen.getByTestId('format-png'));
    expect(screen.getByTestId('export-estimate').textContent).toContain('12.0 MB to 30.0 MB');
  });

  it('anonymous batch cap 0 shows the sign-in line', () => {
    render(dlg(caps({ photoBatch: 0, tier: 'anonymous' }), { signedIn: false }));
    expect(screen.getByTestId('batch-signin')).toBeTruthy();
  });

  it('batch flow end to end with a fake backend: rows, ZIP button, limit message on 403', async () => {
    const deps: BatchDeps = {
      createProject: vi.fn(async (f: File) => ({ id: `id-${f.name}` })),
      startBatch: vi.fn(async (ids: string[]) => ids.map((id) => ({ projectId: id, jobId: `j-${id}` }))),
      jobStatus: vi.fn(async () => ({ status: 'completed' })),
      fetchResult: vi.fn(async () => new Blob(['x'])),
      sleep: vi.fn(async () => undefined),
    };
    render(dlg(caps({ photoBatch: 2 }), { batchDeps: deps }));
    const input = screen.getByTestId('batch-input');
    fireEvent.change(input, { target: { files: [new File(['1'], 'a.jpg'), new File(['2'], 'b.jpg'), new File(['3'], 'c.jpg')] } });
    await waitFor(() => expect(screen.getByTestId('batch-zip')).toBeTruthy());
    expect(deps.createProject).toHaveBeenCalledTimes(2);
    expect(deps.startBatch).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/left out because of your plan limit/)).toBeTruthy();
    expect(screen.getByTestId('batch-zip').textContent).toContain('2 photos');
  });

  it('403 photo_batch_limit from the server shows the neutral limit line', async () => {
    const { PhotoApiError } = await import('@/lib/photo/projectsApi');
    const deps: BatchDeps = {
      createProject: vi.fn(async (f: File) => ({ id: `id-${f.name}` })),
      startBatch: vi.fn(async () => { throw new PhotoApiError(403, 'photo_batch_limit', { limit: 3 }); }),
      jobStatus: vi.fn(async () => ({ status: 'completed' })),
      fetchResult: vi.fn(async () => new Blob(['x'])),
      sleep: vi.fn(async () => undefined),
    };
    const gated = vi.fn();
    render(dlg(caps({ photoBatch: 3 }), { batchDeps: deps, onBatchGated: gated }));
    fireEvent.change(screen.getByTestId('batch-input'), { target: { files: [new File(['1'], 'a.jpg')] } });
    await waitFor(() => expect(screen.getByTestId('batch-limit')).toBeTruthy());
    expect(gated).toHaveBeenCalledWith('limit');
  });
});

// MM103: the presets panel against the account (signed in) and the one-time migration prompt.
describe('presets panel: account presets (MM103)', () => {
  const layers1 = () => [{ id: 'a', type: 'exposure', name: undefined, enabled: true, opacity: 1, blend: 'normal', params: { ev: 0.5, gamma: 1, offset: 0 }, mask: null }];
  const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  const wire = (id: string, name: string) => ({ id, name, category: 'custom', revision: 1, hasThumbnail: false, layers: layers1(), createdAt: '2026-11-03T00:00:00Z', updatedAt: '2026-11-03T00:00:00Z' });

  it('signed in: lists, saves, renames and deletes against the server (IndexedDB untouched)', async () => {
    const calls: string[] = [];
    let server = [wire('s1', 'Server look')];
    vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
      const m = init?.method ?? 'GET';
      calls.push(`${m} ${String(url).replace(/^.*\/photo/, '/photo')}`);
      if (m === 'GET') return json(200, { presets: server, limit: 10, used: server.length });
      if (m === 'POST') {
        const b = JSON.parse(String(init?.body));
        server = [...server, wire('s2', b.name)];
        return json(201, wire('s2', b.name));
      }
      if (m === 'PUT') return json(200, { ...wire('s1', JSON.parse(String(init?.body)).name), revision: 2 });
      server = [];
      return json(200, { deleted: { objects: 1, bytes: 0 }, pending: 0 });
    }));
    render(<Wrap><PhotoSessionProvider value={session({ signedIn: true, thumb: thumb() })}><PresetsPanel /></PhotoSessionProvider></Wrap>);
    await waitFor(() => expect(screen.getByTestId('my-presets').textContent).toContain('Server look'));
    expect(screen.getByText('Saved to your account.')).toBeTruthy();
    // apply: the id is re-prefixed and grouped like any preset
    fireEvent.click(screen.getByText('Server look'));
    expect(layers().some((l) => l.group === 'Preset: Server look' && l.id.startsWith('preset-'))).toBe(true);
    // save current edits -> POST
    fireEvent.click(screen.getByTestId('preset-save-open'));
    fireEvent.change(screen.getByLabelText('Preset name'), { target: { value: 'Fresh' } });
    fireEvent.click(screen.getByTestId('preset-save-confirm'));
    await waitFor(() => expect(calls.some((c) => c.startsWith('POST /photo/presets'))).toBe(true));
    await waitFor(() => expect(screen.getByTestId('my-presets').textContent).toContain('Fresh'));
    // rename -> PUT
    fireEvent.click(screen.getAllByLabelText('Rename preset')[0]);
    const input = screen.getByDisplayValue('Server look');
    fireEvent.change(input, { target: { value: 'Renamed' } });
    fireEvent.blur(input);
    await waitFor(() => expect(calls.some((c) => c.startsWith('PUT /photo/presets/s1'))).toBe(true));
    // delete -> DELETE
    fireEvent.click(screen.getAllByLabelText('Delete preset')[0]);
    await waitFor(() => expect(calls.some((c) => c.startsWith('DELETE /photo/presets/'))).toBe(true));
    expect(await listUserPresets()).toEqual([]);
  });

  it('signed out: IndexedDB only, no network call', async () => {
    const f = vi.fn();
    vi.stubGlobal('fetch', f);
    render(<Wrap><PhotoSessionProvider value={session({ signedIn: false, thumb: thumb() })}><PresetsPanel /></PhotoSessionProvider></Wrap>);
    fireEvent.click(screen.getByTestId('preset-vivid'));
    fireEvent.click(screen.getByTestId('preset-save-open'));
    fireEvent.change(screen.getByLabelText('Preset name'), { target: { value: 'Local' } });
    fireEvent.click(screen.getByTestId('preset-save-confirm'));
    await waitFor(() => expect(screen.getByTestId('my-presets').textContent).toContain('Local'));
    expect(f).not.toHaveBeenCalled();
  });

  it('migration prompt: accept uploads and clears the browser; decline sets the flag once', async () => {
    await saveUserPreset({ name: 'Browser look', layers: layers1() as never });
    const posts: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (_u: string, init?: RequestInit) => {
      if ((init?.method ?? 'GET') === 'POST') {
        posts.push(JSON.parse(String(init?.body)).name);
        return json(201, wire('n1', 'Browser look'));
      }
      return json(200, { presets: [], limit: 10, used: 0 });
    }));
    const { unmount } = render(<Wrap><PhotoSessionProvider value={session({ signedIn: true })}><PresetsPanel /></PhotoSessionProvider></Wrap>);
    await waitFor(() => expect(screen.getByTestId('preset-migrate')).toBeTruthy());
    expect(screen.getByTestId('preset-migrate').textContent).toContain('Keep your 1 preset on your account?');
    const seen: [number, boolean][] = [];
    const off = setMm99Listener({ onPresetsMigrated: (c, d) => seen.push([c, d]) });
    fireEvent.click(screen.getByTestId('preset-migrate-accept'));
    await waitFor(() => expect(posts).toEqual(['Browser look']));
    await waitFor(() => expect(screen.queryByTestId('preset-migrate')).toBeNull());
    expect(await listUserPresets()).toEqual([]);
    expect(seen).toEqual([[1, false]]);
    off();
    unmount();
    cleanup();

    // decline: the browser keeps its presets, the flag is set and the prompt never returns
    await saveUserPreset({ name: 'Keep me', layers: layers1() as never });
    const seen2: [number, boolean][] = [];
    const off2 = setMm99Listener({ onPresetsMigrated: (c, d) => seen2.push([c, d]) });
    const again = render(<Wrap><PhotoSessionProvider value={session({ signedIn: true })}><PresetsPanel /></PhotoSessionProvider></Wrap>);
    await waitFor(() => expect(screen.getByTestId('preset-migrate')).toBeTruthy());
    fireEvent.click(screen.getByTestId('preset-migrate-decline'));
    await waitFor(() => expect(screen.queryByTestId('preset-migrate')).toBeNull());
    expect(seen2).toEqual([[1, true]]);
    expect((await listUserPresets()).map((p) => p.name)).toEqual(['Keep me']);
    again.unmount();
    render(<Wrap><PhotoSessionProvider value={session({ signedIn: true })}><PresetsPanel /></PhotoSessionProvider></Wrap>);
    await waitFor(() => expect(screen.getByTestId('my-presets')).toBeTruthy());
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.queryByTestId('preset-migrate')).toBeNull();
    off2();
  });

  it('JSON import goes to the server when signed in', async () => {
    const posts: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (_u: string, init?: RequestInit) => {
      if ((init?.method ?? 'GET') === 'POST') {
        posts.push(JSON.parse(String(init?.body)).name);
        return json(201, wire('i1', 'Imported'));
      }
      return json(200, { presets: [wire('x', 'Existing')], limit: 10, used: 1 });
    }));
    render(<Wrap><PhotoSessionProvider value={session({ signedIn: true })}><PresetsPanel /></PhotoSessionProvider></Wrap>);
    await waitFor(() => expect(screen.getByTestId('my-presets').textContent).toContain('Existing'));
    const file = new File([JSON.stringify({ format: 'aperture-presets', version: 1, presets: [{ id: 'p1', name: 'Imported', category: 'custom', layers: layers1(), createdAt: '2026-11-03T00:00:00Z' }] })], 'p.json', { type: 'application/json' });
    Object.defineProperty(file, 'text', { value: async () => JSON.stringify({ format: 'aperture-presets', version: 1, presets: [{ id: 'p1', name: 'Imported', category: 'custom', layers: layers1(), createdAt: '2026-11-03T00:00:00Z' }] }) });
    fireEvent.change(screen.getByTestId('preset-import-input'), { target: { files: [file] } });
    await waitFor(() => expect(posts).toEqual(['Imported']));
  });
});
