import type {
  AssessmentAnswers,
  PatternScores,
  PrimaryPatternDecision,
  ScoredPattern,
} from './types';

export interface ScoreRule {
  readonly id: string;
  readonly description: string;
  /** Exact, user-facing observation supported by this rule's predicate. */
  readonly clue: string;
  readonly when: (answers: AssessmentAnswers) => boolean;
  readonly contributions: Readonly<Partial<Record<ScoredPattern, number>>>;
}

function attemptedAny(
  answers: AssessmentAnswers,
  values: readonly NonNullable<AssessmentAnswers['previous_attempts']>[number][],
): boolean {
  return values.some((value) => answers.previous_attempts?.includes(value) === true);
}

/**
 * Integer weights express relative environmental fit only. They are not
 * probabilities, medical risks, or evidence about an underlying cause.
 */
export const SCORE_RULES: readonly ScoreRule[] = [
  {
    id: 'wake-gradual',
    description: 'Heat developed gradually.',
    clue: 'You described heat building gradually.',
    when: (answers) => answers.wake_experience === 'gradually_too_hot',
    contributions: { whole_room_heat: 2, bed_heat_build_up: 2, sudden_personal_heat: -2 },
  },
  {
    id: 'wake-bed-warmer',
    description: 'The bed became hotter over time.',
    clue: 'You reported that the bed became hotter over time.',
    when: (answers) => answers.wake_experience === 'bed_became_hotter',
    contributions: { whole_room_heat: -1, bed_heat_build_up: 4, sudden_personal_heat: -2 },
  },
  {
    id: 'wake-room-hot',
    description: 'The whole bedroom felt hot.',
    clue: 'You reported that the whole bedroom felt hot.',
    when: (answers) => answers.wake_experience === 'whole_bedroom_hot',
    contributions: { whole_room_heat: 4, bed_heat_build_up: -2, sudden_personal_heat: -2 },
  },
  {
    id: 'wake-sudden',
    description: 'Heat arrived as a sudden wave.',
    clue: 'You described the heat arriving as a sudden wave.',
    when: (answers) => answers.wake_experience === 'sudden_wave',
    contributions: { whole_room_heat: -2, bed_heat_build_up: -2, sudden_personal_heat: 5 },
  },
  {
    id: 'wake-damp',
    description: 'The sleeper woke damp or soaked.',
    clue: 'You reported waking damp or soaked.',
    when: (answers) => answers.wake_experience === 'woke_damp_or_soaked',
    contributions: { sudden_personal_heat: 1 },
  },
  {
    id: 'partner-hot',
    description: 'The other sleeper was also hot.',
    clue: 'The other sleeper was also hot.',
    when: (answers) => answers.co_sleeper_state === 'partner_also_hot',
    contributions: { whole_room_heat: 3, bed_heat_build_up: -2, sudden_personal_heat: -1 },
  },
  {
    id: 'partner-comfortable',
    description: 'The other sleeper was comfortable.',
    clue: 'The other sleeper was comfortable while you felt hot.',
    when: (answers) => answers.co_sleeper_state === 'partner_comfortable',
    contributions: { whole_room_heat: -1, bed_heat_build_up: 1, sudden_personal_heat: 1 },
  },
  {
    id: 'partner-cold',
    description: 'The other sleeper was cold.',
    clue: 'The other sleeper was cold while you felt hot.',
    when: (answers) => answers.co_sleeper_state === 'partner_cold',
    contributions: { whole_room_heat: -2, bed_heat_build_up: 1, sudden_personal_heat: 2 },
  },
  {
    id: 'after-stayed-hot',
    description: 'Heat persisted after waking.',
    clue: 'You stayed hot after waking.',
    when: (answers) => answers.after_episode === 'stayed_hot',
    contributions: { whole_room_heat: 1, bed_heat_build_up: 1, sudden_personal_heat: -1 },
  },
  {
    id: 'after-did-not-ease',
    description: 'The heat did not ease.',
    clue: 'You reported that the heat did not ease.',
    when: (answers) => answers.after_episode === 'heat_did_not_ease',
    contributions: { whole_room_heat: 1, bed_heat_build_up: 1, sudden_personal_heat: -1 },
  },
  {
    id: 'after-became-comfortable',
    description: 'The heat passed and comfort returned.',
    clue: 'You became comfortable after the heat passed.',
    when: (answers) => answers.after_episode === 'became_comfortable',
    contributions: { sudden_personal_heat: 1 },
  },
  {
    id: 'after-cold',
    description: 'The sleeper became cold or shivery afterwards.',
    clue: 'You became cold or shivery afterwards.',
    when: (answers) => answers.after_episode === 'became_cold_or_shivery',
    contributions: { whole_room_heat: -2, sudden_personal_heat: 3 },
  },
  {
    id: 'location-underneath',
    description: 'Heat was strongest underneath or in the mattress.',
    clue: 'The strongest heat felt underneath you or around the mattress.',
    when: (answers) => answers.heat_location === 'underneath_or_mattress',
    contributions: { whole_room_heat: -1, bed_heat_build_up: 4, sudden_personal_heat: -1 },
  },
  {
    id: 'location-covers',
    description: 'Heat was strongest under the covers.',
    clue: 'The strongest heat felt trapped under the covers.',
    when: (answers) => answers.heat_location === 'under_covers',
    contributions: { bed_heat_build_up: 3, sudden_personal_heat: -1 },
  },
  {
    id: 'location-upper-body',
    description: 'Heat was concentrated in the upper body, face, or chest.',
    clue: 'The heat felt concentrated in your upper body, face, or chest.',
    when: (answers) => answers.heat_location === 'upper_body_face_or_chest',
    contributions: { whole_room_heat: -2, bed_heat_build_up: -1, sudden_personal_heat: 3 },
  },
  {
    id: 'location-room',
    description: 'Heat was noticeable throughout the room.',
    clue: 'You felt the heat throughout the room.',
    when: (answers) => answers.heat_location === 'throughout_room',
    contributions: { whole_room_heat: 4, bed_heat_build_up: -2, sudden_personal_heat: -2 },
  },
  {
    id: 'location-clammy',
    description: 'Dampness or clamminess was most noticeable.',
    clue: 'You reported damp or clammy skin.',
    when: (answers) => answers.heat_location === 'damp_or_clammy_skin',
    contributions: { sudden_personal_heat: 1 },
  },
  {
    id: 'room-cooling-helped-lot',
    description: 'Whole-room cooling helped a lot.',
    clue: 'Changing the whole-room conditions helped a lot.',
    when: (answers) => answers.whole_room_cooling_effect === 'helped_a_lot',
    contributions: { whole_room_heat: 3, bed_heat_build_up: -1, sudden_personal_heat: -2 },
  },
  {
    id: 'room-cooling-helped-somewhat',
    description: 'Whole-room cooling helped only somewhat.',
    clue: 'Changing the whole-room conditions helped somewhat.',
    when: (answers) => answers.whole_room_cooling_effect === 'helped_somewhat',
    contributions: { whole_room_heat: 1, bed_heat_build_up: 1 },
  },
  {
    id: 'room-cooling-failed',
    description: 'Whole-room cooling did not solve the problem.',
    clue: 'Changing the whole-room conditions did not solve the problem.',
    when: (answers) => answers.whole_room_cooling_effect === 'did_not_solve',
    contributions: { whole_room_heat: -2, sudden_personal_heat: 2 },
  },
  {
    id: 'room-cooling-partner-cold',
    description: 'Whole-room cooling made the other sleeper too cold.',
    clue: 'Changing the whole-room conditions made the other sleeper too cold.',
    when: (answers) => answers.whole_room_cooling_effect === 'partner_became_too_cold',
    contributions: { whole_room_heat: -2, sudden_personal_heat: 3 },
  },
  {
    id: 'bed-changes-already-tried',
    description: 'One or more bedding or surface cooling changes were already tried.',
    clue: 'You have already tried at least one bedding or surface-cooling change.',
    when: (answers) =>
      attemptedAny(answers, [
        'lighter_bedding',
        'cooling_sheets',
        'cooling_pillow',
        'cooling_topper',
      ]),
    contributions: { bed_heat_build_up: 1 },
  },
];

export function calculatePatternScores(answers: AssessmentAnswers): PatternScores {
  const scores: Record<ScoredPattern, number> = {
    whole_room_heat: 0,
    bed_heat_build_up: 0,
    sudden_personal_heat: 0,
  };

  for (const rule of SCORE_RULES) {
    if (!rule.when(answers)) continue;

    for (const pattern of Object.keys(rule.contributions) as ScoredPattern[]) {
      scores[pattern] += rule.contributions[pattern] ?? 0;
    }
  }

  return scores;
}

const PATTERN_ANSWER_KEYS = [
  'wake_experience',
  'co_sleeper_state',
  'after_episode',
  'heat_location',
  'whole_room_cooling_effect',
] as const satisfies readonly (keyof AssessmentAnswers)[];

function countPatternInformation(answers: AssessmentAnswers): {
  readonly informative: number;
  readonly explicitUncertainty: number;
} {
  let informative = 0;
  let explicitUncertainty = 0;

  for (const key of PATTERN_ANSWER_KEYS) {
    const answer = answers[key];
    if (answer === undefined) continue;
    if (answer === 'not_sure') {
      explicitUncertainty += 1;
    } else {
      informative += 1;
    }
  }

  return { informative, explicitUncertainty };
}

function hasExplicitMaterialConflict(answers: AssessmentAnswers): boolean {
  const suddenAndRoomEvidence =
    answers.wake_experience === 'sudden_wave' &&
    answers.heat_location === 'throughout_room' &&
    (answers.whole_room_cooling_effect === 'helped_a_lot' ||
      answers.co_sleeper_state === 'partner_also_hot');

  const roomAndOneSidedConflict =
    answers.wake_experience === 'whole_bedroom_hot' &&
    answers.co_sleeper_state === 'partner_cold';

  const bedAndSuddenConflict =
    answers.wake_experience === 'bed_became_hotter' &&
    answers.heat_location === 'upper_body_face_or_chest' &&
    answers.after_episode === 'became_cold_or_shivery';

  return suddenAndRoomEvidence || roomAndOneSidedConflict || bedAndSuddenConflict;
}

function activeRules(answers: AssessmentAnswers): readonly ScoreRule[] {
  return SCORE_RULES.filter((rule) => rule.when(answers));
}

function supportingObservationCount(
  pattern: ScoredPattern,
  answers: AssessmentAnswers,
): number {
  return activeRules(answers).filter((rule) => (rule.contributions[pattern] ?? 0) > 0).length;
}

function hasMultipleStrongRivalObservations(
  leader: ScoredPattern,
  answers: AssessmentAnswers,
): boolean {
  const strongRivals = activeRules(answers).filter((rule) =>
    (Object.entries(rule.contributions) as [ScoredPattern, number][]).some(
      ([pattern, contribution]) => pattern !== leader && contribution >= 3,
    ),
  );

  // One observation can qualify an otherwise coherent result and is reflected
  // in cautious result language. Two independent strong rival observations make
  // a single-pattern headline misleading even when the raw weights have a leader.
  return strongRivals.length >= 2;
}

function hasAnyRivalObservation(leader: ScoredPattern, answers: AssessmentAnswers): boolean {
  return activeRules(answers).some((rule) =>
    (Object.entries(rule.contributions) as [ScoredPattern, number][]).some(
      ([pattern, contribution]) => pattern !== leader && contribution > 0,
    ),
  );
}

export function determinePrimaryPattern(
  scores: PatternScores,
  answers: AssessmentAnswers,
): PrimaryPatternDecision {
  const information = countPatternInformation(answers);

  if (information.informative < 2) {
    return {
      primaryPattern: 'mixed_or_uncertain',
      clarity: 'not_enough_information',
      reason: 'too_little_information',
    };
  }

  if (information.explicitUncertainty >= 3) {
    return {
      primaryPattern: 'mixed_or_uncertain',
      clarity: 'not_enough_information',
      reason: 'too_much_uncertainty',
    };
  }

  const ranked = (Object.entries(scores) as [ScoredPattern, number][]).sort(
    ([patternA, scoreA], [patternB, scoreB]) =>
      scoreB - scoreA || patternA.localeCompare(patternB),
  );
  const [leader, runnerUp] = ranked;

  if (!leader || leader[1] < 3) {
    return {
      primaryPattern: 'mixed_or_uncertain',
      clarity: 'not_enough_information',
      reason: 'too_little_information',
    };
  }

  if (!runnerUp || leader[1] - runnerUp[1] < 2) {
    return {
      primaryPattern: 'mixed_or_uncertain',
      clarity: 'mixed_pattern',
      reason: 'close_scores',
    };
  }

  if (
    hasExplicitMaterialConflict(answers) ||
    hasMultipleStrongRivalObservations(leader[0], answers)
  ) {
    return {
      primaryPattern: 'mixed_or_uncertain',
      clarity: 'mixed_pattern',
      reason: 'material_conflict',
    };
  }

  // A clear pattern must be explainable with at least two independent recorded
  // observations. A single high-weight answer must never manufacture certainty.
  if (supportingObservationCount(leader[0], answers) < 2) {
    const conflictingObservation = hasAnyRivalObservation(leader[0], answers);
    return {
      primaryPattern: 'mixed_or_uncertain',
      clarity: conflictingObservation ? 'mixed_pattern' : 'not_enough_information',
      reason: conflictingObservation ? 'material_conflict' : 'too_little_information',
    };
  }

  return {
    primaryPattern: leader[0],
    clarity: 'clear_pattern',
    reason: 'leading_pattern',
  };
}
