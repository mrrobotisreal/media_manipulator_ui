import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { usePhotoStore } from '@/lib/photo/photoStore';
import { useToolStore } from '@/lib/photo/toolStore';
import { healStrokesRef } from './heal-session';
import { HealStrokes } from '@/lib/photo/healOps';
import { geometrySchema, newPhotoDoc } from '@/lib/photo/photoTypes';
import { maskOfLayer } from '@/lib/photo/maskOps';
import type { HealDeps } from '@/lib/photo/healFlow';
import { Wrap } from './test-utils';
import { PhotoSessionProvider, type PhotoSession } from './session-context';
import { MasksPanel } from './masks/masks-panel';
import { GeometryPanel } from './panels/geometry-panel';
import { HealPanel } from './panels/heal-panel';
import { RedEyePanel } from './panels/redeye-panel';
import { ToolOverlay } from './tool-overlay';
import { LayersPanel } from './layers-panel';

vi.mock('next/navigation', () => ({ usePathname: () => '/photo/x', useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/components/quota-chip', () => ({ default: () => <div data-testid="quota-chip-mock" /> }));

const session = (over: Partial<PhotoSession> = {}): PhotoSession => ({
  projectId: 'p1',
  signedIn: true,
  capabilities: { enabled: true, render: true, formats: [], maxMegapixels: 12, photoProjects: 5, photoBatch: 0, aiMasks: true, heal: true, tier: 'free' },
  source: { width: 400, height: 300 },
  currentFile: () => ({ blob: new Blob(['x']), name: 'a.jpg' }),
  thumb: null,
  histogram: null,
  requestPick: vi.fn(),
  picked: null,
  keepLocalMask: vi.fn(),
  onHealed: vi.fn(async () => undefined),
  ...over,
});
const wrap = (ui: React.ReactNode, s = session()) => (
  <Wrap>
    <PhotoSessionProvider value={s}>{ui}</PhotoSessionProvider>
  </Wrap>
);

beforeEach(() => {
  usePhotoStore.getState().load('p', newPhotoDoc(400, 300), 'T');
  useToolStore.setState({ tool: 'none', maskLayerId: null, component: -1, maskView: 'off' });
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
});
afterEach(() => {
  cleanup();
  usePhotoStore.getState().close();
  healStrokesRef.strokes = null;
  vi.unstubAllGlobals();
});

describe('Masks panel', () => {
  it('"Add local adjustment" creates the three-layer combo on one named mask and arms the brush', () => {
    render(wrap(<MasksPanel />));
    fireEvent.click(screen.getByTestId('add-local'));
    const d = usePhotoStore.getState().doc!;
    expect(d.layers.map((l) => l.type)).toEqual(['exposure', 'tone', 'vibranceSaturation']);
    expect(new Set(d.layers.map((l) => (l.mask as { ref: string }).ref)).size).toBe(1);
    expect(Object.keys(d.masks ?? {})).toHaveLength(1);
    expect(useToolStore.getState().tool).toBe('brush');
    expect(usePhotoStore.getState().past).toHaveLength(1);
  });

  it('adds each parametric kind from the menu, with mode and props editable', () => {
    usePhotoStore.getState().mutate('seed', (d) => ({ ...d, layers: [{ id: 'e', type: 'exposure', enabled: true, opacity: 1, blend: 'normal', mask: null, params: { ev: 1, offset: 0, gamma: 1 } } as never] }), 'e');
    useToolStore.getState().setMaskLayer('e');
    render(wrap(<MasksPanel />));
    for (const kind of ['Linear gradient', 'Radial', 'Luminosity range', 'Color range']) {
      fireEvent.click(screen.getByTestId('add-mask'));
      fireEvent.click(screen.getByRole('menuitem', { name: kind }));
    }
    const m = maskOfLayer(usePhotoStore.getState().doc!, 'e')!;
    expect(m.components.map((c) => c.kind)).toEqual(['gradient', 'radial', 'luminosity', 'colorRange']);
    fireEvent.change(screen.getAllByLabelText('How this component combines')[0], { target: { value: 'subtract' } });
    expect(maskOfLayer(usePhotoStore.getState().doc!, 'e')!.components[0].mode).toBe('subtract');
    fireEvent.click(screen.getByRole('button', { name: 'Invert' }));
    expect(maskOfLayer(usePhotoStore.getState().doc!, 'e')!.invert).toBe(true);
  });

  it('"Select subject" posts to the route, installs a subject component and kicks the pixel load (fake fetch)', async () => {
    usePhotoStore.getState().mutate('seed', (d) => ({ ...d, layers: [{ id: 'e', type: 'exposure', enabled: true, opacity: 1, blend: 'normal', mask: null, params: { ev: 1, offset: 0, gamma: 1 } } as never] }), 'e');
    useToolStore.getState().setMaskLayer('e');
    const calls: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      calls.push(url);
      return new Response(JSON.stringify({ maskId: 'sm1', maskRef: 'masks/sm1.png', url: '/u', width: 10, height: 10 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }));
    // authedFetch needs auth plumbing; route it to global fetch for the test
    vi.doMock('@/lib/auth/authedFetch', () => ({ authedFetch: (u: string, i?: RequestInit) => fetch(u, i), QuotaExceededError: class extends Error {} }));
    render(wrap(<MasksPanel />));
    fireEvent.click(screen.getByTestId('add-mask'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Select subject' }));
    await waitFor(() => expect(maskOfLayer(usePhotoStore.getState().doc!, 'e')?.components[0]?.kind).toBe('subject'));
    expect(calls.some((u) => u.endsWith('/photo/projects/p1/masks/subject'))).toBe(true);
    const c = maskOfLayer(usePhotoStore.getState().doc!, 'e')!.components[0];
    expect(c.kind === 'subject' && c.maskRef).toBe('masks/sm1.png');
  });

  it('subject is disabled when capabilities say aiMasks is off', () => {
    usePhotoStore.getState().mutate('seed', (d) => ({ ...d, layers: [{ id: 'e', type: 'exposure', enabled: true, opacity: 1, blend: 'normal', mask: null, params: { ev: 1, offset: 0, gamma: 1 } } as never] }), 'e');
    render(wrap(<MasksPanel />, session({ capabilities: { enabled: true, render: true, formats: [], maxMegapixels: 12, photoProjects: 5, photoBatch: 0, aiMasks: false, heal: true, tier: 'free' } })));
    fireEvent.click(screen.getByTestId('add-mask'));
    expect((screen.getByRole('menuitem', { name: 'Select subject' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('the layer row opens the mask editor for that layer', () => {
    usePhotoStore.getState().mutate('seed', (d) => ({ ...d, layers: [{ id: 'e', type: 'exposure', enabled: true, opacity: 1, blend: 'normal', mask: null, params: { ev: 1, offset: 0, gamma: 1 } } as never] }), 'e');
    const open = vi.fn();
    render(wrap(<LayersPanel onOpenPanel={open} />));
    fireEvent.click(screen.getByTestId('layer-mask-open'));
    expect(open).toHaveBeenCalledWith('masks');
    expect(useToolStore.getState().maskLayerId).toBe('e');
  });
});

describe('Tool overlay', () => {
  const view = { zoom: 1, x: 0, y: 0 };
  const overlay = () =>
    render(wrap(<ToolOverlay view={view} iw={400} ih={300} wrap={{ getBoundingClientRect: () => ({ left: 0, top: 0 }) } as never} source={{ width: 400, height: 300 }} />));
  const drag = (el: HTMLElement, a: [number, number], b: [number, number]) => {
    fireEvent.pointerDown(el, { clientX: a[0], clientY: a[1], pointerId: 1 });
    fireEvent.pointerMove(el, { clientX: b[0], clientY: b[1], pointerId: 1 });
    fireEvent.pointerUp(el, { clientX: b[0], clientY: b[1], pointerId: 1 });
  };
  const seedLayer = () => {
    usePhotoStore.getState().mutate('seed', (d) => ({ ...d, layers: [{ id: 'e', type: 'exposure', enabled: true, opacity: 1, blend: 'normal', mask: null, params: { ev: 1, offset: 0, gamma: 1 } } as never] }), 'e');
    useToolStore.setState({ maskLayerId: 'e', component: -1 });
  };

  it('a gradient drag writes from/to normalized to the geometry space', () => {
    seedLayer();
    useToolStore.setState({ tool: 'gradient' });
    overlay();
    drag(screen.getByTestId('tool-overlay'), [200, 30], [200, 270]);
    const c = maskOfLayer(usePhotoStore.getState().doc!, 'e')!.components[0];
    expect(c.kind).toBe('gradient');
    if (c.kind === 'gradient') {
      expect(c.from).toEqual({ x: 0.5, y: 0.1 });
      expect(c.to).toEqual({ x: 0.5, y: 0.9 });
    }
  });

  it('a radial drag writes center and half-axes', () => {
    seedLayer();
    useToolStore.setState({ tool: 'radial' });
    overlay();
    drag(screen.getByTestId('tool-overlay'), [200, 150], [300, 210]);
    const c = maskOfLayer(usePhotoStore.getState().doc!, 'e')!.components[0];
    expect(c.kind === 'radial' && c.center).toEqual({ x: 0.5, y: 0.5 });
    expect(c.kind === 'radial' && c.rx).toBeCloseTo(0.25, 9);
    expect(c.kind === 'radial' && c.ry).toBeCloseTo(0.2, 9);
  });

  it('straighten line -> angle (a line tilted 5 degrees clockwise rotates the photo 5 counter-clockwise)', () => {
    useToolStore.setState({ tool: 'straighten' });
    overlay();
    const a = (5 * Math.PI) / 180;
    drag(screen.getByTestId('tool-overlay'), [50, 100], [50 + 300 * Math.cos(a), 100 + 300 * Math.sin(a)]);
    expect(usePhotoStore.getState().doc!.geometry.rotate).toBeCloseTo(-5, 1);
  });

  it('the crop rectangle respects aspect presets while a corner is dragged', async () => {
    useToolStore.setState({ tool: 'crop', aspect: '1:1' });
    usePhotoStore.getState().mutate('crop', (d) => ({ ...d, geometry: geometrySchema.parse({ crop: { x: 0.1, y: 0.1, width: 0.5, height: 0.5 } }) }));
    overlay();
    const h = screen.getByTestId('crop-handle-se');
    fireEvent.pointerDown(h, { clientX: 240, clientY: 180, pointerId: 1 });
    const root = screen.getByTestId('tool-overlay');
    fireEvent.pointerMove(root, { clientX: 320, clientY: 190, pointerId: 1 });
    fireEvent.pointerUp(root, { clientX: 320, clientY: 190, pointerId: 1 });
    await waitFor(() => expect(usePhotoStore.getState().doc!.geometry.crop).not.toBeNull());
    const c = usePhotoStore.getState().doc!.geometry.crop!;
    expect((c.width * 400) / (c.height * 300)).toBeCloseTo(1, 2);
  });

  it('perspective: dragging a corner writes the offset; zero offsets clear it', () => {
    useToolStore.setState({ tool: 'perspective' });
    overlay();
    const h = screen.getByTestId('persp-handle-tl');
    fireEvent.pointerDown(h, { clientX: 0, clientY: 0, pointerId: 1 });
    const root = screen.getByTestId('tool-overlay');
    fireEvent.pointerMove(root, { clientX: 40, clientY: 30, pointerId: 1 });
    fireEvent.pointerUp(root, { clientX: 40, clientY: 30, pointerId: 1 });
    const p = usePhotoStore.getState().doc!.geometry.perspective;
    expect(p?.tl.x).toBeCloseTo(0.1, 6);
    expect(p?.tl.y).toBeCloseTo(0.1, 6);
    expect(usePhotoStore.getState().past).toHaveLength(1); // one gesture, one undo entry
  });

  it('red-eye click adds a redEye layer with a radial mask at the click', () => {
    useToolStore.setState({ tool: 'redEye', redEyeRadius: 0.02 });
    overlay();
    fireEvent.pointerDown(screen.getByTestId('tool-overlay'), { clientX: 100, clientY: 75, pointerId: 1 });
    const l = usePhotoStore.getState().doc!.layers[0];
    expect(l.type).toBe('redEye');
    const c = maskOfLayer(usePhotoStore.getState().doc!, l.id)!.components[0];
    expect(c.kind === 'radial' && c.center).toEqual({ x: 0.25, y: 0.25 });
  });
});

describe('Geometry panel', () => {
  it('rotate 90 / flip buttons and the perspective auto-crop toggle edit the geometry', async () => {
    render(wrap(<GeometryPanel />));
    fireEvent.click(screen.getByRole('button', { name: 'Rotate 90 degrees right' }));
    expect(usePhotoStore.getState().doc!.geometry.rotate).toBe(90);
    fireEvent.click(screen.getByRole('button', { name: /Flip horizontal/ }));
    expect(usePhotoStore.getState().doc!.geometry.flipH).toBe(true);
    usePhotoStore.getState().mutate('p', (d) => ({ ...d, geometry: geometrySchema.parse({ rotate: 6 }) }));
    fireEvent.click(screen.getByRole('button', { name: 'Auto-crop to the largest rectangle' }));
    expect(usePhotoStore.getState().doc!.geometry.crop).not.toBeNull();
    expect(useToolStore.getState().autoCrop).toBe(true);
  });

  it('choosing 16:9 sets a crop of that pixel aspect', async () => {
    render(wrap(<GeometryPanel />));
    fireEvent.click(screen.getByRole('button', { name: '16:9' }));
    await waitFor(() => expect(usePhotoStore.getState().doc!.geometry.crop).not.toBeNull());
    const c = usePhotoStore.getState().doc!.geometry.crop!;
    expect((c.width * 400) / (c.height * 300)).toBeCloseTo(16 / 9, 2);
  });

  it('a crop move after a brush stroke re-maps the brush (one history entry)', async () => {
    const { makeBrushPng } = await import('@/lib/photo/goldens');
    const { setBrushComponent } = await import('@/lib/photo/maskOps');
    const { applyCropRemap } = await import('@/lib/photo/geometryOps');
    const png = makeBrushPng(8, 8, (x) => (x >= 4 ? 1 : 0));
    let d = usePhotoStore.getState().doc!;
    d = { ...d, layers: [{ id: 'e', type: 'exposure', enabled: true, opacity: 1, blend: 'normal', mask: null, params: { ev: 1, offset: 0, gamma: 1 } } as never] };
    d = setBrushComponent(d, 'e', png, 8, 8);
    const out = await applyCropRemap(d, { x: 0.5, y: 0, width: 0.5, height: 1 }, async (_rgba, w, h) => `data:image/png;base64,${btoa(`${w}x${h}`)}`, async (p) => (p === png ? { width: 8, height: 8, alpha: Array.from({ length: 64 }, (_, i) => (i % 8 >= 4 ? 255 : 0)) } : null));
    const c = maskOfLayer(out, 'e')!.components[0];
    expect(c.kind === 'brush' && c.png).not.toBe(png);
    expect(out.geometry.crop).toEqual({ x: 0.5, y: 0, width: 0.5, height: 1 });
  });
});

describe('Heal panel', () => {
  const deps = (over: Partial<HealDeps> = {}): HealDeps => ({
    startHeal: vi.fn(async () => 'job1'),
    waitForHeal: vi.fn(async (_id, o) => {
      o?.onProgress?.(50);
      return { baseHash: 'h1', baseRef: 'bases/h1.png', maskRef: 'masks/m1.png' };
    }),
    fetchHealResult: vi.fn(),
    ...over,
  });
  const strokes = () => {
    const s = new HealStrokes(geometrySchema.parse({}), 400, 300, 400, 300);
    s.addStroke([{ x: 0.5, y: 0.5 }], 20);
    healStrokesRef.strokes = s;
  };

  it('Heal posts the mask at base size, appends heals[] on completion and swaps the source; one history entry', async () => {
    strokes();
    const d = deps();
    const s = session();
    const encode = vi.fn(async (m: { width: number; height: number }) => {
      expect([m.width, m.height]).toEqual([400, 300]);
      return new Blob(['png'], { type: 'image/png' });
    });
    render(wrap(<HealPanel deps={d} encodeMask={encode} strokes={1} />, s));
    fireEvent.click(screen.getByTestId('heal-press'));
    await waitFor(() => expect(usePhotoStore.getState().doc!.heals).toHaveLength(1));
    expect(usePhotoStore.getState().doc!.heals[0]).toMatchObject({ baseRef: 'bases/h1.png', maskRef: 'masks/m1.png' });
    expect(s.onHealed).toHaveBeenCalledWith(expect.objectContaining({ baseRef: 'bases/h1.png' }));
    expect(d.startHeal).toHaveBeenCalledWith(expect.objectContaining({ projectId: 'p1', baseHash: undefined }));
    expect(healStrokesRef.strokes).toBeNull();
    // undo pops the entry (the editor swaps the source back from the doc)
    act(() => usePhotoStore.getState().undo());
    expect(usePhotoStore.getState().doc!.heals).toHaveLength(0);
  });

  it('guest heal uses the stateless route (no project id)', async () => {
    strokes();
    const d = deps({ waitForHeal: vi.fn(async () => ({})), fetchHealResult: vi.fn(async () => new Blob(['i'])) });
    const s = session({ projectId: null, signedIn: false });
    render(wrap(<HealPanel deps={d} encodeMask={async () => new Blob(['m'])} strokes={1} />, s));
    fireEvent.click(screen.getByTestId('heal-press'));
    await waitFor(() => expect(usePhotoStore.getState().doc!.heals).toHaveLength(1));
    expect(usePhotoStore.getState().doc!.heals[0].baseRef).toMatch(/^local:/);
    expect(d.startHeal).toHaveBeenCalledWith(expect.objectContaining({ projectId: null }));
  });

  it('a 429 does not change the doc and leaves the existing quota sheet to react (no inline failure text)', async () => {
    strokes();
    const quota = Object.assign(new Error('q'), { name: 'QuotaExceededError' });
    const d = deps({ startHeal: vi.fn(async () => { throw quota; }) });
    render(wrap(<HealPanel deps={d} encodeMask={async () => new Blob(['m'])} strokes={1} />));
    fireEvent.click(screen.getByTestId('heal-press'));
    await waitFor(() => expect(d.startHeal).toHaveBeenCalled());
    expect(usePhotoStore.getState().doc!.heals).toHaveLength(0);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByTestId('quota-chip-mock')).toBeTruthy();
  });

  it('is hidden when capabilities.heal is false', () => {
    render(wrap(<HealPanel strokes={0} />, session({ capabilities: { enabled: true, render: true, formats: [], maxMegapixels: 12, photoProjects: 5, photoBatch: 0, aiMasks: true, heal: false, tier: 'free' } })));
    expect(screen.getByTestId('panel-heal-off')).toBeTruthy();
  });
});

describe('Red-eye panel', () => {
  it('the radius slider writes the tool radius', () => {
    render(wrap(<RedEyePanel />));
    fireEvent.change(screen.getByLabelText('Radius (% of the long side)', { selector: 'input' }), { target: { value: '5' } });
    expect(useToolStore.getState().redEyeRadius).toBeCloseTo(0.05, 5);
  });
});
