/**
 * The translator locale's full shard set (MM53), loaded lazily inside the
 * workbench chunk.
 *
 * TRANSLATOR DEPLOYMENTS ONLY. The client i18next store holds only English plus
 * the page locale's eager shards (MM51); `pages`/`articles` never reach the
 * browser and `forms`/`panels` arrive lazily. The workbench needs every key of
 * the locale (All keys, server-rendered text, the registry key table that
 * resolves server markers), so it loads the shards itself through the generated
 * `translatorShards.generated.ts` loaders. Only this module imports them, and
 * only the guarded workbench chunk imports this module.
 */
import { TRANSLATOR_SHARD_LOADERS, TRANSLATOR_SHARD_PATHS } from '@/i18n/generated/translatorShards.generated';
import { defaultLocale } from '@/i18n/locales';

export interface LoadedShard {
  /** `interface/pages` */
  shard: string;
  /** i18next namespace the shard merges into (`interface`, `error`, `accessibility`). */
  ns: string;
  /** Repo path of the locale's file: `i18n/locales/ar-sa/interface/pages.json`. */
  file: string;
  /** Repo path of the English source file. */
  englishFile: string;
  /** dotted key -> string value (non-string leaves skipped). */
  values: Record<string, string>;
  english: Record<string, string>;
}

/** `ar-SA` -> `i18n/locales/ar-sa/interface/pages.json` */
export function shardFilePath(locale: string, shard: string): string {
  return `i18n/locales/${locale.toLowerCase()}/${shard}.json`;
}

/** Every string leaf of a shard as `dotted.path -> value` (array items as `.N`). */
export function flattenStrings(tree: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (node: unknown, path: string) => {
    if (typeof node === 'string') {
      if (path) out[path] = node;
    } else if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, path ? `${path}.${i}` : String(i)));
    } else if (node !== null && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) walk(v, path ? `${path}.${k}` : k);
    }
  };
  walk(tree, '');
  return out;
}

export type ShardLoaderMap = Record<string, Record<string, () => Promise<{ default: unknown }>>>;

/** Loads `locale` and English for every editable shard. Rejects if any shard fails. */
export async function loadTranslatorShards(
  locale: string,
  loaders: ShardLoaderMap = TRANSLATOR_SHARD_LOADERS,
  shardPaths: readonly string[] = TRANSLATOR_SHARD_PATHS,
): Promise<LoadedShard[]> {
  const target = loaders[locale];
  const english = loaders[defaultLocale];
  if (!target || !english) throw new Error(`no translator shards for ${locale}`);
  return Promise.all(
    shardPaths.map(async (shard) => {
      const [mine, en] = await Promise.all([target[shard](), english[shard]()]);
      return {
        shard,
        ns: shard.slice(0, shard.indexOf('/')),
        file: shardFilePath(locale, shard),
        englishFile: shardFilePath(defaultLocale, shard),
        values: flattenStrings(mine.default),
        english: flattenStrings(en.default),
      };
    }),
  );
}
