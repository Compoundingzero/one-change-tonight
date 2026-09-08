import { describe, expect, it } from 'vitest';

import {
  AFTER_EPISODE_VALUES,
  CO_SLEEPER_STATE_VALUES,
  HEAT_LOCATION_VALUES,
  InvalidAssessmentAnswersError,
  WAKE_EXPERIENCE_VALUES,
  WHOLE_ROOM_COOLING_EFFECT_VALUES,
  calculatePatternScores,
  evaluateAssessment,
  validateAnswers,
  type AssessmentAnswers,
} from '../../src/lib/decision-engine';
import { getExperiment } from '../../src/data/experiments/experiments';

const BEDDING_OR_SURFACE_ATTEMPTS = new Set([
  'lighter_bedding',
  'cooling_sheets',
  'cooling_topper',
]);

function clueIsSupported(clue: string, answers: AssessmentAnswers): boolean {
  switch (clue) {
    case 'Heat built gradually.':
      return answers.wake_experience === 'gradually_too_hot';
    case 'The bed got hotter over time.':
      return answers.wake_experience === 'bed_became_hotter';
    case 'The whole bedroom felt hot.':
      return answers.wake_experience === 'whole_bedroom_hot';
    case 'Heat came as a sudden wave.':
      return answers.wake_experience === 'sudden_wave';
    case 'You woke damp or soaked.':
      return answers.wake_experience === 'woke_damp_or_soaked';
    case 'The other sleeper was also hot.':
      return answers.co_sleeper_state === 'partner_also_hot';
    case 'The other sleeper was comfortable while you felt hot.':
      return answers.co_sleeper_state === 'partner_comfortable';
    case 'The other sleeper was cold while you felt hot.':
      return answers.co_sleeper_state === 'partner_cold';
    case 'You stayed hot after waking.':
      return answers.after_episode === 'stayed_hot';
    case 'The heat did not ease.':
      return answers.after_episode === 'heat_did_not_ease';
    case 'You became comfortable after the heat passed.':
      return answers.after_episode === 'became_comfortable';
    case 'You became cold or shivery afterward.':
      return answers.after_episode === 'became_cold_or_shivery';
    case 'The strongest heat felt underneath you or around the mattress.':
      return answers.heat_location === 'underneath_or_mattress';
    case 'The strongest heat felt trapped under the covers.':
      return answers.heat_location === 'under_covers';
    case 'The heat felt concentrated in your upper body, face, or chest.':
      return answers.heat_location === 'upper_body_face_or_chest';
    case 'You felt the heat throughout the room.':
      return answers.heat_location === 'throughout_room';
    case 'Your skin felt damp or clammy.':
      return answers.heat_location === 'damp_or_clammy_skin';
    case 'Changing the whole-room conditions helped a lot.':
      return answers.whole_room_cooling_effect === 'helped_a_lot';
    case 'Changing the whole-room conditions helped somewhat.':
      return answers.whole_room_cooling_effect === 'helped_somewhat';
    case 'Changing the whole-room conditions did not solve the problem.':
      return answers.whole_room_cooling_effect === 'did_not_solve';
    case 'Changing the whole-room conditions made the other sleeper too cold.':
      return answers.whole_room_cooling_effect === 'partner_became_too_cold';
    case 'You already tried a bedding or surface-cooling change.':
      return (
        answers.previous_attempts?.some((attempt) =>
          BEDDING_OR_SURFACE_ATTEMPTS.has(attempt),
        ) === true
      );
    case 'You weren’t sure how the heat began.':
      return answers.wake_experience === 'not_sure';
    case 'You sleep alone.':
      return answers.co_sleeper_state === 'sleep_alone';
    case 'You weren’t sure how the room felt to another sleeper.':
      return answers.co_sleeper_state === 'not_sure';
    case 'You weren’t sure what happened after the heat eased.':
      return answers.after_episode === 'not_sure';
    case 'You weren’t sure where the heat felt strongest.':
      return answers.heat_location === 'not_sure';
    case 'You have not tried cooling the whole room.':
      return answers.whole_room_cooling_effect === 'not_tried';
    case 'You weren’t sure whether cooling the whole room helped.':
      return answers.whole_room_cooling_effect === 'not_sure';
    case 'You have not tried a room, bed, or personal cooling change yet.':
      return answers.previous_attempts?.includes('nothing_yet') === true;
    case 'You weren’t sure which changes you had tried.':
      return answers.previous_attempts?.includes('not_sure') === true;
    case 'No answer yet about how the heat began.':
      return answers.wake_experience === undefined;
    case 'No answer yet about another sleeper.':
      return answers.co_sleeper_state === undefined;
    case 'No answer yet about what happened after the heat eased.':
      return answers.after_episode === undefined;
    case 'No answer yet about where the heat felt strongest.':
      return answers.heat_location === undefined;
    case 'No answer yet about whether cooling the room helped.':
      return answers.whole_room_cooling_effect === undefined;
    case 'You said you woke damp and later felt cold or shivery.':
      return (
        (answers.wake_experience === 'woke_damp_or_soaked' ||
          answers.heat_location === 'damp_or_clammy_skin') &&
        answers.after_episode === 'became_cold_or_shivery'
      );
    default:
      return false;
  }
}

function strongEvidenceObservations(answers: AssessmentAnswers): readonly string[] {
  const patterns: string[] = [];

  if (answers.wake_experience === 'sudden_wave') patterns.push('sudden_personal_heat');
  if (answers.wake_experience === 'bed_became_hotter') patterns.push('bed_heat_build_up');
  if (answers.wake_experience === 'whole_bedroom_hot') patterns.push('whole_room_heat');
  if (answers.co_sleeper_state === 'partner_also_hot') patterns.push('whole_room_heat');
  if (answers.after_episode === 'became_cold_or_shivery') {
    patterns.push('sudden_personal_heat');
  }
  if (
    answers.heat_location === 'underneath_or_mattress' ||
    answers.heat_location === 'under_covers'
  ) {
    patterns.push('bed_heat_build_up');
  }
  if (answers.heat_location === 'upper_body_face_or_chest') {
    patterns.push('sudden_personal_heat');
  }
  if (answers.heat_location === 'throughout_room') patterns.push('whole_room_heat');
  if (answers.whole_room_cooling_effect === 'helped_a_lot') {
    patterns.push('whole_room_heat');
  }
  if (answers.whole_room_cooling_effect === 'partner_became_too_cold') {
    patterns.push('sudden_personal_heat');
  }

  return patterns;
}

describe('decision engine supplied fixtures', () => {
  it('returns a sudden personal-heat pattern and one-sided local experiment', () => {
    const answers: AssessmentAnswers = {
      wake_experience: 'sudden_wave',
      co_sleeper_state: 'partner_cold',
      after_episode: 'became_cold_or_shivery',
      heat_location: 'upper_body_face_or_chest',
      whole_room_cooling_effect: 'partner_became_too_cold',
      previous_attempts: ['lower_thermostat', 'bedside_or_room_fan', 'cooling_sheets'],
      frequency: 'five_or_more_nights',
      change_status: 'yes',
    };

    const result = evaluateAssessment(answers);

    expect(result.primaryPattern).toBe('sudden_personal_heat');
    expect(result.modifiers).toEqual(
      expect.arrayContaining([
        'one_sided_solution_needed',
        'whole_room_cooling_has_failed',
        'frequent_sleep_disruption',
        'new_or_worsening_pattern',
      ]),
    );
    expect(result.experimentId).toBe('local_comfort_during_episode');
    expect(result.premiumFit.fit).toBe('active_one_sided_system_may_be_worth_comparing');
    expect(result.careReminder.show).toBe(true);
    expect(JSON.stringify(result).toLowerCase()).not.toContain('you have perimenopause');
    expect(JSON.stringify(result)).not.toMatch(/\b\d+(?:\.\d+)?%/);
  });

  it('returns a whole-room pattern and room observation experiment', () => {
    const result = evaluateAssessment({
      wake_experience: 'gradually_too_hot',
      co_sleeper_state: 'partner_also_hot',
      after_episode: 'stayed_hot',
      heat_location: 'throughout_room',
      whole_room_cooling_effect: 'helped_a_lot',
      previous_attempts: ['lower_thermostat'],
      frequency: 'one_or_two_nights',
      change_status: 'no',
    } satisfies AssessmentAnswers);

    expect(result.primaryPattern).toBe('whole_room_heat');
    expect(result.modifiers).not.toContain('one_sided_solution_needed');
    expect(result.experimentId).toBe('observe_room_and_both_sleepers');
    expect(result.premiumFit.fit).toBe('premium_active_cooling_not_yet_justified');
  });

  it('returns bed heat build-up and tests a bed layer before the mattress', () => {
    const result = evaluateAssessment({
      wake_experience: 'bed_became_hotter',
      co_sleeper_state: 'partner_comfortable',
      after_episode: 'stayed_hot',
      heat_location: 'underneath_or_mattress',
      whole_room_cooling_effect: 'helped_somewhat',
      previous_attempts: ['cooling_sheets'],
      frequency: 'one_or_two_nights',
      change_status: 'no',
    } satisfies AssessmentAnswers);

    expect(result.primaryPattern).toBe('bed_heat_build_up');
    expect(['change_one_bed_layer', 'separate_top_covers']).toContain(result.experimentId);
    expect(result.doNotBuy.id).toBe('do_not_replace_mattress_yet');
  });

  it('prioritizes moisture recovery without claiming to prevent an episode', () => {
    const result = evaluateAssessment({
      wake_experience: 'woke_damp_or_soaked',
      co_sleeper_state: 'partner_comfortable',
      after_episode: 'became_cold_or_shivery',
      heat_location: 'damp_or_clammy_skin',
      whole_room_cooling_effect: 'did_not_solve',
      previous_attempts: ['lower_thermostat'],
      frequency: 'three_or_four_nights',
      change_status: 'not_sure',
    } satisfies AssessmentAnswers);

    expect(['sudden_personal_heat', 'mixed_or_uncertain']).toContain(result.primaryPattern);
    expect(result.modifiers).toContain('moisture_may_prolong_discomfort');
    expect(result.experimentId).toBe('prepare_one_dry_layer');
    expect(result.explanation.doesNotEstablish).toContain(
      'does not explain why the heat happened',
    );
  });

  it('does not force a conclusion when room and sudden evidence conflict', () => {
    const result = evaluateAssessment({
      wake_experience: 'sudden_wave',
      co_sleeper_state: 'partner_cold',
      heat_location: 'throughout_room',
      whole_room_cooling_effect: 'helped_a_lot',
      previous_attempts: ['lower_thermostat'],
      frequency: 'not_sure',
      change_status: 'not_sure',
    } satisfies AssessmentAnswers);

    expect(result.primaryPattern).toBe('mixed_or_uncertain');
    expect(result.clarity).toBe('mixed_pattern');
    expect(result.experimentId).toBe('measure_first');
  });

  it('does not call contradictory sudden, partner-hot, and bed-location answers clear', () => {
    const result = evaluateAssessment({
      wake_experience: 'sudden_wave',
      co_sleeper_state: 'partner_also_hot',
      after_episode: 'became_comfortable',
      heat_location: 'underneath_or_mattress',
      whole_room_cooling_effect: 'not_sure',
      previous_attempts: ['nothing_yet'],
      frequency: 'one_or_two_nights',
      change_status: 'no',
    } satisfies AssessmentAnswers);

    expect(result.primaryPattern).toBe('mixed_or_uncertain');
    expect(result.clarity).toBe('mixed_pattern');
    expect(result.explanation.clues).toEqual(
      expect.arrayContaining([
        'Heat came as a sudden wave.',
        'The other sleeper was also hot.',
        'The strongest heat felt underneath you or around the mattress.',
      ]),
    );
    expect(result.explanation.title).not.toContain('rather than the room');
  });

  it('returns not enough information and a baseline for empty answers', () => {
    const result = evaluateAssessment({});

    expect(result.primaryPattern).toBe('mixed_or_uncertain');
    expect(result.clarity).toBe('not_enough_information');
    expect(result.experimentId).toBe('measure_first');
    expect(result.premiumFit.fit).toBe('premium_active_cooling_not_yet_justified');
  });
});

describe('decision engine boundaries', () => {
  it('keeps raw weights available for testing but not in the user result', () => {
    const answers: AssessmentAnswers = {
      wake_experience: 'sudden_wave',
      co_sleeper_state: 'partner_cold',
      after_episode: 'became_cold_or_shivery',
      heat_location: 'upper_body_face_or_chest',
    };
    const scores = calculatePatternScores(answers);
    const result = evaluateAssessment(answers);

    expect(scores.sudden_personal_heat).toBeGreaterThan(scores.whole_room_heat);
    expect(result).not.toHaveProperty('scores');
    expect(result).not.toHaveProperty('confidence');
    expect(result).not.toHaveProperty('probability');
  });

  it('requires explicit tradeoff acceptance for the strongest premium fit', () => {
    const answers: AssessmentAnswers = {
      wake_experience: 'sudden_wave',
      co_sleeper_state: 'partner_cold',
      after_episode: 'became_cold_or_shivery',
      heat_location: 'upper_body_face_or_chest',
      whole_room_cooling_effect: 'did_not_solve',
      previous_attempts: ['lower_thermostat', 'bedside_or_room_fan', 'cooling_sheets'],
      frequency: 'five_or_more_nights',
      change_status: 'no',
    };

    expect(evaluateAssessment(answers).premiumFit.fit).toBe(
      'active_one_sided_system_may_be_worth_comparing',
    );
    expect(
      evaluateAssessment(answers, {
        acceptsNoiseMaintenanceAndExpense: true,
      }).premiumFit.fit,
    ).toBe('personal_or_dual_zone_active_system_fits_environmental_constraint');
  });

  it('makes the sudden premium path reachable through a previous-attempt outcome', () => {
    const answers: AssessmentAnswers = {
      wake_experience: 'sudden_wave',
      co_sleeper_state: 'partner_cold',
      after_episode: 'became_cold_or_shivery',
      heat_location: 'upper_body_face_or_chest',
      previous_attempts: [
        'lower_thermostat',
        'bedside_or_room_fan',
        'cooling_sheets',
        'room_cooling_made_partner_too_cold',
      ],
      frequency: 'five_or_more_nights',
      change_status: 'no',
    };

    const comparison = evaluateAssessment(answers);
    const accepted = evaluateAssessment(answers, {
      acceptsNoiseMaintenanceAndExpense: true,
    });

    expect(comparison.primaryPattern).toBe('sudden_personal_heat');
    expect(comparison.modifiers).toEqual(
      expect.arrayContaining([
        'one_sided_solution_needed',
        'whole_room_cooling_has_failed',
        'frequent_sleep_disruption',
      ]),
    );
    expect(comparison.premiumFit.fit).toBe('active_one_sided_system_may_be_worth_comparing');
    expect(accepted.premiumFit.fit).toBe(
      'personal_or_dual_zone_active_system_fits_environmental_constraint',
    );
  });

  it('rejects unknown answer values and mutually exclusive attempts', () => {
    const invalidValue = validateAnswers({ wake_experience: 'diagnose_me' });
    const mutuallyExclusive = validateAnswers({
      previous_attempts: ['nothing_yet', 'cooling_sheets'],
    });

    expect(invalidValue.valid).toBe(false);
    expect(mutuallyExclusive.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'mutually_exclusive_answer' })]),
    );
    expect(() => evaluateAssessment({ medical_diagnosis: 'anything' })).toThrow(
      InvalidAssessmentAnswersError,
    );
  });

  it('keeps premium fit and purchase guidance conservative for uncertain results', () => {
    const result = evaluateAssessment({
      wake_experience: 'not_sure',
      co_sleeper_state: 'partner_cold',
      after_episode: 'not_sure',
      heat_location: 'not_sure',
      whole_room_cooling_effect: 'did_not_solve',
      previous_attempts: ['lower_thermostat', 'open_window'],
      frequency: 'five_or_more_nights',
      change_status: 'no',
    } satisfies AssessmentAnswers);

    expect(result.primaryPattern).toBe('mixed_or_uncertain');
    expect(result.clarity).toBe('not_enough_information');
    expect(result.experimentId).toBe('measure_first');
    expect(result.premiumFit.fit).toBe('premium_active_cooling_not_yet_justified');
    expect(result.doNotBuy.id).toBe('do_not_choose_active_system_yet');
    expect(result.doNotBuy.body).toContain(
      'record one baseline night without changing your usual setup',
    );
  });

  it('uses a dry-layer experiment only with moisture plus recovery evidence', () => {
    const dampWithoutColdRecovery: AssessmentAnswers = {
      wake_experience: 'woke_damp_or_soaked',
      co_sleeper_state: 'partner_also_hot',
      after_episode: 'stayed_hot',
      heat_location: 'throughout_room',
      whole_room_cooling_effect: 'helped_a_lot',
      previous_attempts: ['nothing_yet'],
      frequency: 'one_or_two_nights',
      change_status: 'no',
    };
    const withColdRecovery: AssessmentAnswers = {
      ...dampWithoutColdRecovery,
      after_episode: 'became_cold_or_shivery',
    };

    const primaryExperiment = evaluateAssessment(dampWithoutColdRecovery);
    const recoveryExperiment = evaluateAssessment(withColdRecovery);

    expect(primaryExperiment.primaryPattern).toBe('whole_room_heat');
    expect(primaryExperiment.modifiers).not.toContain('moisture_may_prolong_discomfort');
    expect(primaryExperiment.experimentId).toBe('observe_room_and_both_sleepers');
    expect(JSON.stringify(primaryExperiment.explanation).toLowerCase()).not.toMatch(
      /cold|shiver|comfort returned|recovery effect/,
    );
    expect(recoveryExperiment.primaryPattern).toBe('whole_room_heat');
    expect(recoveryExperiment.modifiers).toContain('moisture_may_prolong_discomfort');
    expect(recoveryExperiment.experimentId).toBe('prepare_one_dry_layer');
    expect(getExperiment(recoveryExperiment.experimentId).patternFit).toContain(
      recoveryExperiment.primaryPattern,
    );
  });

  it('is deterministic and keeps every selected experiment applicable across all pattern inputs', () => {
    let evaluated = 0;
    const semanticFailures: string[] = [];

    const scoreRelevantAttemptClasses = [
      ['lower_thermostat', 'open_window'],
      ['cooling_sheets'],
    ] as const satisfies readonly AssessmentAnswers['previous_attempts'][];
    const wakeInputs = [undefined, ...WAKE_EXPERIENCE_VALUES] as const;
    const coSleeperInputs = [undefined, ...CO_SLEEPER_STATE_VALUES] as const;
    const afterEpisodeInputs = [undefined, ...AFTER_EPISODE_VALUES] as const;
    const heatLocationInputs = [undefined, ...HEAT_LOCATION_VALUES] as const;
    const wholeRoomEffectInputs = [undefined, ...WHOLE_ROOM_COOLING_EFFECT_VALUES] as const;

    for (const previousAttempts of scoreRelevantAttemptClasses) {
      for (const wakeExperience of wakeInputs) {
        for (const coSleeperState of coSleeperInputs) {
          for (const afterEpisode of afterEpisodeInputs) {
            for (const heatLocation of heatLocationInputs) {
              for (const wholeRoomCoolingEffect of wholeRoomEffectInputs) {
                const answers: AssessmentAnswers = {
                  ...(wakeExperience === undefined ? {} : { wake_experience: wakeExperience }),
                  ...(coSleeperState === undefined ? {} : { co_sleeper_state: coSleeperState }),
                  ...(afterEpisode === undefined ? {} : { after_episode: afterEpisode }),
                  ...(heatLocation === undefined ? {} : { heat_location: heatLocation }),
                  ...(wholeRoomCoolingEffect === undefined
                    ? {}
                    : { whole_room_cooling_effect: wholeRoomCoolingEffect }),
                  previous_attempts: previousAttempts,
                  frequency: 'five_or_more_nights',
                  change_status: 'yes',
                };
                const first = evaluateAssessment(answers);
                const second = evaluateAssessment(answers);

                expect(second).toEqual(first);
                expect(getExperiment(first.experimentId).patternFit).toContain(
                  first.primaryPattern,
                );
                if (first.primaryPattern === 'mixed_or_uncertain') {
                  expect(first.premiumFit.fit).toBe('premium_active_cooling_not_yet_justified');
                  expect(first.doNotBuy.id).toBe('do_not_choose_active_system_yet');
                } else {
                  const rivalStrongEvidence = strongEvidenceObservations(answers).filter(
                    (pattern) => pattern !== first.primaryPattern,
                  );
                  if (rivalStrongEvidence.length >= 2) {
                    semanticFailures.push(
                      `clear ${first.primaryPattern} ignored strong ${rivalStrongEvidence.join(', ')} evidence for ${JSON.stringify(answers)}`,
                    );
                  }
                }

                if (first.explanation.clues.length < 2 || first.explanation.clues.length > 4) {
                  semanticFailures.push(
                    `${first.primaryPattern} returned ${first.explanation.clues.length} clues for ${JSON.stringify(answers)}`,
                  );
                }
                for (const clue of first.explanation.clues) {
                  if (!clueIsSupported(clue, answers)) {
                    semanticFailures.push(
                      `unsupported clue ${JSON.stringify(clue)} for ${JSON.stringify(answers)}`,
                    );
                  }
                }
                evaluated += 1;
              }
            }
          }
        }
      }
    }

    expect(evaluated).toBe(24_696);
    expect(semanticFailures.slice(0, 10)).toEqual([]);
  }, 30_000);

  it('keeps two to four literal clues for sparse and explicitly uncertain inputs', () => {
    const partialInputs: readonly AssessmentAnswers[] = [
      {},
      { wake_experience: 'sudden_wave' },
      { co_sleeper_state: 'sleep_alone' },
      { previous_attempts: ['nothing_yet'] },
      {
        wake_experience: 'not_sure',
        co_sleeper_state: 'not_sure',
        after_episode: 'not_sure',
        heat_location: 'not_sure',
        whole_room_cooling_effect: 'not_sure',
      },
    ];

    for (const answers of partialInputs) {
      const result = evaluateAssessment(answers);
      expect(result.explanation.clues.length).toBeGreaterThanOrEqual(2);
      expect(result.explanation.clues.length).toBeLessThanOrEqual(4);
      for (const clue of result.explanation.clues) {
        expect(clueIsSupported(clue, answers)).toBe(true);
      }
    }

    const singleHighWeightSignal = evaluateAssessment({
      wake_experience: 'sudden_wave',
      co_sleeper_state: 'sleep_alone',
    } satisfies AssessmentAnswers);
    expect(singleHighWeightSignal.primaryPattern).toBe('mixed_or_uncertain');
    expect(singleHighWeightSignal.clarity).toBe('not_enough_information');
    expect(singleHighWeightSignal.explanation.clues).toEqual(
      expect.arrayContaining(['Heat came as a sudden wave.', 'You sleep alone.']),
    );
  });

  it('names both mutually exclusive previous-attempt answers', () => {
    const result = validateAnswers({
      previous_attempts: ['not_sure', 'cooling_sheets'],
    });

    expect(result.valid).toBe(false);
    expect(result.issues[0]?.message).toContain('I’m not sure');
  });
});
