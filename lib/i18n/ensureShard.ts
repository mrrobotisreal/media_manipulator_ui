import i18n from '@/i18n';
import { defaultLanguage } from '@/i18n/resources';

/**
 * Lazily merges the tool-surface translation shards into the live i18next
 * instance.
 *
 * `interface/forms.json` (36 KB) and `interface/panels.json` (29 KB) are read
 * only by the conversion forms and tool panels, and every one of those loads
 * behind a `lazy()` or `next/dynamic({ ssr: false })` boundary. Keeping them
 * out of the eager `i18n/resources.ts` bundle takes ~65 KB of JSON off the
 * first load of *every* route, including routes with no tool on them.
 *
 * Call this from inside the dynamic import that pulls a tool panel in — see
 * `components/tools/embedded-tool-panel-client.tsx` for the pattern — so the
 * loader suspends until the strings exist. Rendering a panel before the bundle
 * is merged would flash raw `interface:…` keys.
 *
 * Safe with respect to SSG: none of these surfaces server-render, so no
 * prerendered HTML depends on these shards. `npm run build` is checked for
 * leaked keys at Checkpoint 3.
 *
 * Idempotent — the fetch happens once and every later caller awaits the same
 * promise.
 */
let pending: Promise<void> | null = null;

export function ensureToolShards(): Promise<void> {
  if (pending) return pending;

  pending = (async () => {
    const [forms, panels] = await Promise.all([
      import('@/i18n/locales/en-us/interface/forms.json'),
      import('@/i18n/locales/en-us/interface/panels.json'),
    ]);
    const language = i18n.language || defaultLanguage;
    // deep: true, overwrite: true — these shards own disjoint top-level keys,
    // but a deep merge keeps them additive if that ever stops being true.
    i18n.addResourceBundle(language, 'interface', forms.default, true, true);
    i18n.addResourceBundle(language, 'interface', panels.default, true, true);
  })().catch((error) => {
    // Let a transient chunk failure retry on the next mount rather than leaving
    // every tool panel permanently untranslated.
    pending = null;
    throw error;
  });

  return pending;
}

/**
 * `ensureToolShards()` composed with a dynamic import, for use as the factory
 * of `lazy()` / `next/dynamic()`:
 *
 *     const Panel = dynamic(() => withToolShards(() => import('…')), { ssr: false })
 */
export function withToolShards<T>(load: () => Promise<T>): Promise<T> {
  return ensureToolShards().then(load);
}

export default ensureToolShards;
