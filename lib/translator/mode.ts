/**
 * Translator mode flags (MM52, design `docs/design/TRANSLATOR_WORKBENCH.md` §2.6).
 *
 * THE ONLY module under `lib/translator/` that app code may import statically
 * (enforced by `lib/translator/importBoundary.test.ts`). It holds flags and a
 * runtime hand-off slot, never translator code, so production bundles carry a
 * few bytes of it and nothing else from the workbench.
 *
 *   NEXT_PUBLIC_DEPLOY_ROLE=translator       -> translator deployment (hardening on)
 *   NEXT_PUBLIC_TRANSLATOR_LOCALE=<code>     -> the locale it edits, e.g. `de-DE`;
 *                                               must be one of `translatorLocales`
 *
 * Production never sets either. `next.config.ts` defines both under `env`
 * (empty string when unset), so `process.env.NEXT_PUBLIC_DEPLOY_ROLE` is
 * ALWAYS inlined and `=== 'translator'` folds to a constant in every bundle.
 *
 * Two levels:
 *   - `isTranslatorEnv()`  the deployment role. Every hardening switch (noindex,
 *     no ads/analytics, `/dr` 404, hidden irreversible actions) keys on this, so
 *     a misconfigured locale still gets a hardened deployment.
 *   - `isTranslatorArmed()` role AND a valid locale. Markers, the DOM scanner and
 *     (MM53) the panel key on this; an invalid locale refuses to arm, logged once.
 *
 * Loading translator code: never `import` it statically. Guard the dynamic
 * import / require with the LITERAL expression
 *     if (process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator') { ... }
 * at the call site (not a call to `isTranslatorEnv()`): bundlers fold the
 * literal, they do not inline a function from another module, and only a
 * folded branch keeps the chunk out of the build. `npm run check:no-translator`
 * proves it on the built output.
 */
import { translatorLocales } from '@/i18n/locales';

/** True on a translator deployment (`NEXT_PUBLIC_DEPLOY_ROLE=translator`). */
export function isTranslatorEnv(): boolean {
  return process.env.NEXT_PUBLIC_DEPLOY_ROLE === 'translator';
}

let warnedInvalidLocale = false;

/**
 * The locale code this translator deployment edits, validated against
 * `translatorLocales` (case-insensitive; returned in its registered spelling).
 * `null` outside translator mode and when the value is missing or unknown.
 */
export function translatorLocale(): string | null {
  if (!isTranslatorEnv()) return null;
  const raw = (process.env.NEXT_PUBLIC_TRANSLATOR_LOCALE ?? '').trim().toLowerCase();
  const match = raw ? translatorLocales.find((l) => l.code.toLowerCase() === raw) : undefined;
  if (match) return match.code;
  if (!warnedInvalidLocale) {
    warnedInvalidLocale = true;
    console.warn(
      `[translator] NEXT_PUBLIC_TRANSLATOR_LOCALE=${JSON.stringify(process.env.NEXT_PUBLIC_TRANSLATOR_LOCALE ?? '')} ` +
        'is not a translator locale (see `node scripts/list-locales.mjs --codes`); translator mode will not arm. ' +
        'Hardening stays on.',
    );
  }
  return null;
}

/** Translator role AND a valid locale: markers, scanner and panel may run. */
export function isTranslatorArmed(): boolean {
  return translatorLocale() !== null;
}

/**
 * Design §2.15: Checkout/upgrade, account and data deletion, and Darkroom export
 * are hidden or disabled on translator deployments. UI only; the API still works.
 * One helper so every surface (and MM53+ tests) shares the rule.
 */
export function isIrreversibleActionHidden(): boolean {
  return isTranslatorEnv();
}

/** `metadata.robots` forced on translator deployments (design §2.7). */
export const TRANSLATOR_ROBOTS = { index: false, follow: false } as const;

/** Test seam: re-arm the once-only invalid-locale warning. */
export function resetTranslatorModeWarningsForTests(): void {
  warnedInvalidLocale = false;
}

/* ------------------------------------------------------------------------- */
/* Runtime hand-off                                                           */
/* ------------------------------------------------------------------------- */

/** A registry reference for a translated string: namespace, resolved key, language. */
export interface MarkerRef {
  ns: string;
  /** The RESOLVED key (`foo_one`, `items.0.title`), never the base key. */
  key: string;
  lng: string;
}

/**
 * What `lib/translator/keyMarker.ts` hands to the i18n layer once it is loaded.
 * Declared here (types only) so `i18n/index.ts` and `lib/i18n/server.tsx` can
 * use it without importing translator code.
 */
export interface TranslatorMarkerRuntime {
  /** i18next post-processor module; `name` goes into `postProcess`. */
  postProcessor: {
    type: 'postProcessor';
    name: string;
    process: (value: string, key: string | string[], options: Record<string, unknown>, translator: unknown) => string;
  };
  /** Appends the key marker for `ref` to a server-rendered string (inner markers stripped). */
  markServerString: (value: string, ref: MarkerRef) => string;
  /** Removes every key marker from a string. */
  stripMarkers: (value: string) => string;
  /** Build-artifact sentinel, kept reachable so minifiers cannot drop it. */
  sentinel: string;
}

const RUNTIME_SLOT = '__mmTranslatorMarkerRuntime';

/** The loaded marker runtime, or `null` (always `null` in production). */
export function getTranslatorMarkerRuntime(): TranslatorMarkerRuntime | null {
  return ((globalThis as Record<string, unknown>)[RUNTIME_SLOT] as TranslatorMarkerRuntime | undefined) ?? null;
}

/** Called by `lib/translator/keyMarker.ts` when it is evaluated. */
export function registerTranslatorMarkerRuntime(runtime: TranslatorMarkerRuntime): void {
  (globalThis as Record<string, unknown>)[RUNTIME_SLOT] = runtime;
}
