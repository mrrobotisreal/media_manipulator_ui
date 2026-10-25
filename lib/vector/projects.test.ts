import { describe, expect, it } from 'vitest';

import { blankDoc, classifyProjectId, newLocalProjectId } from './projects';

describe('Motion project ids', () => {
  it('classifies route segments', () => {
    expect(classifyProjectId('new')).toEqual({ kind: 'new' });
    expect(classifyProjectId('local-abc123def456')).toEqual({ kind: 'local', id: 'local-abc123def456' });
    expect(classifyProjectId('../etc')).toEqual({ kind: 'invalid' });
    expect(classifyProjectId('local-')).toEqual({ kind: 'invalid' });
  });

  it('mints valid local ids', () => {
    let i = 0;
    const id = newLocalProjectId(() => ((i++ * 7) % 36) / 36);
    expect(classifyProjectId(id).kind).toBe('local');
    expect(id).toHaveLength(18);
  });

  it('builds the default blank document', () => {
    expect(blankDoc().canvas).toMatchObject({ width: 512, height: 512, background: 'transparent' });
  });
});
