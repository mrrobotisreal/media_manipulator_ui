/**
 * Workbench state (MM53): the key table, drafts, warnings, page keys and base SHAs
 * behind the panel. A plain observable class (`subscribe` + `version`) read through
 * `useSyncExternalStore`, so the panel components stay presentational and the logic
 * is testable without React.
 *
 * TRANSLATOR DEPLOYMENTS ONLY (loaded inside the workbench chunk).
 *
 * Drafts (decision 8, 10): a draft exists while its value differs from the value it
 * was started from (`baseValue`, the deployed file value, '' for a new key). Typing
 * the base value back, or Revert, removes it. "Modified" = has a draft. "Changed
 * upstream" = the deployment now serves a different base than the draft started from
 * (main moved and the branch redeployed); MM54's conflict check covers it at submit.
 *
 * Base SHAs: fetched on the first panel open of a session that has no pending
 * drafts (or no stored base); while drafts exist the stored base is kept, because it
 * is the revision those drafts were written against and MM54's conflict check needs
 * exactly that. "Refresh base" re-fetches on request.
 */
import type { SubmitResult, TranslatorApi } from './api';
import { emitTranslatorEvent } from './devEvents';
import type { BaseMeta, DraftRecord, DraftStore } from './draftStore';
import type { KeySite } from './domScanner';
import type { RegistryEntry } from './keyRegistry';
import type { KeyEntry, KeyTable } from './keyTable';
import type { LiveEditor } from './liveEdit';
import { SearchIndex } from './search';
import type { SubmitRequest } from './submitContract';
import { validatePluralGroup, validateValue, type PluralCategory, type ValidationWarning } from './validators';

export type BaseStatus = 'idle' | 'loading' | 'ok' | 'failed';

/** One pending change, as MM54's submit modal and POST consume it. */
export interface ChangeSetItem {
  file: string;
  key: string;
  value: string;
  baseValue: string;
  english: string | undefined;
  isNew: boolean;
  warnings: ValidationWarning[];
  /** MM54: pathnames where the key (or its plural group) was seen this session, oldest first. */
  seenOn: string[];
}

export interface PageKey {
  entryId: string;
  refs: RegistryEntry[];
  sites: Set<KeySite>;
}

export interface WorkbenchModelOptions {
  locale: string;
  table: KeyTable;
  store: DraftStore;
  live?: LiveEditor | null;
  api?: TranslatorApi | null;
  getIdToken?: () => Promise<string | null>;
  now?: () => number;
  /** MM54: the current page path for `seenOn` (default `location.pathname`). */
  currentPath?: () => string | null;
}

/** Most pathnames remembered per key for the PR's "Pages" section. */
export const SEEN_ON_LIMIT = 5;

export class WorkbenchModel {
  readonly locale: string;
  readonly table: KeyTable;
  readonly search: SearchIndex;
  private readonly store: DraftStore;
  private readonly live: LiveEditor | null;
  private readonly api: TranslatorApi | null;
  private readonly getIdToken: () => Promise<string | null>;
  private readonly now: () => number;
  private readonly currentPath: () => string | null;
  /** MM54: entry id -> pathnames it was seen on (insertion order, capped). */
  private seen = new Map<string, string[]>();

  private drafts = new Map<string, DraftRecord>();
  private warningsById_ = new Map<string, ValidationWarning[]>();
  private groupWarnings = new Map<string, ValidationWarning[]>();
  private page = new Map<string, PageKey>();
  /** Languages of markers on the page that are not the workbench locale (e.g. an English page). */
  pageForeignLanguages: string[] = [];
  private hovered = new Set<string>();
  private listeners = new Set<() => void>();
  private editedThisFocus = new Set<string>();
  private persistChain: Promise<unknown> = Promise.resolve();

  version = 0;
  storage: { persistent: boolean; reason: string | null };
  base: BaseMeta | null = null;
  baseStatus: BaseStatus = 'idle';

  constructor(options: WorkbenchModelOptions) {
    this.locale = options.locale;
    this.table = options.table;
    this.store = options.store;
    this.live = options.live ?? null;
    this.api = options.api ?? null;
    this.getIdToken = options.getIdToken ?? (async () => null);
    this.now = options.now ?? Date.now;
    this.currentPath =
      options.currentPath ?? (() => (typeof window === 'undefined' ? null : window.location.pathname || null));
    this.storage = { persistent: this.store.persistent, reason: this.store.reason };
    this.store.subscribe((s) => {
      this.storage = s;
      this.bump();
    });
    // Re-apply after navigation can change a key's "preview approximate" flag.
    this.live?.subscribe(() => this.bump());
    this.search = new SearchIndex(this.table.entries, (id) => this.table.byId(id)?.base);
  }

  /* --- observable ---------------------------------------------------------- */

  subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  };

  getVersion = (): number => this.version;

  private bump(): void {
    this.version++;
    for (const l of this.listeners) l();
  }

  /* --- session ------------------------------------------------------------- */

  /** Loads this locale's drafts, re-applies them to the page, and loads the stored base. */
  async init(): Promise<void> {
    const [records, meta] = await Promise.all([this.store.list(this.locale), this.store.getMeta(this.locale)]);
    for (const r of records) {
      const entry = this.table.byId(`${r.file}|${r.key}`);
      if (!entry) continue;
      this.drafts.set(entry.id, r);
      this.search.update(entry.id, r.value);
      this.live?.set(this.liveTarget(entry), r.value);
    }
    for (const id of this.drafts.keys()) this.revalidate(id);
    this.base = meta ?? null;
    this.baseStatus = meta ? 'ok' : 'idle';
    this.bump();
  }

  private sessionStarted = false;

  /**
   * The panel was opened (mounted expanded, or expanded from the handle). The first
   * open of a session fetches the base, unless pending drafts pin the stored one.
   */
  async onPanelOpened(): Promise<void> {
    const first = !this.sessionStarted;
    this.sessionStarted = true;
    emitTranslatorEvent('translator_opened', { locale: this.locale, drafts: this.drafts.size, first });
    if (!first || (this.base && this.drafts.size > 0)) return;
    await this.refreshBase();
  }

  async refreshBase(): Promise<void> {
    if (!this.api) return;
    this.baseStatus = 'loading';
    this.bump();
    const token = await this.getIdToken().catch(() => null);
    const res = token ? await this.api.base(token) : { ok: false as const, status: 401, detail: 'signed out' };
    if (res.ok) {
      this.base = { locale: this.locale, sha: res.base.sha, files: res.base.files, fetchedAt: this.now() };
      this.baseStatus = 'ok';
      await this.store.putMeta(this.base);
    } else {
      this.baseStatus = 'failed';
    }
    this.bump();
  }

  /* --- reads --------------------------------------------------------------- */

  /**
   * A primitive that changes iff the row for `id` must re-render (value, flags,
   * warnings, page sites, hover). Rows read it through `useSyncExternalStore`, so a
   * keystroke re-renders one row, not the list.
   */
  rowSnapshot(id: string): string {
    const pk = this.page.get(id);
    return [
      this.valueOf(id),
      this.drafts.has(id) ? 1 : 0,
      this.upstreamChanged(id) ? 1 : 0,
      this.isApproximate(id) ? 1 : 0,
      this.hovered.has(id) ? 1 : 0,
      pk ? [...pk.sites].sort().join(',') : '-',
      this.warnings(id)
        .map((w) => w.id)
        .join(','),
    ].join('\u0001');
  }

  entry(id: string): KeyEntry | undefined {
    return this.table.byId(id);
  }

  draft(id: string): DraftRecord | undefined {
    return this.drafts.get(id);
  }

  /** What the field shows: the draft, else the deployed value ('' for a new key). */
  valueOf(id: string): string {
    return this.drafts.get(id)?.value ?? this.table.byId(id)?.base ?? '';
  }

  isModified(id: string): boolean {
    return this.drafts.has(id);
  }

  upstreamChanged(id: string): boolean {
    const d = this.drafts.get(id);
    const e = this.table.byId(id);
    return !!d && !!e && d.baseValue !== (e.base ?? '');
  }

  warnings(id: string): ValidationWarning[] {
    const e = this.table.byId(id);
    const own = this.warningsById_.get(id) ?? [];
    const group = e?.plural ? (this.groupWarnings.get(e.plural.groupId) ?? []) : [];
    return group.length ? [...own, ...group] : own;
  }

  /** The key's own warnings, without its plural group's (group rows show those once). */
  warningsById(id: string): ValidationWarning[] {
    return this.warningsById_.get(id) ?? [];
  }

  groupWarningsFor(groupId: string): ValidationWarning[] {
    return this.groupWarnings.get(groupId) ?? [];
  }

  isApproximate(id: string): boolean {
    const e = this.table.byId(id);
    return !!e && !!this.live?.isApproximate(e.ns, e.key);
  }

  /** Pending changes, sorted by file then key. */
  changes(): ChangeSetItem[] {
    return [...this.drafts.entries()]
      .map(([id, d]) => {
        const e = this.table.byId(id);
        return {
          file: d.file,
          key: d.key,
          value: d.value,
          baseValue: d.baseValue,
          english: e?.english,
          isNew: e?.isNew ?? false,
          warnings: this.warnings(id),
          seenOn: this.seenOn(id),
        };
      })
      .sort((a, b) => (a.file === b.file ? a.key.localeCompare(b.key) : a.file.localeCompare(b.file)));
  }

  /** Pathnames the key, or any form of its plural group, was seen on. */
  seenOn(id: string): string[] {
    const e = this.table.byId(id);
    const ids = e?.plural ? (this.table.groups.get(e.plural.groupId)?.forms.map((f) => f.id) ?? [id]) : [id];
    const out: string[] = [];
    for (const i of ids) for (const p of this.seen.get(i) ?? []) if (!out.includes(p)) out.push(p);
    return out.slice(0, SEEN_ON_LIMIT);
  }

  /**
   * MM54 "Start fresh" after a submit: drops exactly the submitted drafts (a draft edited
   * again since the request was built is kept), then refreshes the base SHAs.
   */
  async clearSubmitted(submitted: Array<{ file: string; key: string; value: string }>): Promise<void> {
    const cleared: Array<{ file: string; key: string }> = [];
    for (const c of submitted) {
      const id = `${c.file}|${c.key}`;
      const d = this.drafts.get(id);
      const entry = this.table.byId(id);
      if (!d || !entry || d.value !== c.value) continue;
      this.drafts.delete(id);
      cleared.push({ file: c.file, key: c.key });
      this.search.update(id, entry.base);
      this.live?.set(this.liveTarget(entry), undefined);
      this.revalidate(id);
    }
    this.bump();
    if (cleared.length) this.persist(() => this.store.clear(this.locale, cleared));
    await this.flush();
    await this.refreshBase();
  }

  /**
   * MM54: the POST body for the current change set. `base` is the stored base (the
   * revision the drafts were written against); without one the server treats every
   * file as moved and checks each key against `main`.
   */
  buildSubmitRequest(input: { description: string; acknowledged: string[]; confirmConflicts: string[] }): SubmitRequest {
    return {
      locale: this.locale,
      description: input.description,
      changes: this.changes().map((c) => ({
        file: c.file,
        key: c.key,
        value: c.value,
        baseValue: c.baseValue,
        ...(c.seenOn.length ? { seenOn: c.seenOn } : {}),
      })),
      base: { sha: this.base?.sha ?? '', files: this.base?.files ?? {} },
      acknowledged: input.acknowledged,
      confirmConflicts: input.confirmConflicts,
    };
  }

  /** MM54: sends `body` to `/api/translator/submit` (dry run = pre-flight, writes nothing). */
  async submit(body: SubmitRequest, options: { dryRun?: boolean } = {}): Promise<SubmitResult> {
    if (!this.api?.submit) return { kind: 'error', status: null, detail: 'submit is not available' };
    await this.flush();
    const token = await this.getIdToken().catch(() => null);
    if (!token) return { kind: 'unauthorized' };
    return this.api.submit(token, body, options);
  }

  /* --- edits --------------------------------------------------------------- */

  edit(id: string, value: string): void {
    const entry = this.table.byId(id);
    if (!entry) return;
    const prev = this.drafts.get(id);
    const baseValue = prev?.baseValue ?? entry.base ?? '';
    if (value === baseValue) {
      this.drafts.delete(id);
      this.persist(() => this.store.remove(this.locale, entry.file, entry.key));
    } else {
      const record: DraftRecord = { locale: this.locale, file: entry.file, key: entry.key, value, baseValue, updatedAt: this.now() };
      this.drafts.set(id, record);
      this.persist(() => this.store.put(record));
    }
    if (!this.editedThisFocus.has(id)) {
      this.editedThisFocus.add(id);
      emitTranslatorEvent('translator_key_edited', { locale: this.locale, file: entry.file, key: entry.key, isNew: entry.isNew });
    }
    this.search.update(id, value);
    this.live?.set(this.liveTarget(entry), this.drafts.has(id) ? value : undefined);
    this.revalidate(id);
    this.bump();
  }

  /** The field lost focus: the next edit of `id` counts as a new edit event. */
  endEdit(id: string): void {
    this.editedThisFocus.delete(id);
  }

  revert(id: string): void {
    const entry = this.table.byId(id);
    if (!entry || !this.drafts.has(id)) return;
    this.drafts.delete(id);
    this.persist(() => this.store.remove(this.locale, entry.file, entry.key));
    this.search.update(id, entry.base);
    this.live?.set(this.liveTarget(entry), undefined);
    this.revalidate(id);
    emitTranslatorEvent('translator_reverted', { locale: this.locale, file: entry.file, key: entry.key });
    this.bump();
  }

  /** Resolves when every queued draft write has settled (tests, submit). */
  flush(): Promise<unknown> {
    return this.persistChain;
  }

  private persist(op: () => Promise<unknown>): void {
    this.persistChain = this.persistChain.then(op, op).catch(() => undefined);
  }

  private liveTarget(entry: KeyEntry) {
    return {
      ns: entry.ns,
      key: entry.key,
      trans: entry.trans,
      base: entry.base,
      deployed: entry.base ?? entry.english ?? '',
    };
  }

  private revalidate(id: string): void {
    const entry = this.table.byId(id);
    if (!entry) return;
    if (this.drafts.has(id)) {
      const group = this.table.groupOf(entry);
      this.warningsById_.set(
        id,
        validateValue({
          key: entry.key,
          value: this.valueOf(id),
          english: entry.english,
          locale: this.locale,
          englishForms: group?.englishForms,
        }),
      );
    } else {
      this.warningsById_.delete(id);
    }
    const group = this.table.groupOf(entry);
    if (group) {
      const touched = group.forms.some((f) => this.drafts.has(f.id));
      if (!touched) {
        this.groupWarnings.delete(group.id);
      } else {
        const forms: Partial<Record<PluralCategory, string>> = {};
        for (const f of group.forms) forms[f.plural!.category] = this.valueOf(f.id);
        this.groupWarnings.set(
          group.id,
          validatePluralGroup({ base: group.base, locale: this.locale, forms, categories: group.required }),
        );
      }
    }
  }

  /* --- page mapping -------------------------------------------------------- */

  /**
   * Replaces the "This page" set from the scanner's refs. Only refs in the workbench
   * locale are listed (live edit patches those); other languages are reported in
   * `pageForeignLanguages` so the panel can point at the localized URL.
   */
  setPageKeys(refs: Array<{ ref: RegistryEntry; sites: KeySite[] }>): void {
    const next = new Map<string, PageKey>();
    const foreign = new Set<string>();
    for (const { ref, sites } of refs) {
      if (ref.lng !== this.locale) {
        foreign.add(ref.lng);
        continue;
      }
      const e = this.table.byRef(ref.ns, ref.key);
      if (!e) continue;
      const pk = next.get(e.id) ?? { entryId: e.id, refs: [], sites: new Set<KeySite>() };
      if (!pk.refs.some((r) => r.lng === ref.lng && r.key === ref.key && r.ns === ref.ns)) pk.refs.push(ref);
      for (const s of sites) pk.sites.add(s);
      next.set(e.id, pk);
    }
    this.page = next;
    const path = this.currentPath();
    if (path && path.startsWith('/')) {
      for (const id of next.keys()) {
        const list = this.seen.get(id) ?? [];
        if (!list.includes(path) && list.length < SEEN_ON_LIMIT) this.seen.set(id, [...list, path]);
      }
    }
    this.pageForeignLanguages = [...foreign].sort();
    this.bump();
  }

  pageKeys(): PageKey[] {
    return [...this.page.values()];
  }

  pageKey(id: string): PageKey | undefined {
    return this.page.get(id);
  }

  /** Entry ids under the pointer on the page (element -> row highlight). */
  setHovered(ids: Iterable<string>): void {
    const next = new Set(ids);
    if (next.size === this.hovered.size && [...next].every((i) => this.hovered.has(i))) return;
    this.hovered = next;
    this.bump();
  }

  isHovered(id: string): boolean {
    return this.hovered.has(id);
  }

  hoveredIds(): string[] {
    return [...this.hovered];
  }
}
