/**
 * Fixture file lists (see README.md). Tests read the directory through these
 * helpers so a new file is picked up without editing a list.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const FIXTURES_DIR = __dirname;

const list = (dir: string, ext: string) =>
  readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .sort();

/** Canonical documents: the shared contract with MM43's Go sanitizer. */
export const docFixtures = () => list(FIXTURES_DIR, '.json');
/** Golden SVG inputs for import / export idempotence. */
export const svgFixtures = () => list(FIXTURES_DIR, '.svg');
/** Non-canonical inputs that must parse (defaults are filled in). */
export const inputFixtures = () => list(join(FIXTURES_DIR, 'inputs'), '.json');
/** Documents that must fail to parse. */
export const invalidFixtures = () => list(join(FIXTURES_DIR, 'invalid'), '.json');

export const readFixture = (...parts: string[]) => readFileSync(join(FIXTURES_DIR, ...parts), 'utf8');
