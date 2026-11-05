/**
 * MM116a: the hand-written routing copy of each tool, `content/medi/tools/<slug>.md`
 * (`## When to use`, `## When not to use`, `## Related` with `- slug: reason` bullets).
 * Assistant copy, kept apart from the product copy of the tool page.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const TOOL_SIDECAR_DIR = 'content/medi/tools';

export interface ToolSidecar {
  whenToUse: string;
  whenNotToUse: string;
  related: Array<{ slug: string; reason: string }>;
}

export function parseSidecar(text: string): ToolSidecar | null {
  const sections: Record<string, string> = {};
  let cur = '';
  for (const line of text.split('\n')) {
    const m = /^##\s+(.*?)\s*$/.exec(line);
    if (m) {
      cur = m[1];
      sections[cur] = '';
    } else if (cur) sections[cur] += `${line}\n`;
  }
  const whenToUse = (sections['When to use'] ?? '').trim();
  const whenNotToUse = (sections['When not to use'] ?? '').trim();
  if (!whenToUse || !whenNotToUse) return null;
  const related = (sections['Related'] ?? '')
    .split('\n')
    .map((l) => /^-\s+([a-z0-9-]+):\s*(.+)$/.exec(l.trim()))
    .filter((m): m is RegExpExecArray => !!m)
    .map((m) => ({ slug: m[1], reason: m[2].trim() }));
  return { whenToUse, whenNotToUse, related };
}

export function loadToolSidecar(slug: string, root = process.cwd()): ToolSidecar | null {
  const p = join(root, TOOL_SIDECAR_DIR, `${slug}.md`);
  return existsSync(p) ? parseSidecar(readFileSync(p, 'utf8')) : null;
}
