import {
  AFTER_EPISODE_VALUES,
  CHANGE_STATUS_VALUES,
  CO_SLEEPER_STATE_VALUES,
  FREQUENCY_VALUES,
  HEAT_LOCATION_VALUES,
  NOISE_SENSITIVITY_VALUES,
  PREVIOUS_ATTEMPT_VALUES,
  QUESTION_IDS,
  WAKE_EXPERIENCE_VALUES,
  WHOLE_ROOM_COOLING_EFFECT_VALUES,
  type AssessmentAnswers,
  type ValidationIssue,
  type ValidationResult,
} from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAllowed<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && allowed.includes(value as T);
}

export function validateAnswers(input: unknown): ValidationResult {
  if (!isRecord(input)) {
    return {
      valid: false,
      answers: {},
      issues: [
        {
          code: 'not_an_object',
          message: 'Assessment answers must be an object.',
        },
      ],
    };
  }

  const issues: ValidationIssue[] = [];
  const answers: {
    -readonly [Key in keyof AssessmentAnswers]: AssessmentAnswers[Key];
  } = {};
  const knownQuestionIds = new Set<string>(QUESTION_IDS);

  for (const key of Object.keys(input)) {
    if (!knownQuestionIds.has(key)) {
      issues.push({
        questionId: key,
        code: 'unknown_question',
        message: `Unknown assessment question: ${key}.`,
      });
    }
  }

  const assignSingle = <Key extends Exclude<keyof AssessmentAnswers, 'previous_attempts'>>(
    key: Key,
    allowed: readonly NonNullable<AssessmentAnswers[Key]>[],
  ): void => {
    const value = input[key];
    if (value === undefined) return;

    if (!isAllowed(value, allowed as readonly string[])) {
      issues.push({
        questionId: key,
        code: 'invalid_answer',
        message: `Invalid answer for ${key}.`,
      });
      return;
    }

    answers[key] = value as AssessmentAnswers[Key];
  };

  assignSingle('wake_experience', WAKE_EXPERIENCE_VALUES);
  assignSingle('co_sleeper_state', CO_SLEEPER_STATE_VALUES);
  assignSingle('after_episode', AFTER_EPISODE_VALUES);
  assignSingle('heat_location', HEAT_LOCATION_VALUES);
  assignSingle('whole_room_cooling_effect', WHOLE_ROOM_COOLING_EFFECT_VALUES);
  assignSingle('frequency', FREQUENCY_VALUES);
  assignSingle('change_status', CHANGE_STATUS_VALUES);
  assignSingle('noise_sensitivity', NOISE_SENSITIVITY_VALUES);

  const previousAttempts = input.previous_attempts;
  if (previousAttempts !== undefined) {
    if (
      !Array.isArray(previousAttempts) ||
      previousAttempts.some((attempt) => !isAllowed(attempt, PREVIOUS_ATTEMPT_VALUES))
    ) {
      issues.push({
        questionId: 'previous_attempts',
        code: 'invalid_multiple_answer',
        message: 'Previous attempts must contain only supported answer values.',
      });
    } else {
      const uniqueAttempts = [...new Set(previousAttempts)];
      if (
        (uniqueAttempts.includes('nothing_yet') || uniqueAttempts.includes('not_sure')) &&
        uniqueAttempts.length > 1
      ) {
        issues.push({
          questionId: 'previous_attempts',
          code: 'mutually_exclusive_answer',
          message:
            '“Nothing yet” and “I’m not sure” cannot be combined with another previous attempt.',
        });
      } else {
        answers.previous_attempts = uniqueAttempts;
      }
    }
  }

  return {
    valid: issues.length === 0,
    answers,
    issues,
  };
}
