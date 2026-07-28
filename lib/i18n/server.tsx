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
 * Only `en-US` exists today (`i18n/resources.ts`). When a second language ships
 * these helpers take a locale argument and the App Router resolves it per
 * request; every call site already passes through `getServerT()`.
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

type Bundle = Record<string, unknown>;

/**
 * Mirrors the shallow-merge in `i18n/resources.ts` — same three namespaces,
 * same shard precedence — so a key resolves identically on both sides.
 */
const NAMESPACES: Record<string, Bundle> = {
  interface: {
    ...interfaceCore,
    ...interfacePages,
    ...interfaceForms,
    ...interfacePanels,
    ...interfaceComponents,
    ...interfaceTools,
  },
  error: { ...errorCore },
  accessibility: { ...accessibilityCore, ...accessibilityComponents },
};

const DEFAULT_NAMESPACE = 'interface';

/** Resolve `"interface:a.b.c"` or `"a.b.c"` against the bundles above. */
function lookup(key: string, defaultNamespace: string): unknown {
  const colon = key.indexOf(':');
  const namespace = colon === -1 ? defaultNamespace : key.slice(0, colon);
  const path = colon === -1 ? key : key.slice(colon + 1);

  let node: unknown = NAMESPACES[namespace];
  for (const segment of path.split('.')) {
    if (node === null || typeof node !== 'object') return undefined;
    node = (node as Bundle)[segment];
  }
  return node;
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
export function getServerT(defaultNamespace: string = DEFAULT_NAMESPACE): ServerT {
  function t(
    key: string,
    options?: { returnObjects?: true; values?: Record<string, string | number> },
  ): string | unknown {
    const value = lookup(key, defaultNamespace);
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
}

/**
 * Server-component stand-in for react-i18next's `<Trans>`, supporting the props
 * the static views actually pass. Same source strings, same component maps.
 */
export function ServerTrans({ i18nKey, defaults, components = {}, values }: ServerTransProps) {
  const raw = defaults ?? (i18nKey ? lookup(i18nKey, DEFAULT_NAMESPACE) : undefined);
  const source = typeof raw === 'string' ? raw : (i18nKey ?? '');
  return <>{renderRich(interpolate(source, values), components)}</>;
}

export default getServerT;
