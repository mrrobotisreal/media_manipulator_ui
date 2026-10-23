import { describe, expect, it } from 'vitest';
import { buildRows, isGalleryArchive } from './tree';
import type { ArchiveEntry } from './types';

const file = (path: string, kind: ArchiveEntry['kind'] = 'unknown'): ArchiveEntry => ({ path, size: 1, isDir: false, kind });

describe('buildRows', () => {
  const entries = [file('a/1.png', 'image'), file('a/b/2.png', 'image'), file('top.txt')];
  it('collapses folders by default and synthesizes them', () => {
    expect(buildRows(entries, new Set()).map((r) => r.path)).toEqual(['a', 'top.txt']);
  });
  it('expands nested folders', () => {
    expect(buildRows(entries, new Set(['a'])).map((r) => r.path)).toEqual(['a', 'a/1.png', 'a/b', 'top.txt']);
    expect(buildRows(entries, new Set(['a', 'a/b'])).map((r) => r.path)).toContain('a/b/2.png');
  });
  it('search lists matching files flat', () => {
    expect(buildRows(entries, new Set(), '2.PNG').map((r) => r.path)).toEqual(['a/b/2.png']);
  });
});

describe('isGalleryArchive', () => {
  it('needs more than half images', () => {
    expect(isGalleryArchive([file('1.png', 'image'), file('2.png', 'image'), file('x.txt')])).toBe(true);
    expect(isGalleryArchive([file('1.png', 'image'), file('x.txt')])).toBe(false);
    expect(isGalleryArchive([])).toBe(false);
  });
});
