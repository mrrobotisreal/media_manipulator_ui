import { describe, expect, it } from 'vitest';
import type { StudioAsset, StudioTrack } from '@/lib/studioTypes';
import {
  assetDisplayName,
  assetIdsInFolder,
  cleanFolderName,
  compareAssets,
  DEFAULT_BIN_PREFS,
  findAssetUsage,
  isClipOffline,
  listFolders,
  matchesQuery,
  nextVoiceoverName,
  parseBinPrefs,
  usageTrackSummary,
  viewAssets,
} from './mediaBin';

const asset = (id: string, extra: Partial<StudioAsset> = {}): StudioAsset => ({
  id,
  projectId: 'p',
  originalFileName: `${id}.mp4`,
  s3KeyOriginal: `k/${id}`,
  mediaKind: 'video',
  durationSeconds: 10,
  hasAudio: true,
  probeJson: null,
  createdAt: '2026-01-01T00:00:00Z',
  ...extra,
});

describe('display name, search and sort', () => {
  it('prefers displayName and falls back to the filename', () => {
    expect(assetDisplayName(asset('a'))).toBe('a.mp4');
    expect(assetDisplayName(asset('a', { displayName: '  Intro  ' }))).toBe('Intro');
    expect(assetDisplayName(asset('a', { displayName: '   ' }))).toBe('a.mp4');
  });

  it('matches on the display name and the original filename, case-insensitively', () => {
    const a = asset('clip1', { displayName: 'Beach Sunset', originalFileName: 'IMG_0042.MOV' });
    expect(matchesQuery(a, 'sunset')).toBe(true);
    expect(matchesQuery(a, 'img_00')).toBe(true);
    expect(matchesQuery(a, 'nope')).toBe(false);
    expect(matchesQuery(a, '   ')).toBe(true);
  });

  it('sorts by name (natural), date (newest first), duration (longest first), kind', () => {
    const a = asset('a', { displayName: 'Take 2', createdAt: '2026-01-02T00:00:00Z', durationSeconds: 5 });
    const b = asset('b', { displayName: 'Take 10', createdAt: '2026-01-03T00:00:00Z', durationSeconds: 50, mediaKind: 'audio' });
    const c = asset('c', { displayName: 'Take 1', createdAt: '2026-01-01T00:00:00Z', durationSeconds: 0, mediaKind: 'image' });
    const names = (sort: Parameters<typeof compareAssets>[2]) =>
      [a, b, c].sort((x, y) => compareAssets(x, y, sort)).map((x) => x.id);
    expect(names('name')).toEqual(['c', 'a', 'b']);
    expect(names('date')).toEqual(['b', 'a', 'c']);
    expect(names('duration')).toEqual(['b', 'a', 'c']);
    expect(names('kind')).toEqual(['a', 'c', 'b']); // video, image, audio
  });
});

describe('folder and label state mapping', () => {
  const assets = [
    asset('a', { folder: 'B-roll' }),
    asset('b', { folder: 'B-roll' }),
    asset('c', { folder: 'Music' }),
    asset('d'),
  ];

  it('lists distinct folders with counts; unfiled assets add none', () => {
    expect(listFolders(assets)).toEqual([
      { name: 'B-roll', count: 2 },
      { name: 'Music', count: 1 },
    ]);
  });

  it('an emptied folder vanishes naturally', () => {
    const moved = assets.map((x) => (x.id === 'c' ? { ...x, folder: undefined } : x));
    expect(listFolders(moved).map((f) => f.name)).toEqual(['B-roll']);
  });

  it('filters by folder (null = all, "" = unfiled) and composes with search', () => {
    const ids = (folder: string | null, query = '') => viewAssets(assets, { query, sort: 'name', folder }).map((x) => x.id);
    expect(ids(null)).toEqual(['a', 'b', 'c', 'd']);
    expect(ids('B-roll')).toEqual(['a', 'b']);
    expect(ids('')).toEqual(['d']);
    expect(ids('B-roll', 'b.mp4')).toEqual(['b']);
  });

  it('folder rename is a bulk patch over exactly that folder', () => {
    expect(assetIdsInFolder(assets, 'B-roll')).toEqual(['a', 'b']);
    expect(assetIdsInFolder(assets, 'Nope')).toEqual([]);
  });

  it('cleans folder names like the server does', () => {
    expect(cleanFolderName('  B-roll/Day\\1 \n')).toBe('B-roll Day 1');
    expect(cleanFolderName('x'.repeat(100))).toHaveLength(40);
  });
});

describe('usage scan', () => {
  const tracks: StudioTrack[] = [
    {
      id: 't1', kind: 'video', index: 0, muted: false,
      clips: [
        { id: 'c1', assetId: 'a', streamIndex: 0, timelineStart: 0, sourceIn: 0, sourceOut: 2 },
        { id: 'c2', assetId: 'b', streamIndex: 0, timelineStart: 2, sourceIn: 0, sourceOut: 2 },
        { id: 'c3', assetId: '', streamIndex: 0, timelineStart: 4, sourceIn: 0, sourceOut: 2 },
      ],
    },
    {
      id: 't2', kind: 'audio', index: 1, muted: false,
      clips: [{ id: 'c4', assetId: 'a', streamIndex: 0, timelineStart: 0, sourceIn: 0, sourceOut: 2 }],
    },
  ] as StudioTrack[];

  it('finds every referencing clip with its lane label', () => {
    const usage = findAssetUsage(tracks, ['a']);
    expect(usage.map((u) => [u.clipId, u.trackLabel])).toEqual([
      ['c1', 'V1'],
      ['c4', 'A2'],
    ]);
    expect(usageTrackSummary(usage)).toBe('V1, A2');
  });

  it('returns nothing for unused assets, empty input, and never matches title clips', () => {
    expect(findAssetUsage(tracks, ['zzz'])).toEqual([]);
    expect(findAssetUsage(tracks, [])).toEqual([]);
    expect(findAssetUsage(tracks, [''])).toEqual([]);
  });

  it('finds clips across several assets at once', () => {
    expect(findAssetUsage(tracks, ['a', 'b']).map((u) => u.clipId).sort()).toEqual(['c1', 'c2', 'c4']);
  });
});

describe('offline clips', () => {
  it('is offline only when the bin is loaded and the asset is missing', () => {
    expect(isClipOffline({ assetId: 'x' }, {}, true)).toBe(true);
    expect(isClipOffline({ assetId: 'x' }, { x: {} }, true)).toBe(false);
    expect(isClipOffline({ assetId: 'x' }, {}, false)).toBe(false);
    expect(isClipOffline({ assetId: '', title: {} }, {}, true)).toBe(false);
  });
});

describe('view prefs and voiceover naming', () => {
  it('parses prefs defensively', () => {
    expect(parseBinPrefs(null)).toEqual(DEFAULT_BIN_PREFS);
    expect(parseBinPrefs('{oops')).toEqual(DEFAULT_BIN_PREFS);
    expect(parseBinPrefs('{"sort":"name","layout":"grid"}')).toEqual({ sort: 'name', layout: 'grid' });
    expect(parseBinPrefs('{"sort":"bogus","layout":"x"}')).toEqual(DEFAULT_BIN_PREFS);
  });

  it('numbers voiceovers after the highest existing one', () => {
    expect(nextVoiceoverName([])).toBe('Voiceover 1');
    expect(
      nextVoiceoverName([
        asset('a', { originalFileName: 'Voiceover 2.webm' }),
        asset('b', { displayName: 'Voiceover 5' }),
        asset('c', { originalFileName: 'other.mp3' }),
      ]),
    ).toBe('Voiceover 6');
  });
});
