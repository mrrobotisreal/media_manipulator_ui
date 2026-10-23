import { describe, expect, it, vi } from 'vitest';
import { createEntryUrlStore } from './entryUrls';

describe('entry url store', () => {
  it('shares one URL per path and revokes at zero refs', () => {
    let n = 0;
    Object.assign(URL, { createObjectURL: vi.fn(() => `blob:e-${++n}`), revokeObjectURL: vi.fn() });
    const store = createEntryUrlStore();
    const entry = { path: 'a/b.png', size: 1, isDir: false, kind: 'image' as const, data: () => new Uint8Array([1]) };
    expect(store.acquire(entry)).toBe('blob:e-1');
    expect(store.acquire(entry)).toBe('blob:e-1');
    store.release('a/b.png');
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
    store.release('a/b.png');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:e-1');
    store.acquire(entry);
    store.dispose();
    expect(store.size).toBe(0);
  });
});
