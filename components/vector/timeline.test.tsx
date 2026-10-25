/**
 * MM44 S3: timeline, easing editor and the inspector's keyed state, driven in
 * jsdom (no layout: the ruler's rect is 0,0, so clientX = px from time 0).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { createI18nInstance } from '@/i18n';
import { findTrack, keyframeAt } from '@/lib/vector/keyframes';
import { useVectorStore } from '@/lib/vector/vectorStore';
import { parseVectorDoc } from '@/lib/vector/vectorTypes';
import { BezierEditor } from './bezier-editor';
import { Inspector } from './inspector';
import { Timeline } from './timeline';
import { VectorCanvas } from './canvas';

vi.mock('next/navigation', () => ({ usePathname: () => '/motion/x', useRouter: () => ({ push: vi.fn() }) }));

const i18n = createI18nInstance('en-US');
i18n.addResourceBundle('en-US', 'interface', enPanels, true, true);

const doc = () => {
  const r = parseVectorDoc({
    version: 1,
    duration: 2000,
    fps: 10,
    layers: [{ type: 'rect', id: 'box', name: 'Box', x: 0, y: 0, width: 20, height: 20, fill: '#ff0000' }],
  });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};

beforeEach(() => {
  Object.assign(Element.prototype, { setPointerCapture: () => {}, releasePointerCapture: () => {} });
  useVectorStore.getState().load('local-test00000000', doc(), 'Test');
});
afterEach(() => {
  cleanup();
  useVectorStore.getState().close();
  useVectorStore.getState().setAutokey(false);
});

const wrap = (ui: React.ReactNode) => render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
const pt = (x: number, extra: Record<string, unknown> = {}) => ({ clientX: x, clientY: 5, button: 0, pointerId: 1, ...extra });
const st = () => useVectorStore.getState();

describe('Timeline', () => {
  it('scrubs the playhead with frame snap and makes no history entry', () => {
    wrap(<Timeline />);
    const ruler = screen.getByTestId('timeline-ruler');
    // 160 px/s default: 80 px = 500 ms; fps 10 → 100 ms frames.
    fireEvent.pointerDown(ruler, pt(80));
    expect(st().time).toBe(500);
    fireEvent.pointerMove(ruler, pt(85));
    expect(st().time).toBe(500);
    fireEvent.pointerMove(ruler, pt(97));
    expect(st().time).toBe(600);
    fireEvent.pointerMove(ruler, pt(97.3, { altKey: true }));
    expect(st().time).toBe(608);
    fireEvent.pointerUp(ruler, pt(97));
    expect(st().past).toHaveLength(0);
    expect(screen.getByTestId('timecode').textContent).toBe('0:00.608');
  });

  it('stopwatch adds a track; diamonds select, drag in time and delete', () => {
    wrap(<Timeline />);
    fireEvent.click(screen.getByRole('button', { name: 'Expand group' }));
    act(() => st().setTime(500));
    fireEvent.click(screen.getByRole('button', { name: 'Animate Position X' }));
    expect(keyframeAt(st().doc!, 'box', 'transform.x', 500)).toBeDefined();

    const row = screen.getAllByTestId('timeline-property').find((r) => r.dataset.property === 'transform.x')!;
    const key = within(row).getByTestId('keyframe');
    fireEvent.pointerDown(key, pt(80));
    // The drag follows the window (a moved diamond re-mounts).
    fireEvent.pointerMove(window, pt(96)); // +16 px = +100 ms
    fireEvent.pointerMove(window, pt(112)); // +32 px = +200 ms
    fireEvent.pointerUp(window, pt(112));
    expect(keyframeAt(st().doc!, 'box', 'transform.x', 700)).toBeDefined();
    expect(st().past.map((e) => e.label)).toEqual(['Add keyframe', 'Move keyframes']);

    fireEvent.click(screen.getByRole('button', { name: 'Delete keyframes' }));
    expect(findTrack(st().doc!, 'box', 'transform.x')).toBeUndefined();
    act(() => st().undo());
    expect(keyframeAt(st().doc!, 'box', 'transform.x', 700)).toBeDefined();
  });

  it('shift-click multi-selects; copy + paste at the playhead', () => {
    act(() => {
      st().setTime(0);
      st().addKeyframe('box', 'opacity');
      st().setTime(300);
      st().addKeyframe('box', 'opacity');
    });
    wrap(<Timeline />);
    fireEvent.click(screen.getByRole('button', { name: 'Expand group' }));
    const row = screen.getAllByTestId('timeline-property').find((r) => r.dataset.property === 'opacity')!;
    const [k0, k1] = within(row).getAllByTestId('keyframe');
    fireEvent.pointerDown(k0, pt(0));
    fireEvent.pointerUp(window, pt(0));
    fireEvent.pointerDown(k1, pt(48, { shiftKey: true }));
    expect(st().keySelection).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Copy keyframes' }));
    act(() => st().setTime(1000));
    fireEvent.click(screen.getByRole('button', { name: 'Paste keyframes at the playhead' }));
    expect(findTrack(st().doc!, 'box', 'opacity')!.keyframes.map((k) => k.t)).toEqual([0, 300, 1000, 1300]);
  });

  it('play range markers, loop toggle and duration', () => {
    wrap(<Timeline />);
    act(() => st().setTime(400));
    fireEvent.click(screen.getByRole('button', { name: 'Set play range start at the playhead' }));
    act(() => st().setTime(900));
    fireEvent.click(screen.getByRole('button', { name: 'Set play range end at the playhead' }));
    expect(st().range).toEqual({ start: 400, end: 900 });
    fireEvent.click(screen.getByRole('button', { name: 'Loop' }));
    expect(st().doc!.loop).toBe(false);
    const length = screen.getByLabelText('Length') as HTMLInputElement;
    fireEvent.change(length, { target: { value: '1.5' } });
    fireEvent.blur(length);
    expect(st().doc!.duration).toBe(1500);
    expect(st().past.map((e) => e.label)).toEqual(['Loop off', 'Duration']);
  });
});

describe('BezierEditor', () => {
  it('applies presets and numeric handle edits', () => {
    const onChange = vi.fn();
    wrap(<BezierEditor value="linear" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hold' }));
    expect(onChange).toHaveBeenLastCalledWith('hold');
    fireEvent.change(screen.getByLabelText('Curve handle x1'), { target: { value: '1.4' } });
    expect(onChange).toHaveBeenLastCalledWith({ cubicBezier: [1, 0, 1, 1] });
  });

  it('a handle drag is wrapped in drag start/end callbacks', () => {
    const onChange = vi.fn();
    const onDragStart = vi.fn();
    const onDragEnd = vi.fn();
    wrap(<BezierEditor value={{ cubicBezier: [0.25, 0.1, 0.25, 1] }} onChange={onChange} onDragStart={onDragStart} onDragEnd={onDragEnd} />);
    const handle = screen.getByTestId('bezier-handle-1') as unknown as SVGCircleElement;
    fireEvent.pointerDown(handle, pt(40));
    fireEvent.pointerMove(handle.ownerSVGElement!, { clientX: 60, clientY: 60, pointerId: 1 });
    fireEvent.pointerUp(handle.ownerSVGElement!, { clientX: 60, clientY: 60, pointerId: 1 });
    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragEnd).toHaveBeenCalledTimes(1);
    const last = onChange.mock.calls.at(-1)![0] as { cubicBezier: number[] };
    expect(last.cubicBezier[0]).toBeGreaterThanOrEqual(0);
    expect(last.cubicBezier[0]).toBeLessThanOrEqual(1);
  });

  it('easing changes from the timeline popover are undoable', () => {
    act(() => {
      st().addKeyframe('box', 'transform.x');
    });
    act(() => st().setSelectedEasing('easeOut'));
    expect(keyframeAt(st().doc!, 'box', 'transform.x', 0)?.easing).toBe('easeOut');
    act(() => st().undo());
    expect(keyframeAt(st().doc!, 'box', 'transform.x', 0)?.easing).toBe('linear');
  });
});

describe('Inspector keyed state', () => {
  it('filled / hollow / static diamonds follow the playhead, and edits key animated fields', () => {
    act(() => st().setSelection(['box']));
    wrap(<Inspector />);
    const toggle = () => screen.getByTestId('key-toggle-transform.x');
    expect(toggle().dataset.state).toBe('static');
    fireEvent.click(toggle());
    expect(toggle().dataset.state).toBe('key');
    act(() => st().setTime(1000));
    expect(toggle().dataset.state).toBe('animated');
    const x = screen.getByRole('spinbutton', { name: /^X$/ }) as HTMLInputElement;
    fireEvent.focus(x);
    fireEvent.change(x, { target: { value: '40' } });
    fireEvent.blur(x);
    expect(keyframeAt(st().doc!, 'box', 'transform.x', 1000)?.value).toBe(40);
    expect(toggle().dataset.state).toBe('key');
    act(() => st().setTime(500));
    expect((screen.getByRole('spinbutton', { name: /^X$/ }) as HTMLInputElement).value).toBe('20');
  });
});

describe('Canvas at the playhead', () => {
  it('renders sampled values and a drag on an animated layer writes a keyframe', () => {
    act(() => {
      st().addKeyframe('box', 'transform.x');
      st().setTime(1000);
    });
    const { container } = wrap(<VectorCanvas view={{ zoom: 1, panX: 0, panY: 0 }} onViewChange={() => {}} />);
    const viewport = container.querySelector('[role="application"]') as HTMLElement;
    const rect = container.querySelector('[data-layer-id="box"]') as Element;
    fireEvent.pointerDown(rect, { clientX: 5, clientY: 5, button: 0, pointerId: 1 });
    fireEvent.pointerMove(viewport, { clientX: 35, clientY: 5, button: 0, pointerId: 1 });
    fireEvent.pointerUp(viewport, { clientX: 35, clientY: 5, button: 0, pointerId: 1 });
    expect(findTrack(st().doc!, 'box', 'transform.x')!.keyframes.map((k) => [k.t, k.value])).toEqual([
      [0, 0],
      [1000, 30],
    ]);
    act(() => st().setTime(500));
    expect(container.querySelector('[data-layer-id="box"]')!.getAttribute('transform')).toBe('translate(15 0)');
  });
});
