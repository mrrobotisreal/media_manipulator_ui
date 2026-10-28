'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { PanelLoading } from '@/components/darkroom/panel-loading';
import type { ComponentProps } from 'react';
import type EmbeddedToolPanel from '@/components/embedded-tool-panel';
import { withToolShards } from '@/lib/i18n/ensureShard';
import { useLocalization } from '@/i18n/useLocalization';
import { ToolPanelShell, type ToolPanelShellLabels } from '@/components/tools/tool-panel-shell';

// The embedded converter/editor panel is browser-only (file inputs, drag/drop,
// object URLs, media APIs). It is loaded with ssr:false so it never runs during
// prerender — the rich, crawlable tool copy around it is server-rendered.
// `withToolShards` merges the forms/panels translation shards first, so the
// panel never renders against missing keys.
//
// MM88: while it loads (and in the prerendered HTML, where the loading state is all
// there is), the page shows ToolPanelShell: the panel's own empty state with its
// localized dropzone copy, the tool's accept list and a disabled button, built from
// the same pieces as the panel so nothing moves when it arrives. `loading` receives no
// props from next/dynamic, so the page's props reach it through this context.
type Props = ComponentProps<typeof EmbeddedToolPanel>;

const ShellContext = React.createContext<(Props & { shellLabels: ToolPanelShellLabels }) | null>(null);

function PanelShellLoading() {
  const shell = React.useContext(ShellContext);
  const { t } = useLocalization('interface');
  if (!shell) return <PanelLoading label={t('common.loading')} />;
  const { shellLabels, ...panel } = shell;
  return <ToolPanelShell labels={shellLabels} {...panel} />;
}

const Panel = dynamic(() => withToolShards(() => import('@/components/embedded-tool-panel')), {
  ssr: false,
  loading: () => <PanelShellLoading />,
});

export default function EmbeddedToolPanelClient({
  shellLabels,
  ...props
}: Props & {
  /** Server-resolved strings for the loading shell (`getToolPanelShellLabels`). */
  shellLabels?: ToolPanelShellLabels;
}) {
  const shell = shellLabels ? { ...props, shellLabels } : null;
  return (
    <ShellContext.Provider value={shell}>
      <Panel {...props} />
    </ShellContext.Provider>
  );
}
