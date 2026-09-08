import type {
  AssessmentAnswers,
  Explanation,
  Modifier,
  PatternClarity,
  PrimaryPattern,
  ScoredPattern,
} from './types';
import { SCORE_RULES, type ScoreRule } from './scoring';

interface RuleClue {
  readonly rule: ScoreRule;
  readonly supports: readonly ScoredPattern[];
}

const directRuleClues: Readonly<Record<string, string>> = {
  'wake-gradual': 'Heat built gradually.',
  'wake-bed-warmer': 'The bed got hotter over time.',
  'wake-room-hot': 'The whole bedroom felt hot.',
  'wake-sudden': 'Heat came as a sudden wave.',
  'wake-damp': 'You woke damp or soaked.',
  'after-did-not-ease': 'The heat did not ease.',
  'location-clammy': 'Your skin felt damp or clammy.',
  'bed-changes-already-tried': 'You already tried a bedding or surface-cooling change.',
};

function ruleClue(rule: ScoreRule): string {
  return directRuleClues[rule.id] ?? rule.clue;
}

function activeRuleClues(answers: AssessmentAnswers): readonly RuleClue[] {
  return SCORE_RULES.filter((rule) => rule.when(answers)).map((rule) => ({
    rule,
    supports: (Object.entries(rule.contributions) as [ScoredPattern, number][])
      .filter(([, contribution]) => contribution > 0)
      .map(([pattern]) => pattern),
  }));
}

function patternClues(pattern: ScoredPattern, answers: AssessmentAnswers): string[] {
  return activeRuleClues(answers)
    .filter(({ rule }) => (rule.contributions[pattern] ?? 0) > 0)
    .sort(
      (left, right) =>
        (right.rule.contributions[pattern] ?? 0) - (left.rule.contributions[pattern] ?? 0),
    )
    .map(({ rule }) => ruleClue(rule))
    .slice(0, 4);
}

function neutralObservationClues(answers: AssessmentAnswers): string[] {
  const clues: string[] = [];

  if (answers.wake_experience === 'not_sure') {
    clues.push('You weren’t sure how the heat began.');
  }
  if (answers.co_sleeper_state === 'sleep_alone') {
    clues.push('You sleep alone.');
  } else if (answers.co_sleeper_state === 'not_sure') {
    clues.push('You weren’t sure how the room felt to another sleeper.');
  }
  if (answers.after_episode === 'not_sure') {
    clues.push('You weren’t sure what happened after the heat eased.');
  }
  if (answers.heat_location === 'not_sure') {
    clues.push('You weren’t sure where the heat felt strongest.');
  }
  if (answers.whole_room_cooling_effect === 'not_tried') {
    clues.push('You have not tried cooling the whole room.');
  } else if (answers.whole_room_cooling_effect === 'not_sure') {
    clues.push('You weren’t sure whether cooling the whole room helped.');
  }
  if (answers.previous_attempts?.includes('nothing_yet') === true) {
    clues.push('You have not tried a room, bed, or personal cooling change yet.');
  } else if (answers.previous_attempts?.includes('not_sure') === true) {
    clues.push('You weren’t sure which changes you had tried.');
  }

  return clues;
}

function missingObservationClues(answers: AssessmentAnswers): string[] {
  const clues: string[] = [];
  const missing: ReadonlyArray<readonly [keyof AssessmentAnswers, string]> = [
    ['wake_experience', 'No answer yet about how the heat began.'],
    ['co_sleeper_state', 'No answer yet about another sleeper.'],
    ['after_episode', 'No answer yet about what happened after the heat eased.'],
    ['heat_location', 'No answer yet about where the heat felt strongest.'],
    ['whole_room_cooling_effect', 'No answer yet about whether cooling the room helped.'],
  ];

  for (const [key, clue] of missing) {
    if (answers[key] === undefined) clues.push(clue);
  }

  return clues;
}

function mixedClues(answers: AssessmentAnswers): string[] {
  const active = activeRuleClues(answers);
  const selected: RuleClue[] = [];

  // When evidence points in more than one direction, make that visible rather
  // than showing four clues for only the strongest side of the conflict.
  for (const pattern of [
    'whole_room_heat',
    'bed_heat_build_up',
    'sudden_personal_heat',
  ] as const) {
    if (selected.some(({ supports }) => supports.includes(pattern))) continue;

    const candidate = active
      .filter(
        ({ rule, supports }) =>
          supports.includes(pattern) &&
          !selected.some(({ rule: chosen }) => chosen.id === rule.id),
      )
      .sort(
        (left, right) =>
          (right.rule.contributions[pattern] ?? 0) - (left.rule.contributions[pattern] ?? 0),
      )[0];

    if (candidate) selected.push(candidate);
  }

  for (const candidate of active) {
    if (selected.length >= 4) break;
    if (!selected.some(({ rule }) => rule.id === candidate.rule.id)) selected.push(candidate);
  }

  const clues = selected.map(({ rule }) => ruleClue(rule));
  for (const clue of [
    ...neutralObservationClues(answers),
    ...missingObservationClues(answers),
  ]) {
    if (clues.length >= 4) break;
    if (!clues.includes(clue)) clues.push(clue);
  }

  // A valid partial assessment can contain only non-pattern answers. Two
  // specific missing-observation statements still explain why no pattern won.
  return clues.slice(0, 4);
}

function uncertaintyNotes(answers: AssessmentAnswers): string[] {
  const notes: string[] = [];
  const labels: ReadonlyArray<readonly [keyof AssessmentAnswers, string]> = [
    ['wake_experience', 'You weren’t sure how the heat began.'],
    ['co_sleeper_state', 'You weren’t sure how the room felt to another sleeper.'],
    ['after_episode', 'You weren’t sure what happened after the heat eased.'],
    ['heat_location', 'You weren’t sure where the heat felt strongest.'],
    ['whole_room_cooling_effect', 'You weren’t sure whether cooling the room helped.'],
  ];

  for (const [key, note] of labels) {
    if (answers[key] === 'not_sure') notes.push(note);
  }

  if (notes.length === 0) {
    notes.push('These answers describe what felt hot, not why it happened medically.');
  }

  return notes.slice(0, 3);
}

export function buildExplanation(
  primaryPattern: PrimaryPattern,
  clarity: PatternClarity,
  modifiers: readonly Modifier[],
  answers: AssessmentAnswers,
): Explanation {
  let title: string;
  let interpretation: string;
  let clues: string[];

  switch (primaryPattern) {
    case 'whole_room_heat':
      title = 'Start with the room';
      interpretation = 'Your answers point most strongly to the shared room.';
      clues = patternClues('whole_room_heat', answers);
      break;
    case 'bed_heat_build_up':
      title = 'Start with one bed layer';
      interpretation = 'Your answers point most strongly to heat building around the bed.';
      clues = patternClues('bed_heat_build_up', answers);
      break;
    case 'sudden_personal_heat':
      title = 'The heat may be more local than room-wide';
      interpretation =
        'Your answers point to a change on your side before more whole-room cooling.';
      clues = patternClues('sudden_personal_heat', answers);
      break;
    case 'mixed_or_uncertain':
      title =
        clarity === 'not_enough_information'
          ? 'There is not enough information yet'
          : 'Your answers point in different directions';
      interpretation =
        clarity === 'not_enough_information'
          ? 'Keep your usual setup for one night and record what happens before choosing a change.'
          : 'Don’t guess. Keep your usual setup for one night and record what happens.';
      clues = mixedClues(answers);
      break;
  }

  const hasDirectMoistureObservation =
    answers.wake_experience === 'woke_damp_or_soaked' ||
    answers.heat_location === 'damp_or_clammy_skin';
  if (
    modifiers.includes('moisture_may_prolong_discomfort') &&
    hasDirectMoistureObservation &&
    answers.after_episode === 'became_cold_or_shivery' &&
    clues.length < 4
  ) {
    clues.push('You said you woke damp and later felt cold or shivery.');
  }

  return {
    title,
    interpretation,
    clues: clues.slice(0, 4),
    uncertainty: uncertaintyNotes(answers),
    doesNotEstablish:
      'This result does not explain why the heat happened. Cooling may change comfort, but it cannot identify or treat a medical cause.',
  };
}
