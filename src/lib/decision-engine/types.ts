export const WAKE_EXPERIENCE_VALUES = [
  'sudden_wave',
  'gradually_too_hot',
  'woke_damp_or_soaked',
  'bed_became_hotter',
  'whole_bedroom_hot',
  'not_sure',
] as const;

export type WakeExperience = (typeof WAKE_EXPERIENCE_VALUES)[number];

export const CO_SLEEPER_STATE_VALUES = [
  'partner_also_hot',
  'partner_comfortable',
  'partner_cold',
  'sleep_alone',
  'not_sure',
] as const;

export type CoSleeperState = (typeof CO_SLEEPER_STATE_VALUES)[number];

export const AFTER_EPISODE_VALUES = [
  'stayed_hot',
  'became_comfortable',
  'became_cold_or_shivery',
  'heat_did_not_ease',
  'not_sure',
] as const;

export type AfterEpisode = (typeof AFTER_EPISODE_VALUES)[number];

export const HEAT_LOCATION_VALUES = [
  'underneath_or_mattress',
  'under_covers',
  'upper_body_face_or_chest',
  'throughout_room',
  'damp_or_clammy_skin',
  'not_sure',
] as const;

export type HeatLocation = (typeof HEAT_LOCATION_VALUES)[number];

export const WHOLE_ROOM_COOLING_EFFECT_VALUES = [
  'helped_a_lot',
  'helped_somewhat',
  'did_not_solve',
  'partner_became_too_cold',
  'not_tried',
  'not_sure',
] as const;

export type WholeRoomCoolingEffect = (typeof WHOLE_ROOM_COOLING_EFFECT_VALUES)[number];

export const PREVIOUS_ATTEMPT_VALUES = [
  'lower_thermostat',
  'open_window',
  'bedside_or_room_fan',
  'room_cooling_made_partner_too_cold',
  'lighter_bedding',
  'separate_bedding',
  'cooling_sheets',
  'cooling_pillow',
  'cooling_topper',
  'mattress_change',
  'dehumidifier',
  'sleeping_separately',
  'nothing_yet',
  'not_sure',
  'something_else',
] as const;

export type PreviousAttempt = (typeof PREVIOUS_ATTEMPT_VALUES)[number];

export const FREQUENCY_VALUES = [
  'less_than_weekly',
  'one_or_two_nights',
  'three_or_four_nights',
  'five_or_more_nights',
  'not_sure',
] as const;

export type Frequency = (typeof FREQUENCY_VALUES)[number];

export const CHANGE_STATUS_VALUES = ['yes', 'no', 'not_sure', 'prefer_not_to_answer'] as const;

export type ChangeStatus = (typeof CHANGE_STATUS_VALUES)[number];

export const NOISE_SENSITIVITY_VALUES = [
  'very_important',
  'some_noise_acceptable',
  'not_a_major_concern',
  'not_sure',
] as const;

export type NoiseSensitivity = (typeof NOISE_SENSITIVITY_VALUES)[number];

export const QUESTION_IDS = [
  'wake_experience',
  'co_sleeper_state',
  'after_episode',
  'heat_location',
  'whole_room_cooling_effect',
  'previous_attempts',
  'frequency',
  'change_status',
  'noise_sensitivity',
] as const;

export type QuestionId = (typeof QUESTION_IDS)[number];

export interface AssessmentAnswers {
  readonly wake_experience?: WakeExperience;
  readonly co_sleeper_state?: CoSleeperState;
  readonly after_episode?: AfterEpisode;
  readonly heat_location?: HeatLocation;
  readonly whole_room_cooling_effect?: WholeRoomCoolingEffect;
  readonly previous_attempts?: readonly PreviousAttempt[];
  readonly frequency?: Frequency;
  readonly change_status?: ChangeStatus;
  readonly noise_sensitivity?: NoiseSensitivity;
}

export const SCORED_PATTERN_VALUES = [
  'whole_room_heat',
  'bed_heat_build_up',
  'sudden_personal_heat',
] as const;

export type ScoredPattern = (typeof SCORED_PATTERN_VALUES)[number];

export const PRIMARY_PATTERN_VALUES = [...SCORED_PATTERN_VALUES, 'mixed_or_uncertain'] as const;

export type PrimaryPattern = (typeof PRIMARY_PATTERN_VALUES)[number];

export type PatternScores = Readonly<Record<ScoredPattern, number>>;

export type PatternClarity = 'clear_pattern' | 'mixed_pattern' | 'not_enough_information';

export interface PrimaryPatternDecision {
  readonly primaryPattern: PrimaryPattern;
  readonly clarity: PatternClarity;
  /** Machine-readable reason for tests and UI selection; never a probability. */
  readonly reason:
    | 'leading_pattern'
    | 'close_scores'
    | 'material_conflict'
    | 'too_much_uncertainty'
    | 'too_little_information';
}

export const MODIFIER_VALUES = [
  'moisture_may_prolong_discomfort',
  'one_sided_solution_needed',
  'whole_room_cooling_has_failed',
  'noise_sensitive_household',
  'frequent_sleep_disruption',
  'new_or_worsening_pattern',
] as const;

export type Modifier = (typeof MODIFIER_VALUES)[number];

export const EXPERIMENT_IDS = [
  'measure_first',
  'observe_room_and_both_sleepers',
  'change_one_bed_layer',
  'directed_side_airflow',
  'separate_top_covers',
  'prepare_one_dry_layer',
  'local_comfort_during_episode',
] as const;

export type ExperimentId = (typeof EXPERIMENT_IDS)[number];

export const PREMIUM_FIT_VALUES = [
  'premium_active_cooling_not_yet_justified',
  'active_one_sided_system_may_be_worth_comparing',
  'personal_or_dual_zone_active_system_fits_environmental_constraint',
] as const;

export type PremiumFit = (typeof PREMIUM_FIT_VALUES)[number];

export interface PremiumPreferences {
  /**
   * This is intentionally separate from the core assessment. The strongest
   * premium-fit result is unavailable unless the user explicitly accepts the
   * possible noise, maintenance, and expense in a later comparison step.
   */
  readonly acceptsNoiseMaintenanceAndExpense?: boolean;
}

export interface PremiumFitResult {
  readonly fit: PremiumFit;
  readonly reasons: readonly string[];
  readonly caveat: string;
}

export interface Explanation {
  readonly title: string;
  readonly interpretation: string;
  readonly clues: readonly string[];
  readonly uncertainty: readonly string[];
  readonly doesNotEstablish: string;
}

export type CareReminderReason =
  | 'frequent_sleep_disruption'
  | 'new_or_worsening_pattern'
  | 'woke_damp_or_soaked'
  | 'explicit_uncertainty';

export interface CareReminder {
  readonly show: boolean;
  readonly reasons: readonly CareReminderReason[];
  readonly message: string;
}

export interface DoNotBuyGuidance {
  readonly id:
    | 'do_not_replace_mattress_yet'
    | 'do_not_escalate_room_cooling_yet'
    | 'do_not_repeat_cool_to_touch_yet'
    | 'do_not_buy_dual_zone_yet'
    | 'do_not_choose_active_system_yet';
  readonly title: string;
  readonly body: string;
}

export interface DecisionEngineResult {
  readonly primaryPattern: PrimaryPattern;
  readonly clarity: PatternClarity;
  readonly modifiers: readonly Modifier[];
  readonly experimentId: ExperimentId;
  readonly doNotBuy: DoNotBuyGuidance;
  readonly premiumFit: PremiumFitResult;
  readonly explanation: Explanation;
  readonly careReminder: CareReminder;
}

export interface ValidationIssue {
  readonly questionId?: string;
  readonly code:
    | 'not_an_object'
    | 'unknown_question'
    | 'invalid_answer'
    | 'invalid_multiple_answer'
    | 'mutually_exclusive_answer';
  readonly message: string;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly answers: AssessmentAnswers;
  readonly issues: readonly ValidationIssue[];
}
