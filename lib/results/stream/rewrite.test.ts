import { describe, expect, it } from 'vitest';
import { findEntryPoint, mpdUsesAv1, resolveEntryPath, rewriteM3u8, rewriteMpd } from './rewrite';

const MASTER = `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subs",NAME="en",URI="captions/en.m3u8"
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=900000,RESOLUTION=640x360
../hls/360p/index.m3u8
`;

const MEDIA = `#EXTM3U
#EXT-X-TARGETDURATION:6
#EXT-X-MAP:URI="init.mp4"
#EXT-X-KEY:METHOD=AES-128,URI="key.bin",IV=0x01
#EXTINF:6.0,
seg_0001.m4s
#EXTINF:6.0,
../shared/seg_0002.m4s
#EXT-X-ENDLIST`;

const upper = (ref: string) => `blob:${ref}`;

describe('rewriteM3u8', () => {
  it('rewrites a master: URI attributes and bare playlist lines, leaving tags alone', () => {
    const out = rewriteM3u8(MASTER, upper).split('\n');
    expect(out[2]).toContain('URI="blob:captions/en.m3u8"');
    expect(out[2]).toContain('TYPE=SUBTITLES,GROUP-ID="subs"');
    expect(out[4]).toBe('blob:720p/index.m3u8');
    expect(out[6]).toBe('blob:../hls/360p/index.m3u8');
    expect(out[0]).toBe('#EXTM3U');
  });

  it('rewrites a media playlist: EXT-X-MAP, EXT-X-KEY, relative and ../ segments', () => {
    const out = rewriteM3u8(MEDIA, upper);
    expect(out).toContain('#EXT-X-MAP:URI="blob:init.mp4"');
    expect(out).toContain('URI="blob:key.bin",IV=0x01');
    expect(out).toContain('\nblob:seg_0001.m4s\n');
    expect(out).toContain('\nblob:../shared/seg_0002.m4s\n');
    expect(out).toContain('#EXT-X-ENDLIST');
  });

  it('leaves a reference alone when the resolver returns null', () => {
    expect(rewriteM3u8('#EXTM3U\nhttps://cdn/x.ts', () => null)).toBe('#EXTM3U\nhttps://cdn/x.ts');
  });
});

describe('resolveEntryPath', () => {
  it('resolves relative and ../ references against the playlist directory', () => {
    expect(resolveEntryPath('pkg/hls/master.m3u8', '720p/index.m3u8')).toBe('pkg/hls/720p/index.m3u8');
    expect(resolveEntryPath('pkg/hls/720p/index.m3u8', '../shared/seg.m4s')).toBe('pkg/hls/shared/seg.m4s');
    expect(resolveEntryPath('pkg/hls/720p/index.m3u8', 'seg%201.m4s?x=1')).toBe('pkg/hls/720p/seg 1.m4s');
    expect(resolveEntryPath('a/m.m3u8', 'https://cdn/x.ts')).toBeNull();
  });
});

describe('mpd helpers', () => {
  const mpd = `<MPD><Period><BaseURL>video/</BaseURL><AdaptationSet><Representation codecs="av01.0.05M.08"><SegmentTemplate media="seg_$Number$.m4s" initialization="init.mp4"/></Representation></AdaptationSet></Period></MPD>`;
  it('rewrites BaseURL only', () => {
    const out = rewriteMpd(mpd, (r) => `blob:${r}`);
    expect(out).toContain('<BaseURL>blob:video/</BaseURL>');
    expect(out).toContain('media="seg_$Number$.m4s"');
  });
  it('detects AV1', () => {
    expect(mpdUsesAv1(mpd)).toBe(true);
    expect(mpdUsesAv1(mpd.replace('av01.0.05M.08', 'vp09.00.40.08'))).toBe(false);
  });
});

describe('findEntryPoint', () => {
  it('prefers a master playlist and the shallowest manifest', () => {
    const files = [
      { path: 'pkg/hls/720p/index.m3u8', size: 1 },
      { path: 'pkg/hls/master.m3u8', size: 1 },
      { path: 'pkg/dash/manifest.mpd', size: 1 },
    ];
    expect(findEntryPoint(files, 'hls')).toBe('pkg/hls/master.m3u8');
    expect(findEntryPoint(files, 'dash')).toBe('pkg/dash/manifest.mpd');
    expect(findEntryPoint([], 'hls')).toBeNull();
  });
});
