import { describe, expect, it } from 'vitest';
import { parseHash, serializeHash } from './hash';

describe('hash state', () => {
  it('parses open sections and filters', () => {
    expect(parseHash('#meta=gps,camera&mf=location,bogus')).toEqual({ open: ['gps', 'camera'], filters: ['location'] });
  });
  it('distinguishes absent meta from empty meta', () => {
    expect(parseHash('').open).toBeNull();
    expect(parseHash('#meta=').open).toEqual([]);
  });
  it('drops malformed ids', () => {
    expect(parseHash('#meta=gps,<script>,x y').open).toEqual(['gps']);
  });
  it('round-trips', () => {
    const s = { open: ['file', 'gps'], filters: ['identity' as const] };
    expect(parseHash(serializeHash(s))).toEqual(s);
    expect(serializeHash(s)).toBe('#meta=file,gps&mf=identity');
  });
  it('preserves unrelated hash keys and clears empty state', () => {
    expect(serializeHash({ open: ['gps'], filters: [] }, '#foo=bar&meta=old')).toBe('#foo=bar&meta=gps');
    expect(serializeHash({ open: null, filters: [] }, '#meta=old')).toBe('');
  });
});
