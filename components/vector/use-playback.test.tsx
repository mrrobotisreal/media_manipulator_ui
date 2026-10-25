/**
 * MM44 S4: playback preview. Play and scrub share one render path (the canvas
 * samples the model at `time`); the clock advances in preview frames, loops
 * in the play range, stops at the end without loop, never writes history.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { createI18nInstance } from '@/i18n';
import { useVectorStore } from '@/lib/vector/vectorStore';
import { parseVectorDoc } from '@/lib/vector/vectorTypes';
import { VectorCanvas } from './canvas';
import { usePlayback } from './use-playback';

vi.mock('next/navigation', () => ({ usePathname: () => '/motion/x', useRouter: () => ({ push: vi.fn() }) }));

const i18n = createI18nInstance('en-US');
i18n.addResourceBundle('en-US', 'interface', enPanels, true, true);

let clock = 0;
let queue: Array<() => void> = [];
const frame = (ms: number) =>
  act(() => {
    clock += ms;
    const q = queue;
    queue = [];
    q.forEach((cb) => cb());
  });

function Harness() {
  usePlayback({ now: () => clock, raf: (cb) => (queue.push(cb), queue.length), caf: () => (queue = []) });
  return <VectorCanvas view={{ zoom: 1, panX: 0, panY: 0 }} onViewChange={() => {}} />;
}

beforeEach(() => {
  clock = 0;
  queue = [];
  const r = parseVectorDoc({
    version: 1,
    duration: 1000,
    fps: 10,
    layers: [{ type: 'rect', id: 'box', x: 0, y: 0, width: 10, height: 10 }],
    animations: [{ layerId: 'box', property: 'transform.x', keyframes: [{ t: 0, value: 0, easing: 'linear' }, { t: 1000, value: 100, easing: 'linear' }] }],
  });
  if (!r.ok) throw new Error(r.error);
  useVectorStore.getState().load('local-test00000000', r.doc, 'T');
});
afterEach(() => {
  cleanup();
  useVectorStore.getState().close();
});

const st = () => useVectorStore.getState();
const xAttr = (c: HTMLElement) => c.querySelector('[data-layer-id="box"]')!.getAttribute('transform');

describe('playback preview', () => {
  it('plays at the preview fps and renders exactly what a scrub to the same time renders', () => {
    const { container } = render(
      <I18nextProvider i18n={i18n}>
        <Harness />
      </I18nextProvider>,
    );
    act(() => st().setPlaying(true));
    frame(16);
    frame(140); // 156 ms → frame 100 ms
    expect(st().time).toBe(100);
    const played = xAttr(container);
    act(() => st().setPlaying(false));
    act(() => st().setTime(0));
    act(() => st().setTime(100));
    expect(xAttr(container)).toBe(played);
    expect(played).toBe('translate(10 0)');
    expect(st().past).toHaveLength(0);
  });

  it('loops in the play range', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Harness />
      </I18nextProvider>,
    );
    act(() => {
      st().setRange({ start: 200, end: 500 });
      st().setPlaying(true);
    });
    expect(st().time).toBe(200);
    frame(250);
    expect(st().time).toBe(400);
    frame(100);
    expect(st().time).toBe(200);
    expect(st().playing).toBe(true);
  });

  it('stops on the end when loop is off', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Harness />
      </I18nextProvider>,
    );
    act(() => {
      st().setLoop(false);
      st().setPlaying(true);
    });
    frame(2000);
    expect(st().time).toBe(1000);
    expect(st().playing).toBe(false);
  });

  it('starting at the end restarts from the start', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Harness />
      </I18nextProvider>,
    );
    act(() => {
      st().setTime(1000);
      st().setPlaying(true);
    });
    expect(st().time).toBe(0);
  });
});
