'use client';

import { ExternalLink } from 'lucide-react';
import { useLocalization } from '@/i18n/useLocalization';
import { cn } from '@/lib/utils';
import type { ViewerProps } from './types';

export interface PdfFrameProps {
  /** Object URL or inline URL of the PDF. */
  src: string;
  title: string;
  className?: string;
  minHeight?: string;
}

/**
 * The PDF surface: `<object type="application/pdf">` (some browsers refuse a PDF in a plain
 * iframe), with an `<iframe>` inside it as the fallback, and an "Open in new tab" link.
 */
export function PdfFrame({ src, title, className, minHeight = '60dvh' }: PdfFrameProps) {
  const { t } = useLocalization('interface');
  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      <object data={src} type="application/pdf" aria-label={title} className="w-full rounded-md border border-border" style={{ minHeight }}>
        <iframe src={src} title={title} className="w-full rounded-md border border-border" style={{ minHeight }} />
        <p className="p-4 text-sm text-muted-foreground">{t('resultPanel.pdf.fallback')}</p>
      </object>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 self-start text-sm text-primary hover:underline"
      >
        <ExternalLink aria-hidden="true" className="size-4" />
        {t('resultPanel.pdf.openInNewTab')}
      </a>
    </div>
  );
}

/** PDF viewer for the registry: the panel's resolved URL (inline route or blob) in a PdfFrame. */
export function PdfViewer({ src, fileName }: ViewerProps) {
  if (!src) return null;
  return <PdfFrame src={src} title={fileName} />;
}

export default PdfViewer;
