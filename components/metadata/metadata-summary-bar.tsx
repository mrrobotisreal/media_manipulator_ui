'use client';

import { useState } from 'react';
import { ChevronsDownUp, ChevronsUpDown, Code2, Copy, Eraser, ListFilter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/i18n/useLocalization';
import { PRIVACY_CHIP_ORDER } from '@/lib/metadata/categories';
import type { PrivacyClass } from '@/lib/metadata/types';
import { CategoryIcon } from './category-icon';
import { PRIVACY_ICON } from './privacy';

const KIND_CATEGORY: Record<string, string> = { image: 'image', video: 'video', audio: 'audio', document: 'pdf' };

export interface SummaryBarProps {
  fileName: string;
  kind: string;
  /** "4032 x 3024" or "1:15" */
  dimensions?: string;
  duration?: string;
  tagCount: number;
  categoryCount: number;
  privacyCounts: Record<PrivacyClass, number>;
  activeFilters: PrivacyClass[];
  onToggleFilter: (p: PrivacyClass) => void;
  query: string;
  onQueryChange: (q: string) => void;
  raw: boolean;
  onRawChange: (raw: boolean) => void;
  allOpen: boolean;
  onToggleAll: () => void;
  onCopy: () => void;
  mobile: boolean;
  onStripAll?: () => void;
  /** Disables the strip button (a job is running). */
  stripDisabled?: boolean;
  /** Overrides the strip label and makes the button the primary action. */
  stripLabel?: string;
  extraActions?: React.ReactNode;
}

function PrivacyChips({
  counts,
  active,
  onToggle,
  className,
}: {
  counts: Record<PrivacyClass, number>;
  active: PrivacyClass[];
  onToggle: (p: PrivacyClass) => void;
  className?: string;
}) {
  const { t } = useLocalization('interface');
  return (
    <div role="group" aria-label={t('metadata.privacy.label')} className={cn('flex flex-wrap gap-1.5', className)}>
      {PRIVACY_CHIP_ORDER.map((p) => {
        const Icon = PRIVACY_ICON[p];
        const on = active.includes(p);
        return (
          <button
            key={p}
            type="button"
            aria-pressed={on}
            data-privacy={p}
            disabled={counts[p] === 0 && !on}
            title={t(`metadata.privacy.${p}Hint`)}
            onClick={() => onToggle(p)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40',
              on ? 'border-primary bg-primary/10 text-foreground' : 'border-edge bg-surface-2 text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon aria-hidden="true" className="size-3.5" />
            {t(`metadata.privacy.${p}`)}
            <span className="num rounded-sm bg-surface-3 px-1 text-[11px]">{counts[p]}</span>
          </button>
        );
      })}
    </div>
  );
}

export function MetadataSummaryBar(props: SummaryBarProps) {
  const { t } = useLocalization('interface');
  const [sheetOpen, setSheetOpen] = useState(false);
  const active = props.activeFilters.length;

  const chips = (
    <PrivacyChips counts={props.privacyCounts} active={props.activeFilters} onToggle={props.onToggleFilter} />
  );

  return (
    <div
      data-testid="metadata-summary-bar"
      className="sticky top-0 z-10 space-y-3 border-b border-edge bg-surface-1/95 p-3 backdrop-blur sm:p-4"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="flex min-w-0 items-center gap-2">
          <CategoryIcon id={KIND_CATEGORY[props.kind] ?? 'file'} className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm font-semibold text-foreground" title={props.fileName}>
            {props.fileName}
          </span>
        </div>
        {props.dimensions ? (
          <span className="num text-xs text-muted-foreground" data-testid="summary-dimensions">{props.dimensions}</span>
        ) : null}
        {props.duration ? (
          <span className="num text-xs text-muted-foreground" data-testid="summary-duration">{props.duration}</span>
        ) : null}
        <span className="num text-xs text-muted-foreground" data-testid="summary-count">
          {t('metadata.summary.tagCount', { count: props.tagCount, categories: props.categoryCount })}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {props.mobile ? (
          <>
            <Button type="button" variant="outline" size="sm" onClick={() => setSheetOpen(true)}>
              <ListFilter aria-hidden="true" />
              {t('metadata.filters')}
              {active ? <span className="num rounded-sm bg-primary/20 px-1 text-[11px]">{active}</span> : null}
            </Button>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetContent side="bottom" className="p-4">
                <SheetHeader className="p-0">
                  <SheetTitle>{t('metadata.filters')}</SheetTitle>
                  <SheetDescription>{t('metadata.filtersDescription')}</SheetDescription>
                </SheetHeader>
                {chips}
              </SheetContent>
            </Sheet>
          </>
        ) : (
          chips
        )}

        <div className="relative min-w-[10rem] flex-1 basis-48">
          <Search aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={props.query}
            onChange={(e) => props.onQueryChange(e.target.value)}
            placeholder={t('metadata.search.placeholder')}
            aria-label={t('metadata.search.label')}
            className="pl-8 pr-8"
          />
          {props.query ? (
            <button
              type="button"
              aria-label={t('metadata.search.clear')}
              onClick={() => props.onQueryChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            type="button"
            variant={props.raw ? 'secondary' : 'outline'}
            size="sm"
            aria-pressed={props.raw}
            onClick={() => props.onRawChange(!props.raw)}
          >
            <Code2 aria-hidden="true" />
            {t('metadata.raw')}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={props.onCopy}>
            <Copy aria-hidden="true" />
            {t('metadata.copy')}
          </Button>
          {!props.raw ? (
            <Button type="button" variant="outline" size="sm" onClick={props.onToggleAll}>
              {props.allOpen ? <ChevronsDownUp aria-hidden="true" /> : <ChevronsUpDown aria-hidden="true" />}
              {props.allOpen ? t('metadata.collapseAll') : t('metadata.expandAll')}
            </Button>
          ) : null}
          {props.onStripAll ? (
            <Button
              type="button"
              variant={props.stripLabel ? 'default' : 'outline'}
              size="sm"
              onClick={props.onStripAll}
              disabled={props.stripDisabled}
              data-testid="metadata-strip-all"
            >
              <Eraser aria-hidden="true" />
              {props.stripLabel ?? t('metadata.stripAll')}
            </Button>
          ) : null}
          {props.extraActions}
        </div>
      </div>
    </div>
  );
}
