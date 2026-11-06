/**
 * Caption looks (MM121 decision 7): named, complete caption styles. The catalog is the API's
 * (models.StudioCaptionLooks, copied in captionsCatalog.json with an identity test), so the
 * anonymous allowlist the server enforces and the locks the editor shows can never disagree.
 */
import type { StudioCaptionLookId, StudioCaptionStyle } from '@/lib/studioTypes';
import catalog from './captionsCatalog.json';

export interface CaptionLook {
  id: StudioCaptionLookId;
  /** Available to anonymous editors (the other looks show a sign-up lock). */
  anon: boolean;
  style: StudioCaptionStyle;
}

export const CAPTION_LOOKS = catalog.looks as unknown as readonly CaptionLook[];

export function captionLookById(id: string | undefined): CaptionLook | undefined {
  return CAPTION_LOOKS.find((l) => l.id === id);
}

/** Animations an anonymous editor may use (the anonymous looks' animations). */
export const ANON_CAPTION_ANIMATIONS: ReadonlySet<string> = new Set(
  Object.entries(catalog.anon.animations).filter(([, ok]) => ok).map(([a]) => a),
);

/** Is this look/animation locked for the caller (anonymous editors only)? */
export function captionLookLocked(look: CaptionLook, signedIn: boolean): boolean {
  return !signedIn && !look.anon;
}
export function captionAnimationLocked(animation: string, signedIn: boolean): boolean {
  return !signedIn && !ANON_CAPTION_ANIMATIONS.has(animation);
}

/** The style a look sets: every field of the look, lookId included. */
export function applyCaptionLook(look: CaptionLook): StudioCaptionStyle {
  return { ...look.style, lookId: look.id };
}

/** True when the style still equals its look (the editor shows "modified" otherwise). */
export function captionLookModified(style: StudioCaptionStyle): boolean {
  const look = captionLookById(style.lookId);
  if (!look) return false;
  return (Object.keys(look.style) as (keyof StudioCaptionStyle)[]).some((k) => style[k] !== look.style[k]);
}
