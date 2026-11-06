import { describe, expect, it } from 'vitest';
import { studioCaptionStyleSchema } from '@/lib/studioTypes';
import { applyCaptionLook, CAPTION_LOOKS, captionAnimationLocked, captionLookLocked, captionLookModified } from './captionLooks';
import { sanitizeCaptionStyle } from './sanitize';

describe('caption looks (decision 7)', () => {
  it('six looks, three anonymous (Minimal, Clean Highlight, Bold Pop)', () => {
    expect(CAPTION_LOOKS.map((l) => l.id)).toEqual(['bold_pop', 'karaoke_classic', 'clean_highlight', 'minimal', 'neon', 'podcast']);
    expect(CAPTION_LOOKS.filter((l) => l.anon).map((l) => l.id).sort()).toEqual(['bold_pop', 'clean_highlight', 'minimal']);
  });

  it('each look is a full, valid style that survives the sanitizer unchanged', () => {
    for (const l of CAPTION_LOOKS) {
      const st = applyCaptionLook(l);
      expect(studioCaptionStyleSchema.safeParse(st).success, l.id).toBe(true);
      expect(sanitizeCaptionStyle(st), l.id).toEqual(st);
      expect(st.lookId).toBe(l.id);
    }
  });

  it('a tweak keeps lookId and marks the style modified', () => {
    const st = applyCaptionLook(CAPTION_LOOKS[0]);
    expect(captionLookModified(st)).toBe(false);
    expect(captionLookModified({ ...st, highlightColor: '#00FF00' })).toBe(true);
  });

  it('locks only for anonymous editors; Free gets every look and animation', () => {
    const neon = CAPTION_LOOKS.find((l) => l.id === 'neon')!;
    expect(captionLookLocked(neon, false)).toBe(true);
    expect(captionLookLocked(neon, true)).toBe(false);
    expect(captionAnimationLocked('karaoke_fill', false)).toBe(true);
    expect(captionAnimationLocked('karaoke_fill', true)).toBe(false);
    expect(captionAnimationLocked('pop', false)).toBe(false);
  });
});
