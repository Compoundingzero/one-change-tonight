import {
  EXPERIMENT_IDS,
  type AssessmentAnswers,
  type ExperimentId,
} from '../decision-engine/types';
import { validateAnswers } from '../decision-engine/validation';

export const LOCAL_STATE_SCHEMA_VERSION = 1 as const;
export const LOCAL_STATE_TTL_DAYS = 90;
export const LOCAL_STATE_TTL_MS = LOCAL_STATE_TTL_DAYS * 24 * 60 * 60 * 1000;

export const HEAT_AWAKENING_VALUES = ['0', '1', '2', '3_plus'] as const;
export type HeatAwakenings = (typeof HEAT_AWAKENING_VALUES)[number];

export const MOISTURE_VALUES = ['dry', 'damp', 'soaked'] as const;
export type Moisture = (typeof MOISTURE_VALUES)[number];

export const COLD_AFTER_VALUES = ['no', 'slightly', 'strongly'] as const;
export type ColdAfter = (typeof COLD_AFTER_VALUES)[number];

export const COMFORT_TIME_VALUES = [
  'under_10_minutes',
  '10_to_30_minutes',
  '30_to_60_minutes',
  'over_60_minutes',
  'unknown',
] as const;
export type ComfortTime = (typeof COMFORT_TIME_VALUES)[number];

export const PARTNER_DISTURBED_VALUES = ['yes', 'no', 'not_applicable'] as const;
export type PartnerDisturbed = (typeof PARTNER_DISTURBED_VALUES)[number];

export const EXPERIMENT_HELP_VALUES = ['no', 'unsure', 'somewhat', 'clearly'] as const;
export type ExperimentHelp = (typeof EXPERIMENT_HELP_VALUES)[number];

export const CONTINUE_EXPERIMENT_VALUES = ['yes', 'no', 'unsure'] as const;
export type ContinueExperiment = (typeof CONTINUE_EXPERIMENT_VALUES)[number];

export const CHECK_IN_NOT_RECORDED = 'not_recorded' as const;
export type CheckInNotRecorded = typeof CHECK_IN_NOT_RECORDED;

export const HEAT_AWAKENING_DRAFT_VALUES = [
  CHECK_IN_NOT_RECORDED,
  ...HEAT_AWAKENING_VALUES,
] as const;
export type DraftHeatAwakenings = (typeof HEAT_AWAKENING_DRAFT_VALUES)[number];

export const MOISTURE_DRAFT_VALUES = [CHECK_IN_NOT_RECORDED, ...MOISTURE_VALUES] as const;
export type DraftMoisture = (typeof MOISTURE_DRAFT_VALUES)[number];

export const COLD_AFTER_DRAFT_VALUES = [CHECK_IN_NOT_RECORDED, ...COLD_AFTER_VALUES] as const;
export type DraftColdAfter = (typeof COLD_AFTER_DRAFT_VALUES)[number];

export const COMFORT_TIME_DRAFT_VALUES = [
  CHECK_IN_NOT_RECORDED,
  ...COMFORT_TIME_VALUES,
] as const;
export type DraftComfortTime = (typeof COMFORT_TIME_DRAFT_VALUES)[number];

export const PARTNER_DISTURBED_DRAFT_VALUES = [
  CHECK_IN_NOT_RECORDED,
  ...PARTNER_DISTURBED_VALUES,
] as const;
export type DraftPartnerDisturbed = (typeof PARTNER_DISTURBED_DRAFT_VALUES)[number];

export const EXPERIMENT_HELP_DRAFT_VALUES = [
  CHECK_IN_NOT_RECORDED,
  ...EXPERIMENT_HELP_VALUES,
] as const;
export type DraftExperimentHelp = (typeof EXPERIMENT_HELP_DRAFT_VALUES)[number];

export const CONTINUE_EXPERIMENT_DRAFT_VALUES = [
  CHECK_IN_NOT_RECORDED,
  ...CONTINUE_EXPERIMENT_VALUES,
] as const;
export type DraftContinueExperiment = (typeof CONTINUE_EXPERIMENT_DRAFT_VALUES)[number];

export interface MorningCheckIn {
  readonly night: 1 | 2 | 3;
  readonly date: string;
  readonly heatRelatedAwakenings: HeatAwakenings;
  readonly moisture: Moisture;
  readonly becameColdAfterwards: ColdAfter;
  readonly timeToComfort: ComfortTime;
  readonly partnerDisturbed: PartnerDisturbed;
  readonly experimentHelp: ExperimentHelp;
  readonly continueExperiment: ContinueExperiment;
}

/**
 * UI-only shape. `not_recorded` is deliberately excluded from MorningCheckIn
 * and therefore cannot pass persistence normalization.
 */
export interface MorningCheckInDraft {
  readonly night: 1 | 2 | 3;
  readonly date: string;
  readonly heatRelatedAwakenings: DraftHeatAwakenings;
  readonly moisture: DraftMoisture;
  readonly becameColdAfterwards: DraftColdAfter;
  readonly timeToComfort: DraftComfortTime;
  readonly partnerDisturbed: DraftPartnerDisturbed;
  readonly experimentHelp: DraftExperimentHelp;
  readonly continueExperiment: DraftContinueExperiment;
}

export interface LocalUiPreferences {
  readonly lowBrightness: boolean;
}

export interface LocalAppStateV1 {
  readonly schemaVersion: typeof LOCAL_STATE_SCHEMA_VERSION;
  readonly assessmentAnswers: AssessmentAnswers;
  readonly selectedExperimentId?: ExperimentId;
  readonly experimentStartDate?: string;
  readonly morningCheckIns: readonly MorningCheckIn[];
  readonly uiPreferences: LocalUiPreferences;
  readonly lastUpdatedAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isOneOf<T extends string>(value: unknown, values: readonly T[]): value is T {
  return typeof value === 'string' && values.includes(value as T);
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function normalizeCheckIn(value: unknown): MorningCheckIn | null {
  if (!isRecord(value)) return null;
  if (value.night !== 1 && value.night !== 2 && value.night !== 3) return null;
  if (!isIsoDate(value.date)) return null;
  if (!isOneOf(value.heatRelatedAwakenings, HEAT_AWAKENING_VALUES)) return null;
  if (!isOneOf(value.moisture, MOISTURE_VALUES)) return null;
  if (!isOneOf(value.becameColdAfterwards, COLD_AFTER_VALUES)) return null;
  if (!isOneOf(value.timeToComfort, COMFORT_TIME_VALUES)) return null;
  if (!isOneOf(value.partnerDisturbed, PARTNER_DISTURBED_VALUES)) return null;
  if (!isOneOf(value.experimentHelp, EXPERIMENT_HELP_VALUES)) return null;
  if (!isOneOf(value.continueExperiment, CONTINUE_EXPERIMENT_VALUES)) return null;

  return {
    night: value.night,
    date: value.date,
    heatRelatedAwakenings: value.heatRelatedAwakenings,
    moisture: value.moisture,
    becameColdAfterwards: value.becameColdAfterwards,
    timeToComfort: value.timeToComfort,
    partnerDisturbed: value.partnerDisturbed,
    experimentHelp: value.experimentHelp,
    continueExperiment: value.continueExperiment,
  };
}

export function createMorningCheckInDraft(
  night: 1 | 2 | 3,
  now: Date = new Date(),
): MorningCheckInDraft {
  return {
    night,
    date: now.toISOString(),
    heatRelatedAwakenings: CHECK_IN_NOT_RECORDED,
    moisture: CHECK_IN_NOT_RECORDED,
    becameColdAfterwards: CHECK_IN_NOT_RECORDED,
    timeToComfort: CHECK_IN_NOT_RECORDED,
    partnerDisturbed: CHECK_IN_NOT_RECORDED,
    experimentHelp: CHECK_IN_NOT_RECORDED,
    continueExperiment: CHECK_IN_NOT_RECORDED,
  };
}

/** Returns null until every field has a valid persisted value. */
export function finalizeMorningCheckInDraft(draft: MorningCheckInDraft): MorningCheckIn | null {
  return normalizeCheckIn(draft);
}

function normalizeCheckIns(value: unknown): readonly MorningCheckIn[] | null {
  if (!Array.isArray(value) || value.length > 3) return null;
  const checkIns = value.map(normalizeCheckIn);
  if (checkIns.some((checkIn) => checkIn === null)) return null;

  const validCheckIns = checkIns as MorningCheckIn[];
  const nights = new Set(validCheckIns.map((checkIn) => checkIn.night));
  if (nights.size !== validCheckIns.length) return null;

  return [...validCheckIns].sort((a, b) => a.night - b.night);
}

function buildState(args: {
  assessmentAnswers: unknown;
  selectedExperimentId?: unknown;
  experimentStartDate?: unknown;
  morningCheckIns: unknown;
  lowBrightness: unknown;
  lastUpdatedAt: unknown;
}): LocalAppStateV1 | null {
  const validation = validateAnswers(args.assessmentAnswers);
  if (!validation.valid) return null;

  const checkIns = normalizeCheckIns(args.morningCheckIns);
  if (!checkIns) return null;
  if (typeof args.lowBrightness !== 'boolean') return null;
  if (!isIsoDate(args.lastUpdatedAt)) return null;

  const selectedExperimentId = args.selectedExperimentId;
  const experimentStartDate = args.experimentStartDate;

  if (selectedExperimentId !== undefined && !isOneOf(selectedExperimentId, EXPERIMENT_IDS)) {
    return null;
  }
  if (experimentStartDate !== undefined && !isIsoDate(experimentStartDate)) {
    return null;
  }

  const state: LocalAppStateV1 = {
    schemaVersion: LOCAL_STATE_SCHEMA_VERSION,
    assessmentAnswers: validation.answers,
    morningCheckIns: checkIns,
    uiPreferences: { lowBrightness: args.lowBrightness },
    lastUpdatedAt: args.lastUpdatedAt,
    ...(selectedExperimentId === undefined ? {} : { selectedExperimentId }),
    ...(experimentStartDate === undefined ? {} : { experimentStartDate }),
  };

  return state;
}

export function createEmptyLocalState(now: Date = new Date()): LocalAppStateV1 {
  return {
    schemaVersion: LOCAL_STATE_SCHEMA_VERSION,
    assessmentAnswers: {},
    morningCheckIns: [],
    uiPreferences: { lowBrightness: false },
    lastUpdatedAt: now.toISOString(),
  };
}

/**
 * Migrates only known fields. Unknown fields—including accidental PII—are
 * dropped rather than copied forward.
 */
export function migrateLocalState(value: unknown): LocalAppStateV1 | null {
  if (!isRecord(value)) return null;

  if (value.schemaVersion === LOCAL_STATE_SCHEMA_VERSION) {
    if (!isRecord(value.uiPreferences)) return null;
    return buildState({
      assessmentAnswers: value.assessmentAnswers,
      selectedExperimentId: value.selectedExperimentId,
      experimentStartDate: value.experimentStartDate,
      morningCheckIns: value.morningCheckIns,
      lowBrightness: value.uiPreferences.lowBrightness,
      lastUpdatedAt: value.lastUpdatedAt,
    });
  }

  // Supported legacy shape from pre-release prototypes.
  if (value.version === 0) {
    const legacyPreferences: Record<string, unknown> = isRecord(value.preferences)
      ? value.preferences
      : {};
    return buildState({
      assessmentAnswers: value.answers ?? {},
      selectedExperimentId: value.experimentId,
      experimentStartDate: value.experimentStartDate,
      morningCheckIns: value.checkIns ?? [],
      lowBrightness: legacyPreferences.lowBrightness ?? false,
      lastUpdatedAt: value.updatedAt,
    });
  }

  return null;
}

export function isLocalStateExpired(state: LocalAppStateV1, now: Date = new Date()): boolean {
  return now.getTime() - Date.parse(state.lastUpdatedAt) > LOCAL_STATE_TTL_MS;
}

/** Picks only approved fields before persistence. */
export function sanitizeLocalState(
  state: LocalAppStateV1,
  now: Date = new Date(),
): LocalAppStateV1 | null {
  return buildState({
    assessmentAnswers: state.assessmentAnswers,
    selectedExperimentId: state.selectedExperimentId,
    experimentStartDate: state.experimentStartDate,
    morningCheckIns: state.morningCheckIns,
    lowBrightness: state.uiPreferences.lowBrightness,
    lastUpdatedAt: now.toISOString(),
  });
}
