// Account onboarding tour events (MM35). Enums only: no ids, no copy, no free text.
//
//   onboarding_step_viewed     a card became visible (step 1-3 plus its stable step_id)
//   onboarding_step_completed  the person left a card (action: next | cta | skip | dismiss)
//
// There is deliberately no `onboarding_completed`: completion is `step_completed` on step 3, or
// `step_completed` with action `skip`/`dismiss` on any step.

import { analytics } from './client';
import { EVENTS, type OnboardingAction, type OnboardingStepId } from './events';

export const ONBOARDING_STEPS: readonly OnboardingStepId[] = ['keep_results', 'darkroom_projects', 'retention'];

export type OnboardingStepNumber = 1 | 2 | 3;

function safely(fn: () => void): void {
  try {
    fn();
  } catch {
    /* analytics must never break the flow it observes */
  }
}

export const onboardingEvents = {
  stepViewed(step: OnboardingStepNumber): void {
    safely(() => analytics.track(EVENTS.ONBOARDING_STEP_VIEWED, { step, step_id: ONBOARDING_STEPS[step - 1] }));
  },
  stepCompleted(step: OnboardingStepNumber, action: OnboardingAction): void {
    safely(() => analytics.track(EVENTS.ONBOARDING_STEP_COMPLETED, { step, action }));
  },
};
