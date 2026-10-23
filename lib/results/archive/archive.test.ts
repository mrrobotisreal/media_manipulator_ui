import { gzipSync, strToU8, zipSync } from 'fflate';
import { describe, expect, it, vi } from 'vitest';
import { ARCHIVE_MAX_BYTES, archiveCapBytes, isOverArchiveCap } from './limits';
import { ArchiveError, openArchive, openArchiveBytes } from './index';
import { readTar } from './tar';
import { writeTar } from './testTar';
import { extractZipEntry, listZip } from './zip';

const text = (s: string) => strToU8(s);
const decode = (b: Uint8Array) => new TextDecoder().decode(b);

describe('zip', () => {
  const zip = zipSync({
    'frames/': new Uint8Array(),
    'frames/frame_0001.png': text('png-1'),
    'frames/sub/кадр_два.jpg': text('jpg-2'),
    'readme.txt': text('hello'),
  });

  it('lists nested folders and unicode names with kinds', () => {
    const entries = listZip(zip);
    const byPath = Object.fromEntries(entries.map((e) => [e.path, e]));
    expect(byPath['frames'].isDir).toBe(true);
    expect(byPath['frames/frame_0001.png'].kind).toBe('image');
    expect(byPath['frames/sub/кадр_два.jpg'].size).toBe(5);
    expect(byPath['frames/sub/кадр_два.jpg'].kind).toBe('image');
    expect(byPath['readme.txt'].kind).toBe('unknown');
  });

  it('extracts one entry', () => {
    expect(decode(extractZipEntry(zip, 'readme.txt'))).toBe('hello');
    expect(decode(listZip(zip).find((e) => e.path === 'frames/sub/кадр_два.jpg')!.data!())).toBe('jpg-2');
    expect(() => extractZipEntry(zip, 'nope')).toThrow();
  });
});

describe('tar', () => {
  const longPath = `${'d'.repeat(58)}/${'f'.repeat(58)}.mp4`;

  it('reads files, a directory and a 120-char path from a .tar.gz', () => {
    expect(longPath.length).toBeGreaterThan(100);
    const tar = writeTar([
      { path: 'hls', dir: true },
      { path: 'hls/master.m3u8', data: text('#EXTM3U') },
      { path: longPath, data: text('video') },
    ]);
    const opened = openArchiveBytes(gzipSync(tar), 'x.tar.gz');
    expect(opened.format).toBe('tar.gz');
    expect(opened.truncated).toBe(false);
    expect(opened.entries.map((e) => e.path)).toEqual(['hls', 'hls/master.m3u8', longPath]);
    expect(opened.entries[0].isDir).toBe(true);
    expect(opened.entries[2].kind).toBe('video');
    expect(decode(opened.entries[2].data!())).toBe('video');
  });

  it('returns partial entries with truncated true', () => {
    const tar = writeTar([
      { path: 'a.txt', data: text('first') },
      { path: 'b.bin', data: new Uint8Array(2000) },
    ], { terminate: false });
    const cut = tar.subarray(0, 1024 + 600);
    const result = readTar(cut);
    expect(result.truncated).toBe(true);
    expect(result.entries.map((e) => e.path)).toEqual(['a.txt']);
  });

  it('never throws on garbage shorter than a block', () => {
    expect(readTar(new Uint8Array(100)).truncated).toBe(true);
  });
});

describe('openArchive', () => {
  it('sniffs magic bytes, not the file name', async () => {
    const zip = zipSync({ 'a.txt': text('x') });
    const opened = await openArchive(new Blob([zip as BlobPart]), 'wrong.tar.gz');
    expect(opened.format).toBe('zip');
  });

  it('rejects a non-archive', () => {
    expect(() => openArchiveBytes(text('just some text'), 'x.zip')).toThrow(ArchiveError);
  });

  it('refuses a blob over the cap without reading it', async () => {
    const blob = new Blob(['x']);
    Object.defineProperty(blob, 'size', { value: ARCHIVE_MAX_BYTES + 1 });
    const read = vi.spyOn(blob, 'arrayBuffer');
    await expect(openArchive(blob)).rejects.toMatchObject({ code: 'too-large' });
    expect(read).not.toHaveBeenCalled();
  });
});

describe('limits', () => {
  it('is 300 MB, and 300 MB + 1 is over', () => {
    expect(ARCHIVE_MAX_BYTES).toBe(300 * 1024 * 1024);
    expect(isOverArchiveCap(ARCHIVE_MAX_BYTES)).toBe(false);
    expect(isOverArchiveCap(ARCHIVE_MAX_BYTES + 1)).toBe(true);
  });

  it('halves on low-memory devices', () => {
    Object.defineProperty(navigator, 'deviceMemory', { value: 2, configurable: true });
    expect(archiveCapBytes()).toBe(150 * 1024 * 1024);
    Object.defineProperty(navigator, 'deviceMemory', { value: undefined, configurable: true });
  });
});
