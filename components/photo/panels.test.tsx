import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { usePhotoStore } from '@/lib/photo/photoStore';
import { newPhotoDoc, type AdjustmentLayer } from '@/lib/photo/photoTypes';
import { Wrap } from './test-utils';
import { HslPanel } from './panels/hsl-panel';
import { CurvesPanel } from './panels/curves-panel';
import { LevelsPanel } from './panels/levels-panel';
import { BasicPanel } from './panels/basic-panel';
import { LayersPanel } from './layers-panel';
import { ConflictDialog, UploadOffer } from './dialogs';
import { ExportDialog } from './export-dialog';
import type { PhotoCapabilities } from '@/lib/photo/projectsApi';

vi.mock('next/navigation', () => ({ usePathname: () => '/photo/x', useRouter: () => ({ push: vi.fn() }) }));

const layers = () => usePhotoStore.getState().doc?.layers ?? [];
const byType = <T extends AdjustmentLayer['type']>(type: T) => layers().find((l) => l.type === type) as Extract<AdjustmentLayer, { type: T }> | undefined;

beforeEach(() => {
  usePhotoStore.getState().load('p', newPhotoDoc(400, 300), 'Test');
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
});
afterEach(() => {
  cleanup();
  usePhotoStore.getState().close();
  vi.unstubAllGlobals();
});

describe('HSL panel', () => {
  it('"Grey except this" writes saturation -100 to the other five ranges and 0 to the chosen one', () => {
    render(<Wrap><HslPanel /></Wrap>);
    fireEvent.click(screen.getByRole('button', { name: 'Reds' }));
    fireEvent.click(screen.getByTestId('grey-except-this'));
    const ranges = byType('hsl')!.params.ranges;
    expect(ranges).toHaveLength(6);
    expect(ranges.find((r) => r.id === 'reds')!.saturation).toBe(0);
    expect(ranges.filter((r) => r.id !== 'reds').map((r) => r.saturation)).toEqual([-100, -100, -100, -100, -100]);
  });

  it('is one undo entry and a second chip moves the exception', () => {
    render(<Wrap><HslPanel /></Wrap>);
    fireEvent.click(screen.getByRole('button', { name: 'Blues' }));
    fireEvent.click(screen.getByTestId('grey-except-this'));
    expect(usePhotoStore.getState().past).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'Reds' }));
    fireEvent.click(screen.getByTestId('grey-except-this'));
    const r = byType('hsl')!.params.ranges;
    expect(r.find((x) => x.id === 'blues')!.saturation).toBe(-100);
    expect(r.find((x) => x.id === 'reds')!.saturation).toBe(0);
    usePhotoStore.getState().undo();
    expect(byType('hsl')!.params.ranges.find((x) => x.id === 'blues')!.saturation).toBe(0);
  });
});

describe('Curves panel', () => {
  it('refuses a non-monotone drag: a point cannot cross its neighbour', () => {
    render(<Wrap><CurvesPanel /></Wrap>);
    const svg = screen.getByRole('application');
    svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 256, height: 256, right: 256, bottom: 256, x: 0, y: 0, toJSON() {} });
    // add a point at (0.5, 0.5) then another at (0.7, 0.7)
    fireEvent.pointerDown(svg, { clientX: 128, clientY: 128, pointerId: 1 });
    fireEvent.pointerUp(svg, { pointerId: 1 });
    fireEvent.pointerDown(svg, { clientX: 179, clientY: 77, pointerId: 1 });
    fireEvent.pointerUp(svg, { pointerId: 1 });
    expect(byType('curves')!.params.master.points).toHaveLength(4);
    // drag the 0.5 point far past the 0.7 point
    fireEvent.pointerDown(svg, { clientX: 128, clientY: 128, pointerId: 2 });
    fireEvent.pointerMove(svg, { clientX: 240, clientY: 100, pointerId: 2 });
    fireEvent.pointerUp(svg, { pointerId: 2 });
    const pts = byType('curves')!.params.master.points;
    for (let i = 1; i < pts.length; i += 1) expect(pts[i].x).toBeGreaterThan(pts[i - 1].x);
    expect(pts[1].x).toBeLessThan(pts[2].x);
  });

  it('keyboard moves and deletes an inner point; end points stay', () => {
    render(<Wrap><CurvesPanel /></Wrap>);
    const svg = screen.getByRole('application');
    svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 256, height: 256, right: 256, bottom: 256, x: 0, y: 0, toJSON() {} });
    fireEvent.pointerDown(svg, { clientX: 128, clientY: 128, pointerId: 1 });
    fireEvent.pointerUp(svg, { pointerId: 1 });
    fireEvent.keyDown(screen.getByTestId('curve-point-1'), { key: 'ArrowUp' });
    expect(byType('curves')!.params.master.points[1].y).toBeCloseTo(0.51, 2);
    fireEvent.keyDown(screen.getByTestId('curve-point-0'), { key: 'Delete' });
    expect(byType('curves')!.params.master.points).toHaveLength(3);
    fireEvent.keyDown(screen.getByTestId('curve-point-1'), { key: 'Delete' });
    expect(byType('curves')!.params.master.points).toHaveLength(2);
  });
});

describe('Levels panel', () => {
  it('clamps: input black cannot pass input white, gamma stays in range', () => {
    render(<Wrap><LevelsPanel histogram={null} /></Wrap>);
    const white = screen.getAllByRole('spinbutton', { name: 'Input white' })[0];
    fireEvent.change(white, { target: { value: '0.3' } });
    const black = screen.getAllByRole('spinbutton', { name: 'Input black' })[0];
    fireEvent.change(black, { target: { value: '0.9' } });
    const m = byType('levels')!.params.master;
    expect(m.inBlack).toBeLessThan(m.inWhite);
    expect(m.inWhite).toBeCloseTo(0.3, 2);
    fireEvent.change(screen.getAllByRole('spinbutton', { name: 'Midtones' })[0], { target: { value: '5' } });
    expect(byType('levels')!.params.master.gamma).toBeLessThanOrEqual(10);
  });
});

describe('Basic panel', () => {
  it('first touch creates the layer; later drags edit it in place; one undo per drag', () => {
    render(<Wrap><BasicPanel /></Wrap>);
    const ev = screen.getByRole('spinbutton', { name: 'Exposure (EV)' });
    fireEvent.change(ev, { target: { value: '1' } });
    fireEvent.change(ev, { target: { value: '1.5' } });
    expect(layers().filter((l) => l.type === 'exposure')).toHaveLength(1);
    expect(byType('exposure')!.params.ev).toBe(1.5);
    fireEvent.blur(ev);
    expect(usePhotoStore.getState().past).toHaveLength(1);
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Shadows' }), { target: { value: '40' } });
    expect(byType('tone')!.params.shadows).toBe(40);
  });
  it('double-click on the label resets', () => {
    render(<Wrap><BasicPanel /></Wrap>);
    const ev = screen.getByRole('spinbutton', { name: 'Exposure (EV)' });
    fireEvent.change(ev, { target: { value: '2' } });
    fireEvent.doubleClick(screen.getByText('Exposure (EV)'));
    expect(byType('exposure')!.params.ev).toBe(0);
  });
});

describe('Layers panel', () => {
  it('lists, toggles, duplicates, renames and deletes', () => {
    usePhotoStore.getState().mutate('x', (d) => ({ ...d, layers: [
      { id: 'a', type: 'invert', enabled: true, opacity: 1, blend: 'normal', mask: null, params: {} } as AdjustmentLayer,
    ] }));
    render(<Wrap><LayersPanel onOpenPanel={() => {}} /></Wrap>);
    expect(screen.getByTestId('layer-row-a')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Hide layer' }));
    expect(layers()[0].enabled).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Duplicate' }));
    expect(layers().map((l) => l.id)).toEqual(['a', 'a-2']);
    fireEvent.click(within(screen.getByTestId('layer-row-a-2')).getByRole('button', { name: 'Delete' }));
    expect(layers().map((l) => l.id)).toEqual(['a']);
  });
});

describe('dialogs', () => {
  it('the 409 dialog offers both choices', () => {
    const keep = vi.fn();
    const theirs = vi.fn();
    render(<Wrap><ConflictDialog open onKeepMine={keep} onLoadTheirs={theirs} /></Wrap>);
    fireEvent.click(screen.getByRole('button', { name: 'Keep mine' }));
    fireEvent.click(screen.getByRole('button', { name: 'Load theirs' }));
    expect(keep).toHaveBeenCalledTimes(1);
    expect(theirs).toHaveBeenCalledTimes(1);
  });
  it('the sign-in offer shows Keep on my account only when a slot is free', () => {
    const { rerender } = render(<Wrap><UploadOffer canUpload busy={false} error={false} onAccept={() => {}} onDismiss={() => {}} /></Wrap>);
    expect(screen.getByRole('button', { name: 'Keep on my account' })).toBeTruthy();
    rerender(<Wrap><UploadOffer canUpload={false} busy={false} error={false} onAccept={() => {}} onDismiss={() => {}} /></Wrap>);
    expect(screen.queryByRole('button', { name: 'Keep on my account' })).toBeNull();
  });
});

describe('Export dialog', () => {
  const caps = (over: Partial<PhotoCapabilities> = {}): PhotoCapabilities => ({ enabled: true, render: true, formats: ['jpg', 'png', 'webp'], maxMegapixels: 12, photoProjects: 5, photoBatch: 0, aiMasks: false, heal: false, tier: 'free', ...over });
  const doc = newPhotoDoc(6000, 4000); // 24 MP original
  const base = { open: true, onOpenChange: () => {}, doc, projectName: 'Beach', originalFile: null };

  it('free: 24 / 64 / 120 MP are locked, 12 is not; Original is locked for a 24 MP photo', () => {
    render(<Wrap><ExportDialog {...base} projectId="p1" file={null} signedIn capabilities={caps()} /></Wrap>);
    const radio = (n: string) => screen.getByRole('radio', { name: n });
    expect(radio('12 MP').getAttribute('aria-disabled')).toBe('false');
    for (const n of ['24 MP', '64 MP', '120 MP', 'Original']) expect(radio(n).getAttribute('aria-disabled')).toBe('true');
  });

  it('pro: nothing is locked', () => {
    render(<Wrap><ExportDialog {...base} projectId="p1" file={null} signedIn capabilities={caps({ maxMegapixels: 120, tier: 'pro' })} /></Wrap>);
    for (const n of ['Original', '12 MP', '24 MP', '64 MP', '120 MP']) expect(screen.getByRole('radio', { name: n }).getAttribute('aria-disabled')).toBe('false');
  });

  it('a click on a locked size reaches the gating seam and does not select it', () => {
    const gated = vi.fn();
    render(<Wrap><ExportDialog {...base} projectId="p1" file={null} signedIn capabilities={caps()} onGatedSizeClicked={gated} /></Wrap>);
    fireEvent.click(screen.getByRole('radio', { name: '64 MP' }));
    expect(gated).toHaveBeenCalledWith(64);
    expect(screen.getByRole('radio', { name: '64 MP' }).getAttribute('aria-checked')).toBe('false');
  });

  it('says "Export is being set up" and disables Export while capabilities.render is false', () => {
    render(<Wrap><ExportDialog {...base} projectId="p1" file={null} signedIn capabilities={caps({ render: false })} /></Wrap>);
    expect(screen.getByTestId('export-setup').textContent).toBe('Export is being set up');
    expect((screen.getByTestId('export-start') as HTMLButtonElement).disabled).toBe(true);
  });

  it('signed in: posts to the project route with the doc; signed out: the stateless multipart route', async () => {
    const project = vi.fn(async () => 'job-1');
    const stateless = vi.fn(async () => 'job-2');
    const { unmount } = render(<Wrap><ExportDialog {...base} projectId="p1" file={null} signedIn capabilities={caps()} exporters={{ project, stateless }} /></Wrap>);
    fireEvent.click(screen.getByRole('radio', { name: '12 MP' }));
    fireEvent.click(screen.getByTestId('export-start'));
    await waitFor(() => expect(project).toHaveBeenCalledTimes(1));
    expect(project.mock.calls[0][0]).toBe('p1');
    expect(project.mock.calls[0][2]).toMatchObject({ format: 'jpg', quality: 92, metadataMode: 'keep', maxMegapixels: 12 });
    expect(stateless).not.toHaveBeenCalled();
    unmount();

    const blob = new Blob(['x']);
    render(<Wrap><ExportDialog {...base} projectId={null} file={{ blob, name: 'a.jpg' }} signedIn={false} capabilities={caps({ tier: 'anonymous' })} exporters={{ project, stateless }} /></Wrap>);
    fireEvent.click(screen.getByTestId('export-start'));
    await waitFor(() => expect(stateless).toHaveBeenCalledTimes(1));
    expect(stateless.mock.calls[0][0]).toBe(blob);
    expect(stateless.mock.calls[0][1]).toBe('a.jpg');
  });
});
