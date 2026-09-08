import { describe, expect, it } from 'vitest';

import {
  MAX_OPTIONAL_QUESTION_SCREENS,
  MAX_PRIMARY_QUESTION_SCREENS,
  QUESTION_DEFINITIONS,
  getAdaptiveQuestionPath,
} from '../../src/data/questions/questions';
import {
  CO_SLEEPER_STATE_VALUES,
  WAKE_EXPERIENCE_VALUES,
  WHOLE_ROOM_COOLING_EFFECT_VALUES,
  type AssessmentAnswers,
} from '../../src/lib/decision-engine';

describe('question schema', () => {
  it('defines unique IDs and an uncertainty choice for every screen', () => {
    const ids = QUESTION_DEFINITIONS.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const question of QUESTION_DEFINITIONS) {
      expect(question.options.some((option) => option.value === 'not_sure')).toBe(true);
      expect(question.allowsUnanswered).toBe(true);
    }
  });

  it('never exceeds seven primary screens and one optional follow-up', () => {
    const attemptGroups: AssessmentAnswers['previous_attempts'][] = [
      undefined,
      ['nothing_yet'],
      ['lower_thermostat'],
      ['bedside_or_room_fan'],
    ];

    for (const wake of WAKE_EXPERIENCE_VALUES) {
      for (const coSleeper of CO_SLEEPER_STATE_VALUES) {
        for (const roomEffect of WHOLE_ROOM_COOLING_EFFECT_VALUES) {
          for (const previousAttempts of attemptGroups) {
            const answers: AssessmentAnswers = {
              wake_experience: wake,
              co_sleeper_state: coSleeper,
              whole_room_cooling_effect: roomEffect,
              ...(previousAttempts === undefined
                ? {}
                : { previous_attempts: previousAttempts }),
            };
            const path = getAdaptiveQuestionPath(answers);
            const optionalCount = path.filter(
              (question) => question === 'noise_sensitivity',
            ).length;

            expect(path.length - optionalCount).toBeLessThanOrEqual(
              MAX_PRIMARY_QUESTION_SCREENS,
            );
            expect(optionalCount).toBeLessThanOrEqual(MAX_OPTIONAL_QUESTION_SCREENS);
            expect(new Set(path).size).toBe(path.length);
          }
        }
      }
    }
  });

  it('asks about noise only for a likely airflow or partner pathway', () => {
    const noNoiseFollowUp = getAdaptiveQuestionPath({
      wake_experience: 'gradually_too_hot',
      co_sleeper_state: 'sleep_alone',
      previous_attempts: ['nothing_yet'],
    });
    const partnerFollowUp = getAdaptiveQuestionPath({
      wake_experience: 'gradually_too_hot',
      co_sleeper_state: 'partner_cold',
      previous_attempts: ['nothing_yet'],
    });

    expect(noNoiseFollowUp).not.toContain('noise_sensitivity');
    expect(partnerFollowUp.at(-1)).toBe('noise_sensitivity');
  });
});
