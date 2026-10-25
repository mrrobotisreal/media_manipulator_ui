/**
 * Drives the canvas with pointer events in jsdom: tools commit layers
 * through the store (and fire the onToolUsed seam), and a drag is one undo
 * step. jsdom has no layout, so the viewport rect is 0,0 and coordinates are
 * view-space (zoom 1, no pan) = document space.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { createI18nInstance } from '@/i18n';
import { resolveTransform } from '@/lib/vector/geometry';
import { blankDoc } from '@/lib/vector/projects';
import { useVectorStore } from '@/lib/vector/vectorStore';
import { VectorCanvas } from './canvas';

vi.mock('next/navigation', () => ({ usePathname: () => '/motion/x', useRouter: () => ({ push: vi.fn() }) }));

const i18n = createI18nInstance('en-US');
i18n.addResourceBundle('en-US', 'interface', enPanels, true, true);

beforeEach(() => {
  Object.assign(Element.prototype, { setPointerCapture: () => {}, releasePointerCapture: () => {} });
  useVectorStore.getState().load('local-test00000000', blankDoc(), 'Test');
});
afterEach(() => {
  cleanup();
  useVectorStore.getState().close();
});

function mount(onToolUsed = vi.fn()) {
  const { container } = render(
    <I18nextProvider i18n={i18n}>
      <VectorCanvas view={{ zoom: 1, panX: 0, panY: 0 }} onViewChange={() => {}} onToolUsed={onToolUsed} />
    </I18nextProvider>,
  );
  const viewport = container.querySelector('[role="application"]') as HTMLElement;
  return { viewport, container, onToolUsed };
}

const pt = (x: number, y: number, extra: Record<string, unknown> = {}) => ({ clientX: x, clientY: y, button: 0, pointerId: 1, ...extra });

describe('VectorCanvas interaction', () => {
  it('draws a rectangle with the rect tool and fires the onToolUsed seam once', () => {
    const { viewport, onToolUsed } = mount();
    act(() => useVectorStore.getState().setTool('rect'));
    fireEvent.pointerDown(viewport, pt(10, 20));
    fireEvent.pointerMove(viewport, pt(60, 50));
    fireEvent.pointerMove(viewport, pt(110, 70));
    fireEvent.pointerUp(viewport, pt(110, 70));
    const s = useVectorStore.getState();
    expect(s.doc?.layers).toEqual([expect.objectContaining({ type: 'rect', id: 'rect-1', x: 10, y: 20, width: 100, height: 50 })]);
    expect(s.selection).toEqual(['rect-1']);
    expect(s.past).toHaveLength(1);
    expect(onToolUsed).toHaveBeenCalledTimes(1);
    expect(onToolUsed).toHaveBeenCalledWith('rect');
  });

  it('draws a pen path with two clicks and Enter', () => {
    const { viewport } = mount();
    act(() => useVectorStore.getState().setTool('pen'));
    fireEvent.pointerDown(viewport, pt(0, 0));
    fireEvent.pointerUp(viewport, pt(0, 0));
    fireEvent.pointerDown(viewport, pt(100, 50));
    fireEvent.pointerUp(viewport, pt(100, 50));
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(useVectorStore.getState().doc?.layers[0]).toMatchObject({ type: 'path', d: 'M0 0L100 50' });
  });

  it('moves the selection by dragging it, as one undo step', () => {
    const { viewport, container } = mount();
    act(() =>
      useVectorStore.getState().addLayers([{ type: 'rect', id: 'r', x: 0, y: 0, width: 50, height: 50, fill: '#f00' }], 'Draw rect'),
    );
    const rect = container.querySelector('[data-layer-id="r"]') as Element;
    expect(rect).toBeTruthy();
    fireEvent.pointerDown(rect, pt(10, 10, { altKey: true }));
    fireEvent.pointerMove(viewport, pt(20, 15, { altKey: true }));
    fireEvent.pointerMove(viewport, pt(40, 30, { altKey: true }));
    fireEvent.pointerUp(viewport, pt(40, 30));
    const s = useVectorStore.getState();
    const layer = s.doc!.layers[0];
    expect(resolveTransform(layer.type === 'rect' ? layer.transform : undefined)).toMatchObject({ x: 30, y: 20 });
    expect(s.past.map((e) => e.label)).toEqual(['Draw rect', 'Move']);
    act(() => s.undo());
    const back = useVectorStore.getState().doc!.layers[0];
    expect(back.type === 'rect' && back.transform).toBeUndefined();
  });

  it('marquee-selects and nudges with the arrow keys', () => {
    const { viewport } = mount();
    act(() =>
      useVectorStore.getState().addLayers(
        [
          { type: 'rect', id: 'a', x: 0, y: 0, width: 10, height: 10 },
          { type: 'rect', id: 'b', x: 200, y: 200, width: 10, height: 10 },
        ],
        'Add',
      ),
    );
    act(() => useVectorStore.getState().setSelection([]));
    fireEvent.pointerDown(viewport, pt(-5, -5));
    fireEvent.pointerMove(viewport, pt(50, 50));
    fireEvent.pointerUp(viewport, pt(50, 50));
    expect(useVectorStore.getState().selection).toEqual(['a']);
    fireEvent.keyDown(window, { key: 'ArrowRight', shiftKey: true });
    const a = useVectorStore.getState().doc!.layers[0];
    expect(resolveTransform(a.type === 'rect' ? a.transform : undefined).x).toBe(10);
  });

  it('Esc during a drag restores the document', () => {
    const { viewport, container } = mount();
    act(() => useVectorStore.getState().addLayers([{ type: 'rect', id: 'r', x: 0, y: 0, width: 50, height: 50 }], 'Draw rect'));
    const before = useVectorStore.getState().doc;
    fireEvent.pointerDown(container.querySelector('[data-layer-id="r"]') as Element, pt(10, 10, { altKey: true }));
    fireEvent.pointerMove(viewport, pt(90, 90, { altKey: true }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(useVectorStore.getState().doc).toBe(before);
    expect(useVectorStore.getState().past).toHaveLength(1);
  });
});
