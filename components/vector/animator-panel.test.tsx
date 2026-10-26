/**
 * MM45 acceptance 8 (UI): applying Draw on to a path creates the
 * dasharray / dashoffset tracks; Morph with unequal command counts yields
 * normalised keys; undo restores. Plus the `onAnimatorUsed` seam.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { createI18nInstance } from '@/i18n';
import { findTrack } from '@/lib/vector/keyframes';
import { findLayer } from '@/lib/vector/layerTree';
import { morphCompatible } from '@/lib/vector/morph';
import { useVectorStore } from '@/lib/vector/vectorStore';
import { parseVectorDoc, type PathLayer, type VectorDoc } from '@/lib/vector/vectorTypes';

vi.mock('next/navigation', () => ({ usePathname: () => '/motion/x', useRouter: () => ({ push: vi.fn() }) }));

import { AnimatorPanel } from './animator-panel';

const i18n = createI18nInstance('en-US');
i18n.addResourceBundle('en-US', 'interface', enPanels, true, true);

const make = (): VectorDoc => {
  const r = parseVectorDoc({
    version: 1,
    duration: 2000,
    layers: [
      { type: 'path', id: 'tri', name: 'Triangle', d: 'M0 0L100 0L100 100Z', fill: '#f00', stroke: '#000' },
      { type: 'polygon', id: 'hex', name: 'Hexagon', points: [50, 0, 93, 25, 93, 75, 50, 100, 7, 75, 7, 25], fill: '#00f' },
      { type: 'path', id: 'guide', name: 'Guide', d: 'M0 0C50 -50 150 50 200 0', fill: 'none' },
    ],
  });
  if (!r.ok) throw new Error(r.error);
  return r.doc;
};

const mount = (props: Partial<React.ComponentProps<typeof AnimatorPanel>> = {}) =>
  render(
    <I18nextProvider i18n={i18n}>
      <AnimatorPanel {...props} />
    </I18nextProvider>,
  );
const button = (a: string) => document.querySelector(`[data-animator="${a}"]`) as HTMLButtonElement;
const state = () => useVectorStore.getState();

let before: VectorDoc;
beforeEach(() => {
  before = make();
  state().load('anim', before);
  state().setSelection(['tri']);
});
afterEach(() => cleanup());

describe('animator panel', () => {
  it('asks for one selected layer', () => {
    state().setSelection([]);
    mount();
    expect(screen.getByText('Select one layer to animate it.')).toBeTruthy();
  });

  it('Draw on creates dasharray + dashoffset tracks (measured length preferred), one undo step', () => {
    const used = vi.fn();
    mount({ onAnimatorUsed: used, measureLength: () => 341.4 });
    fireEvent.click(button('drawOn'));
    const doc = state().doc!;
    const tri = findLayer(doc.layers, 'tri') as PathLayer;
    expect(tri.strokeDasharray).toEqual([341.4]);
    const tr = findTrack(doc, 'tri', 'strokeDashoffset')!;
    expect(tr.keyframes.map((k) => k.value)).toEqual([341.4, 0]);
    expect(used).toHaveBeenCalledWith('drawOn');
    expect(state().past).toHaveLength(1);
    state().undo();
    expect(state().doc).toBe(before);
  });

  it('Draw on falls back to the pure length when the canvas cannot measure', () => {
    mount({ measureLength: () => undefined });
    fireEvent.click(button('drawOn'));
    const tri = findLayer(state().doc!.layers, 'tri') as PathLayer;
    expect(tri.strokeDasharray![0]).toBeCloseTo(100 + 100 + Math.SQRT2 * 100, 2);
  });

  it('Morph asks for a target; unequal command counts give normalised, compatible keys; undo restores', () => {
    const used = vi.fn();
    mount({ onAnimatorUsed: used });
    fireEvent.click(button('morph'));
    expect(screen.getByText('Morph into which shape?')).toBeTruthy();
    // The pen is offered to draw a new target.
    fireEvent.click(screen.getByRole('button', { name: 'Draw a new one with the pen' }));
    expect(state().tool).toBe('pen');
    fireEvent.click(document.querySelector('[data-target="hex"]')!);
    const doc = state().doc!;
    const keys = findTrack(doc, 'tri', 'd')!.keyframes.map((k) => k.value as string);
    expect(keys).toHaveLength(2);
    expect(morphCompatible(keys[0], keys[1])).toBe(true);
    // Triangle (3 sides) and hexagon (6) now share one command sequence.
    expect(keys[0].replace(/[^A-Z]/g, '')).toBe('MCCCCCCZ');
    expect(keys[1].replace(/[^A-Z]/g, '')).toBe('MCCCCCCZ');
    expect(used).toHaveBeenCalledWith('morph');
    state().undo();
    expect(state().doc).toBe(before);
    expect((findLayer(state().doc!.layers, 'tri') as PathLayer).d).toBe('M0 0L100 0L100 100Z');
  });

  it('Motion path picks a guide and can rotate with it', () => {
    mount();
    fireEvent.click(button('motionPath'));
    expect(screen.getByText('Move along which path?')).toBeTruthy();
    expect(document.querySelector('[data-target="tri"]')).toBeNull();
    fireEvent.click(document.querySelector('[data-target="guide"]')!);
    expect(findTrack(state().doc!, 'tri', 'motionPath')!.extras).toEqual({ pathId: 'guide', autoOrient: false });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Rotate with the path' }));
    expect(findTrack(state().doc!, 'tri', 'motionPath')!.extras).toMatchObject({ autoOrient: true });
  });

  it('Gradient and Blur add their tracks; Mask/Clip is disabled without a mask', () => {
    mount();
    expect(button('maskClip').disabled).toBe(true);
    fireEvent.click(button('gradient'));
    expect(state().doc!.animations.map((t) => t.property)).toEqual(['gradientStop[0].color', 'gradientStop[1].color']);
    fireEvent.click(button('blur'));
    expect(findTrack(state().doc!, 'tri', 'filter.blur')).toBeDefined();
    expect(state().past).toHaveLength(2);
  });

  it('Morph is disabled on a non-path layer', () => {
    state().setSelection(['hex']);
    mount();
    expect(button('morph').disabled).toBe(true);
    expect(button('drawOn').disabled).toBe(false);
  });
});
