/**
 * MM84: scripts/audit-adsense.mjs reads the alias map and the pending list
 * from source with regexes. Pin those regexes to the real modules so the
 * alias and fan-out rules can never go blind on a refactor.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { TOOL_ALIAS_OF } from '@/content/toolAliases';
import { PENDING_ALLOWLIST, REVIEW_INDEXED_TOOL_SLUGS } from '@/content/reviewAllowlist';

const root = join(__dirname, '..');
const audit = readFileSync(join(root, 'scripts/audit-adsense.mjs'), 'utf8');

/** Pull a regex literal out of the audit source by the identifier it guards. */
function regexFor(name: string): RegExp {
  const line = audit.split('\n').find((l) => l.includes(`${name}\\s*`) && l.includes('src.match('));
  const lit = /src\.match\((\/.*\/[a-z]*)\)/.exec(line ?? '')?.[1];
  if (!lit) throw new Error(`no regex for ${name}`);
  const end = lit.lastIndexOf('/');
  return new RegExp(lit.slice(1, end), lit.slice(end + 1));
}

describe('audit-adsense source parsing (MM84)', () => {
  it('reads every alias and its target from content/toolAliases.ts', () => {
    const src = readFileSync(join(root, 'content/toolAliases.ts'), 'utf8');
    const block = src.match(regexFor('TOOL_ALIAS_OF'))!;
    const parsed = Object.fromEntries(
      [...block[1].matchAll(/['"]([a-z0-9-]+)['"]\s*:\s*['"]([a-z0-9-]+)['"]/g)].map((m) => [m[1], m[2]]),
    );
    expect(parsed).toEqual(TOOL_ALIAS_OF);
  });

  it('reads the allowlist and the pending set from content/reviewAllowlist.ts', () => {
    const src = readFileSync(join(root, 'content/reviewAllowlist.ts'), 'utf8');
    const slugs = (name: string) => [...src.match(regexFor(name))![1].matchAll(/['"]([a-z0-9-]+)['"]/g)].map((m) => m[1]);
    expect(slugs('REVIEW_INDEXED_TOOL_SLUGS')).toEqual([...REVIEW_INDEXED_TOOL_SLUGS]);
    expect(slugs('PENDING_ALLOWLIST')).toEqual([...PENDING_ALLOWLIST]);
  });
});
