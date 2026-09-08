import type { AssessmentAnswers, Modifier } from './types';

export function determineModifiers(answers: AssessmentAnswers): readonly Modifier[] {
  const modifiers: Modifier[] = [];
  const roomCoolingMadePartnerTooCold =
    answers.previous_attempts?.includes('room_cooling_made_partner_too_cold') === true;

  const directMoistureSignal =
    answers.wake_experience === 'woke_damp_or_soaked' ||
    answers.heat_location === 'damp_or_clammy_skin';
  const moistureRecoverySignal =
    directMoistureSignal && answers.after_episode === 'became_cold_or_shivery';

  // Dampness alone is an observation, but it does not establish that moisture
  // prolonged recovery. Keep this modifier tied to the explicit recovery answer.
  if (moistureRecoverySignal) {
    modifiers.push('moisture_may_prolong_discomfort');
  }

  if (
    answers.co_sleeper_state === 'partner_comfortable' ||
    answers.co_sleeper_state === 'partner_cold' ||
    answers.whole_room_cooling_effect === 'partner_became_too_cold' ||
    roomCoolingMadePartnerTooCold
  ) {
    modifiers.push('one_sided_solution_needed');
  }

  if (
    answers.whole_room_cooling_effect === 'did_not_solve' ||
    answers.whole_room_cooling_effect === 'partner_became_too_cold' ||
    roomCoolingMadePartnerTooCold
  ) {
    modifiers.push('whole_room_cooling_has_failed');
  }

  if (answers.noise_sensitivity === 'very_important') {
    modifiers.push('noise_sensitive_household');
  }

  if (
    answers.frequency === 'three_or_four_nights' ||
    answers.frequency === 'five_or_more_nights'
  ) {
    modifiers.push('frequent_sleep_disruption');
  }

  if (answers.change_status === 'yes') {
    modifiers.push('new_or_worsening_pattern');
  }

  return modifiers;
}
