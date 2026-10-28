import { Archive, Captions, File, FileText, Film, Image as ImageIcon, Music, Radio, ScrollText } from 'lucide-react';
import type { ComponentType } from 'react';
import type { ResultKind } from '@/lib/results/describe';

/**
 * One icon per result kind. Its own module (MM88) so the home page's recent-results strip
 * can show the icons without pulling a viewer into the route's first load.
 */
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
