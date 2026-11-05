/**
 * MM114: "Show me" plumbing shared by the three editors (the `lib/studio/editorBridges.ts`
 * pattern). A mounted editor registers a handler; the copilot adapter's `reveal(op)` asks the
 * bridge to act, which opens the right panel and flashes the control the op changed. Nothing
 * here touches a document.
 */
type Handler<T> = (target: T) => void;

export interface RevealBridge<T> {
  /** Register a handler; returns the unregister function. Several components may listen. */
  register(fn: Handler<T>): () => void;
  /** True when a mounted component handled the request. */
  request(target: T): boolean;
  /** The latest target for ~4 s, so a section that mounts after the request can still open itself. */
  recent(): T | null;
}

export function createRevealBridge<T>(): RevealBridge<T> {
  const handlers = new Set<Handler<T>>();
  let last: { target: T; at: number } | null = null;
  return {
    register(fn) {
      handlers.add(fn);
      return () => {
        handlers.delete(fn);
      };
    },
    request(target) {
      last = { target, at: Date.now() };
      if (handlers.size === 0) return false;
      for (const fn of Array.from(handlers)) fn(target);
      return true;
    },
    recent() {
      return last && Date.now() - last.at < 4000 ? last.target : null;
    },
  };
}

const FLASH = ['ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-background', 'rounded-md', 'transition-shadow'];

/** Scroll an element into view and outline it for ~1.6 s. */
export function flashElement(el: Element): void {
  try {
    (el as HTMLElement).scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  } catch {
    // scrolling is cosmetic
  }
  el.classList.add(...FLASH);
  window.setTimeout(() => el.classList.remove(...FLASH), 1600);
}

/**
 * Flash the first element marked `data-reveal="<key>"` (keys in order of preference). A panel the request just opened needs a frame or
 * two to render, so look for it for up to ~700 ms. Returns a cancel function.
 */
export function flashReveal(keys: string | string[], root: ParentNode = document): () => void {
  let tries = 0;
  let raf = 0;
  let cancelled = false;
  const list = (Array.isArray(keys) ? keys : [keys]).map((k) => `[data-reveal="${k.replace(/"/g, '')}"]`);
  const look = () => {
    if (cancelled) return;
    // The first key that is on screen wins (most specific first).
    const el = list.map((sel) => root.querySelector(sel)).find(Boolean);
    if (el) return flashElement(el);
    tries += 1;
    if (tries < 14) raf = window.setTimeout(look, 50);
  };
  look();
  return () => {
    cancelled = true;
    window.clearTimeout(raf);
  };
}
