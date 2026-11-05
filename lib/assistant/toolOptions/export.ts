/**
 * MM116a: `tools/<slug>.options.json`, the file the API embeds next to each tool's doc. Either
 * `{ "slug", "options": "none", "reason" }` or `{ "slug", "options": <JSON Schema> }` (Zod v4's
 * own emission, `io: "input"`, so every field is optional and `default` is documentation only).
 */
import { z } from 'zod/v4';

import type { OptionsSpec } from './schemas';

export function optionsJsonSchema(spec: OptionsSpec): Record<string, unknown> | null {
  if (spec.kind === 'none') return null;
  const js = z.toJSONSchema(spec.schema, { io: 'input', target: 'draft-2020-12' }) as Record<string, unknown>;
  delete js.$schema;
  return js;
}

export function optionsFileText(slug: string, spec: OptionsSpec): string {
  const body =
    spec.kind === 'none'
      ? { slug, options: 'none', reason: spec.reason }
      : { slug, family: spec.family, options: optionsJsonSchema(spec) };
  return `${JSON.stringify(body)}\n`;
}
