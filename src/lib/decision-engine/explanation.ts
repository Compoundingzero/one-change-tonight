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
    .map(({ rule }) => rule.clue)
    .slice(0, 4);
}

function neutralObservationClues(answers: AssessmentAnswers): string[] {
  const clues: string[] = [];

  if (answers.wake_experience === 'not_sure') {
    clues.push('You selected “I’m not sure” for how the heat began.');
  }
  if (answers.co_sleeper_state === 'sleep_alone') {
    clues.push('You reported sleeping alone.');
  } else if (answers.co_sleeper_state === 'not_sure') {
    clues.push('You selected “I’m not sure” for the other sleeper’s experience.');
  }
  if (answers.after_episode === 'not_sure') {
    clues.push('You selected “I’m not sure” for what happened after the episode.');
  }
  if (answers.heat_location === 'not_sure') {
    clues.push('You selected “I’m not sure” for where the heat was strongest.');
  }
  if (answers.whole_room_cooling_effect === 'not_tried') {
    clues.push('You selected that whole-room cooling had not been tried.');
  } else if (answers.whole_room_cooling_effect === 'not_sure') {
    clues.push('You selected “I’m not sure” for the effect of whole-room cooling.');
  }
  if (answers.previous_attempts?.includes('nothing_yet') === true) {
    clues.push('You reported that you have not tried an environmental change yet.');
  } else if (answers.previous_attempts?.includes('not_sure') === true) {
    clues.push('You were not sure which environmental changes you had tried.');
  }

  return clues;
}

function missingObservationClues(answers: AssessmentAnswers): string[] {
  const clues: string[] = [];
  const missing: ReadonlyArray<readonly [keyof AssessmentAnswers, string]> = [
    ['wake_experience', 'No answer was recorded for how the heat began.'],
    ['co_sleeper_state', 'No answer was recorded for the other sleeper’s experience.'],
    ['after_episode', 'No answer was recorded for what happened after the episode.'],
    ['heat_location', 'No answer was recorded for where the heat was strongest.'],
    [
      'whole_room_cooling_effect',
      'No answer was recorded for the effect of whole-room cooling.',
    ],
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

  const clues = selected.map(({ rule }) => rule.clue);
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
    ['wake_experience', 'How the heat began remains uncertain.'],
    ['co_sleeper_state', 'The other sleeper’s experience remains uncertain.'],
    ['after_episode', 'What happened after the heat eased remains uncertain.'],
    ['heat_location', 'Where the heat was concentrated remains uncertain.'],
    ['whole_room_cooling_effect', 'The effect of whole-room cooling remains uncertain.'],
  ];

  for (const [key, note] of labels) {
    if (answers[key] === 'not_sure') notes.push(note);
  }

  if (notes.length === 0) {
    notes.push(
      'The observations describe comfort conditions, not the medical reason for the episode.',
    );
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
      title = 'The whole room appears to be contributing';
      interpretation =
        'Your answers fit a pattern in which shared room conditions are a useful first environmental question.';
      clues = patternClues('whole_room_heat', answers);
      break;
    case 'bed_heat_build_up':
      title = 'Heat may be accumulating around the bed';
      interpretation =
        'Your answers make one removable bed or bedding layer a useful first variable to examine.';
      clues = patternClues('bed_heat_build_up', answers);
      break;
    case 'sudden_personal_heat':
      title = 'The observations lean toward heat concentrated around you';
      interpretation =
        'A sudden or localized personal-heat pattern is a useful first environmental question; room conditions may still contribute.';
      clues = patternClues('sudden_personal_heat', answers);
      break;
    case 'mixed_or_uncertain':
      title =
        clarity === 'not_enough_information'
          ? 'There is not enough information yet'
          : 'More than one pattern may be involved';
      interpretation =
        clarity === 'not_enough_information'
          ? 'A baseline night can provide a more useful next observation than a speculative recommendation.'
          : 'The answers conflict or support more than one environmental pattern, so the tool will not force a conclusion.';
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
    clues.push(
      'You explicitly reported both dampness and becoming cold or shivery afterwards.',
    );
  }

  return {
    title,
    interpretation,
    clues: clues.slice(0, 4),
    uncertainty: uncertaintyNotes(answers),
    doesNotEstablish:
      'This pattern cannot determine the medical cause. Environmental cooling may affect comfort without treating the underlying reason for the episode.',
  };
}
