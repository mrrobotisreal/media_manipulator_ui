import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/studio/studioBackend', () => ({
  getActiveStudioBackend: () => {
    throw new Error('studioBackend must not be reached');
  },
}));

import { useStudioStore } from '@/lib/studioStore';
import { studioFixture } from '@/lib/assistant/ops/studioFixture';
import { LUMETRI_PARAMS } from '@/lib/studio/effectRegistry';
import { PLANNED_STUDIO_LOOKS } from '@/lib/assistant/recipes';
import { studioLumetriEffectSchema } from '@/lib/studioTypes';

import { NEUTRAL_LUMETRI, STUDIO_LOOKS, lookEffectId, lookLumetri, withLook } from './looks';

describe('Darkroom looks catalog (MM109 decision 3)', () => {
  it('has 12–16 looks, every planned id (recipes use them), unique ids', () => {
    expect(STUDIO_LOOKS.length).toBeGreaterThanOrEqual(12);
    expect(STUDIO_LOOKS.length).toBeLessThanOrEqual(16);
    expect(new Set(STUDIO_LOOKS.map((l) => l.id)).size).toBe(STUDIO_LOOKS.length);
    for (const id of PLANNED_STUDIO_LOOKS) expect(STUDIO_LOOKS.some((l) => l.id === id), id).toBe(true);
  });

  it('uses only registry Lumetri parameters, inside their ranges (export parity, ADR-0002)', () => {
    for (const l of STUDIO_LOOKS) {
      expect(Object.keys(l.lumetri).sort()).toEqual(LUMETRI_PARAMS.map((p) => p.key).sort());
      for (const p of LUMETRI_PARAMS) {
        const v = (l.lumetri as unknown as Record<string, number>)[p.key];
        expect(v, `${l.id}.${p.key}`).toBeGreaterThanOrEqual(p.min);
        expect(v, `${l.id}.${p.key}`).toBeLessThanOrEqual(p.max);
      }
      expect(studioLumetriEffectSchema.safeParse({ type: 'lumetri', id: lookEffectId(l.id), enabled: true, ...l.lumetri }).success).toBe(true);
      // Not a no-op.
      expect(JSON.stringify(l.lumetri)).not.toBe(JSON.stringify(NEUTRAL_LUMETRI));
    }
  });

  it('intensity 0 is neutral, 1 is the look', () => {
    const l = STUDIO_LOOKS[0];
    expect(lookLumetri(l, 0)).toEqual(NEUTRAL_LUMETRI);
    expect(lookLumetri(l, 1)).toEqual(l.lumetri);
  });

  it('withLook replaces an earlier look in place and keeps the user effects after it', () => {
    const clip = { id: 'c', assetId: 'a', streamIndex: 0, timelineStart: 0, sourceIn: 0, sourceOut: 5, effects: [{ type: 'lumetri' as const, id: 'mine', enabled: true, exposure: 0, contrast: 1.1, saturation: 1, temperature: 0, tint: 0, vibrance: 0 }] };
    const a = withLook(clip, STUDIO_LOOKS[0]);
    expect(a.effects!.map((e) => e.id)).toEqual([lookEffectId(STUDIO_LOOKS[0].id), 'mine']);
    const b = withLook(a, STUDIO_LOOKS[1]);
    expect(b.effects!.map((e) => e.id)).toEqual([lookEffectId(STUDIO_LOOKS[1].id), 'mine']);
  });

  it('the Looks row path (store.applyLook) is one undo entry; clearLook keeps the user grade', () => {
    const st = useStudioStore.getState();
    st.closeProject();
    st.loadProject(studioFixture());
    useStudioStore.getState().applyLook('clipA', 'noir');
    expect(useStudioStore.getState().past).toHaveLength(1);
    expect(useStudioStore.getState().findClip('clipA')!.clip.effects![0].id).toBe('look-noir');
    useStudioStore.getState().clearLook('clipA');
    expect(useStudioStore.getState().findClip('clipA')!.clip.effects).toBeUndefined();
    useStudioStore.getState().undo();
    useStudioStore.getState().undo();
    expect(useStudioStore.getState().findClip('clipA')!.clip.effects).toBeUndefined();
  });
});
