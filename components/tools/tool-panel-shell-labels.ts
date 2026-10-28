import { getServerT } from '@/lib/i18n/server';
import { localizeHref } from '@/i18n/locales';
import type { EmbeddedMediaKind } from '@/components/embedded-tool-panel';
import { SPECIALIZED_DROPZONES, describePanelChrome, type PanelChromeInput } from '@/components/tools/panel-chrome';
import type { ToolPanelShellLabels } from '@/components/tools/tool-panel-shell';

/**
 * MM88: SERVER COMPONENTS ONLY (it reads every locale through `getServerT`). Resolves the
 * strings of the server-rendered tool shell for the page's locale; the result is plain data,
 * passed to `EmbeddedToolPanelClient` as `shellLabels`.
 */
export function getToolPanelShellLabels(
  panel: EmbeddedMediaKind | PanelChromeInput,
  locale?: string,
): ToolPanelShellLabels {
  const loc = locale ?? 'en-US';
  const t = getServerT('interface', loc);
  const input: PanelChromeInput = typeof panel === 'string' ? { defaultMediaKind: panel } : panel;
  const mediaKind = input.defaultMediaKind;
  const focusedTask = describePanelChrome(input).specializedPanel;
  const focused = focusedTask ? SPECIALIZED_DROPZONES[focusedTask] : undefined;
  return {
    specialized: focused
      ? {
          dropHere: t('specializedToolShell.dropHere', { values: { hint: t(focused.hintKey) } }),
          selectHint: t('specializedToolShell.selectHint'),
          selectFile: t('specializedToolShell.selectFile'),
        }
      : undefined,
    sectionAria: t('embeddedToolPanel.sectionAria'),
    tryItNow: t('embeddedToolPanel.tryItNow'),
    dragDrop: t('embeddedToolPanel.dragDrop', {
      values: { kind: t(`embeddedToolPanel.mediaKinds.${mediaKind}`) },
    }),
    selectHint: t('embeddedToolPanel.selectHint'),
    selectFile: t('embeddedToolPanel.selectFile'),
    recommendedOutput: t('embeddedToolPanel.recommendedOutput'),
    outputLocked: t('embeddedToolPanel.outputLocked'),
    expectedInput: t('embeddedToolPanel.expectedInput'),
    accepts: t('embeddedToolPanel.accepts'),
    footerHref: localizeHref('/', loc),
    footerPrefix: t('embeddedToolPanel.needFullPrefix'),
    footerLink: t('embeddedToolPanel.openFullConverter'),
    footerSuffix: t('embeddedToolPanel.needFullSuffix'),
  };
}

