/**
 * The editor's keyboard shortcuts (ticket MM99 decision 8): ONE registry that
 * both the key handler in `editor.tsx` and the `?` sheet read, so the sheet can
 * never list a key the editor does not handle (a test compares the two).
 * `keys` use `Mod` for ⌘ on macOS / Ctrl elsewhere.
 */
export type ShortcutGroup = 'general' | 'view' | 'tools' | 'masks';

export interface Shortcut {
  id: string;
  /** Alternatives shown joined by " / ". */
  keys: string[];
  group: ShortcutGroup;
  /** Handler key matched in `matchShortcut` (event.key lowercased, with modifiers). */
  match: { key: string; mod?: boolean; shift?: boolean }[];
}

export const SHORTCUTS: readonly Shortcut[] = [
  { id: 'undo', keys: ['Mod+Z'], group: 'general', match: [{ key: 'z', mod: true, shift: false }] },
  { id: 'redo', keys: ['Shift+Mod+Z', 'Mod+Y'], group: 'general', match: [{ key: 'z', mod: true, shift: true }, { key: 'y', mod: true }] },
  { id: 'save', keys: ['Mod+S'], group: 'general', match: [{ key: 's', mod: true }] },
  { id: 'export', keys: ['Mod+E'], group: 'general', match: [{ key: 'e', mod: true }] },
  { id: 'shortcuts', keys: ['?'], group: 'general', match: [{ key: '?' }] },
  // MM108: Medi's copilot panel (listed only while the copilot is available, see `visibleShortcuts`).
  { id: 'medi', keys: ['Mod+J'], group: 'general', match: [{ key: 'j', mod: true }] },
  { id: 'before', keys: ['\\'], group: 'view', match: [{ key: '\\' }] },
  { id: 'fit', keys: ['0'], group: 'view', match: [{ key: '0' }] },
  { id: 'actual', keys: ['1'], group: 'view', match: [{ key: '1' }] },
  { id: 'zoomIn', keys: ['+'], group: 'view', match: [{ key: '+' }, { key: '=' }] },
  { id: 'zoomOut', keys: ['-'], group: 'view', match: [{ key: '-' }, { key: '_' }] },
  { id: 'maskView', keys: ['M'], group: 'masks', match: [{ key: 'm' }] },
  { id: 'brush', keys: ['B'], group: 'masks', match: [{ key: 'b' }] },
  { id: 'erase', keys: ['E'], group: 'masks', match: [{ key: 'e' }] },
  { id: 'brushSmaller', keys: ['['], group: 'masks', match: [{ key: '[' }] },
  { id: 'brushLarger', keys: [']'], group: 'masks', match: [{ key: ']' }] },
  { id: 'gradient', keys: ['G'], group: 'tools', match: [{ key: 'g' }] },
  { id: 'radial', keys: ['R'], group: 'tools', match: [{ key: 'r' }] },
  { id: 'crop', keys: ['C'], group: 'tools', match: [{ key: 'c' }] },
  { id: 'heal', keys: ['H'], group: 'tools', match: [{ key: 'h' }] },
];

export const SHORTCUT_GROUPS: readonly ShortcutGroup[] = ['general', 'view', 'tools', 'masks'];

/** The shortcuts to list: Medi's only when the copilot is on for this editor. */
export const visibleShortcuts = (opts: { medi: boolean }): readonly Shortcut[] => (opts.medi ? SHORTCUTS : SHORTCUTS.filter((s) => s.id !== 'medi'));

/** The shortcut id an event maps to, or null. Modifier-free entries never match with Mod/Alt held. */
export function matchShortcut(e: { key: string; metaKey: boolean; ctrlKey: boolean; altKey: boolean; shiftKey: boolean }): string | null {
  const mod = e.metaKey || e.ctrlKey;
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  for (const s of SHORTCUTS) {
    for (const m of s.match) {
      if (m.key !== key) continue;
      if (!!m.mod !== mod) continue;
      if (e.altKey) continue;
      if (m.shift !== undefined && m.shift !== e.shiftKey) continue;
      return s.id;
    }
  }
  return null;
}

/** Render a key string for the platform: `Mod` → ⌘ / Ctrl, `Shift` → ⇧ / Shift. */
export function formatKey(key: string, mac: boolean): string {
  return key
    .split('+')
    .map((k) => (k === 'Mod' ? (mac ? '⌘' : 'Ctrl') : k === 'Shift' ? (mac ? '⇧' : 'Shift') : k))
    .join(mac ? '' : '+');
}
