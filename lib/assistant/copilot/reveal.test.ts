/**
 * MM114: the reveal bridge and the flash helper ("Show me" plumbing).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createRevealBridge, flashElement, flashReveal } from './reveal';

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('reveal bridge', () => {
  it('request reports whether a mounted handler took it; unregistering stops delivery', () => {
    const b = createRevealBridge<{ id: string }>();
    expect(b.request({ id: 'a' })).toBe(false);
    const seen: string[] = [];
    const off = b.register((t) => seen.push(t.id));
    expect(b.request({ id: 'b' })).toBe(true);
    off();
    expect(b.request({ id: 'c' })).toBe(false);
    expect(seen).toEqual(['b']);
  });

  it('remembers the latest target briefly so a section that mounts late can open itself', () => {
    vi.useFakeTimers();
    const b = createRevealBridge<{ id: string }>();
    b.request({ id: 'late' });
    expect(b.recent()).toEqual({ id: 'late' });
    vi.advanceTimersByTime(4100);
    expect(b.recent()).toBeNull();
  });
});

describe('flash', () => {
  it('outlines the element and removes the outline again', () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div id="x"></div>';
    const el = document.getElementById('x')!;
    flashElement(el);
    expect(el.classList.contains('ring-primary')).toBe(true);
    vi.advanceTimersByTime(1700);
    expect(el.classList.contains('ring-primary')).toBe(false);
  });

  it('finds an element that renders a moment later and prefers the first key that exists', () => {
    vi.useFakeTimers();
    flashReveal(['photo:exposure.ev', 'photo:exposure']);
    document.body.innerHTML = '<div id="a" data-reveal="photo:exposure"></div><div id="b" data-reveal="photo:exposure.ev"></div>';
    vi.advanceTimersByTime(60);
    expect(document.getElementById('b')!.classList.contains('ring-primary')).toBe(true);
    expect(document.getElementById('a')!.classList.contains('ring-primary')).toBe(false);
  });
});
