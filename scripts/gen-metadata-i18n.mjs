#!/usr/bin/env node
/**
 * Regenerates the `metadata.about` block of the English-only
 * `i18n/locales/en-us/interface/metadata.json` shard from
 * `lib/metadata/catalog.json` (a copy of the API's internal/metadata/catalog.json).
 *
 * Everything else in the shard (UI chrome, category titles/summaries) is
 * hand-authored and preserved. Keys follow `lib/metadata/keys.ts`
 * (`about.<Group|_>.<Tag>__<category>`); keep the two functions in sync.
 *
 * Run: node scripts/gen-metadata-i18n.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = join(root, 'lib/metadata/catalog.json');
const shardPath = join(root, 'i18n/locales/en-us/interface/metadata.json');

const sanitize = (s) => s.replace(/[.:\s]+/g, '_');
const aboutKey = (row) => `${row.group ? sanitize(row.group) : '_'}.${sanitize(row.tag)}__${row.category}`;

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const shard = JSON.parse(readFileSync(shardPath, 'utf8'));

const about = {};
for (const row of catalog.tags) {
  const key = aboutKey(row);
  const group = key.slice(0, key.indexOf('.'));
  about[group] ??= {};
  // First row wins when the catalog repeats a (group, tag, category) triple.
  about[group][key.slice(group.length + 1)] ??= row.description;
}
const unknown = shard.metadata.about?.unknown ?? 'Vendor-specific; meaning undocumented';
const unverified = shard.metadata.about?.unverified;
shard.metadata.about = { unknown, ...(unverified ? { unverified } : {}), ...sortKeys(about) };

function sortKeys(o) {
  return Object.fromEntries(
    Object.entries(o)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, typeof v === 'object' ? sortKeys(v) : v]),
  );
}

writeFileSync(shardPath, JSON.stringify(shard, null, 2) + '\n');
console.log(`wrote ${Object.keys(about).length} groups, ${catalog.tags.length} rows -> ${shardPath}`);
