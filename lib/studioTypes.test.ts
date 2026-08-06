import { describe, expect, it } from 'vitest';

import {
  DEFAULT_CAPTION_STYLE,
  STUDIO_SCHEMA_VERSION,
  normalizeProject,
  studioProjectSchema,
  type StudioProject,
  type StudioTrack,
} from '@/lib/studioTypes';

// A v1 track shape mirroring the Go sanitizer's byte-stability guard
// (TestSanitizeTracks_V1NoOp in internal/models/studio_sanitize_test.go). The
// clip carries a legacy transitionInSeconds, which the v3 normalizer upgrades
// to a typed transition — the ONE documented change to legacy clip data.
const v1Tracks = (): StudioTrack[] => [
  {
    id: 'v1',
    kind: 'video',
    index: 0,
    muted: false,
    clips: [
      {
        id: 'c1',
        assetId: 'a1',
        streamIndex: 0,
        timelineStart: 0,
        sourceIn: 0,
        sourceOut: 5,
        opacity: 1,
        transitionInSeconds: 0.5,
        adjustments: { brightness: 0.1, contrast: 1.2, saturation: 0.8 },
        textOverlays: [{ id: 'o1', text: 'Reykjavík', x: 0.05, y: 0.9, fontSize: 48, color: '#FFCC00' }],
      },
    ],
  },
  {
    id: 'a1',
    kind: 'audio',
    index: 0,
    muted: false,
    clips: [
      { id: 'c2', assetId: 'music', streamIndex: 0, timelineStart: 0, sourceIn: 0, sourceOut: 10, volume: 0.3 },
    ],
  },
];

/** Like v1Tracks but with nothing the v3 normalizer needs to touch. */
const stableTracks = (): StudioTrack[] => {
  const tracks = v1Tracks();
  delete tracks[0].clips[0].transitionInSeconds;
  return tracks;
};

/** A v1-era persisted project: schemaVersion 1, none of the v2 project fields. */
const v1Project = (tracks: StudioTrack[] = v1Tracks()): StudioProject =>
  ({
    id: 'p1',
    name: 'Iceland cut',
    schemaVersion: 1,
    fps: 30,
    width: 1920,
    height: 1080,
    durationSeconds: 10,
    tracks,
    createdAt: '2025-06-01T00:00:00Z',
    updatedAt: '2025-06-02T00:00:00Z',
  }) as unknown as StudioProject;

const v2Project = (tracks: StudioTrack[] = v1Tracks()): StudioProject => ({
  id: 'p2',
  name: 'Graded cut',
  schemaVersion: 2,
  fps: 30,
  width: 1920,
  height: 1080,
  durationSeconds: 10,
  tracks,
  captions: [{ id: 'cap1', startSeconds: 1, endSeconds: 3, text: 'Hello' }],
  captionStyle: { ...DEFAULT_CAPTION_STYLE, position: 'top', fontSizePct: 6 },
  captionsEnabled: false,
  audio: { duckingEnabled: true, duckVoiceTrackId: 'a1', duckAmountDb: 12, duckAttackMs: 100, duckReleaseMs: 500 },
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-02T00:00:00Z',
});

describe('normalizeProject', () => {
  it('stamps the current schema version and fills v2 defaults on a v1 project', () => {
    const out = normalizeProject(v1Project());
    expect(out.schemaVersion).toBe(STUDIO_SCHEMA_VERSION);
    expect(out.schemaVersion).toBe(3);
    expect(out.captions).toEqual([]);
    expect(out.captionStyle).toEqual(DEFAULT_CAPTION_STYLE);
    expect(out.captionsEnabled).toBe(true);
    expect(out.audio).toBeUndefined();
  });

  it('is idempotent: normalizing twice deep-equals normalizing once', () => {
    const once = normalizeProject(v1Project());
    const twice = normalizeProject(once);
    expect(twice).toEqual(once);
    // The second pass finds nothing to upgrade, so the track tree keeps its identity.
    expect(twice.tracks).toBe(once.tracks);
  });

  it('leaves clips with nothing to upgrade byte-stable (mirrors the Go no-op guard)', () => {
    const input = v1Project(stableTracks());
    const out = normalizeProject(input);
    expect(JSON.stringify(out.tracks)).toBe(JSON.stringify(stableTracks()));
    // Untouched tracks keep their identity — normalization is additive only.
    expect(out.tracks).toBe(input.tracks);
  });

  it('preserves project metadata (name, fps, geometry, timestamps)', () => {
    const out = normalizeProject(v1Project());
    expect(out).toMatchObject({
      id: 'p1',
      name: 'Iceland cut',
      fps: 30,
      width: 1920,
      height: 1080,
      durationSeconds: 10,
      createdAt: '2025-06-01T00:00:00Z',
      updatedAt: '2025-06-02T00:00:00Z',
    });
  });

  it('produces a document that satisfies the wire schema', () => {
    const parsed = studioProjectSchema.parse(normalizeProject(v1Project()));
    expect(parsed.schemaVersion).toBe(STUDIO_SCHEMA_VERSION);
    // zod parse of the normalized v1 payload is also value-stable.
    expect(parsed).toEqual(normalizeProject(v1Project()));
  });
});

describe('normalizeProject — v2 → v3 upgrades', () => {
  it('upgrades transitionInSeconds > 0 to a typed crossDissolve and keeps the legacy field', () => {
    const input = v2Project();
    const out = normalizeProject(input);
    const clip = out.tracks[0].clips[0];
    expect(clip.transition).toEqual({ type: 'crossDissolve', durationSeconds: 0.5 });
    expect(clip.transitionInSeconds).toBe(0.5);
    // The untouched sibling track keeps its identity.
    expect(out.tracks[1]).toBe(input.tracks[1]);
  });

  it('clamps the legacy duration into 0.1–5s on upgrade', () => {
    const tracks = v1Tracks();
    tracks[0].clips[0].transitionInSeconds = 9;
    const out = normalizeProject(v2Project(tracks));
    expect(out.tracks[0].clips[0].transition).toEqual({ type: 'crossDissolve', durationSeconds: 5 });
  });

  it('does not upgrade a zero legacy transition', () => {
    const tracks = v1Tracks();
    tracks[0].clips[0].transitionInSeconds = 0;
    const out = normalizeProject(v2Project(tracks));
    expect(out.tracks[0].clips[0].transition).toBeUndefined();
  });

  it('an existing typed transition wins over the legacy field', () => {
    const tracks = v1Tracks();
    tracks[0].clips[0].transition = { type: 'wipeLeft', durationSeconds: 2 };
    const out = normalizeProject(v2Project(tracks));
    expect(out.tracks[0].clips[0].transition).toEqual({ type: 'wipeLeft', durationSeconds: 2 });
  });

  it('upgrades volumeKeyframes to keyframes.volume with linear ease, keeping the legacy lane', () => {
    const tracks = stableTracks();
    tracks[1].clips[0].volumeKeyframes = [
      { t: 0, gain: 1 },
      { t: 4, gain: 0.2 },
    ];
    const out = normalizeProject(v2Project(tracks));
    const clip = out.tracks[1].clips[0];
    expect(clip.keyframes?.volume).toEqual([
      { t: 0, value: 1, ease: 'linear' },
      { t: 4, value: 0.2, ease: 'linear' },
    ]);
    expect(clip.volumeKeyframes).toEqual([
      { t: 0, gain: 1 },
      { t: 4, gain: 0.2 },
    ]);
  });

  it('keyframes.volume wins when both lanes exist', () => {
    const tracks = stableTracks();
    tracks[1].clips[0].volumeKeyframes = [{ t: 0, gain: 1 }];
    tracks[1].clips[0].keyframes = { volume: [{ t: 2, value: 0.5, ease: 'easeOut' }] };
    const out = normalizeProject(v2Project(tracks));
    expect(out.tracks[1].clips[0].keyframes?.volume).toEqual([{ t: 2, value: 0.5, ease: 'easeOut' }]);
  });

  it('volumeKeyframes upgrade preserves other keyframe lanes on the clip', () => {
    const tracks = stableTracks();
    tracks[1].clips[0].volumeKeyframes = [{ t: 0, gain: 1 }];
    tracks[1].clips[0].keyframes = { pan: [{ t: 0, value: -1, ease: 'linear' }] };
    const out = normalizeProject(v2Project(tracks));
    const kf = out.tracks[1].clips[0].keyframes;
    expect(kf?.pan).toEqual([{ t: 0, value: -1, ease: 'linear' }]);
    expect(kf?.volume).toEqual([{ t: 0, value: 1, ease: 'linear' }]);
  });

  it('v2 → v3 is idempotent across the upgrade fields', () => {
    const once = normalizeProject(v2Project());
    const twice = normalizeProject(once);
    expect(twice).toEqual(once);
    expect(twice.tracks).toBe(once.tracks);
  });

  it('passes an already-v3 project through unchanged', () => {
    const tracks = stableTracks();
    tracks[0].clips[0].transition = { type: 'pushUp', durationSeconds: 1 };
    tracks[0].clips[0].keyframes = { opacity: [{ t: 0, value: 1, ease: 'hold' }] };
    tracks[0].name = 'Main';
    tracks[0].gain = 1.2;
    const input: StudioProject = {
      ...v2Project(tracks),
      schemaVersion: 3,
      markers: [{ id: 'm1', t: 2, name: 'Intro', color: '#22C55E' }],
    };
    const out = normalizeProject(input);
    expect(out).toEqual(input);
    expect(out.tracks).toBe(input.tracks);
    expect(out.markers).toBe(input.markers);
    expect(out.captionStyle).toBe(input.captionStyle);
    expect(out.audio).toBe(input.audio);
  });

  it('normalized v3 output (transitions, keyframes, markers, title clips) satisfies the wire schema', () => {
    const tracks = stableTracks();
    tracks[0].clips.push({
      id: 't1',
      assetId: '',
      streamIndex: 0,
      timelineStart: 5,
      sourceIn: 0,
      sourceOut: 3,
      title: {
        layers: [
          {
            type: 'text',
            text: 'Darkroom',
            fontFamily: 'Inter',
            fontSizePx: 96,
            fontWeight: 700,
            fillColor: '#FFFFFF',
            align: 'center',
            x: 0.5,
            y: 0.4,
          },
          { type: 'rect', x: 0.1, y: 0.7, w: 0.8, h: 0.1, color: '#FF0000', opacity: 0.5 },
          { type: 'line', x1: 0.1, y1: 0.85, x2: 0.9, y2: 0.85, color: '#00FF00', thicknessPx: 3 },
        ],
      },
      freeze: { sourceTime: 1.5 },
    });
    const project: StudioProject = {
      ...v2Project(tracks),
      schemaVersion: 3,
      markers: [{ id: 'm1', t: 2, name: 'Intro', color: '#22C55E', comment: 'tighten' }],
    };
    const parsed = studioProjectSchema.parse(normalizeProject(project));
    expect(parsed).toEqual(normalizeProject(project));
  });
});
