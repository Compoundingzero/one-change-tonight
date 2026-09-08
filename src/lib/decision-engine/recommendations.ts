import { getExperiment, type ExperimentDefinition } from '../../data/experiments/experiments';
import type {
  AssessmentAnswers,
  CareReminder,
  CareReminderReason,
  DoNotBuyGuidance,
  Modifier,
  PremiumFitResult,
  PremiumPreferences,
  PrimaryPattern,
} from './types';

const LOWER_BURDEN_ATTEMPTS = new Set<
  NonNullable<AssessmentAnswers['previous_attempts']>[number]
>([
  'lower_thermostat',
  'open_window',
  'bedside_or_room_fan',
  'lighter_bedding',
  'separate_bedding',
  'cooling_sheets',
  'cooling_pillow',
  'dehumidifier',
]);

function hasModifier(modifiers: readonly Modifier[], modifier: Modifier): boolean {
  return modifiers.includes(modifier);
}

function lowerBurdenAttemptCount(answers: AssessmentAnswers): number {
  return new Set(
    (answers.previous_attempts ?? []).filter((attempt) => LOWER_BURDEN_ATTEMPTS.has(attempt)),
  ).size;
}

export function selectExperiment(
  primaryPattern: PrimaryPattern,
  modifiers: readonly Modifier[],
  answers: AssessmentAnswers,
): ExperimentDefinition {
  const hasMoistureRecoveryEvidence =
    hasModifier(modifiers, 'moisture_may_prolong_discomfort') &&
    answers.after_episode === 'became_cold_or_shivery';

  if (hasMoistureRecoveryEvidence) {
    return getExperiment('prepare_one_dry_layer');
  }

  if (primaryPattern === 'mixed_or_uncertain') {
    return getExperiment('measure_first');
  }

  if (primaryPattern === 'whole_room_heat') {
    return getExperiment('observe_room_and_both_sleepers');
  }

  if (primaryPattern === 'bed_heat_build_up') {
    const alreadyTriedBedSurfaceChange =
      answers.previous_attempts?.some((attempt) =>
        ['lighter_bedding', 'cooling_sheets', 'cooling_topper'].includes(attempt),
      ) === true;
    const separateCoversNotTried =
      answers.previous_attempts?.includes('separate_bedding') !== true;

    if (
      hasModifier(modifiers, 'one_sided_solution_needed') &&
      alreadyTriedBedSurfaceChange &&
      separateCoversNotTried
    ) {
      return getExperiment('separate_top_covers');
    }

    return getExperiment('change_one_bed_layer');
  }

  const fanAlreadyTried = answers.previous_attempts?.includes('bedside_or_room_fan') === true;
  const noiseSensitive = hasModifier(modifiers, 'noise_sensitive_household');

  if (
    hasModifier(modifiers, 'one_sided_solution_needed') &&
    !fanAlreadyTried &&
    !noiseSensitive
  ) {
    return getExperiment('directed_side_airflow');
  }

  return getExperiment('local_comfort_during_episode');
}

export function selectDoNotBuyGuidance(
  primaryPattern: PrimaryPattern,
  modifiers: readonly Modifier[],
  answers: AssessmentAnswers,
): DoNotBuyGuidance {
  if (primaryPattern === 'mixed_or_uncertain') {
    return {
      id: 'do_not_choose_active_system_yet',
      title: 'Do not choose an active system yet',
      body: 'Collect one clearer baseline before accepting extra noise, cleaning, parts, maintenance, or expense.',
    };
  }

  if (primaryPattern === 'bed_heat_build_up') {
    return {
      id: 'do_not_replace_mattress_yet',
      title: 'Do not replace the mattress yet',
      body: 'Test one removable layer above it first so you can learn whether that layer is contributing.',
    };
  }

  if (hasModifier(modifiers, 'one_sided_solution_needed')) {
    return {
      id: 'do_not_escalate_room_cooling_yet',
      title: 'Do not add stronger whole-room cooling yet',
      body: 'When only one side needs a different environment, a local experiment can teach you more without making the other sleeper colder.',
    };
  }

  if (answers.previous_attempts?.includes('cooling_sheets') === true) {
    return {
      id: 'do_not_repeat_cool_to_touch_yet',
      title: 'Do not assume another cool-to-touch layer will last all night',
      body: 'First-touch coolness and continuous heat removal are different constraints. Test the bed setup before repeating the same mechanism.',
    };
  }

  if (primaryPattern === 'whole_room_heat') {
    return {
      id: 'do_not_buy_dual_zone_yet',
      title: 'Do not pay for dual-zone control yet',
      body: 'If both sleepers want the same conditions, first test whether one ordinary room change addresses the shared constraint.',
    };
  }

  return {
    id: 'do_not_choose_active_system_yet',
    title: 'Do not choose an active system yet',
    body: 'Collect one clearer baseline before accepting extra noise, cleaning, parts, maintenance, or expense.',
  };
}

export function determinePremiumFit(
  primaryPattern: PrimaryPattern,
  answers: AssessmentAnswers,
  modifiers: readonly Modifier[],
  preferences: PremiumPreferences = {},
): PremiumFitResult {
  if (primaryPattern === 'mixed_or_uncertain') {
    return {
      fit: 'premium_active_cooling_not_yet_justified',
      reasons: [
        'A clearer environmental pattern is needed before comparing a premium mechanism.',
      ],
      caveat:
        'This is not a product recommendation. Measure first rather than treating uncertainty as a premium fit signal.',
    };
  }

  const frequent = hasModifier(modifiers, 'frequent_sleep_disruption');
  const oneSided = hasModifier(modifiers, 'one_sided_solution_needed');
  const wholeRoomFailed = hasModifier(modifiers, 'whole_room_cooling_has_failed');
  const enoughLowerBurdenAttempts = lowerBurdenAttemptCount(answers) >= 2;
  const roomAlreadyReasonable =
    answers.co_sleeper_state === 'partner_comfortable' ||
    answers.co_sleeper_state === 'partner_cold' ||
    wholeRoomFailed;

  const comparisonFit =
    frequent &&
    oneSided &&
    wholeRoomFailed &&
    enoughLowerBurdenAttempts &&
    roomAlreadyReasonable;

  if (!comparisonFit) {
    return {
      fit: 'premium_active_cooling_not_yet_justified',
      reasons: ['A lower-burden experiment can still clarify the environmental constraint.'],
      caveat:
        'This is not a product recommendation. It says only that a premium comparison is premature.',
    };
  }

  const reasons = [
    'Sleep disruption is frequent.',
    'Only one side appears to need stronger cooling.',
    'Whole-room cooling did not solve the problem or made the other sleeper too cold.',
    'At least two lower-burden approaches have already been tried.',
  ];

  if (preferences.acceptsNoiseMaintenanceAndExpense === true) {
    return {
      fit: 'personal_or_dual_zone_active_system_fits_environmental_constraint',
      reasons,
      caveat:
        'This describes mechanism fit only. Compare noise, maintenance, moisture, complexity, and expense; it is not an instruction to purchase.',
    };
  }

  return {
    fit: 'active_one_sided_system_may_be_worth_comparing',
    reasons,
    caveat:
      'Comparison is optional. Confirm tolerance for possible noise, maintenance, and expense before treating an active system as a fit.',
  };
}

function hasExplicitUncertainty(answers: AssessmentAnswers): boolean {
  return Object.values(answers).some((answer) => {
    if (Array.isArray(answer)) return answer.includes('not_sure');
    return answer === 'not_sure';
  });
}

export function buildCareReminder(
  answers: AssessmentAnswers,
  modifiers: readonly Modifier[],
): CareReminder {
  const reasons: CareReminderReason[] = [];

  if (hasModifier(modifiers, 'frequent_sleep_disruption')) {
    reasons.push('frequent_sleep_disruption');
  }
  if (hasModifier(modifiers, 'new_or_worsening_pattern')) {
    reasons.push('new_or_worsening_pattern');
  }
  if (answers.wake_experience === 'woke_damp_or_soaked') {
    reasons.push('woke_damp_or_soaked');
  }
  if (hasExplicitUncertainty(answers)) {
    reasons.push('explicit_uncertainty');
  }

  return {
    show: reasons.length > 0,
    reasons,
    message:
      'This tool examines the sleep environment and what you can test for comfort. It cannot identify the medical cause of night sweats. New, worsening, frequent, severe, or concerning symptoms deserve a conversation with a qualified healthcare professional. Seek urgent help if you feel seriously unwell.',
  };
}
