// MM34 — the post-AdSense-approval SEO switch.
//
// NEXT_PUBLIC_SEO_FULL_INDEX defaults to OFF (unset). While off, the sitemap,
// the tool-page noindex rule and robots behave exactly as they did during the
// AdSense review: allowlist tools only, no blog/tutorial detail pages, no
// changelog. Mitch flips it with a deploy-time env change AFTER approval; no
// code or fixture ever sets it. It is read at call time (not module load) so
// tests can stub it; Next inlines the literal `process.env.NEXT_PUBLIC_...`
// reference at build time in client bundles too.

export function isSeoFullIndex(): boolean {
  return process.env.NEXT_PUBLIC_SEO_FULL_INDEX === 'true';
}
