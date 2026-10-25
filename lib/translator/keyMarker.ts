/**
 * The i18next key-marker post-processor (MM52, design §2.9).
 *
 * TRANSLATOR DEPLOYMENTS ONLY. Never import this statically from app code: the
 * i18n layer loads it behind the literal `NEXT_PUBLIC_DEPLOY_ROLE` guard (see
 * `i18n/index.ts`, `lib/i18n/server.tsx`), and `npm run check:no-translator`
 * fails a production build that contains `TRANSLATOR_SENTINEL`.
 *
 * Evaluating this module registers the runtime in the `lib/translator/mode.ts`
 * slot, which is how the i18n layer reaches it without a static import.
 *
 * i18next 26.x post-processor arguments (spike, recorded in the design doc §7):
 *   process(value, key, options, translator)
 *     value   the final string: interpolated, `$t()` nesting already resolved
 *             (nested `$t()` calls run with `applyPostProcessor: false`, so the
 *             inner strings arrive unmarked)
 *     key     the ARRAY of requested keys (`['foo']`), base key, ns-prefixed
 *             when the caller wrote `ns:key` — NOT the resolved plural key
 *     options the call options; with `postProcessPassResolved: true` it also
 *             holds `i18nResolved = { res, usedKey, exactUsedKey, usedLng, usedNS }`
 *             where `exactUsedKey` IS the resolved key (`foo_few`, `foo_male`)
 *             and `res` is the raw template before interpolation
 *   returnObjects: each leaf is translated separately with its full dotted path
 *   (`items.0.title`), so each array/object leaf gets its own marker.
 */
import { registerTranslatorMarkerRuntime, type MarkerRef, type TranslatorMarkerRuntime } from './mode';
import { appendMarker, stripMarkers } from './markerCodec';
import { keyRegistry, shouldMarkKey } from './keyRegistry';

/** Build-artifact sentinel: present in a bundle iff this module was bundled. */
export const TRANSLATOR_SENTINEL = '__MM_TRANSLATOR_SENTINEL__';

export const KEY_MARKER_NAME = 'mmKeyMarker';

/** i18next call options that are not interpolation params. */
const OPTION_KEYS = new Set([
  'defaultValue', 'ordinal', 'context', 'replace', 'lng', 'lngs', 'fallbackLng', 'ns', 'keySeparator',
  'nsSeparator', 'returnObjects', 'returnDetails', 'joinArrays', 'postProcess', 'interpolation', 'i18nResolved',
  'applyPostProcessor', 'skipInterpolation', 'nest', 'count', 'defaultNS', 'lngIfNotFound',
]);

interface ResolvedDetails {
  res?: unknown;
  usedKey?: string;
  exactUsedKey?: string;
  usedLng?: string;
  usedNS?: string;
}

interface PluralResolverLike {
  getSuffix: (code: string, count: number, options?: Record<string, unknown>) => string;
}

interface TranslatorLike {
  language?: string;
  pluralResolver?: PluralResolverLike;
}

function paramsOf(options: Record<string, unknown>): Record<string, unknown> | undefined {
  const source =
    options.replace && typeof options.replace === 'object' ? (options.replace as Record<string, unknown>) : options;
  let out: Record<string, unknown> | undefined;
  for (const [k, v] of Object.entries(source)) {
    if (OPTION_KEYS.has(k) || k.startsWith('defaultValue')) continue;
    if (v === null || ['string', 'number', 'boolean'].includes(typeof v)) {
      (out ??= {})[k] = typeof v === 'string' ? stripMarkers(v) : v;
    }
  }
  return out;
}

/**
 * The registry reference for one resolved `t()` call, or `null` when the string
 * must stay unmarked (missing key, identifier leaf).
 */
export function refForCall(
  options: Record<string, unknown>,
  translator: TranslatorLike | undefined,
): MarkerRef | null {
  const resolved = options.i18nResolved as ResolvedDetails | undefined;
  // Missing everywhere: i18next returns the key itself; nothing to edit.
  if (!resolved || resolved.res === undefined || !resolved.exactUsedKey || !resolved.usedNS) return null;
  const lng = String(options.lng ?? translator?.language ?? resolved.usedLng ?? '');
  if (!lng) return null;
  let key = resolved.exactUsedKey;
  // Resolved from the fallback language: the plural suffix belongs to English's
  // rules, not the page locale's. Re-derive it so ar `_few` is not filed as `_other`.
  const count = options.count;
  if (resolved.usedLng && resolved.usedLng !== lng && typeof count === 'number' && translator?.pluralResolver) {
    const suffix = translator.pluralResolver.getSuffix(resolved.usedLng, count, options);
    if (suffix && key.endsWith(suffix)) {
      key = key.slice(0, -suffix.length) + translator.pluralResolver.getSuffix(lng, count, options);
    }
  }
  if (!shouldMarkKey(key, typeof resolved.res === 'string' ? resolved.res : undefined)) return null;
  return { ns: resolved.usedNS, key, lng };
}

export const keyMarkerPostProcessor: TranslatorMarkerRuntime['postProcessor'] = {
  type: 'postProcessor',
  name: KEY_MARKER_NAME,
  process(value, _key, options, translator) {
    if (typeof value !== 'string' || !value) return value;
    const ref = refForCall(options, translator as TranslatorLike | undefined);
    if (!ref) return value;
    const resolved = options.i18nResolved as ResolvedDetails;
    const index = keyRegistry.record(ref, {
      template: typeof resolved.res === 'string' ? resolved.res : undefined,
      params: paramsOf(options),
      count: typeof options.count === 'number' ? options.count : undefined,
      context: typeof options.context === 'string' ? options.context : undefined,
    });
    return appendMarker(value, index);
  },
};

/** Server path (`getServerT`/`ServerTrans`): same index, same codec. */
export function markServerString(value: string, ref: MarkerRef): string {
  if (!value || !shouldMarkKey(ref.key, value)) return value;
  return appendMarker(value, keyRegistry.record(ref));
}

registerTranslatorMarkerRuntime({
  postProcessor: keyMarkerPostProcessor,
  markServerString,
  stripMarkers,
  sentinel: TRANSLATOR_SENTINEL,
});
