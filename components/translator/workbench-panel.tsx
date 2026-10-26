'use client';

/**
 * The translator workbench panel (MM53 decisions 1, 3, 4, 10, 11; design §2.10).
 *
 * TRANSLATOR DEPLOYMENTS ONLY: mounted by `translator-island.tsx`, which the app
 * reaches only through `loadTranslatorWorkbench()` in `lib/translator/mode.ts`
 * behind the literal NEXT_PUBLIC_DEPLOY_ROLE guard.
 *
 * Docks right for LTR locales and left for RTL (he, ar); collapsible to a slim
 * handle; resizable by a pointer-drag (or arrow-key) handle between 320 px and
 * 60 vw, width remembered in localStorage (per-viewer convenience, try/catch).
 * Tabs: This page (scanner keys grouped by namespace › shard), All keys
 * (virtualised), Changes (pending edits, per-key revert, base SHA, submit area
 * for MM54). Search: key, English or translation, case/diacritic-insensitive,
 * debounced 120 ms, `/` focuses it. `Esc` collapses. No focus trap.
 */
import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CHROME } from '@/lib/translator/chromeCopy';
import type { WorkbenchController } from '@/lib/translator/workbenchSession';
import type { WorkbenchModel } from '@/lib/translator/workbenchModel';
import { cn } from '@/lib/utils';
import { fieldDomId, KeyRow } from './key-row';
import { SubmitModal } from './submit-modal';

export const PANEL_MIN_WIDTH = 320;
export const PANEL_MAX_VW = 0.6;
export const PANEL_DEFAULT_WIDTH = 400;
export const SEARCH_DEBOUNCE_MS = 120;
const WIDTH_STORAGE_KEY = 'mm-translator-panel-width';
const COLLAPSED_STORAGE_KEY = 'mm-translator-panel-collapsed';

export type WorkbenchTab = 'page' | 'all' | 'changes';

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Per-viewer convenience only.
  }
}

export function clampPanelWidth(width: number, viewport: number): number {
  const max = Math.max(PANEL_MIN_WIDTH, Math.floor(viewport * PANEL_MAX_VW));
  return Math.min(max, Math.max(PANEL_MIN_WIDTH, Math.round(width)));
}

function useModelVersion(model: WorkbenchModel): number {
  return React.useSyncExternalStore(model.subscribe, model.getVersion, model.getVersion);
}

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/** Row ids for a list: one id per single key, the first form's id per plural group. */
function rowIds(model: WorkbenchModel, ids: Iterable<string>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    const e = model.entry(id);
    if (!e) continue;
    const rowId = e.plural ? (model.table.groups.get(e.plural.groupId)?.forms[0].id ?? id) : id;
    if (seen.has(rowId)) continue;
    seen.add(rowId);
    out.push(rowId);
  }
  return out;
}

/** A row matches when any of its group's forms matches. */
function filterRows(model: WorkbenchModel, rows: string[], query: string): string[] {
  if (!query.trim()) return rows;
  return rows.filter((rowId) => {
    const e = model.entry(rowId);
    const ids = e?.plural ? (model.table.groups.get(e.plural.groupId)?.forms.map((f) => f.id) ?? [rowId]) : [rowId];
    return ids.some((id) => model.search.matches(id, query));
  });
}

export interface WorkbenchPanelProps {
  model: WorkbenchModel;
  controller: WorkbenchController;
  /** The edited locale's direction and BCP-47 code (fields use them; the dock side follows `dir`). */
  dir: 'ltr' | 'rtl';
  lang: string;
  /** Shown when the page is in another language (`/` vs `/ar`): the localized URL. */
  localizedHref?: string;
  /** Test seam: start expanded/collapsed regardless of storage. */
  initialCollapsed?: boolean;
  /** Test seam for the All keys virtualiser (jsdom has no layout). */
  virtualRect?: { width: number; height: number };
}

export const WorkbenchPanel: React.FC<WorkbenchPanelProps> = ({
  model,
  controller,
  dir,
  lang,
  localizedHref,
  initialCollapsed,
  virtualRect,
}) => {
  useModelVersion(model);
  const side = dir === 'rtl' ? 'left' : 'right';
  const [collapsed, setCollapsed] = React.useState<boolean>(
    // MM56: a submit modal left open comes back expanded, on Changes.
    () => initialCollapsed ?? (readStored(COLLAPSED_STORAGE_KEY) === '1' && !model.submitDraft?.open),
  );
  const [width, setWidth] = React.useState<number>(() => {
    const stored = Number(readStored(WIDTH_STORAGE_KEY));
    const vw = typeof window === 'undefined' ? 1280 : window.innerWidth;
    return clampPanelWidth(Number.isFinite(stored) && stored > 0 ? stored : PANEL_DEFAULT_WIDTH, vw);
  });
  // MM56: a submit modal left open (saved in the draft store) reopens on Changes.
  const [tab, setTabState] = React.useState<WorkbenchTab>(
    () => (model.submitDraft?.open ? 'changes' : (model.panelUi.tab ?? 'page')),
  );
  const [query, setQueryState] = React.useState(() => model.panelUi.query ?? '');
  // MM56: remembered on the model, so a remounted panel keeps its tab and search.
  const setTab = React.useCallback(
    (next: WorkbenchTab) => {
      model.rememberPanelUi({ tab: next });
      setTabState(next);
    },
    [model],
  );
  const setQuery = React.useCallback(
    (next: string) => {
      model.rememberPanelUi({ query: next });
      setQueryState(next);
    },
    [model],
  );
  const debounced = useDebounced(query, SEARCH_DEBOUNCE_MS);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const handleRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLElement>(null);
  const pendingFocus = React.useRef<string | null>(null);
  const [focusRequest, setFocusRequest] = React.useState(0);

  // First open of the session fetches the base (decision 8).
  const opened = React.useRef(false);
  React.useEffect(() => {
    if (!collapsed && !opened.current) {
      opened.current = true;
      void model.onPanelOpened();
    }
  }, [collapsed, model]);

  const setCollapsedPersist = React.useCallback((next: boolean) => {
    setCollapsed(next);
    writeStored(COLLAPSED_STORAGE_KEY, next ? '1' : '0');
  }, []);

  // `/` focuses search, `Esc` collapses (when focus is in the panel, or nothing else claims it).
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === '/' && !typing && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setCollapsedPersist(false);
        requestAnimationFrame(() => searchRef.current?.focus());
      } else if (e.key === 'Escape' && !collapsed) {
        const inPanel = !!t && !!panelRef.current?.contains(t);
        if (inPanel || !typing) {
          controller.clearHighlight();
          setCollapsedPersist(true);
          if (inPanel) requestAnimationFrame(() => handleRef.current?.focus());
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [collapsed, controller, setCollapsedPersist]);

  // Alt+click on the page focuses and selects the key's field (This page tab when listed there).
  const focusEntry = React.useCallback(
    (entryId: string) => {
      setCollapsedPersist(false);
      setQuery('');
      const onPage = !!model.pageKey(entryId);
      setTab(onPage ? 'page' : 'all');
      pendingFocus.current = entryId;
      // Re-render even when the tab and query are unchanged, so the focus effect runs.
      setFocusRequest((n) => n + 1);
    },
    [model, setCollapsedPersist, setQuery, setTab],
  );
  React.useEffect(() => controller.onFocusKey(focusEntry), [controller, focusEntry]);

  const rowFor = React.useCallback(
    (entryId: string) => {
      const e = model.entry(entryId);
      return e?.plural ? (model.table.groups.get(e.plural.groupId)?.forms[0].id ?? entryId) : entryId;
    },
    [model],
  );

  const onHighlight = React.useCallback(
    (id: string | null) => {
      const e = id ? model.entry(id) : undefined;
      const ids = e?.plural ? (model.table.groups.get(e.plural.groupId)?.forms.map((f) => f.id) ?? []) : id ? [id] : [];
      if (id && ids.some((i) => model.pageKey(i))) controller.highlightEntry(id);
      else controller.clearHighlight();
    },
    [controller, model],
  );

  /* --- resize ------------------------------------------------------------- */
  const onResizeStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = width;
    const target = e.currentTarget;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // jsdom / old browsers
    }
    const move = (ev: PointerEvent) => {
      const delta = side === 'right' ? startX - ev.clientX : ev.clientX - startX;
      setWidth(clampPanelWidth(startW + delta, window.innerWidth));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      setWidth((w) => {
        writeStored(WIDTH_STORAGE_KEY, String(w));
        return w;
      });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  const onResizeKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const grow = side === 'right' ? 'ArrowLeft' : 'ArrowRight';
    const shrink = side === 'right' ? 'ArrowRight' : 'ArrowLeft';
    if (e.key !== grow && e.key !== shrink) return;
    e.preventDefault();
    const next = clampPanelWidth(width + (e.key === grow ? 24 : -24), window.innerWidth);
    setWidth(next);
    writeStored(WIDTH_STORAGE_KEY, String(next));
  };

  /* --- lists --------------------------------------------------------------- */
  const pageRows = React.useMemo(() => {
    const keys = model.pageKeys().map((p) => p.entryId);
    // Keep the table's order (English shard order), grouped by namespace › shard.
    const order = new Map(model.table.entries.map((e, i) => [e.id, i]));
    keys.sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
    return filterRows(model, rowIds(model, keys), debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, model.version, debounced]);
  const allRowIdsUnfiltered = React.useMemo(() => rowIds(model, model.table.entries.map((e) => e.id)), [model]);
  const allRows = React.useMemo(
    () => filterRows(model, allRowIdsUnfiltered, debounced),
    // Search results re-filter when a translation changes too (the index is patched per edit).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [model, allRowIdsUnfiltered, debounced, debounced ? model.version : 0],
  );
  const changes = model.changes();

  // Hover on the page: bring the row into view in This page.
  const hoveredRow = model.hoveredIds().map(rowFor)[0];
  React.useEffect(() => {
    if (!hoveredRow || tab !== 'page' || collapsed) return;
    const el = panelRef.current?.querySelector(`[data-entry-id="${CSS.escape(hoveredRow)}"]`);
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [hoveredRow, tab, collapsed]);

  // Pending Alt+click focus: once the row is rendered, focus and select its field.
  const allListRef = React.useRef<{ scrollToRow: (rowId: string) => void } | null>(null);
  React.useEffect(() => {
    const id = pendingFocus.current;
    if (!id || collapsed) return;
    if (tab === 'all') allListRef.current?.scrollToRow(rowFor(id));
    const tryFocus = (attempt: number) => {
      const field = document.getElementById(fieldDomId(id)) ?? document.getElementById(fieldDomId(rowFor(id)));
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        pendingFocus.current = null;
        field.scrollIntoView?.({ block: 'center' });
        field.focus();
        field.select();
      } else if (attempt < 5) {
        requestAnimationFrame(() => tryFocus(attempt + 1));
      }
    };
    tryFocus(0);
  }, [focusRequest, tab, collapsed, rowFor]);

  if (collapsed) {
    return (
      <div data-translator-ui="" className={cn('fixed top-1/2 z-[2147483645] -translate-y-1/2', side === 'right' ? 'right-0' : 'left-0')}>
        <button
          ref={handleRef}
          type="button"
          onClick={() => setCollapsedPersist(false)}
          aria-label={CHROME.openPanel}
          aria-expanded={false}
          lang="en"
          data-workbench-handle=""
          className={cn(
            'flex h-28 w-7 items-center justify-center border border-border bg-background text-[11px] font-medium text-muted-foreground shadow-md',
            'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
            side === 'right' ? 'rounded-l-md border-r-0' : 'rounded-r-md border-l-0',
          )}
        >
          <span className="[writing-mode:vertical-rl]">{changes.length ? `${changes.length} · ` : ''}{CHROME.panelLabel}</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      ref={panelRef}
      data-translator-ui=""
      data-workbench-panel=""
      data-side={side}
      dir={dir}
      lang="en"
      aria-label={CHROME.panelLabel}
      style={{ width }}
      className={cn(
        'fixed inset-y-0 z-[2147483645] flex max-w-[60vw] flex-col border-border bg-background text-foreground shadow-xl',
        side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
      )}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={CHROME.resizeHandle}
        aria-valuemin={PANEL_MIN_WIDTH}
        aria-valuenow={width}
        tabIndex={0}
        onPointerDown={onResizeStart}
        onKeyDown={onResizeKey}
        data-resize-handle=""
        className={cn(
          'absolute inset-y-0 w-1.5 cursor-col-resize hover:bg-premium/40 focus-visible:bg-premium/60 focus-visible:outline-none',
          side === 'right' ? '-left-0.5' : '-right-0.5',
        )}
      />
      <header className="flex items-center gap-2 border-b border-border px-3 py-2" dir="ltr">
        <h2 className="text-sm font-semibold">{CHROME.panelLabel}</h2>
        <Badge variant="secondary" className="text-[10px]">
          {lang}
        </Badge>
        <Button
          ref={handleRef}
          variant="ghost"
          size="sm"
          className="ms-auto h-7 px-2"
          aria-label={CHROME.collapsePanel}
          aria-expanded
          onClick={() => setCollapsedPersist(true)}
        >
          {side === 'right' ? '»' : '«'}
        </Button>
      </header>
      {!model.storage.persistent ? (
        <p role="status" data-storage-banner="" className="border-b border-border bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-800 dark:text-amber-300" dir="ltr">
          {CHROME.storageBanner}
        </p>
      ) : null}
      <div className="border-b border-border px-3 py-2" dir="ltr">
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={CHROME.searchLabel}
          placeholder={CHROME.searchPlaceholder}
          data-workbench-search=""
          className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as WorkbenchTab)} className="min-h-0 flex-1 gap-0" dir="ltr">
        <TabsList className="mx-3 my-2 w-auto">
          <TabsTrigger value="page">
            {CHROME.tabs.page} <span className="text-muted-foreground">{pageRows.length}</span>
          </TabsTrigger>
          <TabsTrigger value="all">{CHROME.tabs.all}</TabsTrigger>
          <TabsTrigger value="changes">
            {CHROME.tabs.changes} {changes.length ? <Badge className="h-4 px-1 text-[10px]">{changes.length}</Badge> : null}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="page" className="min-h-0 overflow-y-auto" data-tab-panel="page">
          {model.pageForeignLanguages.length && localizedHref ? (
            <p className="px-3 py-2 text-xs text-muted-foreground">
              {CHROME.otherLocalePage(model.pageForeignLanguages.join(', '), localizedHref)}
            </p>
          ) : null}
          {pageRows.length === 0 ? (
            <p className="px-3 py-4 text-sm text-muted-foreground">{debounced ? CHROME.noMatches : CHROME.noKeysOnPage}</p>
          ) : (
            <GroupedRows model={model} rows={pageRows} dir={dir} lang={lang} onHighlight={onHighlight} />
          )}
        </TabsContent>
        <TabsContent value="all" className="flex min-h-0 flex-col" data-tab-panel="all">
          <AllKeysList
            ref={allListRef}
            model={model}
            rows={allRows}
            dir={dir}
            lang={lang}
            onHighlight={onHighlight}
            initialRect={virtualRect}
          />
        </TabsContent>
        <TabsContent value="changes" className="min-h-0 overflow-y-auto" data-tab-panel="changes">
          <ChangesTab model={model} dir={dir} lang={lang} onHighlight={onHighlight} query={debounced} />
        </TabsContent>
      </Tabs>
    </aside>
  );
};

/* ------------------------------------------------------------------------- */

const GroupedRows: React.FC<{
  model: WorkbenchModel;
  rows: string[];
  dir: 'ltr' | 'rtl';
  lang: string;
  onHighlight: (id: string | null) => void;
}> = ({ model, rows, dir, lang, onHighlight }) => {
  const sections: Array<{ group: string; rows: string[] }> = [];
  for (const id of rows) {
    const g = model.entry(id)?.group ?? '';
    const last = sections[sections.length - 1];
    if (last && last.group === g) last.rows.push(id);
    else sections.push({ group: g, rows: [id] });
  }
  return (
    <>
      {sections.map((s) => (
        <section key={s.group} aria-label={s.group} data-shard-group={s.group}>
          <h3 className="sticky top-0 z-10 border-b border-border bg-muted/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur" dir="ltr">
            {s.group}
          </h3>
          {s.rows.map((id) => (
            <KeyRow key={id} model={model} entryId={id} dir={dir} lang={lang} showSites onHighlight={onHighlight} />
          ))}
        </section>
      ))}
    </>
  );
};

interface AllKeysListProps {
  model: WorkbenchModel;
  rows: string[];
  dir: 'ltr' | 'rtl';
  lang: string;
  onHighlight: (id: string | null) => void;
  initialRect?: { width: number; height: number };
}

/** Every key of the locale, virtualised (decision 3, 12): only the visible rows mount. */
export const AllKeysList = React.forwardRef<{ scrollToRow: (rowId: string) => void }, AllKeysListProps>(
  function AllKeysList({ model, rows, dir, lang, onHighlight, initialRect }, ref) {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
      count: rows.length,
      getScrollElement: () => scrollRef.current,
      estimateSize: () => 112,
      overscan: 6,
      getItemKey: (i) => rows[i],
      initialRect,
    });
    React.useImperativeHandle(
      ref,
      () => ({
        scrollToRow: (rowId: string) => {
          const i = rows.indexOf(rowId);
          if (i >= 0) virtualizer.scrollToIndex(i, { align: 'center' });
        },
      }),
      [rows, virtualizer],
    );
    if (rows.length === 0) return <p className="px-3 py-4 text-sm text-muted-foreground">{CHROME.noMatches}</p>;
    return (
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto" data-virtual-scroll="" style={initialRect ? { height: initialRect.height } : undefined}>
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((item) => (
            <div
              key={item.key}
              data-index={item.index}
              data-virtual-row=""
              ref={virtualizer.measureElement}
              style={{ position: 'absolute', top: 0, insetInlineStart: 0, width: '100%', transform: `translateY(${item.start}px)` }}
            >
              <KeyRow model={model} entryId={rows[item.index]} dir={dir} lang={lang} onHighlight={onHighlight} />
            </div>
          ))}
        </div>
      </div>
    );
  },
);

const ChangesTab: React.FC<{
  model: WorkbenchModel;
  dir: 'ltr' | 'rtl';
  lang: string;
  onHighlight: (id: string | null) => void;
  query: string;
}> = ({ model, dir, lang, onHighlight, query }) => {
  const changes = model.changes();
  const rows = filterRows(
    model,
    rowIds(
      model,
      changes.map((c) => `${c.file}|${c.key}`),
    ),
    query,
  );
  const warnings = changes.reduce((n, c) => n + c.warnings.length, 0);
  // MM56: restored from the draft store; every open/close is saved there.
  const [submitOpen, setSubmitOpenState] = React.useState(() => !!model.submitDraft?.open && changes.length > 0);
  const setSubmitOpen = React.useCallback(
    (next: boolean) => {
      setSubmitOpenState(next);
      model.saveSubmitDraft({ open: next });
    },
    [model],
  );
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 text-xs" dir="ltr">
        <span data-changes-count="">{changes.length ? CHROME.changesCount(changes.length) : CHROME.changesEmpty}</span>
        {warnings ? (
          <Badge variant="outline" className="text-[10px] text-amber-700 dark:text-amber-400">
            {CHROME.warnings(warnings)}
          </Badge>
        ) : null}
        <span className="ms-auto text-muted-foreground" data-base-label="">
          {model.baseStatus === 'failed'
            ? CHROME.baseFailed
            : model.base
              ? CHROME.baseLabel(model.base.sha)
              : CHROME.baseMissing}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={model.baseStatus === 'loading'}
          onClick={() => void model.refreshBase()}
        >
          {CHROME.refreshBase}
        </Button>
      </div>
      {rows.map((id) => (
        <KeyRow key={id} model={model} entryId={id} dir={dir} lang={lang} onHighlight={onHighlight} />
      ))}
      <div className="border-t border-border px-3 py-3" dir="ltr" data-submit-area="">
        <Button className="w-full" disabled={changes.length === 0} onClick={() => setSubmitOpen(true)}>
          {CHROME.submit}
        </Button>
      </div>
      {submitOpen ? <SubmitModal model={model} open onOpenChange={setSubmitOpen} /> : null}
    </div>
  );
};

export default WorkbenchPanel;
