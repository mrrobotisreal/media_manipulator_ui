'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Segmented } from '@/components/darkroom/segmented';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { useLocalization } from '@/i18n/useLocalization';
import { ensureMetadataShard } from '@/lib/i18n/ensureShard';
import useMediaQuery from '@/lib/useMediaQuery';
import { buildDiffModel, type DiffRow } from '@/lib/metadata/diff-model';
import { diffToText, isExpectedChange } from '@/lib/metadata/diff-text';
import { humanizeTag } from '@/lib/metadata/humanize';
import type { DiffEvent, InspectorSurface } from '@/lib/metadata/types';
import { cn } from '@/lib/utils';
import { copyText } from './clipboard';
import { CategoryIcon } from './category-icon';
import { SplitRow, UnifiedRows } from './metadata-diff-rows';
import { useJobMetadata, useJobMetadataDiff } from './use-metadata-data';

export type DiffMode = 'unified' | 'split';

/** The visitor's explicit choice, sticky for the page session. */
let stickyMode: DiffMode | null = null;
export function resetDiffModeForTests() {
  stickyMode = null;
}

/** Rows rendered per category before "Show more" (unchanged-heavy categories). */
const PAGE = 150;

export interface MetadataDiffModalProps {
  jobId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalName: string;
  resultName: string;
  surface?: InspectorSurface;
  onEvent?: (event: DiffEvent) => void;
}

type Visible = Record<'removed' | 'added' | 'changed' | 'unchanged', boolean>;

const KIND_ORDER = ['removed', 'added', 'changed', 'unchanged'] as const;
const GLYPH_OF = { removed: '−', added: '+', changed: '~', unchanged: '' } as const;

export function MetadataDiffModal(props: MetadataDiffModalProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="flex h-[calc(100dvh-2rem)] max-w-[min(96vw,1200px)] flex-col gap-3 overflow-hidden p-4 sm:max-w-[min(96vw,1200px)] sm:p-6">
        {props.open ? <DiffBody {...props} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function DiffBody({ jobId, originalName, resultName, surface = 'result', onEvent }: MetadataDiffModalProps) {
  const { t } = useLocalization('interface');
  const [shardReady, setShardReady] = useState(false);
  useEffect(() => {
    let live = true;
    ensureMetadataShard().then(() => live && setShardReady(true), () => live && setShardReady(true));
    return () => {
      live = false;
    };
  }, []);

  const diffQ = useJobMetadataDiff(jobId);
  const origQ = useJobMetadata(jobId, 'original');
  const wide = useMediaQuery('(min-width: 1024px)');
  const [chosen, setChosen] = useState<DiffMode | null>(stickyMode);
  const mode: DiffMode = chosen ?? (wide ? 'split' : 'unified');

  const emit = useRef(onEvent);
  useEffect(() => {
    emit.current = onEvent;
  });
  useEffect(() => {
    emit.current?.({ type: 'diff_opened', surface });
  }, [surface]);

  const [visible, setVisible] = useState<Visible>({ removed: true, added: true, changed: true, unchanged: false });
  const [cats, setCats] = useState<string[]>([]);
  const [privacyOnly, setPrivacyOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Record<string, number>>({});
  const [openCats, setOpenCats] = useState<string[] | null>(null);

  const model = useMemo(
    () => (diffQ.data ? buildDiffModel(diffQ.data, origQ.data) : null),
    [diffQ.data, origQ.data],
  );

  const tokens = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query]);
  const categories = useMemo(() => {
    if (!model) return [];
    return model.categories
      .filter((c) => cats.length === 0 || cats.includes(c.id))
      .map((c) => ({
        ...c,
        shown: c.rows.filter((r) => {
          const bucket = r.kind === 'expected' ? 'unchanged' : r.kind;
          if (!visible[bucket]) return false;
          if (privacyOnly && !r.privacy) return false;
          if (tokens.length) {
            const hay = `${humanizeTag(r.tag)} ${r.tag} ${r.group} ${r.before} ${r.after}`.toLowerCase();
            if (!tokens.every((x) => hay.includes(x))) return false;
          }
          return true;
        }),
      }))
      .filter((c) => c.shown.length > 0);
  }, [model, cats, visible, privacyOnly, tokens]);

  const defaultOpen = useMemo(
    () => (model ? model.categories.filter((c) => c.counts.removed + c.counts.added + c.counts.changed > 0).map((c) => c.id) : []),
    [model],
  );

  const onCopy = async () => {
    if (!diffQ.data || !model) return;
    const d = diffQ.data;
    const text = diffToText(
      { removed: d.removed, added: d.added, changed: d.changed.filter((c) => !isExpectedChange(c.id)), unchanged: d.unchanged },
      { original: originalName, result: resultName },
      {
        categoryOf: model.categoryOfId,
        show: { removed: visible.removed, added: visible.added, changed: visible.changed },
        mentionUnchanged: visible.unchanged,
      },
    );
    if (await copyText(text)) toast.success(t('metadata.diff.copied'));
    else toast.error(t('metadata.diff.copyFailed'));
  };

  const setMode = (next: DiffMode) => {
    stickyMode = next;
    setChosen(next);
    emit.current?.({ type: 'mode_changed', mode: next });
  };

  const loading = !shardReady || diffQ.status === 'loading' || (origQ.status === 'loading' && !!diffQ.data);
  const totals = model?.totals;

  return (
    <>
      <div className="space-y-1 pr-8">
        <DialogTitle className="truncate text-base font-semibold sm:text-lg">
          {t('metadata.diff.originalToResult', { original: originalName, result: resultName })}
        </DialogTitle>
        <DialogDescription className="sr-only">{t('metadata.diff.description')}</DialogDescription>
        {totals ? (
          <p data-testid="diff-counts" className="num flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {KIND_ORDER.map((k) => (
              <span key={k}>
                <span aria-hidden="true">{GLYPH_OF[k] ? `${GLYPH_OF[k]}` : '='} </span>
                {t(`metadata.diff.counts.${k}`, { count: totals[k] })}
              </span>
            ))}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2" role="group" aria-label={t('metadata.diff.filters.label')}>
        <Segmented
          name="metadata-diff-mode"
          label={t('metadata.diff.mode.label')}
          value={mode}
          onValueChange={setMode}
          options={[
            { value: 'unified', label: t('metadata.diff.mode.unified') },
            { value: 'split', label: t('metadata.diff.mode.split') },
          ]}
          className="w-48"
        />
        {KIND_ORDER.map((k) => (
          <label key={k} className="inline-flex min-h-8 items-center gap-1.5 text-sm">
            <input
              type="checkbox"
              checked={visible[k]}
              onChange={(e) => setVisible((v) => ({ ...v, [k]: e.target.checked }))}
              className="size-4 accent-[var(--accent-primary)]"
              data-testid={`diff-filter-${k}`}
            />
            {t(`metadata.diff.filters.${k}`)}
          </label>
        ))}
        <label className="inline-flex items-center gap-2 text-sm">
          <Switch checked={privacyOnly} onCheckedChange={setPrivacyOnly} aria-label={t('metadata.diff.filters.privacyOnly')} />
          {t('metadata.diff.filters.privacyOnly')}
        </label>
        <div className="relative min-w-40 flex-1">
          <Search aria-hidden="true" className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('metadata.diff.search.placeholder')}
            aria-label={t('metadata.diff.search.label')}
            className="h-8 pl-8"
          />
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onCopy} disabled={!model}>
          <Copy aria-hidden="true" />
          {t('metadata.diff.copy')}
        </Button>
      </div>

      {model && model.categories.length > 1 ? (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('metadata.diff.filters.categories')}>
          {model.categories.map((c) => {
            const on = cats.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => setCats((cur) => (on ? cur.filter((x) => x !== c.id) : [...cur, c.id]))}
                className={cn(
                  'rounded-full border px-2.5 py-0.5 text-xs transition-colors',
                  on ? 'border-primary bg-primary/15 text-foreground' : 'border-edge text-muted-foreground hover:text-foreground',
                )}
              >
                {t(`metadata.categories.${c.id}.title`, { defaultValue: c.id })}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-edge" data-testid="diff-body" data-mode={mode}>
        {loading ? (
          <PanelLoading label={t('metadata.diff.loading')} />
        ) : diffQ.status === 'error' || !model ? (
          <p role="alert" className="p-4 text-sm text-destructive">{t('metadata.diff.error')}</p>
        ) : categories.length === 0 ? (
          <p role="status" className="p-6 text-center text-sm text-muted-foreground">
            {model.totals.removed + model.totals.added + model.totals.changed === 0 && !visible.unchanged
              ? t('metadata.diff.noChanges')
              : t('metadata.diff.empty')}
          </p>
        ) : (
          <Accordion type="multiple" value={openCats ?? defaultOpen} onValueChange={setOpenCats}>
            {categories.map((c) => {
              const limit = expanded[c.id] ?? PAGE;
              const rows = c.shown.slice(0, limit);
              return (
                <AccordionItem key={c.id} value={c.id} data-testid={`diff-category-${c.id}`} data-category={c.id}>
                  <AccordionTrigger className="px-3">
                    <CategoryIcon id={c.id} className="size-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1 text-sm font-semibold">
                      {t(`metadata.categories.${c.id}.title`, { defaultValue: c.id })}
                    </span>
                    <span className="num text-xs text-muted-foreground" data-testid={`diff-category-counts-${c.id}`}>
                      {t('metadata.diff.categoryCounts', c.counts)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div role="table" aria-label={t(`metadata.categories.${c.id}.title`, { defaultValue: c.id })}>
                      {mode === 'split' ? (
                        <div role="row" className="grid grid-cols-2 border-b border-edge bg-surface-2 text-xs font-medium text-muted-foreground">
                          <span role="columnheader" className="px-3 py-1">{t('metadata.diff.original')}</span>
                          <span role="columnheader" className="px-3 py-1">{t('metadata.diff.result')}</span>
                        </div>
                      ) : null}
                      {rows.map((r) => (mode === 'split' ? <SplitRow key={r.id} row={r} /> : <UnifiedRows key={r.id} row={r} />))}
                    </div>
                    {c.shown.length > limit ? (
                      <div className="p-2 text-center">
                        <Button type="button" variant="link" size="sm" onClick={() => setExpanded((e) => ({ ...e, [c.id]: limit + PAGE }))}>
                          {t('metadata.diff.showMore', { count: c.shown.length - limit })}
                        </Button>
                      </div>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </>
  );
}

export type { DiffRow };
export default MetadataDiffModal;
