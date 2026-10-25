/**
 * Highlight + Alt+click primitives (MM52, design §2.10; the panel UI is MM53).
 *
 * TRANSLATOR DEPLOYMENTS ONLY (load behind the `NEXT_PUBLIC_DEPLOY_ROLE` guard).
 *
 *   highlightKey(ref) / clearHighlight()  outline every element showing a key.
 *     The outline is an OVERLAY layer: one fixed-position div per element rect,
 *     `pointer-events: none`, in a single container appended to <body>. The
 *     page's own nodes are never restyled, so nothing reflows and React's
 *     reconciliation of those nodes is untouched.
 *   onElementHover(cb)  element -> keys under the pointer (row highlight in MM53).
 *   Alt+click  `document.elementsFromPoint` finds the topmost mapped element at
 *     the click point (Tolgee behaviour, research §2.2); the click is cancelled
 *     (`preventDefault` + `stopPropagation`, capture phase) so a link or button
 *     does not fire while Alt is held, and `onFocusKey` listeners receive it.
 *   Escape clears the highlight. No other global shortcut.
 */
import type { DomScanner, KeySite } from './domScanner';
import type { RegistryEntry } from './keyRegistry';
import type { MarkerRef } from './mode';

export const OVERLAY_ID = 'mm-translator-highlight';
const OUTLINE_COLOR = '#f5a524';

export interface FocusKeyEvent {
  element: Element;
  keys: Array<{ ref: RegistryEntry; sites: KeySite[] }>;
  /** The key MM53 should focus (first key on the element). */
  ref: RegistryEntry;
}

export interface HoverEvent {
  element: Element | null;
  keys: Array<{ ref: RegistryEntry; sites: KeySite[] }>;
}

export class TranslatorHighlighter {
  private readonly doc: Document;
  private overlay: HTMLDivElement | null = null;
  private current: MarkerRef | null = null;
  private focusListeners = new Set<(e: FocusKeyEvent) => void>();
  private hoverListeners = new Set<(e: HoverEvent) => void>();
  private lastHover: Element | null = null;
  private detach: Array<() => void> = [];
  private raf = 0;

  constructor(
    private readonly scanner: DomScanner,
    doc: Document = document,
  ) {
    this.doc = doc;
  }

  /** Installs the Alt+click, hover, Escape and reposition listeners. Idempotent. */
  attach(): this {
    if (this.detach.length) return this;
    const win = this.doc.defaultView;
    if (!win) return this;
    const onClick = (e: MouseEvent) => this.onClick(e);
    const onMove = (e: MouseEvent) => this.onMove(e);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.current) this.clearHighlight();
    };
    const onReflow = () => this.scheduleReposition();
    // Capture phase: the page's own handlers must not see an Alt+click.
    this.doc.addEventListener('click', onClick, true);
    this.doc.addEventListener('auxclick', onClick, true);
    this.doc.addEventListener('mousemove', onMove, { passive: true });
    this.doc.addEventListener('keydown', onKey);
    win.addEventListener('scroll', onReflow, { passive: true, capture: true });
    win.addEventListener('resize', onReflow, { passive: true });
    this.detach.push(
      () => this.doc.removeEventListener('click', onClick, true),
      () => this.doc.removeEventListener('auxclick', onClick, true),
      () => this.doc.removeEventListener('mousemove', onMove),
      () => this.doc.removeEventListener('keydown', onKey),
      () => win.removeEventListener('scroll', onReflow, { capture: true }),
      () => win.removeEventListener('resize', onReflow),
    );
    return this;
  }

  /* --- Alt+click ------------------------------------------------------- */

  private onClick(e: MouseEvent): void {
    if (!e.altKey) return;
    const hit = this.keysAtPoint(e.clientX, e.clientY, e.target);
    // Alt held over the page: never let the link/button underneath act, even
    // when the point has no key (an accidental navigation loses the session's
    // context for no gain).
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    if (!hit) return;
    const event: FocusKeyEvent = { element: hit.element, keys: hit.keys, ref: hit.keys[0].ref };
    this.highlightKey(event.ref);
    for (const l of this.focusListeners) {
      try {
        l(event);
      } catch {
        // never break the page
      }
    }
  }

  /** Topmost mapped element at a point (`elementsFromPoint`), falling back to the event target. */
  keysAtPoint(
    x: number,
    y: number,
    fallback?: EventTarget | null,
  ): { element: Element; keys: Array<{ ref: RegistryEntry; sites: KeySite[] }> } | null {
    const stack =
      typeof this.doc.elementsFromPoint === 'function' ? this.doc.elementsFromPoint(x, y) : ([] as Element[]);
    for (const el of stack) {
      if (this.overlay?.contains(el)) continue;
      const hit = this.scanner.findKeysAt(el);
      if (hit) return hit;
    }
    return fallback instanceof Element ? this.scanner.findKeysAt(fallback) : null;
  }

  /** MM53 subscribes: Alt+click on a mapped element. */
  onFocusKey(cb: (e: FocusKeyEvent) => void): () => void {
    this.focusListeners.add(cb);
    return () => this.focusListeners.delete(cb);
  }

  /* --- hover ----------------------------------------------------------- */

  private onMove(e: MouseEvent): void {
    if (this.hoverListeners.size === 0) return;
    const target = e.target instanceof Element ? e.target : null;
    const hit = target ? this.scanner.findKeysAt(target) : null;
    const element = hit?.element ?? null;
    if (element === this.lastHover) return;
    this.lastHover = element;
    const event: HoverEvent = { element, keys: hit?.keys ?? [] };
    for (const l of this.hoverListeners) {
      try {
        l(event);
      } catch {
        // never break the page
      }
    }
  }

  /** Element -> keys under the pointer; fires on change only (null when leaving mapped elements). */
  onElementHover(cb: (e: HoverEvent) => void): () => void {
    this.hoverListeners.add(cb);
    return () => this.hoverListeners.delete(cb);
  }

  /* --- outline overlay ------------------------------------------------- */

  highlightKey(ref: MarkerRef): Element[] {
    this.current = ref;
    return this.render();
  }

  clearHighlight(): void {
    this.current = null;
    this.overlay?.replaceChildren();
  }

  get highlighted(): MarkerRef | null {
    return this.current;
  }

  private ensureOverlay(): HTMLDivElement {
    if (this.overlay?.isConnected) return this.overlay;
    const div = this.doc.createElement('div');
    div.id = OVERLAY_ID;
    div.setAttribute('aria-hidden', 'true');
    div.setAttribute('data-translator-ui', '');
    div.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483646;';
    this.doc.body.appendChild(div);
    this.overlay = div;
    return div;
  }

  private render(): Element[] {
    const overlay = this.ensureOverlay();
    overlay.replaceChildren();
    if (!this.current) return [];
    const els = this.scanner.getElementsForKey(this.current);
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const box = this.doc.createElement('div');
      box.style.cssText =
        `position:fixed;pointer-events:none;box-sizing:border-box;border-radius:3px;` +
        `outline:2px solid ${OUTLINE_COLOR};outline-offset:1px;background:rgba(245,165,36,0.08);` +
        `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;`;
      overlay.appendChild(box);
    }
    return els;
  }

  private scheduleReposition(): void {
    if (!this.current || this.raf) return;
    const win = this.doc.defaultView;
    if (!win) return;
    this.raf = win.requestAnimationFrame(() => {
      this.raf = 0;
      this.render();
    });
  }

  dispose(): void {
    for (const off of this.detach.splice(0)) off();
    this.focusListeners.clear();
    this.hoverListeners.clear();
    this.overlay?.remove();
    this.overlay = null;
    this.current = null;
  }
}
