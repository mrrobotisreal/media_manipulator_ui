/**
 * Every `t('vector.…')` key the editor uses exists in the en-US `panels`
 * shard (the parity suite then guarantees every other locale has it).
 * Dynamic keys (`vector.tools.${id}`) are expanded from their source lists.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import panels from '@/i18n/locales/en-us/interface/panels.json';
import { TOOL_IDS } from './tools/types';

const ROOT = join(__dirname, '..', '..');
const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((e) => {
    const full = join(dir, e);
    return statSync(full).isDirectory() ? files(full) : /\.tsx?$/.test(e) && !/\.test\./.test(e) ? [full] : [];
  });

const has = (key: string): boolean => {
  let node: unknown = panels;
  for (const part of key.split('.')) {
    if (typeof node !== 'object' || node === null) return false;
    const obj = node as Record<string, unknown>;
    node = part in obj ? obj[part] : obj[`${part}_other`] !== undefined ? obj[`${part}_other`] : undefined;
  }
  return typeof node === 'string';
};

describe('vector i18n keys', () => {
  const src = [...files(join(ROOT, 'components/vector')), ...files(join(ROOT, 'lib/vector'))].map((f) => readFileSync(f, 'utf8')).join('\n');
  const literal = Array.from(src.matchAll(/t\(\s*['"`](vector\.[A-Za-z0-9_.]+)['"`]/g), (m) => m[1]);

  it('finds the editor keys', () => {
    expect(literal.length).toBeGreaterThan(50);
  });

  it.each(Array.from(new Set(literal)).map((k) => [k]))('%s exists in en-US panels.json', (key) => {
    expect(has(key)).toBe(true);
  });

  it('covers the dynamic keys', () => {
    for (const id of TOOL_IDS) expect(has(`vector.tools.${id}`), id).toBe(true);
    for (const type of ['group', 'path', 'rect', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'image', 'use', 'raw']) {
      expect(has(`vector.layerTypes.${type}`), type).toBe(true);
    }
    for (const code of ['too_large', 'not_svg', 'malformed', 'entities', 'too_complex']) expect(has(`vector.import.errors.${code}`), code).toBe(true);
    for (const code of [
      'script_removed',
      'event_handler_removed',
      'external_reference_removed',
      'unsafe_content_removed',
      'unsupported_element',
      'style_dropped',
      'invalid_value',
      'dangling_reference',
    ]) {
      expect(has(`vector.import.warnings.${code}`), code).toBe(true);
    }
  });

  it('the beta chip reads "<brand> (beta)"', () => {
    expect((panels as { vector: { beta: string } }).vector.beta).toBe('{{brand}} (beta)');
  });
});
