'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Info, TriangleAlert, X } from 'lucide-react';
import { toast } from 'sonner';
import { Accordion } from '@/components/ui/accordion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { useLocalization } from '@/i18n/useLocalization';
import { ensureMetadataShard } from '@/lib/i18n/ensureShard';
import useMediaQuery from '@/lib/useMediaQuery';
import { cn } from '@/lib/utils';
import { getCatalog, type CatalogIndex } from '@/lib/metadata/catalog';
import {
  countByPrivacy,
  defaultOpen,
  groupByCategory,
  hasOnlyBasicInfo,
} from '@/lib/metadata/categories';
import { formatDuration } from '@/lib/metadata/format';
import { aboutKey } from '@/lib/metadata/keys';
import { buildRows } from '@/lib/metadata/rows';
import { buildSearchIndex, searchEntries } from '@/lib/metadata/search';
import {
  privacyOf,
  type InspectorEvent,
  type InspectorSurface,
  type MetadataDocument,
  type MetadataEntry,
  type PrivacyClass,
} from '@/lib/metadata/types';
import { copyText } from './clipboard';
import { MetadataGps } from './metadata-gps';
import { MetadataRaw } from './metadata-raw';
import { MetadataSection } from './metadata-section';
import { MetadataSummaryBar } from './metadata-summary-bar';
import { MetadataThumbnail, thumbnailEntries } from './metadata-thumbnail';
import { useInspectorState } from './use-inspector-state';

export interface MetadataInspectorProps {
  document: MetadataDocument;
  surface: InspectorSurface;
  /** Overrides `document.file.name` in the summary bar. */
  fileName?: string;
  /** Renders a "Strip all metadata" button in the summary bar when given. */
  onStripAll?: () => void;
  extraActions?: React.ReactNode;
  className?: string;
  /** Surfaces own fetching; the inspector only renders what it is given. */
  status?: 'loading' | 'error' | 'ready';
  /** Download URL for a binary entry (thumbnails, ICC); null when none exists yet. */
  resolveBinaryUrl?: (entry: MetadataEntry) => string | null;
  /** Typed callback MM11 maps to analytics. The inspector imports no analytics itself. */
  onEvent?: (event: InspectorEvent) => void;
  /** Mirror open sections and filters to `location.hash` (default true). Off for a second inspector on a page. */
  persistHash?: boolean;
}

const EXIFTOOL_UNAVAILABLE = /^exiftool unavailable$/i;

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

function Callout({ icon: Icon, children, role, onDismiss, dismissLabel }: {
  icon: typeof Info;
  children: React.ReactNode;
  role?: 'alert' | 'status';
  onDismiss?: () => void;
  dismissLabel?: string;
}) {
  return (
    <div role={role} className="flex items-start gap-2 rounded-md border border-edge bg-surface-2 p-3 text-sm">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-premium" />
      <div className="min-w-0 flex-1">{children}</div>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} aria-label={dismissLabel} className="rounded-sm text-muted-foreground hover:text-foreground">
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

export function MetadataInspector({
  document: doc,
  surface,
  fileName,
  onStripAll,
  extraActions,
  className,
  status = 'ready',
  resolveBinaryUrl,
  onEvent,
  persistHash = true,
}: MetadataInspectorProps) {
  const { t, language } = useLocalization('interface');
  const locale = language?.code;
  const mobile = useMediaQuery('(max-width: 767px)');
  const [catalog, setCatalog] = useState<CatalogIndex | null>(null);
  const [shardReady, setShardReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getCatalog(), ensureMetadataShard()])
      .then(([c]) => {
        if (cancelled) return;
        setCatalog(c);
        setShardReady(true);
      })
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const { open, filters, setOpen, setFilters } = useInspectorState(persistHash);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounced(query, 150);
  const deferredQuery = useDeferredValue(debouncedQuery);
  const [raw, setRaw] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const [closure, setClosure] = useState<{ key: string; ids: string[] }>({ key: '', ids: [] });

  const emit = useRef(onEvent);
  useEffect(() => {
    emit.current = onEvent;
  });

  // Rows: entries joined with catalog text and formatted values. Rebuilt when the catalog,
  // shard or language arrives, so the table never flashes raw keys.
  const rows = useMemo(() => {
    if (!catalog) return null;
    return buildRows(doc.entries, {
      catalog,
      locale,
      describe: (row) => t(`metadata.${aboutKey(row)}`, { defaultValue: row.description }),
    });
    // `shardReady` re-runs description lookup once the English shard is merged.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog, doc.entries, locale, t, shardReady]);

  const rowById = useMemo(() => new Map(rows?.map((r) => [r.entry.id, r]) ?? []), [rows]);
  const searchIndex = useMemo(
    () =>
      rows
        ? buildSearchIndex(doc.entries, { locale, describe: (e) => rowById.get(e.id)?.about?.text })
        : [],
    [rows, doc.entries, locale, rowById],
  );

  const matches = useMemo(() => searchEntries(searchIndex, deferredQuery), [searchIndex, deferredQuery]);
  const filtering = matches !== null || filters.length > 0;

  const allGroups = useMemo(() => groupByCategory(doc.entries), [doc.entries]);
  const sections = useMemo(() => {
    if (!rows) return [];
    return allGroups
      .map((g) => {
        const sectionRows = g.entries
          .filter((e) => {
            if (matches && !matches.has(e.id)) return false;
            if (filters.length) {
              const p = privacyOf(e);
              if (!p || !filters.includes(p)) return false;
            }
            return true;
          })
          .map((e) => rowById.get(e.id))
          .filter((r): r is NonNullable<typeof r> => !!r);
        return { ...g, rows: sectionRows };
      })
      .filter((s) => !filtering || s.rows.length > 0);
  }, [allGroups, rows, rowById, matches, filters, filtering]);

  const presentIds = useMemo(() => new Set(allGroups.map((g) => g.id)), [allGroups]);
  const visibleIds = useMemo(() => sections.map((s) => s.id), [sections]);
  const privacyCounts = useMemo(() => countByPrivacy(doc.entries), [doc.entries]);

  // Open state: hash (or defaults) normally; every matching section while filtering.
  const baseOpen = open ?? defaultOpen(presentIds);
  // Sections the user closed while this exact filter was active; a new filter resets it.
  const filterKey = `${deferredQuery}|${filters.join(',')}`;
  const closedIds = closure.key === filterKey ? closure.ids : [];
  const openValue = filtering ? visibleIds.filter((id) => !closedIds.includes(id)) : baseOpen;
  const allOpen = visibleIds.length > 0 && visibleIds.every((id) => openValue.includes(id));

  const lastQueryReported = useRef('');
  useEffect(() => {
    if (!deferredQuery.trim() || lastQueryReported.current === deferredQuery) return;
    lastQueryReported.current = deferredQuery;
    emit.current?.({ type: 'search_used', length: deferredQuery.trim().length, results: matches?.size ?? 0 });
  }, [deferredQuery, matches]);

  const onValueChange = (next: string[]) => {
    const prev = openValue;
    for (const id of next) if (!prev.includes(id)) emit.current?.({ type: 'section_toggled', category: id, open: true });
    for (const id of prev) if (!next.includes(id)) emit.current?.({ type: 'section_toggled', category: id, open: false });
    if (filtering) setClosure({ key: filterKey, ids: visibleIds.filter((id) => !next.includes(id)) });
    else setOpen(next);
  };

  const toggleFilter = (p: PrivacyClass) => {
    const active = !filters.includes(p);
    setFilters(active ? [...filters, p] : filters.filter((x: PrivacyClass) => x !== p));
    emit.current?.({ type: 'privacy_filter_used', privacy: p, active });
  };

  const toggleAll = () => {
    const next = allOpen ? [] : visibleIds;
    if (filtering) setClosure({ key: filterKey, ids: allOpen ? visibleIds : [] });
    else setOpen(next);
    for (const id of visibleIds) {
      if (allOpen === openValue.includes(id)) emit.current?.({ type: 'section_toggled', category: id, open: !allOpen });
    }
  };

  const copyJson = useCallback(async () => {
    const ok = await copyText(JSON.stringify(doc, null, 2));
    if (ok) toast.success(t('metadata.copied'));
    else toast.error(t('metadata.copyFailed'));
  }, [doc, t]);

  const onBinaryDownload = useCallback((entryId: string) => {
    emit.current?.({ type: 'binary_downloaded', entryId });
  }, []);

  if (status === 'loading') return <PanelLoading label={t('metadata.loading')} className={className} />;
  if (status === 'error') {
    return (
      <div className={className}>
        <Callout icon={TriangleAlert} role="alert">
          <p className="font-medium">{t('metadata.error.title')}</p>
          <p className="text-muted-foreground">{t('metadata.error.body')}</p>
        </Callout>
      </div>
    );
  }

  const byId = (id: string) => doc.entries.find((e) => e.id === id);
  const sizeEntry = byId('Composite:ImageSize');
  const dimensions = sizeEntry && typeof sizeEntry.value === 'string' ? sizeEntry.value.replace('x', ' × ') : undefined;
  const durEntry = byId('Format:duration');
  const durNum = durEntry ? Number.parseFloat(String(durEntry.value)) : NaN;
  const duration = Number.isFinite(durNum) ? formatDuration(durNum) : undefined;

  const warnings = doc.warnings.filter((w) => !dismissed.has(w));
  const thumbsPresent = thumbnailEntries(doc.entries).length > 0;
  const thumbSectionShown = sections.some((s) => s.id === 'thumbnail');

  return (
    <TooltipProvider delayDuration={300}>
    <div
      data-testid="metadata-inspector"
      data-surface={surface}
      className={cn('overflow-hidden rounded-lg border border-edge bg-surface-1', className)}
    >
      <MetadataSummaryBar
        fileName={fileName ?? doc.file.name}
        kind={doc.file.kind}
        dimensions={dimensions}
        duration={duration}
        tagCount={doc.entries.length}
        categoryCount={allGroups.length}
        privacyCounts={privacyCounts}
        activeFilters={filters}
        onToggleFilter={toggleFilter}
        query={query}
        onQueryChange={setQuery}
        raw={raw}
        onRawChange={setRaw}
        allOpen={allOpen}
        onToggleAll={toggleAll}
        onCopy={copyJson}
        mobile={mobile}
        onStripAll={onStripAll}
        extraActions={extraActions}
      />

      <div className="space-y-3 p-3 sm:p-4">
        {warnings.length ? (
          <ul className="space-y-2" aria-label={t('metadata.warnings.title')}>
            {warnings.map((w) => {
              const unavailable = EXIFTOOL_UNAVAILABLE.test(w);
              return (
                <li key={w}>
                  <Callout
                    icon={TriangleAlert}
                    role={unavailable ? 'alert' : 'status'}
                    onDismiss={() => setDismissed((d) => new Set(d).add(w))}
                    dismissLabel={t('metadata.warnings.dismiss')}
                  >
                    {unavailable ? t('metadata.warnings.exiftoolUnavailable') : w}
                  </Callout>
                </li>
              );
            })}
          </ul>
        ) : null}

        {doc.entries.length === 0 || hasOnlyBasicInfo(doc.entries) ? (
          <Callout icon={Info} role="status">
            <p className="font-medium">{t('metadata.empty.title')}</p>
            <p className="text-muted-foreground">
              {doc.entries.length === 0 ? t('metadata.empty.noEntries') : t('metadata.empty.body')}
            </p>
          </Callout>
        ) : null}
        {doc.entries.length === 0 ? (
          <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <FileFact label={t('metadata.table.value')} value={doc.file.name} />
            <FileFact label="MIME" value={doc.file.mime || '—'} />
          </dl>
        ) : null}

        {!shardReady && !loadError && !rows ? <PanelLoading label={t('metadata.loading')} variant="inline" /> : null}
        {loadError ? (
          <Callout icon={TriangleAlert} role="alert">{t('metadata.error.title')}</Callout>
        ) : null}

        {raw ? (
          <MetadataRaw entries={doc.entries} />
        ) : (
          <>
            {thumbsPresent && !thumbSectionShown && !filtering ? (
              <MetadataThumbnail entries={doc.entries} resolveBinaryUrl={resolveBinaryUrl} onDownload={onBinaryDownload} />
            ) : null}
            {rows && filtering && sections.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground" role="status">
                <p>{t('metadata.search.noResults')}</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setQuery('');
                    setFilters([]);
                  }}
                >
                  {t('metadata.search.resetFilters')}
                </Button>
              </div>
            ) : null}
            {rows ? (
              <Accordion type="multiple" value={openValue} onValueChange={onValueChange} className="rounded-md border border-edge">
                {sections.map((s) => (
                  <MetadataSection
                    key={s.id}
                    id={s.id}
                    rows={s.rows}
                    total={s.entries.length}
                    privacy={s.privacy}
                    filtering={filtering}
                    compact={mobile}
                    resolveBinaryUrl={resolveBinaryUrl}
                    onBinaryDownload={onBinaryDownload}
                    lead={
                      s.id === 'gps' ? (
                        <MetadataGps entries={doc.entries} />
                      ) : s.id === 'thumbnail' ? (
                        <MetadataThumbnail entries={doc.entries} resolveBinaryUrl={resolveBinaryUrl} onDownload={onBinaryDownload} />
                      ) : undefined
                    }
                  />
                ))}
              </Accordion>
            ) : null}
          </>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}

function FileFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="truncate text-sm">{value}</dd>
    </div>
  );
}

export default MetadataInspector;
