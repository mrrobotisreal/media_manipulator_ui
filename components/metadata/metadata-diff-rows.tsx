'use client';

import { useMemo } from 'react';
import { useLocalization } from '@/i18n/useLocalization';
import { diffChars, formatNumericChange, numericDelta } from '@/lib/metadata/diff-text';
import type { DiffRow } from '@/lib/metadata/diff-model';
import { humanizeTag } from '@/lib/metadata/humanize';
import { cn } from '@/lib/utils';

/** Gutter glyph per kind: the non-color signal alongside the sr-only label and left border. */
export const GLYPH: Record<DiffRow['kind'], string> = {
  removed: '−',
  added: '+',
  changed: '~',
  unchanged: ' ',
  expected: ' ',
};

const TONE: Record<DiffRow['kind'], string> = {
  removed: 'border-l-[3px] border-solid border-l-[var(--mm-diff-removed-fg)] bg-[var(--mm-diff-removed-bg)] text-[var(--mm-diff-removed-fg)]',
  added: 'border-l-[3px] border-dashed border-l-[var(--mm-diff-added-fg)] bg-[var(--mm-diff-added-bg)] text-[var(--mm-diff-added-fg)]',
  changed: 'border-l-[3px] border-double border-l-[var(--mm-diff-changed-fg)] bg-[var(--mm-diff-changed-bg)] text-[var(--mm-diff-changed-fg)]',
  unchanged: 'border-l-[3px] border-l-transparent text-muted-foreground',
  expected: 'border-l-[3px] border-l-transparent text-muted-foreground opacity-70',
};

function Label({ row }: { row: DiffRow }) {
  return (
    <span className="min-w-0">
      <span className="block truncate text-sm font-medium" title={row.id}>{humanizeTag(row.tag)}</span>
      <span className="block truncate text-xs opacity-80">{row.group}</span>
    </span>
  );
}

function SrKind({ kind }: { kind: DiffRow['kind'] }) {
  const { t } = useLocalization('interface');
  return <span className="sr-only">{t(`metadata.diff.kind.${kind}`)}: </span>;
}

/** Value text with char-level highlights for the changed side. */
function Highlighted({ row, side }: { row: DiffRow; side: 'before' | 'after' }) {
  const ops = useMemo(() => diffChars(row.before, row.after), [row.before, row.after]);
  const numeric = numericDelta(row.beforeRaw, row.afterRaw);
  if (numeric) return <span>{side === 'before' ? row.before : row.after}</span>;
  return (
    <span>
      {ops.map((op, i) => {
        if (op.type === 'equal') return <span key={i}>{op.text}</span>;
        if (op.type === 'remove') {
          return side === 'before' ? (
            <mark key={i} className="rounded-[2px] bg-[var(--mm-diff-char-removed)] text-inherit">{op.text}</mark>
          ) : null;
        }
        return side === 'after' ? (
          <mark key={i} className="rounded-[2px] bg-[var(--mm-diff-char-added)] text-inherit">{op.text}</mark>
        ) : null;
      })}
    </span>
  );
}

function Value({ row, side }: { row: DiffRow; side: 'before' | 'after' }) {
  const { t } = useLocalization('interface');
  const text = side === 'before' ? row.before : row.after;
  if (row.kind === 'changed') return <Highlighted row={row} side={side} />;
  if (!text) return <span className="opacity-60">{t('metadata.diff.emptyCell')}</span>;
  return <span>{text}</span>;
}

const cell = 'num min-w-0 break-words px-2 py-1.5 text-sm';

export function SplitRow({ row }: { row: DiffRow }) {
  const leftTone = row.kind === 'added' ? 'unchanged' : row.kind;
  const rightTone = row.kind === 'removed' ? 'unchanged' : row.kind;
  const numeric = row.kind === 'changed' ? formatNumericChange(row.beforeRaw, row.afterRaw) : undefined;
  return (
    <div
      role="row"
      data-testid="diff-row"
      data-kind={row.kind}
      data-mode="split"
      className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] border-b border-edge last:border-b-0"
    >
      <div role="cell" className={cn('flex gap-2', TONE[leftTone], row.kind === 'added' && 'bg-surface-2/40')}>
        <span aria-hidden="true" className="num w-5 shrink-0 select-none py-1.5 pl-2 text-center">{row.kind === 'added' ? '' : GLYPH[row.kind]}</span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className={cell}>
            <SrKind kind={row.kind} />
            <Label row={row} />
          </span>
          <span className={cn(cell, 'pt-0')}>{row.kind === 'added' ? null : <Value row={row} side="before" />}</span>
        </span>
      </div>
      <div role="cell" className={cn('flex gap-2', TONE[rightTone], row.kind === 'removed' && 'bg-surface-2/40')}>
        <span aria-hidden="true" className="num w-5 shrink-0 select-none py-1.5 pl-2 text-center">{row.kind === 'removed' ? '' : row.kind === 'added' || row.kind === 'changed' ? GLYPH[row.kind] : ''}</span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className={cn(cell, 'pb-0')}>
            {row.kind === 'removed' ? null : <Label row={row} />}
          </span>
          <span className={cell}>
            {row.kind === 'removed' ? null : <Value row={row} side="after" />}
            {numeric ? <span className="ml-2 text-xs opacity-80">{numeric.slice(numeric.indexOf('('))}</span> : null}
          </span>
        </span>
      </div>
    </div>
  );
}

function UnifiedLine({ row, glyph, value, kind, marker }: { row: DiffRow; glyph: string; value: React.ReactNode; kind: DiffRow['kind']; marker?: string }) {
  return (
    <div role="row" data-testid="diff-row" data-kind={row.kind} data-line={kind} data-mode="unified" className={cn('grid grid-cols-[1.75rem_minmax(0,12rem)_minmax(0,1fr)] items-start sm:grid-cols-[1.75rem_minmax(0,16rem)_minmax(0,1fr)]', TONE[kind])}>
      <span role="cell" aria-hidden="true" className="num select-none py-1.5 text-center" data-testid="diff-gutter">{glyph}</span>
      <span role="cell" className="px-2 py-1.5"><SrKind kind={kind === 'removed' && marker ? 'changed' : kind} /><Label row={row} /></span>
      <span role="cell" className={cell}>{marker ? <span aria-hidden="true" data-testid="diff-changed-marker" className="num mr-1 select-none opacity-80">{marker}</span> : null}{value}</span>
    </div>
  );
}

export function UnifiedRows({ row }: { row: DiffRow }) {
  if (row.kind === 'changed') {
    const numeric = formatNumericChange(row.beforeRaw, row.afterRaw);
    return (
      <div className="border-b border-edge last:border-b-0">
        <UnifiedLine row={row} kind="removed" marker={GLYPH.changed} glyph={GLYPH.removed} value={<Value row={row} side="before" />} />
        <UnifiedLine
          row={row}
          kind="added"
          glyph={GLYPH.added}
          value={
            <>
              <Value row={row} side="after" />
              {numeric ? <span className="ml-2 text-xs opacity-80">{numeric.slice(numeric.indexOf('('))}</span> : null}
            </>
          }
        />
      </div>
    );
  }
  return (
    <div className="border-b border-edge last:border-b-0">
      <UnifiedLine
        row={row}
        kind={row.kind}
        glyph={GLYPH[row.kind]}
        value={<Value row={row} side={row.kind === 'added' ? 'after' : 'before'} />}
      />
    </div>
  );
}
