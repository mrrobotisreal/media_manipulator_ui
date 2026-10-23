import { describe, expect, it } from 'vitest';
import { buildRaw } from './raw';
import type { MetadataEntry } from './types';

const e = (group: string, tag: string, value: MetadataEntry['value'], id = `${group}:${tag}`): MetadataEntry => ({
  id,
  group,
  tag,
  value,
  category: 'other',
});

describe('buildRaw', () => {
  it('splits exiftool and synthetic groups and keeps duplicates', () => {
    const raw = buildRaw([
      e('IFD0', 'ModifyDate', 'a'),
      e('IFD0', 'ModifyDate', 'b', 'IFD0:ModifyDate#2'),
      e('Format', 'duration', '1.0'),
      e('Stream:0', 'codec_name', 'h264'),
    ]);
    expect(raw.exiftool).toEqual({ IFD0: { ModifyDate: 'a', 'ModifyDate#2': 'b' } });
    expect(Object.keys(raw.ffprobe)).toEqual(['Format', 'Stream:0']);
  });
});
