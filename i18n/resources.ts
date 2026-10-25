// Namespace bundles are sharded by feature so different parts of the codebase
// can extend translations independently — each imported JSON file owns one or
// more top-level keys, and we shallow-merge them into the final namespace
// object below.
//
// Registration is generated (MM51): the per-locale shard imports live in
// `i18n/generated/resources.generated.ts`, written by `npm run i18n:gen` from
// the rows in `i18n/locales.ts`. To add a LANGUAGE: add its row there, copy
// `locales/en-us/` to `locales/<code-lowercase>/` (minus the English-only
// `interface/metadata.json`), run `npm run i18n:gen`. To add a SHARD: drop the
// JSON into every locale directory and add it to the shard lists in
// `scripts/gen-i18n-registry.mjs`. The `localeParity` test enforces key parity
// and `i18n/generated/registry.test.ts` fails when the generated files are stale.

// Three shards are deliberately NOT imported here, because everything that
// reads them is either a server component or behind a lazy boundary. Importing
// them would put ~144 KB of JSON into the first-load bundle of every route:
//
//   interface/pages.json    (79 KB) — read only by the static views in `views/`,
//                                     which are React Server Components. They go
//                                     through `lib/i18n/server.tsx` instead.
//   interface/articles.json         — long-form blog/tutorial copy, same deal.
//   interface/forms.json    (36 KB) — conversion forms
//   interface/panels.json   (29 KB) — tool panels
//
// The last two are merged in at runtime by `lib/i18n/ensureShard.ts`, awaited
// inside the dynamic import that loads the panel that needs them.

import { locales, defaultLocale, type LocaleDef } from "./locales";

import { defaultEagerShards } from "./generated/resources.generated";
import { buildClientBundle, type ClientBundle } from "./clientBundle";

export type SupportedLanguage = LocaleDef;

/** The picker list — derived from the locale registry, never hand-maintained. */
export const supportedLanguages: SupportedLanguage[] = locales;

export const defaultLanguage = defaultLocale;

/**
 * The resources the client bundle ships: English only (MM51). English is the
 * i18next fallback for every locale and the language of the non-localized
 * routes, so it must be present synchronously everywhere. Every other
 * locale's eager bundle arrives from the server as a `<Providers resources>`
 * prop (see `i18n/localeResources.ts`), which keeps first-load JS flat no
 * matter how many locales `i18n/locales.ts` registers.
 */
export const resources: Record<string, ClientBundle> = {
  [defaultLocale]: buildClientBundle(defaultEagerShards),
};

export type AppResources = ClientBundle;
