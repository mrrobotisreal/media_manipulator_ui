/**
 * MM88: "Skip to content", the first focusable element on every page (WCAG 2.4.1).
 *
 * Rendered by both root layouts before anything else in <body>, so a keyboard or
 * switch user's first Tab lands here rather than in the nav. Invisible until
 * focused, then a solid chip at the top inline-start corner (logical `start-4`,
 * so it sits top-right in Arabic and Hebrew). The target is the
 * `<main id="main" tabIndex={-1}>` in `app/providers.tsx` (or the chromeless
 * wrapper with the same id), so focus moves into the content and the next Tab
 * continues from there.
 *
 * A server component with the label passed in: the layouts resolve it with
 * `getServerT`, so it is in the prerendered HTML in the page's own language and
 * costs no client JavaScript. `focus:not-sr-only` resets position and padding,
 * hence the `!` on the ones the chip sets again.
 */
export const MAIN_CONTENT_ID = 'main';

export function SkipLink({ label }: { label: string }) {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      data-skip-link
      className="sr-only focus:not-sr-only focus:fixed! focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4! focus:py-2! focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
    >
      {label}
    </a>
  );
}

export default SkipLink;
