'use client';

import { useCallback, useState } from 'react';
import { analytics, EVENTS, safeFileExtension, useToolAnalytics } from '@/lib/analytics';
import useDownloadFile from '@/lib/useDownloadFile';
import { saveBlobToDisk } from './save';
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
  /** After a download that actually produced a file (the post-conversion upgrade nudge). */
  onDownloaded?: () => void;
}

/**
 * The default Download action: serve the blob the viewer already holds, else fetch it.
 *
 * useDownloadFile emits download_started/completed/failed around the FETCH. When the viewer
 * already loaded the bytes there is no fetch, so nothing would record what is, to the
 * visitor, a download; the cached path therefore emits download_completed itself. Emitting
 * on both paths would double-count the site's most important conversion event.
 */
export function useResultDownload({ jobId, fileName, cachedBlob, onDownloaded }: ResultDownloadOptions) {
  const { downloadFile } = useDownloadFile();
  const { track } = useToolAnalytics();
  const [isDownloading, setDownloading] = useState(false);
  const [failed, setFailed] = useState(false);

  const download = useCallback(async () => {
    setDownloading(true);
    setFailed(false);
    try {
      const cached = cachedBlob ?? peekResultBlob(jobId);
      const blob = cached ?? (await downloadFile(jobId));
      saveBlobToDisk(blob, fileName);
      if (cached) {
        track(
          EVENTS.DOWNLOAD_COMPLETED,
          { job_id: jobId, output_format: safeFileExtension(fileName), size_bytes: blob.size },
          { job_id: jobId },
        );
      }
      onDownloaded?.();
    } catch (error) {
      console.error('Result download failed', error);
      setFailed(true);
      // download_started/failed already fired for a failed FETCH; this covers the cached
      // path only, where the work succeeded and the user still got nothing.
      if (cachedBlob ?? peekResultBlob(jobId)) {
        analytics.track(
          EVENTS.DOWNLOAD_FAILED,
          { job_id: jobId, reason: error instanceof Error ? error.message : 'unknown' },
          { job_id: jobId },
        );
      }
    } finally {
      setDownloading(false);
    }
  }, [cachedBlob, downloadFile, fileName, jobId, onDownloaded, track]);

  return { download, isDownloading, failed };
}
