/**
 * Workbench session wiring (MM53): shard load -> registry seed -> key table ->
 * drafts -> scanner, highlighter and live edit -> model.
 *
 * TRANSLATOR DEPLOYMENTS ONLY (the workbench chunk; started only after the gate
 * says `allowed`, so visitors who are not translators never load the shards or
 * get a scanner).
 */
import type { TranslatorApi } from './api';
import { DomScanner, type KeySite, type MarkerMemory } from './domScanner';
import { openDraftStore, type DraftStore } from './draftStore';
import { TranslatorHighlighter } from './highlight';
import { keyRegistry as defaultRegistry, type KeyRegistry, type RegistryEntry } from './keyRegistry';
import { buildKeyTable, type KeyEntry } from './keyTable';
import { LiveEditor, type I18nLike } from './liveEdit';
import { loadTranslatorShards, type LoadedShard } from './shardSource';
import { WorkbenchModel } from './workbenchModel';

/** What the panel needs from the page side (a fake in panel-only tests). */
export interface WorkbenchController {
  /** Row hover/focus: outline every element of the entry (all forms of a plural group) and bring the first into view. */
  highlightEntry(id: string): void;
  clearHighlight(): void;
  /** Alt+click on the page -> the entry to focus. */
  onFocusKey(cb: (entryId: string) => void): () => void;
}

export interface WorkbenchSession {
  model: WorkbenchModel;
  controller: WorkbenchController;
  /** MM56: re-scan the page now (called after every client navigation). */
  rescan(): void;
  dispose(): void;
}

export interface StartWorkbenchSessionOptions {
  locale: string;
  i18n: I18nLike | null;
  api: TranslatorApi | null;
  getIdToken: () => Promise<string | null>;
  /** Test seams. */
  shards?: LoadedShard[];
  store?: DraftStore;
  registry?: KeyRegistry;
  /** MM56: marker memory (default: the page's). */
  memory?: MarkerMemory;
  doc?: Document;
  scanImmediately?: boolean;
}

/** Every ref on the page with the sites it occupies (text and/or attribute names). */
export function refsWithSites(scanner: DomScanner): Array<{ ref: RegistryEntry; sites: KeySite[] }> {
  return scanner.getKeysOnPage().map((ref) => {
    const sites = new Set<KeySite>();
    for (const el of scanner.getElementsForKey(ref)) {
      for (const k of scanner.getKeysForElement(el)) {
        if (k.ref.ns === ref.ns && k.ref.key === ref.key && k.ref.lng === ref.lng) k.sites.forEach((s) => sites.add(s));
      }
    }
    return { ref, sites: [...sites] };
  });
}

function isOutOfView(el: Element): boolean {
  const win = el.ownerDocument.defaultView;
  if (!win) return false;
  const r = el.getBoundingClientRect();
  return r.bottom < 0 || r.top > win.innerHeight;
}

export async function startWorkbenchSession(options: StartWorkbenchSessionOptions): Promise<WorkbenchSession> {
  const { locale } = options;
  const registry = options.registry ?? defaultRegistry;
  const shards = options.shards ?? (await loadTranslatorShards(locale));

  // Seed the key table that resolves markers the browser did not mint (server HTML).
  // MM52: without it, markers in prerendered pages do not resolve.
  for (const s of shards) registry.seedKeys(s.ns, new Set([...Object.keys(s.english), ...Object.keys(s.values)]));

  const table = buildKeyTable(locale, shards);
  const store = options.store ?? (await openDraftStore());
  const scanner = new DomScanner({ root: options.doc, registry, memory: options.memory });
  const highlighter = new TranslatorHighlighter(scanner, options.doc);
  const live = new LiveEditor({ locale, i18n: options.i18n, scanner, registry });
  const model = new WorkbenchModel({
    locale,
    table,
    store,
    live,
    api: options.api,
    getIdToken: options.getIdToken,
  });

  const entryOf = (ref: RegistryEntry): KeyEntry | undefined => (ref.lng === locale ? table.byRef(ref.ns, ref.key) : undefined);
  const offs: Array<() => void> = [];

  // Drafts are applied to the store before the scanner's first pass, so client strings
  // already render them; the scanner then re-applies to server text as nodes link.
  live.attach();
  await model.init();

  offs.push(scanner.subscribe(() => model.setPageKeys(refsWithSites(scanner))));
  highlighter.attach();
  offs.push(
    highlighter.onElementHover((e) => {
      model.setHovered(e.keys.map((k) => entryOf(k.ref)?.id).filter((id): id is string => !!id));
    }),
  );
  scanner.start({ immediate: options.scanImmediately });
  if (options.scanImmediately) model.setPageKeys(refsWithSites(scanner));

  const refsFor = (id: string) => {
    const e = table.byId(id);
    if (!e) return [];
    const ids = e.plural ? (table.groups.get(e.plural.groupId)?.forms.map((f) => f.id) ?? [id]) : [id];
    return ids.flatMap((i) => model.pageKey(i)?.refs ?? []);
  };

  const controller: WorkbenchController = {
    highlightEntry(id) {
      const els = highlighter.highlightKeys(refsFor(id));
      const first = els[0];
      if (first && isOutOfView(first)) first.scrollIntoView({ block: 'center' });
    },
    clearHighlight() {
      highlighter.clearHighlight();
    },
    onFocusKey(cb) {
      return highlighter.onFocusKey((e) => {
        const entry = e.keys.map((k) => entryOf(k.ref)).find(Boolean);
        if (entry) cb(entry.id);
      });
    },
  };

  return {
    model,
    controller,
    rescan() {
      scanner.rescan();
    },
    dispose() {
      for (const off of offs.splice(0)) off();
      highlighter.dispose();
      live.dispose();
      scanner.dispose();
      store.close();
    },
  };
}

/* ------------------------------------------------------------------------- */
/* Realm-scoped session (MM56, dry-run defects 2 and 3)                       */
/* ------------------------------------------------------------------------- */

/**
 * The workbench session lives for the PAGE (JS realm), not for the island.
 *
 * The island sits inside the `[lang]` root layout, and Next remounts everything
 * under that segment when its value changes (German page <-> English view): the
 * layout router keys the segment by `lang|<value>`. MM53 started a session per
 * island mount, so every such navigation threw away the scanner, re-loaded the
 * shards and re-gated (about a second without a panel). Worse, the outgoing
 * scanner was still observing while React inserted the incoming page (passive
 * effect cleanups run after the commit's MutationObserver microtask), so it
 * stripped the new page's markers just before it was disposed, and the fresh
 * scanner found nothing: "This page" showed 0 items until another remount.
 *
 * Now the first allowed mount starts the session, later mounts reuse it at once
 * (one scanner observes the page throughout), and it is disposed only when the
 * gate turns negative (sign-out, a revalidated refusal). The ID-token getter is
 * the latest mount's, so a remounted AuthProvider's user is the one asked.
 */
interface HeldSession {
  locale: string;
  promise: Promise<WorkbenchSession>;
  session: WorkbenchSession | null;
}

let held: HeldSession | null = null;
let heldTokenGetter: () => Promise<string | null> = async () => null;

export function holdWorkbenchSession(
  options: StartWorkbenchSessionOptions,
  start: (options: StartWorkbenchSessionOptions) => Promise<WorkbenchSession> = startWorkbenchSession,
): Promise<WorkbenchSession> {
  heldTokenGetter = options.getIdToken;
  if (held && held.locale === options.locale) return held.promise;
  releaseWorkbenchSession();
  const entry: HeldSession = { locale: options.locale, session: null, promise: Promise.resolve(null as never) };
  entry.promise = start({ ...options, getIdToken: () => heldTokenGetter() }).then((s) => {
    if (held !== entry) {
      s.dispose();
      throw new Error('workbench session released while starting');
    }
    entry.session = s;
    return s;
  });
  // A failed start may be retried by the next mount.
  entry.promise.catch(() => {
    if (held === entry) held = null;
  });
  held = entry;
  return entry.promise;
}

/** The started session for `locale`, if any (lets a remount render the panel synchronously). */
export function heldWorkbenchSession(locale: string): WorkbenchSession | null {
  return held && held.locale === locale ? held.session : null;
}

/** Disposes the held session (gate refused, signed out; tests). */
export function releaseWorkbenchSession(): void {
  const h = held;
  held = null;
  h?.session?.dispose();
}
