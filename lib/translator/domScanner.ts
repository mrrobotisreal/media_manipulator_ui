/**
 * DOM scanner (MM52, design §2.9): turns the live DOM into a `key <-> Element` map.
 *
 * TRANSLATOR DEPLOYMENTS ONLY (load behind the `NEXT_PUBLIC_DEPLOY_ROLE` guard).
 *
 * A `MutationObserver` on `document.documentElement` watches text nodes and the
 * attributes `placeholder`, `aria-label`, `title`, `alt`, `value`. Every key
 * marker it finds is decoded through the key registry and REMOVED from the node
 * or attribute (copy/paste, screen readers, form values and `innerText`
 * measurements then see clean text, research §2.2), and the reference is kept in
 * a live map. `document.title`, `<meta>` content and `<link>` attributes are
 * cleaned too (they are never mapped: nothing to point at).
 *
 * Text nodes map to their PARENT element (the thing a translator can see and
 * click). A `<Trans>` string carries one marker in its last text node, so its
 * element is that node's parent (research §2.2: one marker per Trans string).
 *
 * The scanner rewrites what React rendered. React does not re-read the DOM, so
 * this never causes a hydration mismatch as long as the first scan runs after
 * hydration: `start()` waits for idle (`requestIdleCallback`, `setTimeout`
 * fallback). When React later re-renders a node, it writes a fresh marked string
 * and the observer picks it up again.
 */
import { findMarkers, hasMarker, stripMarkers } from './markerCodec';
import { keyRegistry, refId, type KeyRegistry, type RegistryEntry } from './keyRegistry';
import type { MarkerRef } from './mode';

/** Attributes that carry translated copy. */
export const SCANNED_ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'alt', 'value'] as const;
export type ScannedAttribute = (typeof SCANNED_ATTRIBUTES)[number];

/** Where a key was seen on an element. `'text'` = a child text node. */
export type KeySite = 'text' | ScannedAttribute;

/** Per-node patch value: the node's current clean text and where it sits -> the new text. */
export type PatchValue = (current: string, site: KeySite, target: Text | Element) => string;

export interface ScannerChange {
  /** Refs that appeared on the page since the last notification. */
  added: RegistryEntry[];
  /** Refs no longer on the page. */
  removed: RegistryEntry[];
}

interface ElementRecord {
  /** refId -> sites on this element. */
  sites: Map<string, Set<KeySite>>;
  /** The text nodes this element owns a key through (for `patchTextNode`). */
  textNodes: Map<string, Set<Text>>;
}

const MARKER_FREE_HEAD_SELECTORS = 'meta[content], link';

export interface DomScannerOptions {
  root?: Document;
  registry?: KeyRegistry;
}

export class DomScanner {
  private readonly doc: Document;
  private readonly registry: KeyRegistry;
  private observer: MutationObserver | null = null;
  private byElement = new Map<Element, ElementRecord>();
  private byRef = new Map<string, Set<Element>>();
  private refs = new Map<string, RegistryEntry>();
  private listeners = new Set<(change: ScannerChange) => void>();
  private linkListeners = new Set<(refs: RegistryEntry[]) => void>();
  private pending: ScannerChange = { added: [], removed: [] };
  /** Refs (re)linked to a node in the current batch, new or not (MM53 draft re-apply). */
  private pendingLinked = new Map<string, RegistryEntry>();
  private dirty = new Set<Node>();
  private processScheduled = false;
  private cancelStart: (() => void) | null = null;
  private disposed = false;
  /** Values the scanner wrote itself, so its own mutations are not re-processed. */
  private selfWrites = new WeakSet<Node>();

  constructor(options: DomScannerOptions = {}) {
    this.doc = options.root ?? document;
    this.registry = options.registry ?? keyRegistry;
  }

  /**
   * Starts observing now and runs the first full scan after hydration (idle).
   * `immediate` scans synchronously (tests, or a caller that knows hydration is done).
   */
  start({ immediate = false }: { immediate?: boolean } = {}): this {
    if (this.observer || this.disposed) return this;
    const win = this.doc.defaultView;
    if (!win || typeof win.MutationObserver !== 'function') return this;
    this.observer = new win.MutationObserver((records) => this.onMutations(records));
    this.observer.observe(this.doc.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...SCANNED_ATTRIBUTES, 'content', 'href'],
    });
    if (immediate) {
      this.scan(this.doc.documentElement);
      this.flush();
    } else {
      const ric = (win as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;
      if (typeof ric === 'function') {
        const handle = ric(() => this.initialScan(), { timeout: 2000 });
        this.cancelStart = () =>
          (win as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(handle);
      } else {
        const timer = win.setTimeout(() => this.initialScan(), 200);
        this.cancelStart = () => win.clearTimeout(timer);
      }
    }
    return this;
  }

  private initialScan(): void {
    this.cancelStart = null;
    if (this.disposed) return;
    this.scan(this.doc.documentElement);
    this.flush();
  }

  /** Full scan of a subtree (also cleans the document title and head metadata). */
  scan(root: Node): void {
    if (root.nodeType === Node.TEXT_NODE) {
      this.processText(root as Text);
    } else if (root.nodeType === Node.ELEMENT_NODE || root.nodeType === Node.DOCUMENT_NODE) {
      const el = root as Element;
      if (root.nodeType === Node.ELEMENT_NODE) this.processAttributes(el);
      const walker = this.doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      let n: Node | null = walker.nextNode();
      while (n) {
        if (n.nodeType === Node.TEXT_NODE) this.processText(n as Text);
        else this.processAttributes(n as Element);
        n = walker.nextNode();
      }
    }
    this.cleanHead();
  }

  /** `document.title` and head `<meta>`/`<link>`: strip only, never mapped (design §2.9). */
  private cleanHead(): void {
    if (hasMarker(this.doc.title)) this.doc.title = stripMarkers(this.doc.title);
    for (const el of this.doc.querySelectorAll(MARKER_FREE_HEAD_SELECTORS)) {
      for (const attr of el.getAttributeNames()) {
        const v = el.getAttribute(attr);
        if (v && hasMarker(v)) el.setAttribute(attr, stripMarkers(v));
      }
    }
  }

  private onMutations(records: MutationRecord[]): void {
    for (const r of records) {
      if (r.type === 'characterData') {
        if (this.selfWrites.has(r.target)) {
          this.selfWrites.delete(r.target);
          continue;
        }
        this.dirty.add(r.target);
      } else if (r.type === 'attributes') {
        this.dirty.add(r.target);
      } else {
        r.addedNodes.forEach((n) => this.dirty.add(n));
        if (r.removedNodes.length) this.dirty.add(this.doc.documentElement);
      }
    }
    if (!this.processScheduled) {
      this.processScheduled = true;
      queueMicrotask(() => this.processDirty());
    }
  }

  private processDirty(): void {
    this.processScheduled = false;
    if (this.disposed) return;
    const nodes = [...this.dirty];
    this.dirty.clear();
    let pruned = false;
    for (const n of nodes) {
      if (n === this.doc.documentElement && !pruned) {
        pruned = true;
        this.prune();
        continue;
      }
      if (!n.isConnected) continue;
      if (n.nodeType === Node.TEXT_NODE) this.processText(n as Text);
      else if (n.nodeType === Node.ELEMENT_NODE) this.scan(n);
    }
    this.cleanHead();
    this.flush();
  }

  private processText(node: Text): void {
    const data = node.data;
    if (!hasMarker(data)) return;
    const owner = node.parentElement;
    const markers = findMarkers(data);
    this.selfWrites.add(node);
    node.data = stripMarkers(data);
    if (!owner || owner.closest('head,script,style,noscript,template')) return;
    for (const m of markers) {
      const entry = this.registry.resolve(m.index);
      if (entry) this.link(owner, entry, 'text', node);
    }
  }

  private processAttributes(el: Element): void {
    // <head> (title, meta, link) is cleaned by cleanHead() and never mapped.
    if (el.closest('head')) return;
    for (const attr of SCANNED_ATTRIBUTES) {
      const v = el.getAttribute(attr);
      if (!v || !hasMarker(v)) continue;
      const markers = findMarkers(v);
      const clean = stripMarkers(v);
      el.setAttribute(attr, clean);
      // A controlled <input value> keeps its own property; clean that too.
      if (attr === 'value' && 'value' in el && (el as HTMLInputElement).value === v) {
        (el as HTMLInputElement).value = clean;
      }
      for (const m of markers) {
        const entry = this.registry.resolve(m.index);
        if (entry) this.link(el, entry, attr);
      }
    }
  }

  private link(el: Element, entry: RegistryEntry, site: KeySite, textNode?: Text): void {
    const id = refId(entry);
    let rec = this.byElement.get(el);
    if (!rec) {
      rec = { sites: new Map(), textNodes: new Map() };
      this.byElement.set(el, rec);
    }
    let sites = rec.sites.get(id);
    if (!sites) {
      sites = new Set();
      rec.sites.set(id, sites);
    }
    sites.add(site);
    if (textNode) {
      let nodes = rec.textNodes.get(id);
      if (!nodes) {
        nodes = new Set();
        rec.textNodes.set(id, nodes);
      }
      nodes.add(textNode);
    }
    let els = this.byRef.get(id);
    if (!els) {
      els = new Set();
      this.byRef.set(id, els);
    }
    const isNewRef = !this.refs.has(id);
    els.add(el);
    this.refs.set(id, entry);
    if (isNewRef) this.pending.added.push(entry);
    this.pendingLinked.set(id, entry);
  }

  /** Drops elements that left the document, and refs no longer on the page. */
  private prune(): void {
    for (const [el, rec] of this.byElement) {
      if (el.isConnected) {
        for (const [id, nodes] of rec.textNodes) {
          for (const n of nodes) if (!n.isConnected || n.parentElement !== el) nodes.delete(n);
          if (nodes.size === 0) rec.textNodes.delete(id);
        }
        continue;
      }
      this.byElement.delete(el);
      for (const id of rec.sites.keys()) {
        const els = this.byRef.get(id);
        els?.delete(el);
        if (els && els.size === 0) {
          this.byRef.delete(id);
          const entry = this.refs.get(id);
          this.refs.delete(id);
          if (entry) this.pending.removed.push(entry);
        }
      }
    }
  }

  private flush(): void {
    if (this.pendingLinked.size) {
      const linked = [...this.pendingLinked.values()];
      this.pendingLinked.clear();
      for (const l of this.linkListeners) {
        try {
          l(linked);
        } catch {
          // A broken subscriber must never break the page.
        }
      }
    }
    if (this.pending.added.length === 0 && this.pending.removed.length === 0) return;
    const change = this.pending;
    this.pending = { added: [], removed: [] };
    for (const l of this.listeners) {
      try {
        l(change);
      } catch {
        // A broken subscriber must never break the page.
      }
    }
  }

  /* ----------------------------------------------------------------------- */
  /* API for MM53                                                             */
  /* ----------------------------------------------------------------------- */

  /** Notified with added/removed refs after every scan batch. */
  subscribe(cb: (change: ScannerChange) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  /**
   * Notified after every scan batch with each ref that was linked to a node in it,
   * including refs already on the page (React replaced a node, a client navigation
   * re-rendered a server component). MM53 re-applies drafts from this: `subscribe`
   * alone misses a node swapped in while its key never left the page.
   */
  subscribeLinks(cb: (refs: RegistryEntry[]) => void): () => void {
    this.linkListeners.add(cb);
    return () => this.linkListeners.delete(cb);
  }

  /** Every ref currently on the page. */
  getKeysOnPage(): RegistryEntry[] {
    return [...this.refs.values()];
  }

  /** Elements showing `ref` (text or attribute), in document order. */
  getElementsForKey(ref: MarkerRef): Element[] {
    const els = [...(this.byRef.get(refId(ref)) ?? [])].filter((e) => e.isConnected);
    return els.sort((a, b) =>
      a === b ? 0 : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
  }

  /** Refs on `el` itself, with where each sits (text and/or attribute names). */
  getKeysForElement(el: Element): Array<{ ref: RegistryEntry; sites: KeySite[] }> {
    const rec = this.byElement.get(el);
    if (!rec) return [];
    return [...rec.sites].flatMap(([id, sites]) => {
      const ref = this.refs.get(id);
      return ref ? [{ ref, sites: [...sites] }] : [];
    });
  }

  /** Refs on `el` or its nearest mapped ancestor (what Alt+click and hover resolve). */
  findKeysAt(el: Element | null): { element: Element; keys: Array<{ ref: RegistryEntry; sites: KeySite[] }> } | null {
    for (let cur = el; cur; cur = cur.parentElement) {
      const keys = this.getKeysForElement(cur);
      if (keys.length) return { element: cur, keys };
    }
    return null;
  }

  /**
   * MM53 live edit (ticket decision 11): sets every mapped text node / attribute
   * of `ref` to `value` and keeps the mapping. A text node holding several keys
   * is not split: only nodes that hold exactly this key are rewritten.
   * `value` may be a function of the node's current text and site (MM53: each
   * instance of an interpolated server string keeps its own params).
   * Returns how many nodes/attributes changed.
   */
  patchTextNode(ref: MarkerRef, value: string | PatchValue): number {
    const id = refId(ref);
    const valueFor = (current: string, site: KeySite, target: Text | Element) =>
      stripMarkers(typeof value === 'function' ? value(current, site, target) : value);
    let changed = 0;
    for (const el of this.byRef.get(id) ?? []) {
      const rec = this.byElement.get(el);
      if (!rec) continue;
      const sites = rec.sites.get(id) ?? new Set<KeySite>();
      if (sites.has('text')) {
        for (const node of rec.textNodes.get(id) ?? []) {
          if (!node.isConnected) continue;
          const others = [...rec.textNodes].some(([other, nodes]) => other !== id && nodes.has(node));
          if (others) continue;
          const clean = valueFor(node.data, 'text', node);
          if (node.data !== clean) {
            this.selfWrites.add(node);
            node.data = clean;
            changed++;
          }
        }
      }
      for (const site of sites) {
        if (site === 'text') continue;
        const current = el.getAttribute(site) ?? '';
        const clean = valueFor(current, site, el);
        if (current !== clean) {
          el.setAttribute(site, clean);
          changed++;
        }
      }
    }
    return changed;
  }

  dispose(): void {
    this.disposed = true;
    this.cancelStart?.();
    this.observer?.disconnect();
    this.observer = null;
    this.listeners.clear();
    this.linkListeners.clear();
    this.pendingLinked.clear();
    this.byElement.clear();
    this.byRef.clear();
    this.refs.clear();
  }
}

/** Convenience for MM53: a started scanner on the current document. */
export function startDomScanner(options?: DomScannerOptions & { immediate?: boolean }): DomScanner {
  return new DomScanner(options).start({ immediate: options?.immediate });
}
