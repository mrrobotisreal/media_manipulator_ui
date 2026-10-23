/**
 * Rebuilds exiftool-shaped JSON (`{ "Group": { "Tag": value } }`) from entries for
 * the Raw view. Synthetic ffprobe groups (Format, Stream:n, Chapter:n, SideData)
 * go to a second object. Duplicate ids (`#2`) get a `#2` key suffix so nothing is
 * lost.
 */
import type { MetadataEntry, MetadataValue } from './types';

const SYNTHETIC = /^(Format|SideData|Stream:\d+|Chapter:\d+)$/;

export function isSyntheticGroup(group: string): boolean {
  return SYNTHETIC.test(group);
}

export function buildRaw(entries: readonly MetadataEntry[]): {
  exiftool: Record<string, Record<string, MetadataValue>>;
  ffprobe: Record<string, Record<string, MetadataValue>>;
} {
  const exiftool: Record<string, Record<string, MetadataValue>> = {};
  const ffprobe: Record<string, Record<string, MetadataValue>> = {};
  for (const e of entries) {
    const target = isSyntheticGroup(e.group) ? ffprobe : exiftool;
    const bucket = (target[e.group] ??= {});
    const dup = /#(\d+)$/.exec(e.id);
    bucket[dup ? `${e.tag}#${dup[1]}` : e.tag] = e.value;
  }
  return { exiftool, ffprobe };
}
