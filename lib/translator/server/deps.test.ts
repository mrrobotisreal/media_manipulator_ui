/**
 * MM54: the new dependencies are exact pins, MIT, and listed in content/licenses.ts
 * with the copyright line from each package's own licence file.
 */
// @vitest-environment node
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { LICENSES } from '@/content/licenses';

const ROOT = join(__dirname, '..', '..', '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

describe('MM54 dependencies', () => {
  it.each(['jose', '@octokit/auth-app', '@octokit/rest'])('%s: exact pin, MIT, licence notice recorded', (name) => {
    const pin = pkg.dependencies[name];
    expect(pin).toMatch(/^\d+\.\d+\.\d+$/);
    const own = JSON.parse(readFileSync(join(ROOT, 'node_modules', name, 'package.json'), 'utf8'));
    expect(own.version).toBe(pin);
    expect(own.license).toBe('MIT');
    const entry = LICENSES.find((l) => l.name === name);
    expect(entry).toMatchObject({ version: pin, license: 'MIT', embeddedInExports: false });
    const dir = join(ROOT, 'node_modules', name);
    const licence = readdirSync(dir).find((f) => /^licen[cs]e/i.test(f))!;
    const text = readFileSync(join(dir, licence), 'utf8');
    for (const line of entry!.copyright.split('\n')) expect(text).toContain(line);
  });
});
