import { describe, expect, it } from 'vitest';
import { windowMarkers } from './markerLayout';

const m = (id: string, t: number) => ({ id, t, name: id, color: '#22C55E' });

describe('windowMarkers', () => {
  const ms = [m('a', 1), m('b', 50), m('c', 500)];
  it('keeps only markers inside the window', () => {
    expect(windowMarkers(ms, 0, 60).map((x) => x.id)).toEqual(['a', 'b']);
  });
  it('always keeps the selected / edited marker even when off-window', () => {
    expect(windowMarkers(ms, 0, 60, 'c', null).map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });
});
