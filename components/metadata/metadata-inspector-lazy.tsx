'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import { ensureMetadataShard } from '@/lib/i18n/ensureShard';
import type { MetadataInspector as Inspector } from './metadata-inspector';

/**
 * The only entry point surfaces should import. Client-only (`ssr: false`): the
 * inspector, the ~400 KB catalog and the ~120 KB `metadata` i18n shard are all
 * separate lazy chunks that load when this mounts, never on first paint.
 */
const LazyInspector = dynamic(
  () => ensureMetadataShard().then(() => import('./metadata-inspector').then((m) => m.MetadataInspector)),
  { ssr: false, loading: () => <PanelLoading label="Reading metadata…" /> },
);

export type LazyMetadataInspectorProps = ComponentProps<typeof Inspector>;

export function LazyMetadataInspector(props: LazyMetadataInspectorProps) {
  return <LazyInspector {...props} />;
}

export default LazyMetadataInspector;
