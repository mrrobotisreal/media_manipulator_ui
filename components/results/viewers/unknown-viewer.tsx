'use client';

import { Archive, Captions, File, FileText, Film, Image as ImageIcon, Music, Radio, ScrollText } from 'lucide-react';
import type { ComponentType } from 'react';
import { Stat } from '@/components/darkroom/stat';
import { useLocalization } from '@/i18n/useLocalization';
import type { ResultKind } from '@/lib/results/describe';
import type { ViewerProps } from './types';

export const KIND_ICONS: Record<ResultKind, ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  image: ImageIcon,
  gif: ImageIcon,
  video: Film,
  audio: Music,
  transcript: FileText,
  captions: Captions,
  pdf: FileText,
  archive: Archive,
  hls: Radio,
  dash: Radio,
  metadata: FileText,
  summary: ScrollText,
  unknown: File,
};

/**
 * The file card: name, type and size. Also what every kind without a viewer yet renders
 * (transcript and captions until MM03; pdf, archive and streams until MM04), so a finished
 * job always shows something besides a bare Download button.
 */
export function UnknownViewer({ kind, fileName, mime, sizeBytes }: ViewerProps) {
  const { t, formatFileSize } = useLocalization('interface');
  const Icon = KIND_ICONS[kind] ?? File;
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border border-edge bg-surface-2 p-6 text-center">
      <Icon aria-hidden={true} className="size-12 text-muted-foreground" />
      <p className="max-w-full truncate font-medium text-foreground">{fileName}</p>
      <p className="text-sm text-muted-foreground">{t('resultPanel.unknown.body')}</p>
      <div className="grid w-full grid-cols-2 gap-3 text-left">
        <Stat label={t('resultPanel.unknown.type')} value={mime} />
        {sizeBytes !== undefined && <Stat label={t('resultPanel.unknown.size')} value={formatFileSize(sizeBytes)} />}
      </div>
    </div>
  );
}

export default UnknownViewer;
