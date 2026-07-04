'use client';

import React from 'react';
import { Download, FileText, FileType2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getBaseURL } from '@/lib/utils';
import { useLocalization } from '@/i18n/useLocalization';
import type { DocumentScanResultsResponse } from '@/lib/documentScanTypes';

interface PdfResultViewerProps {
  jobId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results?: DocumentScanResultsResponse;
}

// PdfResultViewer shows the finished searchable PDF in a browser-native <iframe>
// (no pdf.js dependency) with download buttons for every produced artifact and,
// for handwriting/auto jobs, an inline confidence/uncertainty note.
const PdfResultViewer: React.FC<PdfResultViewerProps> = ({ jobId, open, onOpenChange, results }) => {
  const { t } = useLocalization('interface');

  const resultUrl = (format: string) =>
    `${getBaseURL()}/document-scan/${jobId}/result?format=${format}`;

  const outputs = results?.outputs ?? [];
  const hasPdf = outputs.some((o) => o.format === 'pdf');
  const hasDocx = outputs.some((o) => o.format === 'docx');
  const hasSummary = outputs.some((o) => o.format === 'summary-docx');

  const pages = results?.pages ?? [];
  const handwritingPages = pages.filter((p) => p.kind === 'handwriting');
  const uncertainTotal = pages.reduce((sum, p) => sum + (p.illegibleCount || 0), 0);
  const showConfidence = handwritingPages.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t('documentScan.viewer.title')}</DialogTitle>
          <DialogDescription>{t('documentScan.viewer.description')}</DialogDescription>
        </DialogHeader>

        {showConfidence && (
          <div className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
            <p className="font-medium text-amber-700 dark:text-amber-400">
              {t('documentScan.viewer.confidenceTitle')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('documentScan.viewer.confidenceNote', {
                pages: handwritingPages.length,
                tokens: uncertainTotal,
              })}
            </p>
          </div>
        )}

        {hasPdf ? (
          <iframe
            src={resultUrl('pdf')}
            title={t('documentScan.viewer.title')}
            className="w-full rounded-md border border-border"
            style={{ minHeight: '60vh' }}
          />
        ) : (
          <div className="rounded-md border border-border bg-background/40 p-8 text-center text-sm text-muted-foreground">
            {t('documentScan.viewer.noPdf')}
          </div>
        )}

        <DialogFooter className="flex flex-wrap items-center gap-2 sm:justify-start">
          {hasPdf && (
            <a
              href={resultUrl('pdf')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors motion-reduce:transition-none"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t('documentScan.viewer.downloadPdf')}
            </a>
          )}
          {hasDocx && (
            <a
              href={resultUrl('docx')}
              className="inline-flex items-center gap-1.5 rounded-md border border-input px-4 py-2 text-sm hover:bg-muted"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              {t('documentScan.viewer.downloadDocx')}
            </a>
          )}
          {hasSummary && (
            <a
              href={resultUrl('summary')}
              className="inline-flex items-center gap-1.5 rounded-md border border-input px-4 py-2 text-sm hover:bg-muted"
            >
              <FileType2 className="h-4 w-4" aria-hidden="true" />
              {t('documentScan.viewer.downloadSummary')}
            </a>
          )}
        </DialogFooter>

        {results?.notes && results.notes.length > 0 && (
          <p className="text-xs text-muted-foreground">{results.notes[0]}</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PdfResultViewer;
