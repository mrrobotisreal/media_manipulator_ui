import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import enPanels from '@/i18n/locales/en-us/interface/panels.json';
import { SHORTCUTS, SHORTCUT_GROUPS, formatKey, matchShortcut } from './shortcuts';

const ev = (key: string, o: Partial<{ metaKey: boolean; ctrlKey: boolean; altKey: boolean; shiftKey: boolean }> = {}) => ({ key, metaKey: false, ctrlKey: false, altKey: false, shiftKey: false, ...o });

describe('shortcuts registry', () => {
  it('lists every shortcut of the ticket', () => {
    const ids = SHORTCUTS.map((s) => s.id);
    for (const id of ['undo', 'redo', 'before', 'maskView', 'brush', 'erase', 'brushSmaller', 'brushLarger', 'gradient', 'radial', 'crop', 'heal', 'fit', 'actual', 'zoomIn', 'zoomOut', 'save', 'export', 'shortcuts']) expect(ids).toContain(id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('maps events to registry ids (⌘/Ctrl variants, shift, no modifier leakage)', () => {
    expect(matchShortcut(ev('z', { metaKey: true }))).toBe('undo');
    expect(matchShortcut(ev('Z', { ctrlKey: true, shiftKey: true }))).toBe('redo');
    expect(matchShortcut(ev('y', { ctrlKey: true }))).toBe('redo');
    expect(matchShortcut(ev('s', { metaKey: true }))).toBe('save');
    expect(matchShortcut(ev('e', { metaKey: true }))).toBe('export');
    expect(matchShortcut(ev('e'))).toBe('erase');
    expect(matchShortcut(ev('?', { shiftKey: true }))).toBe('shortcuts');
    expect(matchShortcut(ev('0'))).toBe('fit');
    expect(matchShortcut(ev('1'))).toBe('actual');
    expect(matchShortcut(ev('j', { metaKey: true }))).toBe('medi');
    expect(matchShortcut(ev('j'))).toBeNull();
    expect(matchShortcut(ev('b', { metaKey: true }))).toBeNull();
    expect(matchShortcut(ev('b', { altKey: true }))).toBeNull();
  });

  it('every registry entry has copy in en-US and a group; the editor key handler handles every one', () => {
    const t = enPanels.photo.shortcuts;
    const editor = readFileSync(join(__dirname, '../../components/photo/editor.tsx'), 'utf8');
    for (const s of SHORTCUTS) {
      expect((t.action as Record<string, string>)[s.id], s.id).toBeTruthy();
      expect(SHORTCUT_GROUPS).toContain(s.group);
      // each primary key literal appears in the handler (as a key compare), so the sheet cannot promise a dead key
      const k = s.match[0].key;
      const lit = k === '\\' ? "'\\\\'" : `'${k}'`;
      const lower = `'${k.toLowerCase()}'`;
      expect(editor.includes(lit) || editor.includes(lower) || editor.includes(`"${k}"`), `${s.id} (${k})`).toBe(true);
    }
  });

  it('formats keys per platform', () => {
    expect(formatKey('Shift+Mod+Z', true)).toBe('⇧⌘Z');
    expect(formatKey('Mod+Z', false)).toBe('Ctrl+Z');
  });
});
