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
 * Registration: every language in `i18n/locales.ts` needs its full 9-shard
 * bundle imported and spread here; untranslated locales are byte-copies of
 * en-US until their dedicated translation session. The `localeParity` test
 * enforces key parity across all of them.
 */
import React, { cloneElement, type ReactElement, type ReactNode } from 'react';

import interfaceCore from '@/i18n/locales/en-us/interface/_core.json';
import interfacePages from '@/i18n/locales/en-us/interface/pages.json';
import interfaceForms from '@/i18n/locales/en-us/interface/forms.json';
import interfacePanels from '@/i18n/locales/en-us/interface/panels.json';
import interfaceComponents from '@/i18n/locales/en-us/interface/components.json';
import interfaceTools from '@/i18n/locales/en-us/interface/tools.json';
import errorCore from '@/i18n/locales/en-us/error/_core.json';
import accessibilityCore from '@/i18n/locales/en-us/accessibility/_core.json';
import accessibilityComponents from '@/i18n/locales/en-us/accessibility/components.json';

import ruInterfaceCore from '@/i18n/locales/ru-ru/interface/_core.json';
import ruInterfacePages from '@/i18n/locales/ru-ru/interface/pages.json';
import ruInterfaceForms from '@/i18n/locales/ru-ru/interface/forms.json';
import ruInterfacePanels from '@/i18n/locales/ru-ru/interface/panels.json';
import ruInterfaceComponents from '@/i18n/locales/ru-ru/interface/components.json';
import ruInterfaceTools from '@/i18n/locales/ru-ru/interface/tools.json';
import ruErrorCore from '@/i18n/locales/ru-ru/error/_core.json';
import ruAccessibilityCore from '@/i18n/locales/ru-ru/accessibility/_core.json';
import ruAccessibilityComponents from '@/i18n/locales/ru-ru/accessibility/components.json';

import ukInterfaceCore from '@/i18n/locales/uk-ua/interface/_core.json';
import ukInterfacePages from '@/i18n/locales/uk-ua/interface/pages.json';
import ukInterfaceForms from '@/i18n/locales/uk-ua/interface/forms.json';
import ukInterfacePanels from '@/i18n/locales/uk-ua/interface/panels.json';
import ukInterfaceComponents from '@/i18n/locales/uk-ua/interface/components.json';
import ukInterfaceTools from '@/i18n/locales/uk-ua/interface/tools.json';
import ukErrorCore from '@/i18n/locales/uk-ua/error/_core.json';
import ukAccessibilityCore from '@/i18n/locales/uk-ua/accessibility/_core.json';
import ukAccessibilityComponents from '@/i18n/locales/uk-ua/accessibility/components.json';

import heInterfaceCore from '@/i18n/locales/he-il/interface/_core.json';
import heInterfacePages from '@/i18n/locales/he-il/interface/pages.json';
import heInterfaceForms from '@/i18n/locales/he-il/interface/forms.json';
import heInterfacePanels from '@/i18n/locales/he-il/interface/panels.json';
import heInterfaceComponents from '@/i18n/locales/he-il/interface/components.json';
import heInterfaceTools from '@/i18n/locales/he-il/interface/tools.json';
import heErrorCore from '@/i18n/locales/he-il/error/_core.json';
import heAccessibilityCore from '@/i18n/locales/he-il/accessibility/_core.json';
import heAccessibilityComponents from '@/i18n/locales/he-il/accessibility/components.json';

import deInterfaceCore from '@/i18n/locales/de-de/interface/_core.json';
import deInterfacePages from '@/i18n/locales/de-de/interface/pages.json';
import deInterfaceForms from '@/i18n/locales/de-de/interface/forms.json';
import deInterfacePanels from '@/i18n/locales/de-de/interface/panels.json';
import deInterfaceComponents from '@/i18n/locales/de-de/interface/components.json';
import deInterfaceTools from '@/i18n/locales/de-de/interface/tools.json';
import deErrorCore from '@/i18n/locales/de-de/error/_core.json';
import deAccessibilityCore from '@/i18n/locales/de-de/accessibility/_core.json';
import deAccessibilityComponents from '@/i18n/locales/de-de/accessibility/components.json';

import esInterfaceCore from '@/i18n/locales/es-es/interface/_core.json';
import esInterfacePages from '@/i18n/locales/es-es/interface/pages.json';
import esInterfaceForms from '@/i18n/locales/es-es/interface/forms.json';
import esInterfacePanels from '@/i18n/locales/es-es/interface/panels.json';
import esInterfaceComponents from '@/i18n/locales/es-es/interface/components.json';
import esInterfaceTools from '@/i18n/locales/es-es/interface/tools.json';
import esErrorCore from '@/i18n/locales/es-es/error/_core.json';
import esAccessibilityCore from '@/i18n/locales/es-es/accessibility/_core.json';
import esAccessibilityComponents from '@/i18n/locales/es-es/accessibility/components.json';

type Bundle = Record<string, unknown>;

const DEFAULT_LOCALE = 'en-US';

/**
 * Builds one language's namespace map. Mirrors the shallow-merge in
 * `i18n/resources.ts` — same three namespaces, same shard precedence — so a
 * key resolves identically on both sides (plus the server-only `pages`,
 * `forms`, `panels` shards merged into `interface`).
 */
function language(
  core: Bundle,
  pages: Bundle,
  forms: Bundle,
  panels: Bundle,
  components: Bundle,
  tools: Bundle,
  error: Bundle,
  a11yCore: Bundle,
  a11yComponents: Bundle,
): Record<string, Bundle> {
  return {
    interface: { ...core, ...pages, ...forms, ...panels, ...components, ...tools },
    error: { ...error },
    accessibility: { ...a11yCore, ...a11yComponents },
  };
}

const LOCALES: Record<string, Record<string, Bundle>> = {
  'en-US': language(
    interfaceCore,
    interfacePages,
    interfaceForms,
    interfacePanels,
    interfaceComponents,
    interfaceTools,
    errorCore,
    accessibilityCore,
    accessibilityComponents,
  ),
  'ru-RU': language(
    ruInterfaceCore,
    ruInterfacePages,
    ruInterfaceForms,
    ruInterfacePanels,
    ruInterfaceComponents,
    ruInterfaceTools,
    ruErrorCore,
    ruAccessibilityCore,
    ruAccessibilityComponents,
  ),
  'uk-UA': language(
    ukInterfaceCore,
    ukInterfacePages,
    ukInterfaceForms,
    ukInterfacePanels,
    ukInterfaceComponents,
    ukInterfaceTools,
    ukErrorCore,
    ukAccessibilityCore,
    ukAccessibilityComponents,
  ),
  'he-IL': language(
    heInterfaceCore,
    heInterfacePages,
    heInterfaceForms,
    heInterfacePanels,
    heInterfaceComponents,
    heInterfaceTools,
    heErrorCore,
    heAccessibilityCore,
    heAccessibilityComponents,
  ),
  'de-DE': language(
    deInterfaceCore,
    deInterfacePages,
    deInterfaceForms,
    deInterfacePanels,
    deInterfaceComponents,
    deInterfaceTools,
    deErrorCore,
    deAccessibilityCore,
    deAccessibilityComponents,
  ),
  'es-ES': language(
    esInterfaceCore,
    esInterfacePages,
    esInterfaceForms,
    esInterfacePanels,
    esInterfaceComponents,
    esInterfaceTools,
    esErrorCore,
    esAccessibilityCore,
    esAccessibilityComponents,
  ),
};

const DEFAULT_NAMESPACE = 'interface';

function lookupIn(namespaces: Record<string, Bundle> | undefined, namespace: string, path: string): unknown {
  let node: unknown = namespaces?.[namespace];
  for (const segment of path.split('.')) {
    if (node === null || typeof node !== 'object') return undefined;
    node = (node as Bundle)[segment];
  }
  return node;
}

/** Resolve `"interface:a.b.c"` or `"a.b.c"` for `locale`, en-US as fallback. */
function lookup(key: string, defaultNamespace: string, locale: string = DEFAULT_LOCALE): unknown {
  const colon = key.indexOf(':');
  const namespace = colon === -1 ? defaultNamespace : key.slice(0, colon);
  const path = colon === -1 ? key : key.slice(colon + 1);

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
  function t(
    key: string,
    options?: { returnObjects?: true; values?: Record<string, string | number> },
  ): string | unknown {
    const value = lookup(key, defaultNamespace, locale);
    if (options?.returnObjects) return value ?? [];
    if (typeof value === 'string') return interpolate(value, options?.values);
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
  return <>{renderRich(interpolate(source, values), components)}</>;
}

export default getServerT;
