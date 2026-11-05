import { PHOTO_BRAND } from '@/lib/photo/brand';
import { MOTION_BRAND } from '@/lib/vector/brand';


/** The three editors that carry a Medi copilot, as tool-page links (the editors themselves are chromeless routes). */
export const EDITOR_LINKS: ReadonlyArray<{ brand: string; href: string }> = [
  { brand: PHOTO_BRAND, href: '/tools/aperture' },
  { brand: 'Darkroom', href: '/tools/content-studio' },
  { brand: MOTION_BRAND, href: '/tools/motion' },
];
