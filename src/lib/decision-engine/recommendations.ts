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
      title: 'Do not buy a powered cooling system yet',
      body: 'First record one baseline night without changing your usual setup. Powered cooling can add noise, cleaning, parts, upkeep, and cost.',
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
      body: 'If only one side needs cooling, try a change on that side without making the other sleeper colder.',
    };
  }

  if (answers.previous_attempts?.includes('cooling_sheets') === true) {
    return {
      id: 'do_not_repeat_cool_to_touch_yet',
      title: 'Do not assume another cool-to-touch layer will last all night',
      body: 'Feeling cool at first is not the same as removing heat all night. Test the bed setup before trying the same approach again.',
    };
  }

  if (primaryPattern === 'whole_room_heat') {
    return {
      id: 'do_not_buy_dual_zone_yet',
      title: 'Do not pay for dual-zone control yet',
      body: 'If both sleepers want the same temperature, first try one ordinary room change.',
    };
  }

  return {
    id: 'do_not_choose_active_system_yet',
    title: 'Do not buy a powered cooling system yet',
    body: 'First record one baseline night without changing your usual setup. Powered cooling can add noise, cleaning, parts, upkeep, and cost.',
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
        'Your answers do not yet show whether the room, bed, or one side should change.',
      ],
      caveat: 'Uncertainty is not a reason to buy a powered system.',
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
      reasons: [
        'A simpler test can help you decide whether to change the room, bed, or one side.',
      ],
      caveat: 'Try the simpler change before comparing powered cooling.',
    };
  }

  const reasons = [
    'Sleep disruption is frequent.',
    'Only one side appears to need stronger cooling.',
    'Whole-room cooling did not solve the problem or made the other sleeper too cold.',
    'At least two simpler or lower-cost changes have already been tried.',
  ];

  if (preferences.acceptsNoiseMaintenanceAndExpense === true) {
    return {
      fit: 'personal_or_dual_zone_active_system_fits_environmental_constraint',
      reasons,
      caveat:
        'Powered cooling may offer control on one side, but check noise, cleaning, upkeep, moisture, parts, and cost before deciding.',
    };
  }

  return {
    fit: 'active_one_sided_system_may_be_worth_comparing',
    reasons,
    caveat:
      'Comparing is optional. Decide whether noise, cleaning, upkeep, and cost are acceptable before considering powered cooling.',
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
      'This tool looks only at the sleep environment and comfort. It cannot explain the medical cause of night sweats. Talk with a qualified healthcare professional if symptoms are new, worsening, frequent, severe, soaking, or concerning. Seek urgent help if you feel seriously unwell.',
  };
}
