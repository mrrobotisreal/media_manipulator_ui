/**
 * The tutorials index (`/tutorials`) reads this registry, so a new tutorial shows up there by adding one entry
 * (plus its page, its `TUTORIAL_DATES` entry and its `tutorials.tutorials.<key>` strings). Nothing else on the
 * index page is hand-listed. `tutorialIndex.test.ts` fails when a dated tutorial has no entry here, or the other
 * way round, so the index cannot drift from the sitemap.
 *
 * `goal` groups a tutorial on the index; the order of `TUTORIAL_GOALS` is the order of the groups, and a group
 * with no tutorial is not rendered.
 */
import type { TutorialPath } from '@/content/pageDates';

export const TUTORIAL_GOALS = ['files', 'video', 'photo', 'audio', 'motion', 'assistant'] as const;
export type TutorialGoal = (typeof TUTORIAL_GOALS)[number];

export interface TutorialIndexEntry {
  /** Site path, also the key of `TUTORIAL_DATES`. */
  path: TutorialPath;
  /** Key under `tutorials.tutorials.*` holding `title`, `excerpt` and `readTime`. */
  key: string;
  goal: TutorialGoal;
}

export const TUTORIAL_INDEX: readonly TutorialIndexEntry[] = [
  { path: '/tutorials/video/getting-started', key: 'videoGettingStarted', goal: 'files' },
  { path: '/tutorials/image/getting-started', key: 'imageGettingStarted', goal: 'files' },
  { path: '/tutorials/content-studio', key: 'contentStudio', goal: 'video' },
  { path: '/tutorials/ai-frame-interpolation', key: 'aiFrameInterpolation', goal: 'video' },
  { path: '/tutorials/aperture', key: 'aperture', goal: 'photo' },
  { path: '/tutorials/audio/getting-started', key: 'audioGettingStarted', goal: 'audio' },
  { path: '/tutorials/motion', key: 'motion', goal: 'motion' },
  { path: '/tutorials/medi', key: 'medi', goal: 'assistant' },
];
