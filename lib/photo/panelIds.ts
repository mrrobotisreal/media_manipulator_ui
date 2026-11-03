/**
 * Editor panels an Aperture tool page can open first (MM100 decision 2). Matches the
 * `PanelId` of `components/photo/layers-panel.tsx` (the spec's `mixer` is `channelMixer`
 * as built). Dependency-free so content/toolPages.ts and the editor share it.
 */
export const PHOTO_PANEL_IDS = [
  'presets',
  'basic',
  'detail',
  'geometry',
  'masks',
  'heal',
  'redEye',
  'curves',
  'levels',
  'hsl',
  'colorBalance',
  'blackWhite',
  'channelMixer',
  'photoFilter',
  'splitTone',
  'lut',
  'effects',
] as const;
export type PhotoPanelId = (typeof PHOTO_PANEL_IDS)[number];
export const isPhotoPanelId = (v: unknown): v is PhotoPanelId => typeof v === 'string' && (PHOTO_PANEL_IDS as readonly string[]).includes(v);
