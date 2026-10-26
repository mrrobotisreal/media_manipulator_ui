/**
 * The workbench key table (MM53): every editable key of the translator locale,
 * with its English source, deployed value, shard, and CLDR plural grouping.
 *
 * Pure. Built once per session from `loadTranslatorShards()`.
 *
 * Plural groups (decision 6): keys whose base has `_zero/_one/_two/_few/_many/_other`
 * siblings (at least one `_other` in English or the locale) form one group. The
 * required forms come from `Intl.PluralRules` (`pluralCategories`). A required
 * form the file lacks becomes a NEW entry (`isNew`, no deployed value) for the
 * translator to fill; MM54's writer inserts it after the group's last sibling.
 * Existing forms the language does not use stay visible, flagged as surplus.
 */
import type { LoadedShard } from './shardSource';
import { PLURAL_CATEGORIES, pluralCategories, splitPluralKey, type PluralCategory } from './validators';

export interface KeyEntry {
  /** `${file}|${key}` (also the React key and the draft id suffix). */
  id: string;
  file: string;
  shard: string;
  ns: string;
  key: string;
  /** `interface › pages` */
  group: string;
  english: string | undefined;
  /** The deployed value of the locale file; undefined for a new key. */
  base: string | undefined;
  isNew: boolean;
  /** Uses `<Trans>`-style tags (edits as a raw template with a preview). */
  trans: boolean;
  plural: { groupId: string; base: string; category: PluralCategory; required: boolean } | null;
}

export interface PluralGroup {
  id: string;
  file: string;
  ns: string;
  base: string;
  group: string;
  required: PluralCategory[];
  /** Canonical category order: required forms first-class, surplus flagged on the entry. */
  forms: KeyEntry[];
  englishForms: Partial<Record<PluralCategory, string>>;
}

const TAG_RE = /<\/?(?:[A-Za-z][A-Za-z0-9_-]*|\d+)\s*\/?>/;

export function groupLabel(shard: string): string {
  return shard.split('/').join(' › ');
}

export class KeyTable {
  readonly entries: KeyEntry[];
  readonly groups: Map<string, PluralGroup>;
  private byIdMap: Map<string, KeyEntry>;
  private byRefMap: Map<string, KeyEntry>;

  constructor(
    readonly locale: string,
    entries: KeyEntry[],
    groups: Map<string, PluralGroup>,
  ) {
    this.entries = entries;
    this.groups = groups;
    this.byIdMap = new Map(entries.map((e) => [e.id, e]));
    this.byRefMap = new Map();
    // First file wins on an ns:key clash (shards own disjoint top-level keys today).
    for (const e of entries) if (!this.byRefMap.has(`${e.ns}:${e.key}`)) this.byRefMap.set(`${e.ns}:${e.key}`, e);
  }

  byId(id: string): KeyEntry | undefined {
    return this.byIdMap.get(id);
  }

  /** The entry a marker ref (`ns`, resolved `key`) points at. */
  byRef(ns: string, key: string): KeyEntry | undefined {
    return this.byRefMap.get(`${ns}:${key}`);
  }

  groupOf(entry: KeyEntry): PluralGroup | undefined {
    return entry.plural ? this.groups.get(entry.plural.groupId) : undefined;
  }

  get size(): number {
    return this.entries.length;
  }
}

export function buildKeyTable(
  locale: string,
  shards: LoadedShard[],
  categories: readonly PluralCategory[] = pluralCategories(locale),
): KeyTable {
  const required = PLURAL_CATEGORIES.filter((c) => categories.includes(c));
  const entries: KeyEntry[] = [];
  const groups = new Map<string, PluralGroup>();

  for (const s of shards) {
    const group = groupLabel(s.shard);
    // English order first (the source of truth), then keys only the locale has.
    const keys = [...Object.keys(s.english), ...Object.keys(s.values).filter((k) => !(k in s.english))];

    // Plural bases: a base with an `_other` form in English or the locale.
    const bases = new Set<string>();
    for (const k of keys) {
      const p = splitPluralKey(k);
      if (p?.category === 'other') bases.add(p.base);
    }

    const emitted = new Set<string>();
    const push = (key: string, extra: Partial<KeyEntry> = {}) => {
      if (emitted.has(key)) return;
      emitted.add(key);
      const english = s.english[key];
      const base = s.values[key];
      entries.push({
        id: `${s.file}|${key}`,
        file: s.file,
        shard: s.shard,
        ns: s.ns,
        key,
        group,
        english,
        base,
        isNew: base === undefined,
        trans: TAG_RE.test(english ?? base ?? ''),
        plural: null,
        ...extra,
      });
    };

    for (const k of keys) {
      const p = splitPluralKey(k);
      if (!p || !bases.has(p.base)) {
        push(k);
        continue;
      }
      const groupId = `${s.file}|${p.base}`;
      if (groups.has(groupId)) continue;
      // The whole group goes in at its first sibling's position.
      const englishForms: Partial<Record<PluralCategory, string>> = {};
      for (const c of PLURAL_CATEGORIES) {
        const v = s.english[`${p.base}_${c}`];
        if (v !== undefined) englishForms[c] = v;
      }
      const present = PLURAL_CATEGORIES.filter(
        (c) => s.values[`${p.base}_${c}`] !== undefined || s.english[`${p.base}_${c}`] !== undefined,
      );
      const cats = PLURAL_CATEGORIES.filter((c) => required.includes(c) || present.includes(c));
      const forms: KeyEntry[] = [];
      for (const c of cats) {
        const key = `${p.base}_${c}`;
        push(key, {
          plural: { groupId, base: p.base, category: c, required: required.includes(c) },
        });
        forms.push(entries[entries.length - 1]);
      }
      groups.set(groupId, { id: groupId, file: s.file, ns: s.ns, base: p.base, group, required, forms, englishForms });
    }
  }
  return new KeyTable(locale, entries, groups);
}
