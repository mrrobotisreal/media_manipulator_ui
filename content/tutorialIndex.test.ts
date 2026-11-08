import { describe, expect, it } from 'vitest';

import { TUTORIAL_DATES } from '@/content/pageDates';
import { TUTORIAL_GOALS, TUTORIAL_INDEX } from '@/content/tutorialIndex';

describe('tutorials index registry', () => {
  it('lists every dated tutorial exactly once, and only dated tutorials', () => {
    const indexed = TUTORIAL_INDEX.map((e) => e.path).sort();
    expect(indexed).toEqual(Object.keys(TUTORIAL_DATES).sort());
  });

  it('puts every tutorial in a known goal group with a unique key', () => {
    for (const e of TUTORIAL_INDEX) expect(TUTORIAL_GOALS).toContain(e.goal);
    const keys = TUTORIAL_INDEX.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
