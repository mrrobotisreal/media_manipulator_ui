'use client';

import { ResultInspector } from '@/components/metadata/metadata-strip';
import type { ViewerProps } from './types';

/**
 * Kind `metadata` (task `inspect_metadata`): the product is the metadata itself, so the
 * viewer is the result-side inspector. No task produces this kind today; the branch exists
 * for the MM-M2 contract (RESULT_VIEWERS.md section 3).
 */
export function MetadataViewer({ descriptor, fileName }: ViewerProps) {
  return <ResultInspector jobId={descriptor.jobId} name={fileName} surface="result" className="w-full" />;
}
