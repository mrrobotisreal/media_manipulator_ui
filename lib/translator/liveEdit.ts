/**
 * Live edit (MM53 decision 5; design §2.11; research §2.4, §2.5 option 3).
 *
 * TRANSLATOR DEPLOYMENTS ONLY (loaded inside the workbench chunk).
 *
 * An edit reaches the page two ways at once:
 *   1. i18n store: `i18n.addResource(locale, ns, key, value)` (not silent), so every
 *      client component re-renders through react-i18next (`bindI18nStore: "added removed"`).
 *   2. DOM: `DomScanner.patchTextNode` rewrites every text node / attribute the scanner
 *      mapped to the key, so SERVER-rendered text updates with no round trip.
 *
 * Re-apply (drafts win, always last):
 *   - scanner link events (a client navigation or a React re-render put a fresh node
 *     with the deployed text on the page) -> re-patch that key's nodes;
 *   - a bundle merged into the locale's store (`lib/i18n/ensureShard.ts` merges
 *     forms/panels with overwrite: true, which would clobber a draft) and
 *     `languageChanged` -> re-add every draft to the store. Shard first, drafts last.
 *
 * Interpolated server strings: the browser does not know the params a server
 * component passed. Each node remembers the template that produced its current text
 * (initially the deployed one); the params are recovered by matching that template
 * against the text (`3 files` vs `{{count}} files` -> count = 3) and substituted into
 * the new template. When that fails, the params the marker plugin recorded for
 * client strings are used; when those are missing too the token stays literal and
 * the key is flagged "preview approximate". `<Trans>` strings are never DOM-patched
 * (their marker sits in the last text node only): client ones re-render through the
 * store, server ones are flagged approximate and previewed in the panel.
 */
import type { KeySite, PatchValue } from './domScanner';
import type { RegistryEntry } from './keyRegistry';
import type { MarkerRef } from './mode';

/** `{{name}}`, `{{name, format}}`, `{{- name}}`, and `$t(key, {...})` nesting. */
const TOKEN_RE = /\{\{[^{}]*\}\}|\$t\((?:[^()]|\([^()]*\))*\)/g;

const tokenId = (raw: string) => raw.replace(/\s+/g, '');

/** Placeholder name of a `{{…}}` token (`{{count, number}}` -> `count`), else null. */
function placeholderName(raw: string): string | null {
  const m = /^\{\{-?\s*([^,}\s]+)/.exec(raw);
  return m ? m[1] : null;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type Part = { token: false; text: string } | { token: true; raw: string };

function parts(template: string): Part[] {
  const out: Part[] = [];
  let last = 0;
  for (const m of template.matchAll(TOKEN_RE)) {
    if (m.index > last) out.push({ token: false, text: template.slice(last, m.index) });
    out.push({ token: true, raw: m[0] });
    last = m.index + m[0].length;
  }
  if (last < template.length) out.push({ token: false, text: template.slice(last) });
  return out;
}

export function hasTokens(template: string): boolean {
  TOKEN_RE.lastIndex = 0;
  return new RegExp(TOKEN_RE.source).test(template);
}

/**
 * Token values recovered by matching `template` against `rendered`, or null when the
 * text does not fit the template. A template without tokens matches only itself.
 */
export function recoverTokens(template: string, rendered: string): Map<string, string> | null {
  const ps = parts(template);
  const tokens = ps.filter((p): p is Extract<Part, { token: true }> => p.token);
  if (tokens.length === 0) return template === rendered ? new Map() : null;
  const re = new RegExp(`^${ps.map((p) => (p.token ? '([\\s\\S]*?)' : escapeRe(p.text))).join('')}$`);
  const m = re.exec(rendered);
  if (!m) return null;
  const out = new Map<string, string>();
  for (let i = 0; i < tokens.length; i++) {
    const id = tokenId(tokens[i].raw);
    const v = m[i + 1];
    if (out.has(id) && out.get(id) !== v) return null;
    out.set(id, v);
  }
  return out;
}

/** `template` with each token replaced by its recovered value or a known param; `missing` counts the rest. */
export function renderTemplate(
  template: string,
  recovered: Map<string, string> | null,
  params?: Record<string, unknown>,
): { text: string; missing: number } {
  let missing = 0;
  const text = parts(template)
    .map((p) => {
      if (!p.token) return p.text;
      const known = recovered?.get(tokenId(p.raw));
      if (known !== undefined) return known;
      const name = placeholderName(p.raw);
      const param = name && params ? params[name] : undefined;
      if (param !== undefined && param !== null && !p.raw.includes(',')) return String(param);
      missing++;
      return p.raw;
    })
    .join('');
  return { text, missing };
}

/* ------------------------------------------------------------------------- */

/** The i18next surface live edit uses (the browser instance in the deployment). */
export interface I18nLike {
  addResource(lng: string, ns: string, key: string, value: string, options?: { silent?: boolean }): unknown;
  on(event: 'languageChanged', cb: (lng: string) => void): unknown;
  off(event: 'languageChanged', cb: (lng: string) => void): unknown;
  // i18next types the store callback as (lng, ns); at runtime `added` also passes the
  // key (addResource) or the merged resources (addResourceBundle) as a third argument.
  store: {
    on(event: 'added', cb: (lng: string, ns: string) => void): unknown;
    off(event: 'added', cb: (lng: string, ns: string) => void): unknown;
  };
}

export interface ScannerLike {
  patchTextNode(ref: MarkerRef, value: string | PatchValue): number;
  subscribeLinks(cb: (refs: RegistryEntry[]) => void): () => void;
}

export interface RegistryLike {
  get(ref: MarkerRef): RegistryEntry | undefined;
}

/** One editable key as live edit needs it. */
export interface LiveTarget {
  ns: string;
  key: string;
  /** Uses `<Trans>` tags: never DOM-patched. */
  trans: boolean;
  /** The deployed file value (undefined for a new key; revert restores it). */
  base: string | undefined;
  /** What the deployed page renders for the key (base, else the English fallback). */
  deployed: string;
}

const refKey = (ns: string, key: string) => `${ns}:${key}`;

export class LiveEditor {
  private drafts = new Map<string, { target: LiveTarget; value: string }>();
  private approx = new Set<string>();
  /** node -> site:ns:key -> template that produced its current text. */
  private nodeTemplates = new WeakMap<object, Map<string, string>>();
  private detachers: Array<() => void> = [];
  private listeners = new Set<() => void>();

  constructor(
    private readonly deps: {
      locale: string;
      i18n: I18nLike | null;
      scanner: ScannerLike | null;
      registry: RegistryLike | null;
    },
  ) {}

  /** Applies a draft (`value`) or reverts to the deployed state (`undefined`). */
  set(target: LiveTarget, value: string | undefined): void {
    const id = refKey(target.ns, target.key);
    if (value === undefined) this.drafts.delete(id);
    else this.drafts.set(id, { target, value });
    this.writeStore(target, value === undefined ? target.base : value);
    this.patchDom(target, value ?? target.deployed);
  }

  isApproximate(ns: string, key: string): boolean {
    return this.approx.has(refKey(ns, key));
  }

  /** Notified when the approximate set changes. */
  subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  /** Wires the re-apply paths. Returns the detach function (also `dispose`). */
  attach(): () => void {
    const { i18n, scanner, locale } = this.deps;
    if (scanner) {
      this.detachers.push(
        scanner.subscribeLinks((refs) => {
          for (const r of refs) {
            if (r.lng !== locale) continue;
            const d = this.drafts.get(refKey(r.ns, r.key));
            if (d) this.patchDom(d.target, d.value);
          }
        }),
      );
    }
    if (i18n) {
      // Bundle merges (addResourceBundle / addResources) pass an object; our own
      // addResource calls pass a string key and are ignored (no loop).
      const onAdded = (lng: string, ns: string, ...rest: unknown[]) => {
        if (lng !== locale || typeof rest[0] === 'string') return;
        this.reapplyStore(ns);
      };
      const onLanguage = () => this.reapplyStore();
      i18n.store.on('added', onAdded);
      i18n.on('languageChanged', onLanguage);
      this.detachers.push(
        () => i18n.store.off('added', onAdded),
        () => i18n.off('languageChanged', onLanguage),
      );
    }
    return () => this.dispose();
  }

  /** Re-adds every draft (optionally of one namespace) to the store. */
  reapplyStore(ns?: string): void {
    for (const { target, value } of this.drafts.values()) {
      if (ns === undefined || target.ns === ns) this.writeStore(target, value);
    }
  }

  dispose(): void {
    for (const off of this.detachers.splice(0)) off();
    this.listeners.clear();
  }

  private writeStore(target: LiveTarget, value: string | undefined): void {
    const { i18n, locale } = this.deps;
    if (!i18n) return;
    try {
      // `undefined` (revert of a new key) makes i18next fall back to English again.
      i18n.addResource(locale, target.ns, target.key, value as string);
    } catch {
      // A store failure must never break the page; the DOM patch still shows the edit.
    }
  }

  private patchDom(target: LiveTarget, template: string): void {
    const { scanner, registry, locale } = this.deps;
    if (!scanner) return;
    const id = refKey(target.ns, target.key);
    const ref: MarkerRef = { ns: target.ns, key: target.key, lng: locale };
    const entry = registry?.get(ref);
    const clientRendered = entry?.template !== undefined;
    let approximate = false;
    if (target.trans) {
      approximate = !clientRendered;
    } else {
      try {
        const params = entry?.count !== undefined ? { count: entry.count, ...entry.params } : entry?.params;
        scanner.patchTextNode(ref, (current: string, site: KeySite, node: Text | Element) => {
          const slot = `${site}|${id}`;
          let map = this.nodeTemplates.get(node);
          if (!map) {
            map = new Map();
            this.nodeTemplates.set(node, map);
          }
          // Already showing this template (React re-rendered a client string from the
          // store, or an earlier patch): leave the node alone.
          if (recoverTokens(template, current) !== null) {
            map.set(slot, template);
            return current;
          }
          const prev = map.get(slot) ?? target.deployed;
          const recovered =
            recoverTokens(prev, current) ?? (entry?.template !== undefined ? recoverTokens(entry.template, current) : null);
          const { text, missing } = renderTemplate(template, recovered, params);
          if (missing) approximate = true;
          map.set(slot, template);
          return text;
        });
      } catch {
        approximate = true;
      }
    }
    const was = this.approx.has(id);
    if (approximate) this.approx.add(id);
    else this.approx.delete(id);
    if (was !== approximate) for (const l of this.listeners) l();
  }
}
