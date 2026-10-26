/**
 * Shared MM53 test fixtures: in-memory shards (no JSON imports), a ready model.
 */
import { createMemoryDraftStore, type DraftStore } from '../draftStore';
import { buildKeyTable } from '../keyTable';
import type { LoadedShard } from '../shardSource';
import { WorkbenchModel, type WorkbenchModelOptions } from '../workbenchModel';
import type { PluralCategory } from '../validators';

export function shard(
  locale: string,
  shardPath: string,
  english: Record<string, string>,
  values: Record<string, string> = english,
): LoadedShard {
  return {
    shard: shardPath,
    ns: shardPath.slice(0, shardPath.indexOf('/')),
    file: `i18n/locales/${locale.toLowerCase()}/${shardPath}.json`,
    englishFile: `i18n/locales/en-us/${shardPath}.json`,
    english,
    values,
  };
}

/** A shard with `n` generated keys (`bulk.k00000` …). */
export function bulkShard(locale: string, n: number): LoadedShard {
  const english: Record<string, string> = {};
  for (let i = 0; i < n; i++) english[`bulk.k${String(i).padStart(5, '0')}`] = `English string number ${i}`;
  return shard(locale, 'interface/pages', english);
}

export async function makeModel(
  locale: string,
  shards: LoadedShard[],
  options: Partial<WorkbenchModelOptions> & { categories?: readonly PluralCategory[]; store?: DraftStore } = {},
): Promise<WorkbenchModel> {
  const table = buildKeyTable(locale, shards, options.categories);
  const model = new WorkbenchModel({
    locale,
    table,
    store: options.store ?? createMemoryDraftStore(null),
    ...options,
  });
  await model.init();
  return model;
}
