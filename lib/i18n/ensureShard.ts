import i18n from '@/i18n';
import { defaultLanguage } from '@/i18n/resources';

/**
 * Lazily merges the tool-surface translation shards into the live i18next
 * instance, per language.
 *
 * `interface/forms.json` (~36 KB) and `interface/panels.json` (~29 KB) are read
 * only by the conversion forms and tool panels, and every one of those loads
 * behind a `lazy()` or `next/dynamic({ ssr: false })` boundary. Keeping them
 * out of the eager `i18n/resources.ts` bundle takes that JSON off the
 * first load of *every* route, including routes with no tool on them.
 *
 * Call this from inside the dynamic import that pulls a tool panel in — see
 * `components/tools/embedded-tool-panel-client.tsx` for the pattern — so the
 * loader suspends until the strings exist. Rendering a panel before the bundle
 * is merged would flash raw `interface:…` keys.
 *
 * Language switching: once any tool shard has been requested, a
 * `languageChanged` listener loads the shards for each newly-selected language
 * too. The i18n init options bind re-renders to `added` store events, so a
 * panel that is already on screen settles into the new language as soon as its
 * shards merge.
 *
 * Safe with respect to SSG: none of these surfaces server-render, so no
 * prerendered HTML depends on these shards. `npm run build` is checked for
 * leaked keys at Checkpoint 3.
 *
 * Idempotent per language — each language's fetch happens once and every later
 * caller awaits the same promise.
 */
type ShardModule = { default: Record<string, unknown> };

// One loader per registered language. Adding a language: add its entry here
// (dynamic imports keep each language's JSON in its own lazy chunk).
const SHARD_LOADERS: Record<string, () => Promise<[ShardModule, ShardModule]>> = {
  'en-US': () =>
    Promise.all([
      import('@/i18n/locales/en-us/interface/forms.json'),
      import('@/i18n/locales/en-us/interface/panels.json'),
    ]),
  'ru-RU': () =>
    Promise.all([
      import('@/i18n/locales/ru-ru/interface/forms.json'),
      import('@/i18n/locales/ru-ru/interface/panels.json'),
    ]),
};

const pendingByLanguage = new Map<string, Promise<void>>();
let shardsRequested = false;
let languageListenerBound = false;

const resolveLoaderLanguage = (language: string | undefined): string => {
  if (language && SHARD_LOADERS[language]) return language;
  return defaultLanguage;
};

function ensureShardsForLanguage(language: string): Promise<void> {
  const lang = resolveLoaderLanguage(language);
  const existing = pendingByLanguage.get(lang);
  if (existing) return existing;

  const pending = (async () => {
    const [forms, panels] = await SHARD_LOADERS[lang]();
    // deep: true, overwrite: true — these shards own disjoint top-level keys,
    // but a deep merge keeps them additive if that ever stops being true.
    i18n.addResourceBundle(lang, 'interface', forms.default, true, true);
    i18n.addResourceBundle(lang, 'interface', panels.default, true, true);
  })().catch((error) => {
    // Let a transient chunk failure retry on the next mount rather than leaving
    // every tool panel permanently untranslated.
    pendingByLanguage.delete(lang);
    throw error;
  });

  pendingByLanguage.set(lang, pending);
  return pending;
}

export function ensureToolShards(): Promise<void> {
  shardsRequested = true;
  if (!languageListenerBound) {
    languageListenerBound = true;
    i18n.on('languageChanged', (lng: string) => {
      if (!shardsRequested) return;
      // Swallow chunk-load failures here; the visible surfaces re-request the
      // shards on their next mount via ensureToolShards().
      void ensureShardsForLanguage(lng).catch(() => {});
    });
  }
  return ensureShardsForLanguage(i18n.language || defaultLanguage);
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
