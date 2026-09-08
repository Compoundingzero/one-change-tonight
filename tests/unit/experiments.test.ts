import { describe, expect, it } from 'vitest';

import { EXPERIMENTS } from '../../src/data/experiments/experiments';
import {
  determineModifiers,
  selectExperiment,
  type AssessmentAnswers,
} from '../../src/lib/decision-engine';

describe('experiment library', () => {
  it('contains complete, unique, noncommercial records', () => {
    expect(new Set(EXPERIMENTS.map((experiment) => experiment.id)).size).toBe(
      EXPERIMENTS.length,
    );

    for (const experiment of EXPERIMENTS) {
      expect(experiment.patternFit.length).toBeGreaterThan(0);
      expect(experiment.oneVariableToChange.length).toBeGreaterThan(0);
      expect(experiment.keepConstant.length).toBeGreaterThan(0);
      expect(experiment.steps.length).toBeGreaterThan(0);
      expect(experiment.whatToRecord.length).toBeGreaterThan(0);
      expect(experiment.stopConditions.length).toBeGreaterThan(0);
      expect(experiment.safetyNote.length).toBeGreaterThan(0);
      expect(experiment.sourceIds.length).toBeGreaterThan(0);

      const copy = JSON.stringify(experiment).toLowerCase();
      expect(copy).not.toContain('buy now');
      expect(copy).not.toContain('affiliate');
      expect(copy).not.toContain('you have perimenopause');
    }
  });

  it('does not repeat a fan experiment after a fan was already tried', () => {
    const answers: AssessmentAnswers = {
      wake_experience: 'sudden_wave',
      co_sleeper_state: 'partner_cold',
      after_episode: 'became_cold_or_shivery',
      heat_location: 'upper_body_face_or_chest',
      previous_attempts: ['bedside_or_room_fan'],
    };

    const selected = selectExperiment(
      'sudden_personal_heat',
      determineModifiers(answers),
      answers,
    );

    expect(selected.id).not.toBe('directed_side_airflow');
  });

  it('rules out airflow when quiet is critical', () => {
    const answers: AssessmentAnswers = {
      wake_experience: 'sudden_wave',
      co_sleeper_state: 'partner_comfortable',
      noise_sensitivity: 'very_important',
      previous_attempts: ['nothing_yet'],
    };

    const selected = selectExperiment(
      'sudden_personal_heat',
      determineModifiers(answers),
      answers,
    );

    expect(selected.id).toBe('local_comfort_during_episode');
  });

  it('keeps completed three-night guidance and observations noncausal', () => {
    for (const experiment of EXPERIMENTS) {
      expect(experiment.nextIfHelps).not.toMatch(/up to two more nights/i);
      expect(experiment.whatToRecord.join(' ')).not.toMatch(/prolonged discomfort/i);
    }
  });
});
