'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocalization } from '@/i18n/useLocalization';
import type { MetadataRow } from '@/lib/metadata/rows';
import { MetadataValueCell, type MetadataValueCellProps } from './metadata-value';

/** Sections with at least this many rows render virtualized. */
export const VIRTUALIZE_AT = 200;
const ROW_ESTIMATE = 44;
const GRID = 'grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1.5fr)] gap-x-4';
const GRID_COMPACT = 'grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-x-3';

export interface MetadataTableProps extends Pick<MetadataValueCellProps, 'resolveBinaryUrl' | 'onBinaryDownload'> {
  rows: MetadataRow[];
  /** Accessible table name (the category title). */
  label: string;
  /** Narrow layout: About moves under the tag name. */
  compact?: boolean;
  virtualizeAt?: number;
}

function AboutText({ row }: { row: MetadataRow }) {
  const { t } = useLocalization('interface');
  if (!row.about) {
    return <span className="text-xs text-muted-foreground">{t('metadata.about.unknown')}</span>;
  }
  return (
    <span className="flex items-start gap-1.5">
      <span className="min-w-0 flex-1 text-xs text-muted-foreground">{row.about.text}</span>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={t('metadata.table.aboutButton', { tag: row.label })}
            className="shrink-0 rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Info aria-hidden="true" className="size-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="space-y-2 text-sm">
          <p className="font-medium">{row.label}</p>
          <p className="text-muted-foreground">{row.about.text}</p>
          {row.about.aliases.length ? (
            <p className="font-mono text-xs text-muted-foreground">{row.about.aliases.join(' · ')}</p>
          ) : null}
          {row.about.unverified ? <p className="text-xs text-premium">{t('metadata.about.unverified')}</p> : null}
        </PopoverContent>
      </Popover>
    </span>
  );
}

function TagCell({ row, compact }: { row: MetadataRow; compact: boolean }) {
  const { t } = useLocalization('interface');
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        <span className="break-words text-sm font-medium text-foreground">{row.label}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="rounded-sm border border-edge px-1 text-[10px] leading-4 text-muted-foreground" tabIndex={0}>
              {row.groupLabel}
            </span>
          </TooltipTrigger>
          <TooltipContent>{t('metadata.table.group', { group: row.groupLabel })}</TooltipContent>
        </Tooltip>
      </div>
      {row.entry.tag !== row.label ? (
        <div className="break-all font-mono text-[11px] text-muted-foreground">{row.entry.tag}</div>
      ) : null}
      {compact ? (
        <div className="mt-1">
          <AboutText row={row} />
        </div>
      ) : null}
    </div>
  );
}

export function MetadataTable({ rows, label, compact = false, virtualizeAt = VIRTUALIZE_AT, ...cellProps }: MetadataTableProps) {
  const { t } = useLocalization('interface');
  const parentRef = useRef<HTMLDivElement>(null);
  const virtual = rows.length >= virtualizeAt;
  const virtualizer = useVirtualizer({
    count: virtual ? rows.length : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_ESTIMATE,
    overscan: 8,
    getItemKey: (i) => rows[i]?.entry.id ?? i,
  });
  const grid = compact ? GRID_COMPACT : GRID;

  if (!virtual) {
    return (
      <table className="w-full table-fixed border-collapse text-left" aria-label={label}>
        <thead className="sr-only md:not-sr-only">
          <tr className="text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="w-[28%] px-2 py-1.5 font-medium">{t('metadata.table.tag')}</th>
            <th scope="col" className="w-[36%] px-2 py-1.5 font-medium">{t('metadata.table.value')}</th>
            {compact ? null : <th scope="col" className="px-2 py-1.5 font-medium">{t('metadata.table.about')}</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.entry.id} className="border-t border-edge align-top" data-entry-id={row.entry.id}>
              <td className="px-2 py-2"><TagCell row={row} compact={compact} /></td>
              <td className="min-w-0 px-2 py-2"><MetadataValueCell row={row} {...cellProps} /></td>
              {compact ? null : <td className="px-2 py-2"><AboutText row={row} /></td>}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Virtualized: div rows with ARIA roles (a <table> cannot take absolutely positioned rows).
  return (
    <div role="table" aria-label={label} aria-rowcount={rows.length + 1} data-virtualized="true">
      <div role="row" aria-rowindex={1} className={`${grid} px-2 py-1.5 text-xs uppercase tracking-wide text-muted-foreground`}>
        <div role="columnheader">{t('metadata.table.tag')}</div>
        <div role="columnheader">{t('metadata.table.value')}</div>
        {compact ? null : <div role="columnheader">{t('metadata.table.about')}</div>}
      </div>
      <div ref={parentRef} className="max-h-[560px] overflow-auto" data-testid="metadata-virtual-scroll">
        <div role="rowgroup" style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((item) => {
            const row = rows[item.index];
            return (
              <div
                key={item.key}
                role="row"
                aria-rowindex={item.index + 2}
                data-index={item.index}
                data-entry-id={row.entry.id}
                ref={virtualizer.measureElement}
                className={`${grid} absolute left-0 top-0 w-full border-t border-edge px-2 py-2`}
                style={{ transform: `translateY(${item.start}px)` }}
              >
                <div role="cell" className="min-w-0"><TagCell row={row} compact={compact} /></div>
                <div role="cell" className="min-w-0"><MetadataValueCell row={row} {...cellProps} /></div>
                {compact ? null : <div role="cell" className="min-w-0"><AboutText row={row} /></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
