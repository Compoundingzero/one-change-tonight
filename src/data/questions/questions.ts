import type {
  AssessmentAnswers,
  PreviousAttempt,
  QuestionId,
} from '../../lib/decision-engine/types';

export interface QuestionOption {
  readonly value: string;
  readonly label: string;
}

export interface QuestionDefinition {
  readonly id: QuestionId;
  readonly prompt: string;
  readonly whyItMatters: string;
  readonly answerKind: 'single' | 'multiple';
  readonly options: readonly QuestionOption[];
  /** An unanswered screen is treated as uncertainty, never as medical evidence. */
  readonly allowsUnanswered: true;
}

export const QUESTION_DEFINITIONS = [
  {
    id: 'wake_experience',
    prompt: 'What best describes the moment you woke?',
    whyItMatters:
      'How the heat appeared helps separate room and bed conditions from a sudden personal-heat pattern.',
    answerKind: 'single',
    allowsUnanswered: true,
    options: [
      { value: 'sudden_wave', label: 'A sudden wave of heat woke me' },
      { value: 'gradually_too_hot', label: 'I gradually became too hot' },
      { value: 'woke_damp_or_soaked', label: 'I woke damp or soaked' },
      { value: 'bed_became_hotter', label: 'The bed became hotter over time' },
      { value: 'whole_bedroom_hot', label: 'The whole bedroom felt hot' },
      { value: 'not_sure', label: 'I’m not sure' },
    ],
  },
  {
    id: 'co_sleeper_state',
    prompt: 'How did the room feel to the other sleeper?',
    whyItMatters:
      'Different experiences in the same room can make a one-sided experiment more useful than further whole-room cooling.',
    answerKind: 'single',
    allowsUnanswered: true,
    options: [
      { value: 'partner_also_hot', label: 'My partner was also hot' },
      { value: 'partner_comfortable', label: 'My partner was comfortable' },
      { value: 'partner_cold', label: 'My partner was cold' },
      { value: 'sleep_alone', label: 'I sleep alone' },
      { value: 'not_sure', label: 'I’m not sure' },
    ],
  },
  {
    id: 'after_episode',
    prompt: 'What happened after the heat began to ease?',
    whyItMatters:
      'Recording moisture, temperature, and timing separately can show what remained after the strongest heat eased.',
    answerKind: 'single',
    allowsUnanswered: true,
    options: [
      { value: 'stayed_hot', label: 'I stayed hot' },
      { value: 'became_comfortable', label: 'I became comfortable' },
      { value: 'became_cold_or_shivery', label: 'I became cold or shivery' },
      { value: 'heat_did_not_ease', label: 'The heat did not really ease' },
      { value: 'not_sure', label: 'I’m not sure' },
    ],
  },
  {
    id: 'heat_location',
    prompt: 'Where did the heat or dampness feel most noticeable?',
    whyItMatters:
      'Location can help choose which environmental variable is most useful to test first.',
    answerKind: 'single',
    allowsUnanswered: true,
    options: [
      { value: 'underneath_or_mattress', label: 'Underneath me or in the mattress' },
      { value: 'under_covers', label: 'Under the covers' },
      {
        value: 'upper_body_face_or_chest',
        label: 'In my upper body, face, or chest',
      },
      { value: 'throughout_room', label: 'Throughout the entire room' },
      { value: 'damp_or_clammy_skin', label: 'Damp or clammy against my skin' },
      { value: 'not_sure', label: 'I’m not sure' },
    ],
  },
  {
    id: 'whole_room_cooling_effect',
    prompt: 'What happened when you tried cooling the whole room?',
    whyItMatters:
      'A room change that did not help—or made a partner too cold—can make another local experiment more informative.',
    answerKind: 'single',
    allowsUnanswered: true,
    options: [
      { value: 'helped_a_lot', label: 'It helped a lot' },
      { value: 'helped_somewhat', label: 'It helped somewhat' },
      { value: 'did_not_solve', label: 'It did not solve the problem' },
      { value: 'partner_became_too_cold', label: 'My partner became too cold' },
      { value: 'not_tried', label: 'I have not tried it' },
      { value: 'not_sure', label: 'I’m not sure' },
    ],
  },
  {
    id: 'previous_attempts',
    prompt: 'What have you already tried, and what happened?',
    whyItMatters:
      'Your plan should not repeat an environmental change that has already failed to provide useful information.',
    answerKind: 'multiple',
    allowsUnanswered: true,
    options: [
      { value: 'lower_thermostat', label: 'Lower thermostat' },
      { value: 'open_window', label: 'Open window' },
      { value: 'bedside_or_room_fan', label: 'Bedside or room fan' },
      { value: 'lighter_bedding', label: 'Lighter bedding' },
      { value: 'separate_bedding', label: 'Separate bedding' },
      { value: 'cooling_sheets', label: 'Cooling sheets' },
      { value: 'cooling_pillow', label: 'Cooling pillow' },
      { value: 'cooling_topper', label: 'Cooling topper' },
      { value: 'mattress_change', label: 'New mattress or mattress change' },
      { value: 'dehumidifier', label: 'Dehumidifier' },
      { value: 'sleeping_separately', label: 'Sleeping separately' },
      {
        value: 'room_cooling_made_partner_too_cold',
        label: 'Room cooling made my partner too cold',
      },
      { value: 'nothing_yet', label: 'Nothing yet' },
      { value: 'not_sure', label: 'I’m not sure' },
      { value: 'something_else', label: 'Something else' },
    ],
  },
  {
    id: 'frequency',
    prompt: 'How often is night heat disrupting your sleep?',
    whyItMatters:
      'Frequency changes the care reminder and whether a more involved environmental comparison is worth considering.',
    answerKind: 'single',
    allowsUnanswered: true,
    options: [
      { value: 'less_than_weekly', label: 'Less than once a week' },
      { value: 'one_or_two_nights', label: 'One or two nights a week' },
      { value: 'three_or_four_nights', label: 'Three or four nights a week' },
      { value: 'five_or_more_nights', label: 'Five or more nights a week' },
      { value: 'not_sure', label: 'I’m not sure' },
    ],
  },
  {
    id: 'change_status',
    prompt: 'Is this pattern new or getting worse?',
    whyItMatters:
      'This answer is used only to strengthen a reminder to speak with a qualified healthcare professional.',
    answerKind: 'single',
    allowsUnanswered: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'not_sure', label: 'I’m not sure' },
      { value: 'prefer_not_to_answer', label: 'Prefer not to answer' },
    ],
  },
  {
    id: 'noise_sensitivity',
    prompt: 'How important is quiet for this experiment?',
    whyItMatters: 'Noise sensitivity can rule out airflow as tonight’s smallest useful change.',
    answerKind: 'single',
    allowsUnanswered: true,
    options: [
      { value: 'very_important', label: 'Very important; small sounds wake us' },
      { value: 'some_noise_acceptable', label: 'Some noise is acceptable' },
      { value: 'not_a_major_concern', label: 'Noise is not a major concern' },
      { value: 'not_sure', label: 'I’m not sure' },
    ],
  },
] as const satisfies readonly QuestionDefinition[];

export const MAX_PRIMARY_QUESTION_SCREENS = 7;
export const MAX_OPTIONAL_QUESTION_SCREENS = 1;

const ROOM_COOLING_ATTEMPTS: ReadonlySet<PreviousAttempt> = new Set([
  'lower_thermostat',
  'open_window',
]);

function hasRoomCoolingAttempt(attempts: readonly PreviousAttempt[] | undefined): boolean {
  return attempts?.some((attempt) => ROOM_COOLING_ATTEMPTS.has(attempt)) ?? false;
}

function selectPatternQuestion(answers: AssessmentAnswers): QuestionId {
  const suddenOrMoistureLed =
    answers.wake_experience === 'sudden_wave' ||
    answers.wake_experience === 'woke_damp_or_soaked';

  if (suddenOrMoistureLed) {
    return 'after_episode';
  }

  if (
    hasRoomCoolingAttempt(answers.previous_attempts) ||
    answers.wake_experience === 'whole_bedroom_hot' ||
    answers.wake_experience === 'gradually_too_hot' ||
    answers.wake_experience === 'bed_became_hotter'
  ) {
    return 'whole_room_cooling_effect';
  }

  return 'after_episode';
}

/**
 * All nine question definitions are available, but no user sees all nine.
 * Six high-value questions are stable, one pattern-disambiguating question is
 * selected adaptively, and noise is the sole optional follow-up.
 */
export function getAdaptiveQuestionPath(answers: AssessmentAnswers): readonly QuestionId[] {
  const primary: QuestionId[] = [
    'wake_experience',
    'co_sleeper_state',
    'heat_location',
    'previous_attempts',
    'frequency',
    'change_status',
    selectPatternQuestion(answers),
  ];

  const likelyPartnerConstraint =
    answers.co_sleeper_state === 'partner_comfortable' ||
    answers.co_sleeper_state === 'partner_cold' ||
    answers.whole_room_cooling_effect === 'partner_became_too_cold' ||
    answers.previous_attempts?.includes('room_cooling_made_partner_too_cold') === true;
  const likelyAirflowPlan =
    answers.wake_experience === 'sudden_wave' ||
    answers.previous_attempts?.includes('bedside_or_room_fan') === true;

  if (likelyPartnerConstraint || likelyAirflowPlan) {
    return [...primary, 'noise_sensitivity'];
  }

  return primary;
}

export function getQuestionDefinition(id: QuestionId): QuestionDefinition {
  const question = QUESTION_DEFINITIONS.find((candidate) => candidate.id === id);
  // The satisfies check above keeps this exhaustive; this guard protects
  // runtime callers receiving untrusted strings through a cast.
  if (!question) {
    throw new Error(`Unknown question: ${id}`);
  }
  return question;
}
