// Namespace bundles are sharded by feature so different parts of the codebase
// can extend translations independently — each imported JSON file owns one or
// more top-level keys, and we shallow-merge them into the final namespace
// object below.
//
// To register a NEW shard:
//   1. Drop the JSON file into `locales/<code-lowercase>/{namespace}/<shard>.json`
//      for EVERY language listed in `i18n/locales.ts`.
//   2. Import it here and add it to the corresponding spread.
//   3. The keys you define become available as `t("interface:yourKey...")`,
//      `t("error:yourKey...")`, etc.
//
// Adding a new LANGUAGE: add its row to `i18n/locales.ts` (single source of
// truth for codes/prefixes/dir/translated), create its `locales/<code>/` shard
// files, mirror the import + spread pattern below, and register its lazy
// forms/panels loaders in `lib/i18n/ensureShard.ts` plus its full bundle in
// `lib/i18n/server.tsx`. The `localeParity` test enforces key parity.

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

// --- interface namespace shards ---
import enUsInterfaceCore from "./locales/en-us/interface/_core.json";
import enUsInterfaceComponents from "./locales/en-us/interface/components.json";
import enUsInterfaceTools from "./locales/en-us/interface/tools.json";
import ruRuInterfaceCore from "./locales/ru-ru/interface/_core.json";
import ruRuInterfaceComponents from "./locales/ru-ru/interface/components.json";
import ruRuInterfaceTools from "./locales/ru-ru/interface/tools.json";
import ukUaInterfaceCore from "./locales/uk-ua/interface/_core.json";
import ukUaInterfaceComponents from "./locales/uk-ua/interface/components.json";
import ukUaInterfaceTools from "./locales/uk-ua/interface/tools.json";
import heIlInterfaceCore from "./locales/he-il/interface/_core.json";
import heIlInterfaceComponents from "./locales/he-il/interface/components.json";
import heIlInterfaceTools from "./locales/he-il/interface/tools.json";
import deDeInterfaceCore from "./locales/de-de/interface/_core.json";
import deDeInterfaceComponents from "./locales/de-de/interface/components.json";
import deDeInterfaceTools from "./locales/de-de/interface/tools.json";
import esEsInterfaceCore from "./locales/es-es/interface/_core.json";
import esEsInterfaceComponents from "./locales/es-es/interface/components.json";
import esEsInterfaceTools from "./locales/es-es/interface/tools.json";

// --- error namespace shards ---
import enUsErrorCore from "./locales/en-us/error/_core.json";
import ruRuErrorCore from "./locales/ru-ru/error/_core.json";
import ukUaErrorCore from "./locales/uk-ua/error/_core.json";
import heIlErrorCore from "./locales/he-il/error/_core.json";
import deDeErrorCore from "./locales/de-de/error/_core.json";
import esEsErrorCore from "./locales/es-es/error/_core.json";

// --- accessibility namespace shards ---
import enUsAccessibilityCore from "./locales/en-us/accessibility/_core.json";
import enUsAccessibilityComponents from "./locales/en-us/accessibility/components.json";
import ruRuAccessibilityCore from "./locales/ru-ru/accessibility/_core.json";
import ruRuAccessibilityComponents from "./locales/ru-ru/accessibility/components.json";
import ukUaAccessibilityCore from "./locales/uk-ua/accessibility/_core.json";
import ukUaAccessibilityComponents from "./locales/uk-ua/accessibility/components.json";
import heIlAccessibilityCore from "./locales/he-il/accessibility/_core.json";
import heIlAccessibilityComponents from "./locales/he-il/accessibility/components.json";
import deDeAccessibilityCore from "./locales/de-de/accessibility/_core.json";
import deDeAccessibilityComponents from "./locales/de-de/accessibility/components.json";
import esEsAccessibilityCore from "./locales/es-es/accessibility/_core.json";
import esEsAccessibilityComponents from "./locales/es-es/accessibility/components.json";

export type SupportedLanguage = LocaleDef;

/** The picker list — derived from the locale registry, never hand-maintained. */
export const supportedLanguages: SupportedLanguage[] = locales;

export const defaultLanguage = defaultLocale;

const bundle = (
  core: Record<string, unknown>,
  components: Record<string, unknown>,
  tools: Record<string, unknown>,
  error: Record<string, unknown>,
  a11yCore: Record<string, unknown>,
  a11yComponents: Record<string, unknown>,
) => ({
  interface: { ...core, ...components, ...tools },
  error: { ...error },
  accessibility: { ...a11yCore, ...a11yComponents },
});

export const resources = {
  "en-US": bundle(
    enUsInterfaceCore,
    enUsInterfaceComponents,
    enUsInterfaceTools,
    enUsErrorCore,
    enUsAccessibilityCore,
    enUsAccessibilityComponents,
  ),
  "ru-RU": bundle(
    ruRuInterfaceCore,
    ruRuInterfaceComponents,
    ruRuInterfaceTools,
    ruRuErrorCore,
    ruRuAccessibilityCore,
    ruRuAccessibilityComponents,
  ),
  "uk-UA": bundle(
    ukUaInterfaceCore,
    ukUaInterfaceComponents,
    ukUaInterfaceTools,
    ukUaErrorCore,
    ukUaAccessibilityCore,
    ukUaAccessibilityComponents,
  ),
  "he-IL": bundle(
    heIlInterfaceCore,
    heIlInterfaceComponents,
    heIlInterfaceTools,
    heIlErrorCore,
    heIlAccessibilityCore,
    heIlAccessibilityComponents,
  ),
  "de-DE": bundle(
    deDeInterfaceCore,
    deDeInterfaceComponents,
    deDeInterfaceTools,
    deDeErrorCore,
    deDeAccessibilityCore,
    deDeAccessibilityComponents,
  ),
  "es-ES": bundle(
    esEsInterfaceCore,
    esEsInterfaceComponents,
    esEsInterfaceTools,
    esEsErrorCore,
    esEsAccessibilityCore,
    esEsAccessibilityComponents,
  ),
} as const;

export type AppResources = (typeof resources)["en-US"];
