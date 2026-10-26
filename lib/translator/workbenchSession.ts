/**
 * Workbench session wiring (MM53): shard load -> registry seed -> key table ->
 * drafts -> scanner, highlighter and live edit -> model.
 *
 * TRANSLATOR DEPLOYMENTS ONLY (the workbench chunk; started only after the gate
 * says `allowed`, so visitors who are not translators never load the shards or
 * get a scanner).
 */
import type { TranslatorApi } from './api';
import { DomScanner, type KeySite } from './domScanner';
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
  const scanner = new DomScanner({ root: options.doc, registry });
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
    dispose() {
      for (const off of offs.splice(0)) off();
      highlighter.dispose();
      live.dispose();
      scanner.dispose();
      store.close();
    },
  };
}
