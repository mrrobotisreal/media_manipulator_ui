import { describe, expect, it } from 'vitest';
import { buildNativePlaylistUrl } from './native';

const enc = (s: string) => new TextEncoder().encode(s);

describe('buildNativePlaylistUrl', () => {
  it('rewrites nested playlists and segments to blob urls, resolving ../', () => {
    const files: Record<string, Uint8Array> = {
      'p/hls/master.m3u8': enc('#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=1\n720p/index.m3u8\n'),
      'p/hls/720p/index.m3u8': enc('#EXTM3U\n#EXT-X-MAP:URI="init.mp4"\n#EXTINF:6,\n../shared/s1.m4s\n'),
      'p/hls/720p/init.mp4': enc('init'),
      'p/hls/shared/s1.m4s': enc('seg'),
    };
    const made: Record<string, string> = {};
    const url = buildNativePlaylistUrl('p/hls/master.m3u8', (p) => files[p] ?? null, (p, data) => {
      made[p] = typeof data === 'string' ? data : '<bytes>';
      return `blob:${p}`;
    });
    expect(url).toBe('blob:p/hls/master.m3u8');
    expect(made['p/hls/master.m3u8']).toContain('blob:p/hls/720p/index.m3u8');
    expect(made['p/hls/720p/index.m3u8']).toContain('URI="blob:p/hls/720p/init.mp4"');
    expect(made['p/hls/720p/index.m3u8']).toContain('blob:p/hls/shared/s1.m4s');
  });

  it('survives a playlist that references itself', () => {
    const files: Record<string, Uint8Array> = { 'a.m3u8': enc('#EXTM3U\na.m3u8\n') };
    expect(buildNativePlaylistUrl('a.m3u8', (p) => files[p] ?? null, (p) => `blob:${p}`)).toBe('blob:a.m3u8');
  });
});
