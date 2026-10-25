/**
 * Server-side translation access for React Server Components.
 *
 * ⚠️ SERVER COMPONENTS ONLY. Importing this from a `'use client'` module drags
 * every locale shard — including the 79 KB `pages.json` — back into a client
 * chunk, which is exactly what this module exists to prevent. Client code keeps
 * using `useLocalization()` / `i18n/index.ts`.
 *
 * The static views (about, how-it-works, tutorials, blog, legal, 404) render
 * pure copy. Reading the locale JSON directly at build time lets them be server
 * components: no i18next runtime, no react-i18next, no locale payload shipped
 * to the browser, and the prerendered HTML still contains real translated text
 * for crawlers.
 *
 * Locale resolution: pages resolve the `[lang]` URL segment to a locale code
 * (see `lib/i18n/routeLocale.ts`) and pass it down to `getServerT(ns, locale)`
 * / `<ServerTrans locale=…>`. No argument means en-US. A key missing from a
 * locale falls back to the en-US string, the same net behavior as i18next's
 * `fallbackLng`.
 *
 * Registration: every language in `i18n/locales.ts` gets its full 10-shard
 * bundle from `i18n/generated/serverBundles.generated.ts`, written by
 * `npm run i18n:gen` (`interface/articles.json` is server-only — long-form
 * blog/tutorial copy that must never enter `i18n/resources.ts`); untranslated
 * locales are byte-copies of en-US until their dedicated translation session.
 * The `localeParity` test enforces key parity across all of them.
 */
import React, { cloneElement, type ReactElement, type ReactNode } from 'react';

import { locales } from '@/i18n/locales';
import { serverShards } from '@/i18n/generated/serverBundles.generated';
import { loadTranslatorMarkerRuntime, type TranslatorMarkerRuntime } from '@/lib/translator/mode';

type Bundle = Record<string, unknown>;

const DEFAULT_LOCALE = 'en-US';

/**
 * Builds one language's namespace map. Mirrors the shallow-merge in
 * `i18n/resources.ts` — same three namespaces, same shard precedence — so a
 * key resolves identically on both sides (plus the server-only `pages`,
 * `forms`, `panels`, `articles` shards merged into `interface`).
 */
function language(shards: Record<string, Bundle>): Record<string, Bundle> {
  return {
    interface: {
      ...shards['interface/_core'],
      ...shards['interface/pages'],
      ...shards['interface/forms'],
      ...shards['interface/panels'],
      ...shards['interface/components'],
      ...shards['interface/tools'],
      ...shards['interface/articles'],
    },
    error: { ...shards['error/_core'] },
    accessibility: { ...shards['accessibility/_core'], ...shards['accessibility/components'] },
  };
}

const LOCALES: Record<string, Record<string, Bundle>> = Object.fromEntries(
  locales.map((l) => [l.code, language(serverShards[l.code])]),
);

const DEFAULT_NAMESPACE = 'interface';

function lookupIn(namespaces: Record<string, Bundle> | undefined, namespace: string, path: string): unknown {
  let node: unknown = namespaces?.[namespace];
  for (const segment of path.split('.')) {
    if (node === null || typeof node !== 'object') return undefined;
    node = (node as Bundle)[segment];
  }
  return node;
}

/** `"interface:a.b.c"` or `"a.b.c"` -> namespace + dotted path. */
function splitKey(key: string, defaultNamespace: string): { namespace: string; path: string } {
  const colon = key.indexOf(':');
  return colon === -1
    ? { namespace: defaultNamespace, path: key }
    : { namespace: key.slice(0, colon), path: key.slice(colon + 1) };
}

/** Resolve `"interface:a.b.c"` or `"a.b.c"` for `locale`, en-US as fallback. */
function lookup(key: string, defaultNamespace: string, locale: string = DEFAULT_LOCALE): unknown {
  const { namespace, path } = splitKey(key, defaultNamespace);

  const localized = lookupIn(LOCALES[locale], namespace, path);
  if (localized !== undefined) return localized;
  if (locale === DEFAULT_LOCALE) return undefined;
  return lookupIn(LOCALES[DEFAULT_LOCALE], namespace, path);
}

/** `{{name}}` interpolation, matching i18next's default delimiters. */
function interpolate(text: string, values?: Record<string, string | number>): string {
  if (!values) return text;
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}

/**
 * Translator deployments only (MM52, design §2.9): the zero-width key marker for
 * a server-rendered string, so the DOM scanner can map it to its key exactly as
 * it maps client `t()` output. The marker is content-derived (namespace +
 * resolved key + page locale), so a string rendered here and by a client
 * component's `t()` carries the same one. `null` in production (folds away).
 */
function markerRuntime(): TranslatorMarkerRuntime | null {
  return loadTranslatorMarkerRuntime();
}

/** Every string leaf of a `returnObjects` result, marked with its own dotted key. Copies; never mutates the bundle. */
function markTree(
  value: unknown,
  runtime: TranslatorMarkerRuntime,
  ns: string,
  path: string,
  locale: string,
): unknown {
  if (typeof value === 'string') return runtime.markServerString(value, { ns, key: path, lng: locale });
  if (Array.isArray(value)) return value.map((v, i) => markTree(v, runtime, ns, `${path}.${i}`, locale));
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, markTree(v, runtime, ns, `${path}.${k}`, locale)]),
    );
  }
  return value;
}

export interface ServerT {
  (key: string): string;
  (key: string, options: { returnObjects: true }): unknown;
  (key: string, options: { values: Record<string, string | number> }): string;
}

/**
 * Returns a `t` with the subset of the i18next signature the static views use:
 * plain lookup, `{ returnObjects: true }` for arrays/objects, and `{{}}`
 * interpolation. A missing key returns the key itself, exactly as i18next does,
 * so a typo is visible in the HTML rather than rendering blank.
 */
export function getServerT(
  defaultNamespace: string = DEFAULT_NAMESPACE,
  locale: string = DEFAULT_LOCALE,
): ServerT {
  return buildServerT(defaultNamespace, locale, markerRuntime());
}

/**
 * `getServerT` that NEVER carries translator key markers. For `generateMetadata`
 * only: `<title>`, `<meta>` and Open Graph text must stay clean in the HTML on
 * translator deployments too (MM52 decision 6). Identical to `getServerT` in
 * production.
 */
export function getServerMetadataT(
  defaultNamespace: string = DEFAULT_NAMESPACE,
  locale: string = DEFAULT_LOCALE,
): ServerT {
  return buildServerT(defaultNamespace, locale, null);
}

function buildServerT(
  defaultNamespace: string,
  locale: string,
  runtime: TranslatorMarkerRuntime | null,
): ServerT {
  function t(
    key: string,
    options?: { returnObjects?: true; values?: Record<string, string | number> },
  ): string | unknown {
    const value = lookup(key, defaultNamespace, locale);
    if (options?.returnObjects) {
      if (value === undefined) return [];
      if (!runtime) return value;
      const { namespace, path } = splitKey(key, defaultNamespace);
      return markTree(value, runtime, namespace, path, locale);
    }
    if (typeof value === 'string') {
      const text = interpolate(value, options?.values);
      if (!runtime) return text;
      const { namespace, path } = splitKey(key, defaultNamespace);
      return runtime.markServerString(text, { ns: namespace, key: path, lng: locale });
    }
    return key;
  }
  return t as ServerT;
}

/** Convenience `t` bound to the `interface` namespace. */
export const serverT = getServerT();

type ComponentMap = Record<string, ReactElement>;

interface Frame {
  name: string | null;
  children: ReactNode[];
}

/**
 * Renders i18next-style rich text — `"built by <strong>CreaTV Ltd.</strong>"` —
 * by substituting each named tag with the element supplied in `components`.
 *
 * A tag with no matching entry stays literal text, so a stray `<br>` in copy
 * cannot silently disappear. Nesting is supported; unbalanced markup degrades
 * to text rather than throwing during a page render.
 */
function renderRich(source: string, components: ComponentMap): ReactNode {
  const stack: Frame[] = [{ name: null, children: [] }];
  const token = /<(\/?)([A-Za-z][A-Za-z0-9_-]*)>/g;
  let cursor = 0;
  let keySeed = 0;
  let match: RegExpExecArray | null;

  const top = () => stack[stack.length - 1];

  while ((match = token.exec(source)) !== null) {
    const [full, closing, name] = match;
    if (!(name in components)) continue;
    if (closing && top().name !== name) continue;

    if (match.index > cursor) top().children.push(source.slice(cursor, match.index));
    cursor = match.index + full.length;

    if (closing) {
      const frame = stack.pop() as Frame;
      top().children.push(
        cloneElement(components[name], { key: `rich-${keySeed++}` }, ...frame.children),
      );
    } else {
      stack.push({ name, children: [] });
    }
  }

  if (cursor < source.length) top().children.push(source.slice(cursor));

  // Any frame still open means unbalanced markup; flatten it into the parent.
  while (stack.length > 1) {
    const frame = stack.pop() as Frame;
    top().children.push(...frame.children);
  }

  return stack[0].children;
}

export interface ServerTransProps {
  /** `"interface:about.intro"`, or any key — ignored when `defaults` is set. */
  i18nKey?: string;
  /** A literal source string, for copy that already came out of an array. */
  defaults?: string;
  /** Maps tag names in the source string to elements, as in react-i18next. */
  components?: ComponentMap;
  /** `{{name}}` interpolation values. */
  values?: Record<string, string | number>;
  /** Locale for `i18nKey` lookup (`defaults` is already localized). */
  locale?: string;
}

/**
 * Server-component stand-in for react-i18next's `<Trans>`, supporting the props
 * the static views actually pass. Same source strings, same component maps.
 */
export function ServerTrans({ i18nKey, defaults, components = {}, values, locale }: ServerTransProps) {
  const raw = defaults ?? (i18nKey ? lookup(i18nKey, DEFAULT_NAMESPACE, locale) : undefined);
  const source = typeof raw === 'string' ? raw : (i18nKey ?? '');
  let text = interpolate(source, values);
  // Translator deployments: one marker per rich string, appended to the source
  // so it lands in the last text node (`defaults` came from a `returnObjects`
  // lookup and already carries its leaf's marker).
  const runtime = defaults === undefined && i18nKey && typeof raw === 'string' ? markerRuntime() : null;
  if (runtime && i18nKey) {
    const { namespace, path } = splitKey(i18nKey, DEFAULT_NAMESPACE);
    text = runtime.markServerString(text, { ns: namespace, key: path, lng: locale ?? DEFAULT_LOCALE });
  }
  return <>{renderRich(text, components)}</>;
}

export default getServerT;
