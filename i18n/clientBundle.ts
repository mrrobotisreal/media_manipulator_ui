/**
 * The shallow-merge that turns one locale's client-eager shards into its
 * i18next namespaces. Shared by `i18n/resources.ts` (English, bundled into
 * the client) and `i18n/localeResources.ts` (every other locale, built on the
 * server and handed to the client as a layout prop), so both produce the same
 * shape with the same shard precedence. Dependency-free.
 */
export type ShardSet = Record<string, Record<string, unknown>>;

export type ClientBundle = {
  interface: Record<string, unknown>;
  error: Record<string, unknown>;
  accessibility: Record<string, unknown>;
};

export function buildClientBundle(shards: ShardSet): ClientBundle {
  return {
    interface: {
      ...shards["interface/_core"],
      ...shards["interface/components"],
      ...shards["interface/tools"],
    },
    error: { ...shards["error/_core"] },
    accessibility: {
      ...shards["accessibility/_core"],
      ...shards["accessibility/components"],
    },
  };
}
