'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useLocalization } from '@/i18n/useLocalization';
import type { MetadataRow } from '@/lib/metadata/rows';
import type { PrivacyClass } from '@/lib/metadata/types';
import { CategoryIcon } from './category-icon';
import { MetadataTable, type MetadataTableProps } from './metadata-table';
import { PRIVACY_ICON } from './privacy';

export interface MetadataSectionProps extends Pick<MetadataTableProps, 'resolveBinaryUrl' | 'onBinaryDownload' | 'compact'> {
  id: string;
  rows: MetadataRow[];
  /** Total rows in the category before filtering. */
  total: number;
  privacy: PrivacyClass[];
  filtering: boolean;
  /** Category-specific content rendered above the table (GPS locator, thumbnails). */
  lead?: React.ReactNode;
}

/** One accordion item: icon, title, one-sentence summary, count, privacy badges, then the table. */
export function MetadataSection({ id, rows, total, privacy, filtering, lead, ...tableProps }: MetadataSectionProps) {
  const { t } = useLocalization('interface');
  const title = t(`metadata.categories.${id}.title`, { defaultValue: id });
  return (
    <AccordionItem value={id} data-category={id} data-testid={`metadata-section-${id}`}>
      <AccordionTrigger className="px-3 sm:px-4">
        <CategoryIcon id={id} className="size-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">{title}</span>
          <span className="hidden text-xs text-muted-foreground sm:block">
            {t(`metadata.categories.${id}.summary`, { defaultValue: '' })}
          </span>
        </span>
        {privacy.map((p) => {
          const PIcon = PRIVACY_ICON[p];
          return (
            <span key={p} title={t('metadata.section.privacyBadge', { privacy: t(`metadata.privacy.${p}`) })} className="text-muted-foreground">
              <PIcon aria-hidden="true" className="size-3.5" />
              <span className="sr-only">{t('metadata.section.privacyBadge', { privacy: t(`metadata.privacy.${p}`) })}</span>
            </span>
          );
        })}
        <Badge variant="outline" className="num" data-testid={`metadata-count-${id}`}>
          {filtering
            ? t('metadata.section.countFiltered', { shown: rows.length, total })
            : t('metadata.section.count', { count: total })}
        </Badge>
      </AccordionTrigger>
      <AccordionContent className="px-3 sm:px-4">
        {lead}
        <MetadataTable rows={rows} label={title} {...tableProps} />
      </AccordionContent>
    </AccordionItem>
  );
}
