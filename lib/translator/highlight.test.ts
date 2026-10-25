import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DomScanner } from './domScanner';
import { OVERLAY_ID, TranslatorHighlighter, type FocusKeyEvent } from './highlight';
import { KeyRegistry, markerIndex } from './keyRegistry';
import { appendMarker } from './markerCodec';

let registry: KeyRegistry;
let scanner: DomScanner;
let hl: TranslatorHighlighter;

const marked = (text: string, key: string) => {
  const r = { ns: 'interface', key, lng: 'de-DE' };
  registry.record(r);
  return appendMarker(text, markerIndex(r));
};

beforeEach(() => {
  registry = new KeyRegistry();
  document.body.innerHTML = `
    <nav><a id="link" href="/pricing"><span id="label">${marked('Preise', 'topNav.pricing')}</span></a></nav>
    <button id="btn" type="button">${marked('Abbrechen', 'common.cancel')}</button>
    <p id="plain">no key here</p>`;
  scanner = new DomScanner({ registry }).start({ immediate: true });
  hl = new TranslatorHighlighter(scanner).attach();
  // jsdom has no layout: report the event target as the topmost element.
  document.elementsFromPoint = vi.fn(() => [] as Element[]);
});

afterEach(() => {
  hl.dispose();
  scanner.dispose();
});

function click(el: Element, init: MouseEventInit = {}) {
  const ev = new MouseEvent('click', { bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(ev);
  return ev;
}

describe('Alt+click', () => {
  it('Alt held: link click suppressed (default prevented, page handler not called) and focusKey fired', () => {
    const focus: FocusKeyEvent[] = [];
    hl.onFocusKey((e) => focus.push(e));
    const pageHandler = vi.fn();
    document.getElementById('link')!.addEventListener('click', pageHandler);
    const ev = click(document.getElementById('label')!, { altKey: true });
    expect(ev.defaultPrevented).toBe(true);
    expect(pageHandler).not.toHaveBeenCalled();
    expect(focus).toHaveLength(1);
    expect(focus[0].ref.key).toBe('topNav.pricing');
    expect(focus[0].element.id).toBe('label');
    expect(hl.highlighted?.key).toBe('topNav.pricing');
  });

  it('no Alt: normal click (page handler runs, default not prevented, no focusKey)', () => {
    const focus = vi.fn();
    hl.onFocusKey(focus);
    const pageHandler = vi.fn();
    document.getElementById('btn')!.addEventListener('click', pageHandler);
    const ev = click(document.getElementById('btn')!);
    expect(ev.defaultPrevented).toBe(false);
    expect(pageHandler).toHaveBeenCalledTimes(1);
    expect(focus).not.toHaveBeenCalled();
  });

  it('uses document.elementsFromPoint to find the topmost mapped element', () => {
    const focus: FocusKeyEvent[] = [];
    hl.onFocusKey((e) => focus.push(e));
    const btn = document.getElementById('btn')!;
    document.elementsFromPoint = vi.fn(() => [document.getElementById('plain')!, btn, document.body]);
    click(document.body, { altKey: true, clientX: 10, clientY: 20 });
    expect(document.elementsFromPoint).toHaveBeenCalledWith(10, 20);
    expect(focus[0].ref.key).toBe('common.cancel');
  });

  it('Alt+click on an element without a key still suppresses the click but emits nothing', () => {
    const focus = vi.fn();
    hl.onFocusKey(focus);
    const ev = click(document.getElementById('plain')!, { altKey: true });
    expect(ev.defaultPrevented).toBe(true);
    expect(focus).not.toHaveBeenCalled();
  });
});

describe('highlight overlay', () => {
  it('outlines every element of a key in a pointer-events:none overlay without touching page nodes', () => {
    const before = document.getElementById('btn')!.getAttribute('style');
    const els = hl.highlightKey({ ns: 'interface', key: 'common.cancel', lng: 'de-DE' });
    expect(els.map((e) => e.id)).toEqual(['btn']);
    const overlay = document.getElementById(OVERLAY_ID)!;
    expect(overlay.style.pointerEvents).toBe('none');
    expect(overlay.style.position).toBe('fixed');
    expect(overlay.children).toHaveLength(1);
    expect((overlay.children[0] as HTMLElement).style.pointerEvents).toBe('none');
    expect(document.getElementById('btn')!.getAttribute('style')).toBe(before);
    // The overlay itself is never scanned or mapped.
    expect(scanner.getKeysForElement(overlay)).toEqual([]);
  });

  it('Escape clears the highlight', () => {
    hl.highlightKey({ ns: 'interface', key: 'common.cancel', lng: 'de-DE' });
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(hl.highlighted).toBeNull();
    expect(document.getElementById(OVERLAY_ID)!.children).toHaveLength(0);
  });

  it('onElementHover reports the keys under the pointer, on change only', () => {
    const seen: Array<string[]> = [];
    hl.onElementHover((e) => seen.push(e.keys.map((k) => k.ref.key)));
    const move = (el: Element) => el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    move(document.getElementById('label')!);
    move(document.getElementById('label')!);
    move(document.getElementById('btn')!);
    move(document.getElementById('plain')!);
    expect(seen).toEqual([['topNav.pricing'], ['common.cancel'], []]);
  });
});
