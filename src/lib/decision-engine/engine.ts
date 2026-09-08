import type { PremiumPreferences, DecisionEngineResult } from './types';
import { buildExplanation } from './explanation';
import { determineModifiers } from './modifiers';
import {
  buildCareReminder,
  determinePremiumFit,
  selectDoNotBuyGuidance,
  selectExperiment,
} from './recommendations';
import { calculatePatternScores, determinePrimaryPattern } from './scoring';
import { validateAnswers } from './validation';

export class InvalidAssessmentAnswersError extends Error {
  readonly issues: ReturnType<typeof validateAnswers>['issues'];

  constructor(issues: ReturnType<typeof validateAnswers>['issues']) {
    super('Assessment answers failed validation.');
    this.name = 'InvalidAssessmentAnswersError';
    this.issues = issues;
  }
}

/**
 * Runs the complete local decision pipeline. This function has no network,
 * storage, time, randomness, or UI dependencies.
 */
export function evaluateAssessment(
  input: unknown,
  premiumPreferences: PremiumPreferences = {},
): DecisionEngineResult {
  const validation = validateAnswers(input);
  if (!validation.valid) {
    throw new InvalidAssessmentAnswersError(validation.issues);
  }

  const answers = validation.answers;
  const scores = calculatePatternScores(answers);
  const pattern = determinePrimaryPattern(scores, answers);
  const modifiers = determineModifiers(answers);
  const experiment = selectExperiment(pattern.primaryPattern, modifiers, answers);

  return {
    primaryPattern: pattern.primaryPattern,
    clarity: pattern.clarity,
    modifiers,
    experimentId: experiment.id,
    doNotBuy: selectDoNotBuyGuidance(pattern.primaryPattern, modifiers, answers),
    premiumFit: determinePremiumFit(
      pattern.primaryPattern,
      answers,
      modifiers,
      premiumPreferences,
    ),
    explanation: buildExplanation(pattern.primaryPattern, pattern.clarity, modifiers, answers),
    careReminder: buildCareReminder(answers, modifiers),
  };
}
