'use client';

import { useCallback } from 'react';
import { useToolAnalytics } from '@/lib/analytics';
import { downloadResult, useDownloadStatus } from './downloadController';
import { peekResultBlob } from './useResultBlob';

export interface ResultDownloadOptions {
  jobId: string;
  /** The name the file is saved under. */
  fileName: string;
  /**
   * Bytes the caller already holds (home keeps a blob per history entry). Wins over the
   * shared blob cache.
   */
  cachedBlob?: Blob | null;
  /** Known result size, for the "download started" line. */
  sizeBytes?: number;
  /** After a download was handed to the browser (the post-conversion upgrade nudge). */
  onDownloaded?: () => void;
}

/**
 * The default Download action (MM80): save small bytes the viewer already holds, otherwise get
 * a signed link and let the browser's download manager fetch it. Never buffers a download in
 * JS. Analytics and the double-click guard live in `downloadController`.
 */
export function useResultDownload({ jobId, fileName, cachedBlob, sizeBytes, onDownloaded }: ResultDownloadOptions) {
  const { track } = useToolAnalytics();
  const status = useDownloadStatus(jobId);

  const download = useCallback(async () => {
    await downloadResult({
      jobId,
      fileName,
      cachedBlob: cachedBlob ?? peekResultBlob(jobId),
      sizeBytes,
      track,
      onDownloaded,
    });
  }, [cachedBlob, fileName, jobId, onDownloaded, sizeBytes, track]);

  return {
    download,
    status,
    isDownloading: status.phase === 'preparing',
    failed: status.phase === 'failed',
  };
}
