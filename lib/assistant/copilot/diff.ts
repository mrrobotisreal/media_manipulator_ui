/**
 * MM114: the leaf-by-leaf `before → after` values of the staged diff card. Pure: two plain
 * values in, the changed leaves out (capped, so a whole-document change stays readable).
 */
import type { CopilotValueChange } from './types';

const MAX_VALUES = 8;

export function formatValue(v: unknown, t: (key: string) => string): string {
  if (v === undefined || v === null) return '—';
  if (typeof v === 'number') return String(Math.round(v * 1000) / 1000);
  if (typeof v === 'boolean') return t(v ? 'assistant.copilot.staged.on' : 'assistant.copilot.staged.off');
  if (typeof v === 'string') return v.length > 24 ? `${v.slice(0, 23)}…` : v;
  return JSON.stringify(v).slice(0, 40);
}

/** Changed leaves of `after` against `before`; `label(path)` names a path (default: the path). */
export function leafChanges(before: unknown, after: unknown, t: (key: string) => string, label: (path: string) => string = (p) => p): CopilotValueChange[] {
  const out: CopilotValueChange[] = [];
  const walk = (a: unknown, b: unknown, path: string) => {
    if (out.length >= MAX_VALUES) return;
    if (Array.isArray(a) || Array.isArray(b)) {
      if (JSON.stringify(a) !== JSON.stringify(b)) out.push({ label: label(path), before: formatValue(Array.isArray(a) ? `[${a.length}]` : a, t), after: formatValue(Array.isArray(b) ? `[${b.length}]` : b, t) });
      return;
    }
    const oa = a && typeof a === 'object';
    const ob = b && typeof b === 'object';
    if (oa || ob) {
      const keys = new Set([...Object.keys((oa ? a : {}) as object), ...Object.keys((ob ? b : {}) as object)]);
      for (const k of Array.from(keys).sort()) walk((oa ? a : {}) && (a as Record<string, unknown> | undefined)?.[k], (ob ? b : {}) && (b as Record<string, unknown> | undefined)?.[k], path ? `${path}.${k}` : k);
      return;
    }
    if (a !== b) out.push({ label: label(path), before: formatValue(a, t), after: formatValue(b, t) });
  };
  walk(before, after, '');
  return out;
}

/** `localized(key)` when the catalog has it (the result is not the key itself), else `fallback`. */
export function labelOr(t: (key: string) => string, key: string, fallback: string): string {
  const v = t(key);
  return v && v !== key ? v : fallback;
}
