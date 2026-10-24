import { beforeEach, describe, expect, it, vi } from 'vitest';

const track = vi.hoisted(() => vi.fn());
vi.mock('./client', () => ({ analytics: { track } }));

import { onboardingEvents } from './onboardingEvents';
import { EVENTS, EVENT_PRIORITY } from './events';
import { validateDevEvent } from './devValidation';

const ctx = { page_type: 'home' };
const check = (name: string, properties: Record<string, unknown>) =>
  validateDevEvent(name, { properties, context: ctx } as never, ctx as never);

beforeEach(() => track.mockReset());

describe('onboarding events', () => {
  it('emits viewed with the stable step id and completed with the action', () => {
    onboardingEvents.stepViewed(2);
    onboardingEvents.stepCompleted(3, 'cta');
    expect(track.mock.calls).toEqual([
      [EVENTS.ONBOARDING_STEP_VIEWED, { step: 2, step_id: 'darkroom_projects' }],
      [EVENTS.ONBOARDING_STEP_COMPLETED, { step: 3, action: 'cta' }],
    ]);
  });
  it('schemas accept valid payloads and reject extras and bad enums', () => {
    expect(check('onboarding_step_viewed', { step: 1, step_id: 'keep_results' })).toEqual([]);
    expect(check('onboarding_step_viewed', { step: 4, step_id: 'keep_results' }).length).toBeGreaterThan(0);
    expect(check('onboarding_step_completed', { step: 3, action: 'skip' })).toEqual([]);
    expect(check('onboarding_step_completed', { step: 3, action: 'later' }).length).toBeGreaterThan(0);
    expect(check('onboarding_step_completed', { step: 3, action: 'next', uid: 'x' }).length).toBeGreaterThan(0);
  });
  it('registers P2 priorities mirrored in the Go catalog', () => {
    expect(EVENT_PRIORITY.onboarding_step_viewed).toBe(2);
    expect(EVENT_PRIORITY.onboarding_step_completed).toBe(2);
  });
});
