/**
 * MM109 acceptance 2: the tracks Medi's engine produces for a representative batch (a look, a
 * grade, a slide-in lower-third, a transition, keyframes, speed, a held frame, an audio preset),
 * committed to the API as `internal/models/testdata/medi_studio_tracks.json`. The Go test feeds it
 * through `SanitizeTracks` and requires it back unchanged: everything Medi writes is already
 * inside the server's ranges, so a save never silently alters a Medi edit.
 */
import { lockedViolation } from '@/lib/studioStore';

import { applyStudioOps } from './applyStudio';
import { STUDIO_FIXTURE_ASSETS, studioFixture } from './studioFixture';

export const MEDI_SANITIZER_FIXTURE = '../media_manipulator_api/internal/models/testdata/medi_studio_tracks.json';

export function mediSanitizerTracks(): string {
  let n = 0;
  const r = applyStudioOps(
    studioFixture(),
    [
      { op: 'apply_look', clipIds: ['clipA'], lookId: 'cinematic', intensity: 0.8 },
      { op: 'grade', clipIds: ['clipB'], lumetri: { temperature: -12, saturation: 0.95, exposure: 0.3 } },
      { op: 'set_transition', clipId: 'clipB', type: 'crossDissolve', durationSeconds: 0.8 },
      { op: 'add_title', template: 'lowerThird', lines: ['Sam Lee', 'Designer'], start: 2, duration: 5, style: { fontFamily: 'Montserrat', backgroundOpacity: 0.6 }, animateIn: 'slideLeft', animateOut: 'fade' },
      { op: 'set_keyframes', clipId: 'clipA', property: 'scale', keyframes: [{ t: 0, value: 1, ease: 'easeBoth' }, { t: 11, value: 1.15, ease: 'linear' }] },
      { op: 'set_speed', clipId: 'clipB', speed: 0.5 },
      { op: 'freeze_frame', clipId: 'clipB', at: 14, duration: 2 },
      { op: 'audio_preset', track: 'A1', preset: 'voiceClarity' },
      { op: 'set_volume', clipId: 'music1', gainDb: -6 },
      { op: 'set_keyframes', clipId: 'music1', property: 'volume', keyframes: [{ t: 0, value: 0, ease: 'easeOut' }, { t: 2, value: 0.5, ease: 'linear' }] },
    ],
    {
      assetKind: (id) => STUDIO_FIXTURE_ASSETS[id]?.mediaKind,
      assetDuration: (id) => STUDIO_FIXTURE_ASSETS[id]?.durationSeconds,
      lockedViolation,
      newId: () => `medi${++n}`,
    },
  );
  if (!r.ok) throw new Error(r.errors.join('; '));
  return `${JSON.stringify(r.project.tracks, null, 2)}\n`;
}
