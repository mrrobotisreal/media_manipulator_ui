import { vi } from 'vitest';
import en from '@/i18n/locales/en-us/interface/metadata.json';
import type { MetadataDocument, MetadataEntry } from '@/lib/metadata/types';

/** Test-only `useLocalization` backed by the real English metadata shard. */
export function mockLocalization() {
  const lookup = (key: string) =>
    key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], { metadata: en.metadata });
  const t = (key: string, opts?: Record<string, unknown>) => {
    let found = lookup(key);
    if (found === undefined && typeof opts?.count === 'number') {
      found = lookup(`${key}_${opts.count === 1 ? 'one' : 'other'}`);
    }
    const text = typeof found === 'string' ? found : typeof opts?.defaultValue === 'string' ? opts.defaultValue : key;
    return text.replace(/\{\{(\w+)\}\}/g, (_, k: string) => String(opts?.[k] ?? ''));
  };
  return { t, language: { code: 'en-US' } };
}

export const useLocalizationMock = () => mockLocalization();
export const ensureShardMock = () => ({ ensureMetadataShard: vi.fn(() => Promise.resolve()) });

const e = (group: string, tag: string, value: MetadataEntry['value'], category: string, extra: Partial<MetadataEntry> = {}): MetadataEntry => ({
  id: `${group}:${tag}`,
  group,
  tag,
  value,
  category,
  ...extra,
});

/** Realistic phone-JPEG document, shaped like real exiftool -G1 output (System group, not File). */
export function photoDocument(): MetadataDocument {
  return {
    schemaVersion: 1,
    file: { name: 'IMG_0001.jpg', sizeBytes: 2202009, mime: 'image/jpeg', kind: 'image', sha256: 'ab', modificationTime: '2026-10-01T09:15:00Z' },
    tools: ['exiftool 12.76'],
    warnings: [],
    entries: [
      e('System', 'FileName', 'IMG_0001.jpg', 'file', { privacy: 'identity' }),
      e('System', 'FileSize', '2.1 MB', 'file'),
      e('System', 'FileModifyDate', '2026:10:01 09:15:00+00:00', 'file'),
      e('File', 'FileType', 'JPEG', 'file'),
      e('IFD0', 'Make', 'Apple', 'image', { privacy: 'device' }),
      e('IFD0', 'Model', 'iPhone 15 Pro', 'image', { privacy: 'device' }),
      e('IFD0', 'Software', '17.4.1', 'image', { privacy: 'identity' }),
      e('IFD0', 'ModifyDate', '2026:09:30 18:42:11', 'image'),
      e('ExifIFD', 'ExposureTime', '1/120', 'camera', { rawValue: 0.00833 }),
      e('ExifIFD', 'FNumber', 1.8, 'camera'),
      e('ExifIFD', 'ISO', 80, 'camera'),
      e('ExifIFD', 'DateTimeOriginal', '2026:09:30 18:42:10', 'camera', { privacy: 'identity' }),
      e('ExifIFD', 'BodySerialNumber', 'F2LXXXXXXXX', 'camera', { privacy: 'device' }),
      e('GPS', 'GPSLatitude', '37 deg 46\' 29.90" N', 'gps', { privacy: 'location', rawValue: 37.774972 }),
      e('GPS', 'GPSLongitude', '122 deg 25\' 9.90" W', 'gps', { privacy: 'location', rawValue: -122.419417 }),
      e('GPS', 'GPSAltitude', '16.2 m', 'gps', { privacy: 'location' }),
      e('Nikon', 'ZzzVendorOnly', '42', 'makernote'),
      e('IFD1', 'ThumbnailImage', { bytes: 12698 }, 'thumbnail', { binary: true, privacy: 'history' }),
      e('Composite', 'ImageSize', '4032x3024', 'composite'),
    ],
  };
}

/** Synthetic document with `n` entries spread over several categories; `big` goes to `bigCategory`. */
export function syntheticDocument(n: number, bigCategory = 'makernote'): MetadataDocument {
  const entries: MetadataEntry[] = [
    e('System', 'FileName', 'big.jpg', 'file'),
    e('ExifIFD', 'ISO', 100, 'camera', { privacy: 'device' }),
    e('GPS', 'GPSLatitude', '1', 'gps', { privacy: 'location', rawValue: 1 }),
    e('GPS', 'GPSLongitude', '2', 'gps', { privacy: 'location', rawValue: 2 }),
  ];
  for (let i = 0; entries.length < n; i++) {
    entries.push(e('Canon', `MakerTag${i}`, `value-${i}`, bigCategory, i % 50 === 0 ? { privacy: 'identity' } : {}));
  }
  return { schemaVersion: 1, file: { name: 'big.jpg', sizeBytes: 1, mime: 'image/jpeg', kind: 'image' }, tools: [], warnings: [], entries };
}
