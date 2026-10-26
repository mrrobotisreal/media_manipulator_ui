/**
 * Translator validators (MM53). Pure, warn-only, dependency-free (no module
 * dependencies of any kind) so the browser panel and the Node route handler
 * (MM54) can share this one file.
 */

export const WARNING_CODES = [
  'placeholder_missing',
  'placeholder_extra',
  'plural_forms',
  'tag_unbalanced',
  'empty',
  'same_as_english',
  'whitespace_drift',
  'nesting_changed',
] as const;
export type WarningCode = (typeof WARNING_CODES)[number];

export const PLURAL_CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other'] as const;
export type PluralCategory = (typeof PLURAL_CATEGORIES)[number];

export interface ValidationWarning {
  code: WarningCode;
  key: string;
  id: string;
  message: string;
  tokens?: string[];
}

function warn(code: WarningCode, key: string, message: string, tokens?: string[]): ValidationWarning {
  const w: ValidationWarning = { code, key, id: `${key}#${code}`, message };
  if (tokens && tokens.length > 0) w.tokens = tokens;
  return w;
}

function isCategory(s: string): s is PluralCategory {
  return (PLURAL_CATEGORIES as readonly string[]).includes(s);
}

export function pluralCategories(
  locale: string,
  rules?: { resolvedOptions(): { pluralCategories: readonly string[] } },
): PluralCategory[] {
  try {
    const r = rules ?? new Intl.PluralRules(locale);
    const reported = r.resolvedOptions().pluralCategories;
    const out = PLURAL_CATEGORIES.filter((c) => reported.includes(c));
    return out.length > 0 ? out : ['one', 'other'];
  } catch {
    return ['one', 'other'];
  }
}

export function splitPluralKey(key: string): { base: string; category: PluralCategory } | null {
  const i = key.lastIndexOf('_');
  if (i <= 0) return null;
  const category = key.slice(i + 1);
  if (!isCategory(category)) return null;
  const base = key.slice(0, i);
  if (base === '' || base.endsWith('.')) return null;
  return { base, category };
}

export function extractPlaceholders(text: string): string[] {
  const out: string[] = [];
  try {
    const re = /\{\{([^{}]*)\}\}/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      let inner = m[1].trim();
      if (inner.startsWith('-')) inner = inner.slice(1).trim();
      const comma = inner.indexOf(',');
      if (comma === -1) {
        out.push(inner.replace(/\s+/g, ' '));
      } else {
        const name = inner.slice(0, comma).trim();
        const fmt = inner.slice(comma + 1).trim().replace(/\s+/g, ' ');
        out.push(`${name}, ${fmt}`);
      }
    }
  } catch {
    /* never throw */
  }
  return out;
}

export function extractTags(text: string): { names: string[]; balanced: boolean } {
  const names: string[] = [];
  let balanced = true;
  try {
    const re = /<(\/)?([A-Za-z0-9][A-Za-z0-9_-]*)\s*(\/)?>/g;
    const stack: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const closing = m[1] === '/';
      const selfClosing = m[3] === '/';
      const name = m[2];
      if (closing && selfClosing) {
        balanced = false;
        continue;
      }
      if (closing) {
        if (stack.length > 0 && stack[stack.length - 1] === name) stack.pop();
        else balanced = false;
      } else {
        names.push(name);
        if (!selfClosing) stack.push(name);
      }
    }
    if (stack.length > 0) balanced = false;
  } catch {
    /* never throw */
  }
  return { names, balanced };
}

export function extractNesting(text: string): string[] {
  const out: string[] = [];
  try {
    let from = 0;
    for (;;) {
      const start = text.indexOf('$t(', from);
      if (start === -1) break;
      let depth = 1;
      let i = start + 3;
      for (; i < text.length && depth > 0; i++) {
        if (text[i] === '(') depth++;
        else if (text[i] === ')') depth--;
      }
      if (depth !== 0) break;
      const inner = text.slice(start + 3, i - 1).replace(/\s+/g, ' ').trim();
      out.push(inner.replace(/\s*,\s*/, ', '));
      from = i;
    }
  } catch {
    /* never throw */
  }
  return out;
}

export interface ValueInput {
  key: string;
  value: string;
  english: string | undefined;
  locale: string;
  englishForms?: Partial<Record<PluralCategory, string>>;
}

function counts(items: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const i of items) m.set(i, (m.get(i) ?? 0) + 1);
  return m;
}

/** Items of `a` not covered by `b`, as a multiset difference (unique list out). */
function multisetDiff(a: string[], b: string[]): string[] {
  const left = counts(b);
  const out: string[] = [];
  for (const item of a) {
    const n = left.get(item) ?? 0;
    if (n > 0) left.set(item, n - 1);
    else if (!out.includes(item)) out.push(item);
  }
  return out;
}

function isCountToken(t: string): boolean {
  return t === 'count' || t.startsWith('count,');
}

function braces(tokens: string[]): string[] {
  return tokens.map((t) => `{{${t}}}`);
}

function sortedEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const x = [...a].sort();
  const y = [...b].sort();
  return x.every((v, i) => v === y[i]);
}

function stripSyntax(text: string): string {
  return text
    .replace(/\{\{[^{}]*\}\}/g, '')
    .replace(/<\/?[A-Za-z0-9][A-Za-z0-9_-]*\s*\/?>/g, '')
    .replace(/\$t\([^)]*\)/g, '');
}

export function validateValue(input: ValueInput): ValidationWarning[] {
  try {
    return validateValueUnsafe(input);
  } catch {
    return [];
  }
}

function validateValueUnsafe(input: ValueInput): ValidationWarning[] {
  const { key, locale } = input;
  const value = typeof input.value === 'string' ? input.value : '';
  const english = input.english;
  const out: ValidationWarning[] = [];

  if (value.trim() === '') {
    if (english === undefined || english.trim() !== '') {
      out.push(warn('empty', key, 'Translation is empty'));
    }
    return out;
  }

  const plural = splitPluralKey(key);
  const forms = input.englishForms;
  const formValues = forms ? Object.values(forms).filter((v): v is string => typeof v === 'string') : [];
  const isPluralForm = plural !== null && formValues.length > 0;

  // Placeholders
  const valueTokens = extractPlaceholders(value);
  if (isPluralForm && plural) {
    const expected = extractPlaceholders(forms?.other ?? formValues[0]);
    const union = new Set(formValues.flatMap(extractPlaceholders));
    let missing = multisetDiff(expected, valueTokens);
    if (plural.category === 'zero' || plural.category === 'one' || plural.category === 'two') {
      missing = missing.filter((t) => !isCountToken(t));
    }
    const extra = [...new Set(valueTokens.filter((t) => !union.has(t)))];
    if (missing.length) {
      out.push(warn('placeholder_missing', key, `Missing placeholder ${braces(missing).join(', ')}`, braces(missing)));
    }
    if (extra.length) {
      out.push(warn('placeholder_extra', key, `Unexpected placeholder ${braces(extra).join(', ')}`, braces(extra)));
    }
  } else if (english !== undefined) {
    const enTokens = extractPlaceholders(english);
    const missing = multisetDiff(enTokens, valueTokens);
    const extra = multisetDiff(valueTokens, enTokens);
    if (missing.length) {
      out.push(warn('placeholder_missing', key, `Missing placeholder ${braces(missing).join(', ')}`, braces(missing)));
    }
    if (extra.length) {
      out.push(warn('placeholder_extra', key, `Unexpected placeholder ${braces(extra).join(', ')}`, braces(extra)));
    }
  }

  // Tags
  const vt = extractTags(value);
  if (english === undefined) {
    if (!vt.balanced) out.push(warn('tag_unbalanced', key, 'Tags are unbalanced'));
  } else {
    const et = extractTags(english);
    if ((!vt.balanced && et.balanced) || !sortedEqual(vt.names, et.names)) {
      const diff = [...multisetDiff(et.names, vt.names), ...multisetDiff(vt.names, et.names)];
      out.push(
        warn(
          'tag_unbalanced',
          key,
          vt.balanced ? 'Tags differ from the English source' : 'Tags are unbalanced',
          diff.map((n) => `<${n}>`),
        ),
      );
    }
  }

  if (english !== undefined) {
    // Same as English
    if (
      value === english &&
      !locale.toLowerCase().startsWith('en') &&
      /\p{L}/u.test(stripSyntax(value))
    ) {
      out.push(warn('same_as_english', key, 'Identical to the English source'));
    }

    // Whitespace
    const lead = (s: string) => /^\s*/.exec(s)?.[0] ?? '';
    const trail = (s: string) => /\s*$/.exec(s)?.[0] ?? '';
    if (lead(value) !== lead(english) || trail(value) !== trail(english)) {
      out.push(warn('whitespace_drift', key, 'Leading or trailing whitespace differs from the English source'));
    }

    // Nesting
    const vn = extractNesting(value);
    const en = extractNesting(english);
    if (!sortedEqual(vn, en)) {
      const diff = [...multisetDiff(en, vn), ...multisetDiff(vn, en)];
      out.push(warn('nesting_changed', key, 'Nested $t() references differ from the English source', diff));
    }
  }

  return out;
}

export interface PluralGroupInput {
  base: string;
  locale: string;
  forms: Partial<Record<PluralCategory, string>>;
  categories?: readonly PluralCategory[];
}

export function validatePluralGroup(input: PluralGroupInput): ValidationWarning[] {
  try {
    const required = input.categories ?? pluralCategories(input.locale);
    const tokens: string[] = [];
    for (const c of PLURAL_CATEGORIES) {
      const v = input.forms[c];
      const present = typeof v === 'string' && v.trim() !== '';
      if (required.includes(c) && !present) tokens.push(`missing:${c}`);
    }
    for (const c of PLURAL_CATEGORIES) {
      if (!required.includes(c) && input.forms[c] !== undefined) tokens.push(`surplus:${c}`);
    }
    if (tokens.length === 0) return [];
    const missing = tokens.filter((t) => t.startsWith('missing:')).map((t) => t.slice(8));
    const surplus = tokens.filter((t) => t.startsWith('surplus:')).map((t) => t.slice(8));
    const parts: string[] = [];
    if (missing.length) parts.push(`missing ${missing.join(', ')}`);
    if (surplus.length) parts.push(`surplus ${surplus.join(', ')}`);
    return [warn('plural_forms', input.base, `Plural forms for ${input.locale}: ${parts.join('; ')}`, tokens)];
  } catch {
    return [];
  }
}

export function validateKeys(input: {
  locale: string;
  keys: string[];
  values: Record<string, string>;
  english: Record<string, string>;
  categories?: readonly PluralCategory[];
}): ValidationWarning[] {
  const { locale, keys, values, english, categories } = input;
  const out: ValidationWarning[] = [];
  const seen = new Set<string>();
  const push = (ws: ValidationWarning[]) => {
    for (const w of ws) {
      if (!seen.has(w.id)) {
        seen.add(w.id);
        out.push(w);
      }
    }
  };
  const groups = new Set<string>();
  const formsOf = (base: string, src: Record<string, string>) => {
    const f: Partial<Record<PluralCategory, string>> = {};
    for (const c of PLURAL_CATEGORIES) {
      const v = src[`${base}_${c}`];
      if (typeof v === 'string') f[c] = v;
    }
    return f;
  };
  try {
    for (const key of keys) {
      const split = splitPluralKey(key);
      const englishForms = split ? formsOf(split.base, english) : undefined;
      push(
        validateValue({
          key,
          value: values[key] ?? '',
          english: english[key],
          locale,
          englishForms: englishForms && Object.keys(englishForms).length > 0 ? englishForms : undefined,
        }),
      );
      if (split) groups.add(split.base);
    }
    for (const base of groups) {
      push(validatePluralGroup({ base, locale, forms: formsOf(base, values), categories }));
    }
  } catch {
    /* never throw */
  }
  return out;
}
