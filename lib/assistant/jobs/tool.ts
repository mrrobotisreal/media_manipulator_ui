/**
 * MM116b: the tool page behind a confirmation card (its embed config and option spec), loaded
 * lazily: `content/toolPages.ts` is ~600 KB and the guide must not carry it until a card shows up.
 */
import type { OptionsSpec } from '@/lib/assistant/toolOptions/schemas';

import type { JobEmbed } from './plan';

export interface JobTool {
  slug: string;
  /** The English page name (a fallback; the card shows the server's localized `toolName`). */
  name: string;
  spec: OptionsSpec;
  embed: JobEmbed;
}

export async function loadJobTool(slug: string): Promise<JobTool | null> {
  const [{ PRIMARY_TOOL_PAGES }, { optionsSpecForTool }] = await Promise.all([import('@/content/toolPages'), import('@/lib/assistant/toolOptions/registry')]);
  const tool = PRIMARY_TOOL_PAGES.find((t) => t.slug === slug);
  if (!tool) return null;
  return { slug, name: tool.name, spec: optionsSpecForTool(tool), embed: tool.embed as unknown as JobEmbed };
}
