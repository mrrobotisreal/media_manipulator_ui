import type { ResultKind } from '@/lib/results/describe';
import { ArchiveViewer } from './archive-viewer';
import { AudioViewer } from './audio-viewer';
import { CaptionsViewer } from './captions-viewer';
import { GifViewer } from './gif-viewer';
import { ImageViewer } from './image-viewer';
import { PdfViewer } from './pdf-viewer';
import { StreamViewer } from './stream-viewer';
import { TranscriptViewer } from './transcript-viewer';
import { UnknownViewer } from './unknown-viewer';
import { VideoViewer } from './video-viewer';
import type { ViewerEntry } from './types';

export type { ViewerEntry, ViewerProps } from './types';

/**
 * The viewer registry: `ResultKind` -> viewer.
 *
 * ResultPanel never switches on kind; it looks the kind up here. MM03 adds `transcript` and
 * `captions`, MM04 adds `pdf`, `archive`, `hls` and `dash`, each by adding one entry (and
 * setting `needsBlob: false` if the viewer fetches for itself). A kind with no entry, which
 * today is every one of those, renders the file card.
 */
export const RESULT_VIEWERS: Partial<Record<ResultKind, ViewerEntry>> = {
  image: { component: ImageViewer, needsBlob: true },
  gif: { component: GifViewer, needsBlob: true },
  video: { component: VideoViewer, needsBlob: true },
  audio: { component: AudioViewer, needsBlob: true },
  captions: { component: CaptionsViewer, needsBlob: true },
  transcript: { component: TranscriptViewer, needsBlob: false },
  archive: { component: ArchiveViewer, needsBlob: false },
  pdf: { component: PdfViewer, needsBlob: true },
  hls: { component: StreamViewer, needsBlob: false },
  dash: { component: StreamViewer, needsBlob: false },
  unknown: { component: UnknownViewer, needsBlob: false },
};

const FALLBACK: ViewerEntry = { component: UnknownViewer, needsBlob: false };

export function viewerFor(kind: ResultKind): ViewerEntry {
  return RESULT_VIEWERS[kind] ?? FALLBACK;
}
