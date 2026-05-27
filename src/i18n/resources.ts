// English (US) namespace bundles are sharded by feature so different parts of
// the codebase can extend translations independently — each Vite-imported JSON
// file owns one or more top-level keys, and we shallow-merge them into the
// final namespace object below.
//
// To register a NEW shard:
//   1. Drop the JSON file into `locales/en-us/{namespace}/<shard>.json`.
//   2. Import it here and add it to the corresponding spread.
//   3. The keys you define become available as `t("interface:yourKey...")`,
//      `t("error:yourKey...")`, etc.
//
// Adding a new LANGUAGE works the same way: create `locales/<code>/{ns}/...`
// shards, mirror the import pattern below, and append a record to
// `supportedLanguages` plus an entry in `resources`.

// --- interface namespace shards ---
import enUsInterfaceCore from "./locales/en-us/interface/_core.json";
import enUsInterfacePages from "./locales/en-us/interface/pages.json";
import enUsInterfaceForms from "./locales/en-us/interface/forms.json";
import enUsInterfacePanels from "./locales/en-us/interface/panels.json";
import enUsInterfaceComponents from "./locales/en-us/interface/components.json";
import enUsInterfaceTools from "./locales/en-us/interface/tools.json";

// --- error namespace shards ---
import enUsErrorCore from "./locales/en-us/error/_core.json";

// --- accessibility namespace shards ---
import enUsAccessibilityCore from "./locales/en-us/accessibility/_core.json";
import enUsAccessibilityComponents from "./locales/en-us/accessibility/components.json";

export interface SupportedLanguage {
  /** BCP-47 style locale code used as the i18next language key. */
  code: string;
  /** Native language label shown in the language selector. */
  label: string;
  /** English description, shown as a tooltip / secondary label. */
  englishLabel: string;
  /** Optional flag emoji or short tag rendered next to the label. */
  flag?: string;
  /** Text direction. Defaults to ltr. */
  dir?: "ltr" | "rtl";
}

export const supportedLanguages: SupportedLanguage[] = [
  { code: "en-US", label: "English", englishLabel: "English", flag: "🇺🇸" },
  // To add a new language: drop interface/error/accessibility shards into
  // locales/<code>/, mirror the import + spread block above, add an entry
  // here, and the picker + i18n stack will register it automatically.
];

export const defaultLanguage = "en-US";

const enUsInterface = {
  ...enUsInterfaceCore,
  ...enUsInterfacePages,
  ...enUsInterfaceForms,
  ...enUsInterfacePanels,
  ...enUsInterfaceComponents,
  ...enUsInterfaceTools,
};

const enUsError = {
  ...enUsErrorCore,
};

const enUsAccessibility = {
  ...enUsAccessibilityCore,
  ...enUsAccessibilityComponents,
};

export const resources = {
  "en-US": {
    interface: enUsInterface,
    error: enUsError,
    accessibility: enUsAccessibility,
  },
} as const;

export type AppResources = (typeof resources)["en-US"];
