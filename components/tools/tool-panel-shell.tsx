import * as React from 'react';

import {
  DropzoneCopy,
  SELECT_FILE_BUTTON,
  SPECIALIZED_DROPZONES,
  ToolPanelFooter,
  ToolPanelFormats,
  ToolPanelIntro,
  ToolPanelSection,
  describePanelChrome,
  dropzoneClass,
  type FormatLabels,
  type PanelChromeInput,
} from '@/components/tools/panel-chrome';

/**
 * MM88 decision 5: the server-visible stand-in for the embedded tool panel.
 *
 * The panel itself (1 276 lines: file input, drag/drop, uploads, job polling, viewers) stays
 * `ssr:false`. Until it hydrates, `next/dynamic` renders its `loading` component, and in the
 * prerendered HTML that component is ALL there is. It used to be a hardcoded English
 * "Loading the tool…" box, so view-source showed nothing of what the tool does, in any
 * language. Now it is this shell: the panel's own section, intro, format box, dropzone with
 * its localized "Drag and drop … / or click to select" copy and the tool's `accept` list,
 * a disabled "Select file" button, and the footer, built from the same pieces
 * (`panel-chrome.tsx`) the live panel renders, so the swap moves nothing.
 *
 * Labels are resolved on the server by `getToolPanelShellLabels` (tool-panel-shell-labels.ts,
 * `getServerT` for the page's locale) and handed to the client loader as plain strings, so
 * the shell needs no i18next runtime and no tool shard in the browser. This file has no
 * server imports on purpose: the client loader imports it.
 *
 * Two empty states exist and the shell mirrors whichever the page will mount: the generic
 * converter's dropzone, or (for the focused video/audio panels in `SPECIALIZED_DROPZONES`)
 * SpecializedToolShell's. The remaining focused panels (metadata inspector, captions,
 * stitch, summarize, voices) build their own first screen; the shell shows the intro and
 * footer for those and leaves the middle to the panel.
 *
 * What differs from the live empty state, on purpose: the button is `disabled` (it cannot
 * open a picker before the island exists) and the section is `aria-busy`. The quota chip
 * and the upload-limit line depend on the visitor's tier, so the shell renders exactly what
 * those two render while the tier resolves (a 28px chip skeleton, an empty 16px line), and
 * the live panel fills the same boxes.
 */
export interface ToolPanelShellLabels extends FormatLabels {
  sectionAria: string;
  tryItNow: string;
  dragDrop: string;
  selectHint: string;
  selectFile: string;
  /**
   * The dropzone copy of `components/specialized-tool-shell.tsx`, for pages whose task mounts
   * one of its focused panels (`SPECIALIZED_DROPZONES`). Absent for every other page.
   */
  specialized?: { dropHere: string; selectHint: string; selectFile: string };
  footerHref: string;
  footerPrefix: string;
  footerLink: string;
  footerSuffix: string;
}

export type ToolPanelShellInput = PanelChromeInput & { compact?: boolean };

/**
 * Pure markup from props, so it works as the `loading` component of a client
 * `next/dynamic` (it is prerendered into the HTML from there) and in tests.
 */
export function ToolPanelShell({
  labels,
  ...panel
}: ToolPanelShellInput & { labels: ToolPanelShellLabels }) {
  const chrome = describePanelChrome(panel);
  const focused = chrome.specializedPanel ? SPECIALIZED_DROPZONES[chrome.specializedPanel] : undefined;
  return (
    <ToolPanelSection
      compact={panel.compact}
      aria-label={labels.sectionAria}
      aria-busy
      data-tool-shell=""
    >
      <ToolPanelIntro
        mediaKind={panel.defaultMediaKind}
        transcribe={panel.transcribeMode}
        tryItNow={labels.tryItNow}
        heading={chrome.heading}
        subheading={chrome.subheading}
      />
      {chrome.showQuotaChip ? <ChipSkeleton className="mb-4" /> : null}
      <ToolPanelFormats
        labels={labels}
        recommendedFormat={chrome.recommendedFormat}
        lockedOutputDisplay={chrome.lockedOutputDisplay}
        lockedInputFormat={panel.lockedInputFormat}
        allowedInputFormats={panel.allowedInputFormats}
      />
      {focused && labels.specialized ? (
        // = SpecializedToolShell's empty state (components/specialized-tool-shell.tsx).
        <div className="space-y-4">
          <ChipSkeleton />
          <Dropzone
            accept={typeof focused.accept === 'function' ? focused.accept(panel.acceptOverride) : focused.accept}
            dragDrop={labels.specialized.dropHere}
            selectHint={labels.specialized.selectHint}
            selectFile={labels.specialized.selectFile}
          />
        </div>
      ) : chrome.specializedPanel ? null : (
        // = the generic converter's empty state (components/embedded-tool-panel.tsx).
        <Dropzone
          accept={chrome.accept}
          dragDrop={labels.dragDrop}
          selectHint={labels.selectHint}
          selectFile={labels.selectFile}
          limitLine
        />
      )}
      <ToolPanelFooter
        href={labels.footerHref}
        prefix={labels.footerPrefix}
        linkLabel={labels.footerLink}
        suffix={labels.footerSuffix}
      />
    </ToolPanelSection>
  );
}

/** = QuotaChip while the tier resolves (components/quota-chip.tsx). */
function ChipSkeleton({ className }: { className?: string }) {
  return (
    <div className={className ? `flex min-h-7 items-center ${className}` : 'flex min-h-7 items-center'} aria-hidden="true">
      <span className="block h-7 w-44 animate-pulse rounded-full bg-surface-2 motion-reduce:animate-none" />
    </div>
  );
}

function Dropzone({
  accept,
  dragDrop,
  selectHint,
  selectFile,
  limitLine,
}: {
  accept: string;
  dragDrop: string;
  selectHint: string;
  selectFile: string;
  /** The generic panel's UploadLimitHint slot: empty and reserved while the tier resolves. */
  limitLine?: boolean;
}) {
  return (
    <div className={dropzoneClass(false)}>
      <DropzoneCopy dragDrop={dragDrop} selectHint={selectHint} />
      <button type="button" disabled className={SELECT_FILE_BUTTON}>
        {selectFile}
      </button>
      <input type="file" accept={accept} disabled className="hidden" aria-label={selectFile} />
      {limitLine ? (
        <p className="num min-h-4 text-xs leading-4 text-muted-foreground mt-3" aria-hidden="true" />
      ) : null}
    </div>
  );
}

export default ToolPanelShell;
