/**
 * MM100: the English body of an Aperture tool page. `category`, `lastReviewed`
 * and the `embed` panel/preset wiring are added by content/photo/index.ts so a
 * body file holds prose only.
 */
import type { ToolPageContent } from '@/content/toolPages';

export type PhotoPageBody = Omit<ToolPageContent, 'category' | 'lastReviewed' | 'aliasOf' | 'embed'> & {
  /** Heading and one-line help shown above the page's drop zone. */
  embed: { title: string; description: string };
};
