/**
 * Key registry (MM52, design §2.9): marker index <-> `{ ns, key, lng }`.
 *
 * DETERMINISTIC, CONTENT-DERIVED INDEX (ticket decision 4, hydration safety).
 * The same string must carry the same marker whether a server component, the
 * SSR pass of a client component or the browser rendered it, so the index can
 * never be a render-order counter. It is
 *
 *     index = localeSlot(lng) * 2^32 + fnv1a32(ns + ':' + resolvedKey)
 *
 * where `localeSlot` is the locale's position in `i18n/locales.ts` (255 for an
 * unregistered language) and the hash is 32-bit FNV-1a with a fixed seed. Every
 * renderer computes it from the key alone, with no shared state.
 *
 * The hash is checked collision-free over the union of every locale's shard key
 * list, plural forms expanded (`keyRegistry.test.ts`); if a future key ever
 * collides, that test fails and `HASH_SEED` is bumped. That key list is also the
 * lookup table for markers the browser did not mint itself (server-rendered
 * text): `seedFromResources` fills it, `resolve()` reads it.
 */
import { locales } from '@/i18n/locales';
import type { MarkerRef } from './mode';

export type { MarkerRef } from './mode';

/** FNV-1a offset basis XOR a project seed. Bump only when the collision test fails. */
export const HASH_SEED = 0x811c9dc5 ^ 0x4d4d3532; // "MM52"
const FNV_PRIME = 0x01000193;
const UNKNOWN_LOCALE_SLOT = 255;
const SLOT_FACTOR = 2 ** 32;

const PLURAL_SUFFIXES = ['zero', 'one', 'two', 'few', 'many', 'other'] as const;
const PLURAL_RE = /_(zero|one|two|few|many|other)$/;

/**
 * Leaf names that are identifiers, not copy, and must stay byte-exact even in
 * translator mode (e.g. `privacyPolicy.sections.N.id` becomes an element `id`
 * that `#retention` links target). They are never marked.
 */
const UNMARKED_LEAVES = new Set(['id']);

/** 32-bit FNV-1a over UTF-16 code units. */
export function fnv1a32(text: string): number {
  let h = HASH_SEED >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, FNV_PRIME) >>> 0;
  }
  return h >>> 0;
}

const slotByCode = new Map(locales.map((l, i) => [l.code.toLowerCase(), i]));

export function localeSlot(lng: string): number {
  return slotByCode.get(lng.toLowerCase()) ?? UNKNOWN_LOCALE_SLOT;
}

/** The marker index for a reference. Pure; identical on server and client. */
export function markerIndex(ref: MarkerRef): number {
  return localeSlot(ref.lng) * SLOT_FACTOR + fnv1a32(`${ref.ns}:${ref.key}`);
}

/** False for identifier leaves that must never carry a marker. */
export function shouldMarkKey(key: string): boolean {
  const leaf = key.slice(key.lastIndexOf('.') + 1);
  return !UNMARKED_LEAVES.has(leaf);
}

/** `foo_one` -> `foo`; any other key unchanged. */
export function pluralBase(key: string): string {
  return key.replace(PLURAL_RE, '');
}

/** Stable string id for a reference (map keys, React keys in MM53). */
export function refId(ref: MarkerRef): string {
  return `${ref.lng}|${ref.ns}|${ref.key}`;
}

export interface RegistryEntry extends MarkerRef {
  index: number;
  /** Raw template before interpolation (`Hello {{name}}`, `<0>Trans</0>` source). */
  template?: string;
  /** Last-seen interpolation params (MM53 previews interpolated strings with them). */
  params?: Record<string, unknown>;
  count?: number;
  context?: string;
}

/** Every dotted leaf path in a nested resource object (array items as `.N`). */
export function leafKeys(tree: unknown, prefix = ''): string[] {
  const out: string[] = [];
  const walk = (node: unknown, path: string) => {
    if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, path ? `${path}.${i}` : String(i)));
    } else if (node !== null && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
    } else if (path) {
      out.push(path);
    }
  };
  walk(tree, prefix);
  return out;
}

/** A key list with every plural key expanded to all six CLDR suffixes. */
export function withPluralForms(keys: Iterable<string>): string[] {
  const out = new Set<string>();
  for (const key of keys) {
    out.add(key);
    if (PLURAL_RE.test(key)) {
      const base = pluralBase(key);
      for (const s of PLURAL_SUFFIXES) out.add(`${base}_${s}`);
    }
  }
  return [...out];
}

type Listener = (entry: RegistryEntry) => void;

/**
 * Index -> entry, per page load. Entries come from two places: strings minted in
 * this JS realm (`record`, with the raw template and params) and the shard key
 * table (`seedKeys`), which resolves markers minted elsewhere (server HTML).
 */
export class KeyRegistry {
  private entries = new Map<number, RegistryEntry>();
  /** ns:key per hash, locale-independent (keys are identical across locales). */
  private keyTable = new Map<number, { ns: string; key: string }>();
  private listeners = new Set<Listener>();

  record(ref: MarkerRef, extra?: Omit<RegistryEntry, keyof MarkerRef | 'index'>): number {
    const index = markerIndex(ref);
    const prev = this.entries.get(index);
    const next: RegistryEntry = { ...prev, ...ref, ...extra, index };
    this.entries.set(index, next);
    if (!prev) for (const l of this.listeners) l(next);
    return index;
  }

  /** Adds `ns:key` pairs to the lookup table used by `resolve`. */
  seedKeys(ns: string, keys: Iterable<string>): void {
    for (const key of withPluralForms(keys)) this.keyTable.set(fnv1a32(`${ns}:${key}`), { ns, key });
  }

  /** Seeds from a namespace's resource tree (`{ interface: {...}, error: {...} }` shape per ns). */
  seedFromResources(ns: string, tree: unknown): void {
    this.seedKeys(ns, leafKeys(tree));
  }

  get tableSize(): number {
    return this.keyTable.size;
  }

  /** The reference behind a marker index, or `undefined` when unknown. */
  resolve(index: number): RegistryEntry | undefined {
    const known = this.entries.get(index);
    if (known) return known;
    const slot = Math.floor(index / SLOT_FACTOR);
    const hit = this.keyTable.get(index % SLOT_FACTOR);
    const locale = locales[slot];
    if (!hit || !locale) return undefined;
    const entry: RegistryEntry = { ...hit, lng: locale.code, index };
    this.entries.set(index, entry);
    return entry;
  }

  get(ref: MarkerRef): RegistryEntry | undefined {
    return this.resolve(markerIndex(ref));
  }

  all(): RegistryEntry[] {
    return [...this.entries.values()];
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  clear(): void {
    this.entries.clear();
    this.keyTable.clear();
  }
}

/** The page's registry (one per JS realm; translator deployments only). */
export const keyRegistry = new KeyRegistry();
