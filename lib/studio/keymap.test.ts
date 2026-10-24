import { describe, expect, it } from 'vitest';
import {
  KEYMAP,
  KEYMAP_CATEGORIES,
  chordOf,
  cheatSheetSections,
  formatBinding,
  matchBinding,
  shouldIgnoreKeyEvent,
  type KeyEventLike,
} from './keymap';

const ev = (key: string, mods: Partial<KeyEventLike> = {}): KeyEventLike => ({
  key,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  ...mods,
});
const cmd = (key: string, mods: Partial<KeyEventLike> = {}) => matchBinding(ev(key, mods))?.command ?? null;

describe('keymap table integrity', () => {
  it('has no duplicate chord', () => {
    const seen = new Map<string, string>();
    for (const b of KEYMAP) {
      const chord = chordOf(b);
      expect(seen.has(chord), `duplicate chord ${chord} (${b.command} vs ${seen.get(chord)})`).toBe(false);
      seen.set(chord, b.command);
    }
  });

  it('every binding has a description and a known category', () => {
    for (const b of KEYMAP) {
      expect(b.description.length).toBeGreaterThan(3);
      expect(KEYMAP_CATEGORIES).toContain(b.category);
    }
  });

  it('never binds a browser-owned Cmd/Ctrl chord', () => {
    // Cmd/Ctrl+<letter> belongs to the browser unless it is on this allow-list.
    const allowed = new Set(['z', 'y', 'k', 'd']);
    for (const b of KEYMAP) {
      if (b.mod || b.ctrl) expect(allowed.has(b.key), `${formatBinding(b)} collides with the browser`).toBe(true);
    }
  });
});

describe('breaking Premiere keymap switch', () => {
  it('maps the tool keys', () => {
    expect(cmd('v')).toBe('tool.select');
    expect(cmd('c')).toBe('tool.razor');
    expect(cmd('y')).toBe('tool.slip');
    expect(cmd('u')).toBe('tool.slide');
    expect(cmd('h')).toBe('tool.hand');
  });

  it('Cmd/Ctrl+K splits; plain S now toggles snapping (no legacy split alias)', () => {
    expect(cmd('k', { metaKey: true })).toBe('edit.split');
    expect(cmd('k', { ctrlKey: true })).toBe('edit.split');
    expect(cmd('s')).toBe('edit.toggleSnapping');
    expect(cmd('S', { shiftKey: true })).toBeNull();
    expect(KEYMAP.filter((b) => b.command === 'edit.split').every((b) => b.mod === true)).toBe(true);
  });

  it('M adds a marker; Q/W ripple-trim; ? opens the cheat sheet', () => {
    expect(cmd('m')).toBe('marker.add');
    expect(cmd('q')).toBe('edit.rippleTrimPrev');
    expect(cmd('w')).toBe('edit.rippleTrimNext');
    expect(cmd('?', { shiftKey: true })).toBe('view.cheatSheet');
  });

  it('keeps Space, arrows, Delete, zoom, undo/redo', () => {
    expect(cmd(' ')).toBe('transport.playPause');
    expect(cmd('ArrowLeft')).toBe('transport.stepBack');
    expect(cmd('ArrowRight')).toBe('transport.stepForward');
    expect(cmd('Delete')).toBe('edit.rippleDelete');
    expect(cmd('Backspace')).toBe('edit.rippleDelete');
    expect(cmd('+', { shiftKey: true })).toBe('view.zoomIn');
    expect(cmd('=')).toBe('view.zoomIn');
    expect(cmd('-')).toBe('view.zoomOut');
    expect(cmd('z', { metaKey: true })).toBe('history.undo');
    expect(cmd('z', { ctrlKey: true, shiftKey: true })).toBe('history.redo');
    expect(cmd('y', { ctrlKey: true })).toBe('history.redo');
  });

  it('Shift+M is the markers panel, distinct from M', () => {
    expect(cmd('M', { shiftKey: true })).toBe('view.toggleMarkersPanel');
  });
});

describe('browser / OS collisions', () => {
  it('plain-letter bindings never fire under Cmd/Ctrl', () => {
    for (const k of ['v', 'c', 'u', 'h', 's', 'm', 'q', 'w', 't', 'g']) {
      expect(cmd(k, { metaKey: true }), `Cmd+${k}`).toBeNull();
      expect(cmd(k, { ctrlKey: true }), `Ctrl+${k}`).toBeNull();
    }
  });

  it('never fires under Alt/Option', () => {
    expect(cmd('v', { altKey: true })).toBeNull();
    expect(cmd('k', { metaKey: true, altKey: true })).toBeNull();
  });

  it('Cmd+C / Cmd+W / Cmd+S stay with the browser (no binding)', () => {
    expect(cmd('c', { metaKey: true })).toBeNull();
    expect(cmd('w', { metaKey: true })).toBeNull();
    expect(cmd('s', { metaKey: true })).toBeNull();
  });
});

describe('cheat sheet generation', () => {
  it('is generated from the table and merges multi-chord commands', () => {
    const sections = cheatSheetSections();
    const all = sections.flatMap((s) => s.rows);
    const del = all.find((r) => r.command === 'edit.rippleDelete');
    expect(del?.keys).toEqual(['Del', '⌫']);
    const redo = all.find((r) => r.command === 'history.redo');
    expect(redo?.keys.length).toBe(2);
    // Every command in the table appears exactly once.
    const cmds = new Set(KEYMAP.map((b) => b.command));
    expect(all.length).toBe(cmds.size);
  });
});

describe('focus guards', () => {
  const el = (tag: string, extra: Record<string, unknown> = {}) => ({
    tagName: tag,
    getAttribute: () => null,
    closest: () => null,
    ...extra,
  });
  it('ignores text inputs, textareas, selects and contentEditable', () => {
    expect(shouldIgnoreKeyEvent({ key: 'v' }, el('INPUT', { type: 'text' }))).toBe(true);
    expect(shouldIgnoreKeyEvent({ key: 'v' }, el('INPUT'))).toBe(true);
    expect(shouldIgnoreKeyEvent({ key: 'v' }, el('TEXTAREA'))).toBe(true);
    expect(shouldIgnoreKeyEvent({ key: 'v' }, el('SELECT'))).toBe(true);
    expect(shouldIgnoreKeyEvent({ key: 'v' }, el('DIV', { isContentEditable: true }))).toBe(true);
  });
  it('ignores anything inside a dialog or menu', () => {
    expect(shouldIgnoreKeyEvent({ key: 'v' }, el('DIV', { closest: () => ({}) }))).toBe(true);
  });
  it('a focused button only keeps Space/Enter, so palette clicks do not kill hotkeys', () => {
    expect(shouldIgnoreKeyEvent({ key: 'v' }, el('BUTTON'))).toBe(false);
    expect(shouldIgnoreKeyEvent({ key: ' ' }, el('BUTTON'))).toBe(true);
  });
  it('sliders keep their arrow keys', () => {
    expect(shouldIgnoreKeyEvent({ key: 'ArrowLeft' }, el('SPAN', { getAttribute: () => 'slider' }))).toBe(true);
    expect(shouldIgnoreKeyEvent({ key: 'v' }, el('SPAN', { getAttribute: () => 'slider' }))).toBe(false);
  });
  it('lets everything through with no focused element', () => {
    expect(shouldIgnoreKeyEvent({ key: 'v' }, null)).toBe(false);
    expect(shouldIgnoreKeyEvent({ key: 'v' }, el('BODY'))).toBe(false);
  });
});
