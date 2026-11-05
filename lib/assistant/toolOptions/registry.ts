/**
 * MM116a: every primary tool page's option spec, keyed by slug. Built from the page registry
 * (`content/toolPages.ts`) so a new tool page is covered the day it is added; the coverage test
 * fails when a tool resolves to neither options nor an explicit `none`.
 */
import { PRIMARY_TOOL_PAGES, type ToolPageContent } from '@/content/toolPages';

import { optionsSpecFor, type OptionsSpec, type OptionsSpecInput } from './schemas';

export function specInputOf(tool: ToolPageContent): OptionsSpecInput {
  const e = tool.embed;
  return {
    slug: tool.slug,
    defaultMediaKind: e.defaultMediaKind,
    defaultTask: e.defaultTask,
    preset: e.preset as OptionsSpecInput['preset'],
    lockedOutputFormat: e.lockedOutputFormat,
    lockedVideoOutputFormat: e.lockedVideoOutputFormat,
    lockedExtractAudioFormat: e.lockedExtractAudioFormat,
    defaultAIImageOperation: e.defaultAIImageOperation,
    lockedAIImageOperation: e.lockedAIImageOperation,
    pdfLockOutputFormat: e.pdfLockOutputFormat,
    transcribeMode: e.transcribeMode,
    transcodeMode: e.transcodeMode,
    transcodeProtocol: e.transcodeProtocol,
    transcodeLockProtocol: e.transcodeLockProtocol,
  };
}

export function optionsSpecForTool(tool: ToolPageContent): OptionsSpec {
  return optionsSpecFor(specInputOf(tool));
}

export function allToolOptionSpecs(): Array<{ tool: ToolPageContent; spec: OptionsSpec }> {
  return PRIMARY_TOOL_PAGES.map((tool) => ({ tool, spec: optionsSpecForTool(tool) }));
}
