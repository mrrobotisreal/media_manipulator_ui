/**
 * MM54 decision 8 / acceptance 3: the stable writer is byte-identical on every
 * real shard of every locale, keeps integer-like key order (where JSON.parse +
 * JSON.stringify does not), resolves dotted keys whose segments contain dots,
 * and inserts new plural forms after the group's last sibling.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  applyAt,
  flattenNode,
  locateKey,
  parseJson,
  resolveDottedKey,
  StableJsonError,
  writeJson,
} from './stableJson';

const ROOT = join(__dirname, '..', '..');
const LOCALES = join(ROOT, 'i18n', 'locales');

function shardFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) return shardFiles(abs);
    return name.endsWith('.json') ? [abs] : [];
  });
}

const ALL = shardFiles(LOCALES).map((abs) => relative(ROOT, abs).split(sep).join('/'));

describe('stable JSON writer: idempotency over every real shard', () => {
  it('covers all 17 locale directories', () => {
    const dirs = new Set(ALL.map((p) => p.split('/')[2]));
    expect(dirs.size).toBe(17);
    expect(ALL.length).toBeGreaterThanOrEqual(17 * 10);
  });

  it.each(ALL)('writer(parse(file)) === file: %s', (file) => {
    const text = readFileSync(join(ROOT, file), 'utf8');
    expect(writeJson(parseJson(text))).toBe(text);
  });

  it('the shards with integer-like keys are exactly where plain JSON.stringify would reorder (so the ordered tree is needed)', () => {
    const reordered = ALL.filter((file) => {
      const text = readFileSync(join(ROOT, file), 'utf8');
      return JSON.stringify(JSON.parse(text), null, 2) + '\n' !== text;
    });
    // forms.json / panels.json carry `"1080"`, `"720"`, `"480"`-style keys.
    expect(reordered.length).toBeGreaterThan(0);
    for (const f of reordered) expect(f).toMatch(/\/interface\/(forms|panels)\.json$/);
  });

  it('no dotted key is ambiguous in any shard (keys with dots resolve to one leaf)', () => {
    for (const file of ALL) {
      const root = parseJson(readFileSync(join(ROOT, file), 'utf8'));
      for (const key of Object.keys(flattenNode(root))) expect(() => resolveDottedKey(root, key), `${file} ${key}`).not.toThrow();
    }
  });
});

describe('stable JSON writer: edits', () => {
  const text = `{
  "videoCompressor": {
    "resolutions": {
      "1080": "1080p",
      "720": "720p",
      "480": "480p"
    }
  },
  "models": {
    "rife-v4.6": "RIFE 4.6",
    "rife-v4": "RIFE 4"
  },
  "files_one": "{{count}} file",
  "files_other": "{{count}} files",
  "after": "x",
  "list": [
    "a",
    {
      "title": "T"
    }
  ],
  "empty": {},
  "flag": true,
  "n": 1.5,
  "nil": null
}
`;

  it('round-trips the fixture byte-for-byte (empty object, booleans, numbers, null, arrays)', () => {
    expect(writeJson(parseJson(text))).toBe(text);
  });

  it('keeps integer-like key order where JSON.stringify would move 480 first', () => {
    expect(JSON.stringify(JSON.parse(text), null, 2) + '\n').not.toBe(text);
    const root = parseJson(text);
    applyAt(root, locateKey(root, 'videoCompressor.resolutions.720', [])!, '720p (HD)');
    expect(writeJson(root)).toBe(text.replace('"720p"', '"720p (HD)"'));
  });

  it('resolves keys whose segment contains a dot (models.rife-v4.6)', () => {
    const root = parseJson(text);
    expect(resolveDottedKey(root, 'models.rife-v4.6')).toEqual(['models', 'rife-v4.6']);
    expect(resolveDottedKey(root, 'models.rife-v4')).toEqual(['models', 'rife-v4']);
    expect(resolveDottedKey(root, 'list.1.title')).toEqual(['list', '1', 'title']);
    expect(resolveDottedKey(root, 'list.0')).toEqual(['list', '0']);
    expect(resolveDottedKey(root, 'nope')).toBeNull();
    expect(resolveDottedKey(root, 'flag')).toBeNull(); // not a string leaf
    expect(resolveDottedKey(root, 'videoCompressor')).toBeNull(); // an object, not a leaf
  });

  it('refuses an ambiguous dotted key', () => {
    const root = parseJson('{\n  "a.b": "1",\n  "a": {\n    "b": "2"\n  }\n}\n');
    expect(() => resolveDottedKey(root, 'a.b')).toThrow(StableJsonError);
  });

  it('inserts a new plural form after the last existing sibling of the group', () => {
    const root = parseJson(text);
    const few = locateKey(root, 'files_few', ['one', 'few', 'many', 'other']);
    expect(few).toEqual({ kind: 'new', parent: [], name: 'files_few', after: 'files_other' });
    applyAt(root, few!, '{{count}} файла');
    const many = locateKey(root, 'files_many', ['one', 'few', 'many', 'other']);
    applyAt(root, many!, '{{count}} файлов');
    expect(writeJson(root)).toBe(
      text.replace(
        '"files_other": "{{count}} files",\n',
        '"files_other": "{{count}} files",\n  "files_few": "{{count}} файла",\n  "files_many": "{{count}} файлов",\n',
      ),
    );
  });

  it('refuses a new key that is not a plural form of an existing group, or a category the locale does not use', () => {
    const root = parseJson(text);
    expect(locateKey(root, 'brand_new', ['one', 'other'])).toBeNull();
    expect(locateKey(root, 'ghost_few', ['few'])).toBeNull();
    expect(locateKey(root, 'files_few', ['one', 'other'])).toBeNull();
  });

  it('escapes like JSON.stringify (quotes, backslashes, control chars, U+2028) and keeps non-ASCII literal', () => {
    const root = parseJson('{\n  "k": "x"\n}\n');
    const value = 'a "quote" \\ back\nline\ttab \u0001   ü 日本 🎉';
    applyAt(root, locateKey(root, 'k', [])!, value);
    const out = writeJson(root);
    expect(out).toBe(`{\n  "k": ${JSON.stringify(value)}\n}\n`);
    expect(JSON.parse(out).k).toBe(value);
  });

  it('rejects malformed JSON, duplicate keys and trailing content', () => {
    expect(() => parseJson('{"a": 1,}')).toThrow(StableJsonError);
    expect(() => parseJson('{"a": "1", "a": "2"}')).toThrow(/duplicate key/);
    expect(() => parseJson('{} {}')).toThrow(/trailing/);
    expect(() => parseJson('{"a": "unterminated}')).toThrow(StableJsonError);
  });
});
