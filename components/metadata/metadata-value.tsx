'use client';

import { useState } from 'react';
import { ChevronRight, Download } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLocalization } from '@/i18n/useLocalization';
import { humanizeTag } from '@/lib/metadata/humanize';
import { formatBytes } from '@/lib/metadata/format';
import type { MetadataRow } from '@/lib/metadata/rows';
import type { MetadataValue } from '@/lib/metadata/types';

export const MAX_DEPTH = 4;
const MAX_CHIPS = 12;

const scalar = (v: MetadataValue): string => (v === null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));

function ValueTree({ value, depth, label }: { value: MetadataValue; depth: number; label?: string }) {
  const { t } = useLocalization('interface');
  const [open, setOpen] = useState(false);

  if (value === null || typeof value !== 'object') {
    return <span className="break-words">{scalar(value) || <span className="text-muted-foreground">{t('metadata.table.empty')}</span>}</span>;
  }
  if (depth >= MAX_DEPTH) {
    return (
      <span>
        <code className="break-all font-mono text-xs">{JSON.stringify(value)}</code>
        <span className="sr-only">{t('metadata.table.depthLimit')}</span>
      </span>
    );
  }
  const entries: Array<[string, MetadataValue]> = Array.isArray(value)
    ? value.map((v, i) => [String(i), v])
    : Object.entries(value);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="inline-flex items-center gap-1 rounded-sm text-left text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
        <ChevronRight aria-hidden="true" className={`size-3 transition-transform ${open ? 'rotate-90' : ''}`} />
        {label ? <span className="font-mono">{label}</span> : null}
        <span>{t('metadata.table.objectProperties', { count: entries.length })}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <dl className="mt-1 space-y-1 border-l border-edge pl-3">
          {entries.map(([k, v]) => (
            <div key={k} className="flex flex-wrap gap-x-2 text-xs">
              <dt className="text-muted-foreground">{Array.isArray(value) ? `[${k}]` : humanizeTag(k)}</dt>
              <dd className="min-w-0 flex-1">
                <ValueTree value={v} depth={depth + 1} />
              </dd>
            </div>
          ))}
        </dl>
      </CollapsibleContent>
    </Collapsible>
  );
}

export interface MetadataValueCellProps {
  row: MetadataRow;
  resolveBinaryUrl?: (entry: MetadataRow['entry']) => string | null;
  onBinaryDownload?: (entryId: string) => void;
}

/** The formatted value of one row: text, chips, binary size + link, or a nested tree. */
export function MetadataValueCell({ row, resolveBinaryUrl, onBinaryDownload }: MetadataValueCellProps) {
  const { t } = useLocalization('interface');
  const f = row.formatted;
  switch (f.kind) {
    case 'text':
      return (
        <span className="num break-words text-sm" title={f.title}>
          {f.text || <span className="text-muted-foreground">{t('metadata.table.empty')}</span>}
        </span>
      );
    case 'chips':
      return (
        <ul className="flex flex-wrap gap-1" aria-label={row.label}>
          {f.items.map((item, i) => (
            <li key={i} className="rounded-sm border border-edge bg-surface-2 px-1.5 py-0.5 text-xs">
              {item}
            </li>
          ))}
          {f.more > 0 ? (
            <li className="px-1 py-0.5 text-xs text-muted-foreground">{t('metadata.table.moreChips', { count: f.more })}</li>
          ) : null}
        </ul>
      );
    case 'binary': {
      const url = resolveBinaryUrl?.(row.entry) ?? null;
      return (
        <span className="num inline-flex flex-wrap items-center gap-2 text-sm">
          {f.bytes === undefined ? 'Binary' : t('metadata.table.binaryBytes', { size: formatBytes(f.bytes) })}
          {url ? (
            <a
              href={url}
              download
              onClick={() => onBinaryDownload?.(row.entry.id)}
              className="inline-flex items-center gap-1 text-xs text-primary underline-offset-2 hover:underline"
            >
              <Download aria-hidden="true" className="size-3" />
              {t('metadata.table.download')}
            </a>
          ) : null}
        </span>
      );
    }
    case 'object':
      return <ValueTree value={f.value} depth={0} />;
  }
}

export { MAX_CHIPS };
