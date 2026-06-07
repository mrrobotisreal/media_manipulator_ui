import "i18next";

/**
 * We intentionally avoid binding the full resource shape into i18next's
 * `CustomTypeOptions.resources` field. Doing so makes namespace-prefixed
 * lookups (`t("accessibility:foo.bar")`) trip the TypeScript checker with
 * "type instantiation is excessively deep" errors and forces every call site
 * to use the precise nested key. We trade key-level autocomplete for ergonomic
 * usage across hundreds of components — runtime behavior is unchanged.
 */
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "interface";
    returnNull: false;
  }
}
