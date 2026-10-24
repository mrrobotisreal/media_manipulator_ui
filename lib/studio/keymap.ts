/**
 * The Darkroom keymap (Darkroom v3 part 18) — ONE declarative table consumed
 * by the window keydown handler (editor.tsx → matchBinding) and the `?` cheat
 * sheet (shortcut-cheatsheet.tsx). Never hand-duplicate a shortcut anywhere
 * else.
 *
 * Pure: no DOM, no store. The command implementations live in commands.ts.
 *
 * BREAKING SWITCH (design §11, approved): the pre-part-18 `S` = split is GONE
 * with no alias. `S` now toggles snapping; split is Cmd/Ctrl+K.
 *
 * COLLISIONS. Plain-letter bindings only fire with NO Cmd/Ctrl/Alt held, so
 * Cmd+C/V/X/A/W/T/N/R/F/S/P … always belong to the browser and OS. The only
 * modified bindings are Cmd/Ctrl+Z (undo), Cmd/Ctrl+Shift+Z / Ctrl+Y (redo),
 * Cmd/Ctrl+K (split, Premiere-standard) and Cmd/Ctrl+D (default transition,
 * part 14). All four are cancelable keydowns, so preventDefault wins over the
 * browser's own meaning (omnibox-search for K, bookmark for D). Grouping
 * deliberately avoids Premiere's Cmd+G (browser "find next") and Cmd+L
 * (address bar): group is `G`, ungroup `Shift+G`, detach audio `Shift+D`.
 */

export type KeymapCategory = 'tools' | 'editing' | 'playback' | 'view' | 'history';

export type CommandId =
  | 'tool.select'
  | 'tool.razor'
  | 'tool.slip'
  | 'tool.slide'
  | 'tool.hand'
  | 'edit.split'
  | 'edit.toggleSnapping'
  | 'edit.rippleTrimPrev'
  | 'edit.rippleTrimNext'
  | 'edit.rippleDelete'
  | 'edit.defaultTransition'
  | 'edit.addTitle'
  | 'edit.group'
  | 'edit.ungroup'
  | 'edit.detachAudio'
  | 'marker.add'
  | 'view.toggleMarkersPanel'
  | 'view.zoomIn'
  | 'view.zoomOut'
  | 'view.cheatSheet'
  | 'history.undo'
  | 'history.redo'
  | 'transport.playPause'
  | 'transport.stepBack'
  | 'transport.stepForward';

export interface KeyBinding {
  /** `KeyboardEvent.key` value; single characters are lowercase ('k', '?', ' '). */
  key: string;
  /** Cmd (macOS) or Ctrl (elsewhere) must be held. */
  mod?: boolean;
  /** Ctrl specifically (not Cmd) — only Ctrl+Y redo uses this. */
  ctrl?: boolean;
  /** Shift must be held. Ignored for symbol keys whose glyph already implies it. */
  shift?: boolean;
  command: CommandId;
  /** English description; the cheat sheet localizes through `contentStudio.keymap.cmd.<command>`. */
  description: string;
  category: KeymapCategory;
}

export const KEYMAP_CATEGORIES: readonly KeymapCategory[] = ['tools', 'editing', 'playback', 'view', 'history'];

export const KEYMAP: readonly KeyBinding[] = [
  // --- Tools -------------------------------------------------------------
  { key: 'v', command: 'tool.select', description: 'Selection tool', category: 'tools' },
  { key: 'c', command: 'tool.razor', description: 'Razor tool (click a clip to cut)', category: 'tools' },
  { key: 'y', command: 'tool.slip', description: 'Slip tool (re-window source)', category: 'tools' },
  { key: 'u', command: 'tool.slide', description: 'Slide tool (neighbors absorb)', category: 'tools' },
  { key: 'h', command: 'tool.hand', description: 'Hand tool (pan timeline)', category: 'tools' },

  // --- Editing -----------------------------------------------------------
  { key: 'k', mod: true, command: 'edit.split', description: 'Split at playhead', category: 'editing' },
  { key: 's', command: 'edit.toggleSnapping', description: 'Toggle snapping', category: 'editing' },
  { key: 'q', command: 'edit.rippleTrimPrev', description: 'Ripple-trim previous edit to playhead', category: 'editing' },
  { key: 'w', command: 'edit.rippleTrimNext', description: 'Ripple-trim next edit to playhead', category: 'editing' },
  { key: 'Delete', command: 'edit.rippleDelete', description: 'Ripple delete', category: 'editing' },
  { key: 'Backspace', command: 'edit.rippleDelete', description: 'Ripple delete', category: 'editing' },
  { key: 'd', mod: true, command: 'edit.defaultTransition', description: 'Apply default transition', category: 'editing' },
  { key: 't', command: 'edit.addTitle', description: 'Add title clip at playhead', category: 'editing' },
  { key: 'g', command: 'edit.group', description: 'Group selected clips', category: 'editing' },
  { key: 'g', shift: true, command: 'edit.ungroup', description: 'Ungroup selected clips', category: 'editing' },
  { key: 'd', shift: true, command: 'edit.detachAudio', description: 'Detach audio', category: 'editing' },
  { key: 'm', command: 'marker.add', description: 'Add marker at playhead', category: 'editing' },

  // --- Playback ----------------------------------------------------------
  { key: ' ', command: 'transport.playPause', description: 'Play / pause', category: 'playback' },
  { key: 'ArrowLeft', command: 'transport.stepBack', description: 'Step back one frame', category: 'playback' },
  { key: 'ArrowRight', command: 'transport.stepForward', description: 'Step forward one frame', category: 'playback' },

  // --- View --------------------------------------------------------------
  { key: '+', command: 'view.zoomIn', description: 'Zoom in', category: 'view' },
  { key: '=', command: 'view.zoomIn', description: 'Zoom in', category: 'view' },
  { key: '-', command: 'view.zoomOut', description: 'Zoom out', category: 'view' },
  { key: '_', command: 'view.zoomOut', description: 'Zoom out', category: 'view' },
  { key: 'm', shift: true, command: 'view.toggleMarkersPanel', description: 'Show / hide markers panel', category: 'view' },
  { key: '?', command: 'view.cheatSheet', description: 'Keyboard shortcuts', category: 'view' },

  // --- History -----------------------------------------------------------
  { key: 'z', mod: true, command: 'history.undo', description: 'Undo', category: 'history' },
  { key: 'z', mod: true, shift: true, command: 'history.redo', description: 'Redo', category: 'history' },
  { key: 'y', ctrl: true, command: 'history.redo', description: 'Redo', category: 'history' },
];

/** Keys whose glyph already implies Shift on common layouts; Shift is not compared for them. */
const SYMBOL_KEYS = new Set(['+', '=', '-', '_', '?', ' ']);

/** Commands that auto-repeat while the key is held; every other command fires once per press. */
const REPEATABLE: ReadonlySet<CommandId> = new Set([
  'transport.stepBack',
  'transport.stepForward',
  'view.zoomIn',
  'view.zoomOut',
]);

export function isRepeatable(command: CommandId): boolean {
  return REPEATABLE.has(command);
}

/** The slice of KeyboardEvent the matcher reads (keeps it testable without DOM events). */
export interface KeyEventLike {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

const normKey = (k: string): string => (k.length === 1 ? k.toLowerCase() : k);

function bindingMatches(b: KeyBinding, e: KeyEventLike): boolean {
  if (normKey(e.key) !== b.key) return false;
  if (e.altKey) return false; // Option/Alt combos belong to the OS (and type glyphs on macOS)
  if (b.ctrl) {
    if (!e.ctrlKey || e.metaKey) return false;
  } else if (b.mod) {
    if (!(e.metaKey || e.ctrlKey)) return false;
  } else if (e.metaKey || e.ctrlKey) {
    return false; // plain bindings never fire under Cmd/Ctrl — those are the browser's
  }
  if (!SYMBOL_KEYS.has(b.key) && !!b.shift !== e.shiftKey) return false;
  return true;
}

/** The binding a key event triggers, or null. First match in table order wins. */
export function matchBinding(e: KeyEventLike): KeyBinding | null {
  for (const b of KEYMAP) if (bindingMatches(b, e)) return b;
  return null;
}

/** Stable identity of a binding's key chord (used for the duplicate check). */
export function chordOf(b: KeyBinding): string {
  return `${b.ctrl ? 'ctrl+' : ''}${b.mod ? 'mod+' : ''}${b.shift && !SYMBOL_KEYS.has(b.key) ? 'shift+' : ''}${b.key}`;
}

// --- Display ----------------------------------------------------------------

const KEY_LABELS: Record<string, string> = {
  ' ': 'Space',
  ArrowLeft: '←',
  ArrowRight: '→',
  Delete: 'Del',
  Backspace: '⌫',
};

/** Human label for one binding, e.g. "⌘/Ctrl+Shift+Z". */
export function formatBinding(b: KeyBinding): string {
  const parts: string[] = [];
  if (b.mod) parts.push('⌘/Ctrl');
  if (b.ctrl) parts.push('Ctrl');
  if (b.shift && !SYMBOL_KEYS.has(b.key)) parts.push('Shift');
  parts.push(KEY_LABELS[b.key] ?? (b.key.length === 1 ? b.key.toUpperCase() : b.key));
  return parts.join('+');
}

export interface CheatSheetRow {
  command: CommandId;
  description: string;
  /** Every chord bound to the command, in table order. */
  keys: string[];
}

/** The table grouped by category, with commands that have several chords merged into one row. */
export function cheatSheetSections(): { category: KeymapCategory; rows: CheatSheetRow[] }[] {
  return KEYMAP_CATEGORIES.map((category) => {
    const rows: CheatSheetRow[] = [];
    for (const b of KEYMAP) {
      if (b.category !== category) continue;
      const existing = rows.find((r) => r.command === b.command);
      if (existing) existing.keys.push(formatBinding(b));
      else rows.push({ command: b.command, description: b.description, keys: [formatBinding(b)] });
    }
    return { category, rows };
  }).filter((s) => s.rows.length > 0);
}

// --- Focus guards -----------------------------------------------------------

/** The slice of an element the focus guard reads. */
export interface FocusTargetLike {
  tagName: string;
  isContentEditable?: boolean;
  type?: string;
  getAttribute?: (name: string) => string | null;
  closest?: (selector: string) => unknown;
}

const TEXT_INPUT_TYPES = new Set([
  '', 'text', 'search', 'url', 'tel', 'email', 'password', 'number', 'date', 'datetime-local', 'month', 'time', 'week',
]);

/**
 * Whether a keydown aimed at `target` must be left alone. Text entry and
 * dialogs/menus swallow everything. A focused BUTTON only keeps Space/Enter
 * (they activate it), so clicking a palette button never kills V/C/Y/… ; arrows
 * are left to sliders, listboxes and menus.
 */
export function shouldIgnoreKeyEvent(e: { key: string }, target: FocusTargetLike | null): boolean {
  if (!target) return false;
  const tag = target.tagName.toUpperCase();
  if (tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return true;
  if (tag === 'INPUT') {
    const type = (target.type ?? '').toLowerCase();
    if (TEXT_INPUT_TYPES.has(type)) return true;
    // checkbox / radio / range: they own Space and the arrows
    if (e.key === ' ' || e.key.startsWith('Arrow')) return true;
  }
  const role = target.getAttribute?.('role') ?? '';
  if (role === 'textbox' || role === 'combobox' || role === 'searchbox' || role === 'spinbutton') return true;
  if (
    (role === 'slider' || role === 'listbox' || role === 'menu' || role === 'menuitem' || role === 'tab') &&
    (e.key.startsWith('Arrow') || e.key === ' ')
  ) {
    return true;
  }
  if (tag === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return true;
  if (target.closest?.('[role="dialog"], [role="alertdialog"], [role="menu"]')) return true;
  return false;
}
