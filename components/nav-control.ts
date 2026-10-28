/**
 * MM88: the hit area shared by the four icon controls in the sticky nav: the
 * mobile-menu trigger, the theme toggle, the language trigger and the account
 * trigger.
 *
 * The visual box stays 36px (`size-9`), which keeps the chrome tight and the
 * 56px (`h-14`) nav centred, and an absolutely positioned `::after` extends the
 * clickable area by 4px on every side: 36 + 2 x 4 = 44px, the WCAG 2.5.5 /
 * Apple HIG / Material target. A pseudo-element is part of its element for hit
 * testing, so taps on the extension land on the control.
 *
 * Neighbours sit `gap-2` (8px) apart, exactly two extensions, so adjacent hit
 * areas touch but never overlap. `components/top-nav.test.tsx` asserts both
 * numbers from the class names.
 */
export const NAV_HIT_EXTENSION = "relative after:absolute after:-inset-1 after:content-['']";

export const NAV_ICON_CONTROL = `size-9 shrink-0 ${NAV_HIT_EXTENSION}`;
