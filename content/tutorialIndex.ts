/**
 * The tutorials index (`/tutorials`) reads this registry, so a new tutorial shows up there by adding one entry
 * (plus its page, its `TUTORIAL_DATES` entry and its `tutorials.tutorials.<key>` strings). Nothing else on the
 * index page is hand-listed. `tutorialIndex.test.ts` fails when a dated tutorial has no entry here, or the other
 * way round, so the index cannot drift from the sitemap.
 *
 * `goal` groups a tutorial on the index; the order of `TUTORIAL_GOALS` is the order of the groups, and a group
 * with no tutorial is not rendered.
 */
import { MEDI_BRAND } from '@/lib/assistant/brand';
import { PHOTO_BRAND } from '@/lib/photo/brand';
import { MOTION_BRAND } from '@/lib/vector/brand';
import type { TutorialPath } from '@/content/pageDates';

export const TUTORIAL_GOALS = ['files', 'video', 'photo', 'audio', 'motion', 'assistant'] as const;
export type TutorialGoal = (typeof TUTORIAL_GOALS)[number];

export interface TutorialIndexEntry {
  /** Site path, also the key of `TUTORIAL_DATES`. */
  path: TutorialPath;
  /** Key under `tutorials.tutorials.*` holding `title`, `excerpt` and `readTime`. */
  key: string;
  goal: TutorialGoal;
  /**
   * What `{{brand}}` means in this tutorial's `title` and `excerpt`. The copy never spells a brand, and
   * each tutorial is about a different product, so the index page and Medi's knowledge export both read it
   * from here. (Until 2026-11-11 both filled every card with the photo editor's brand, so the assistant's
   * tutorial was titled "How to use Aperture, the assistant" on the live index and in Medi's corpus.)
   */
  brand?: string;
}

/** The interpolation values for one tutorial's `title` / `excerpt` (empty when the copy has no brand). */
export function tutorialBrandValues(key: string): { brand: string } | Record<string, never> {
  const brand = TUTORIAL_INDEX.find((e) => e.key === key)?.brand;
  return brand ? { brand } : {};
}

export const TUTORIAL_INDEX: readonly TutorialIndexEntry[] = [
  { path: '/tutorials/video/getting-started', key: 'videoGettingStarted', goal: 'files' },
  { path: '/tutorials/image/getting-started', key: 'imageGettingStarted', goal: 'files' },
  { path: '/tutorials/content-studio', key: 'contentStudio', goal: 'video' },
  { path: '/tutorials/ai-frame-interpolation', key: 'aiFrameInterpolation', goal: 'video' },
  { path: '/tutorials/aperture', key: 'aperture', goal: 'photo', brand: PHOTO_BRAND },
  { path: '/tutorials/audio/getting-started', key: 'audioGettingStarted', goal: 'audio' },
  { path: '/tutorials/motion', key: 'motion', goal: 'motion', brand: MOTION_BRAND },
  { path: '/tutorials/medi', key: 'medi', goal: 'assistant', brand: MEDI_BRAND },
];
