import type { ExperimentId, PrimaryPattern } from '../../lib/decision-engine/types';

export type ExperimentEvidenceLevel =
  'editorial_observation_protocol' | 'environmental_mechanism';

export interface ExperimentDefinition {
  readonly id: ExperimentId;
  readonly plainLanguageName: string;
  readonly patternFit: readonly PrimaryPattern[];
  readonly purpose: string;
  readonly oneVariableToChange: string;
  readonly keepConstant: readonly string[];
  readonly steps: readonly string[];
  readonly whatToRecord: readonly string[];
  readonly stopConditions: readonly string[];
  readonly safetyNote: string;
  readonly evidenceLevel: ExperimentEvidenceLevel;
  readonly sourceIds: readonly string[];
  readonly nextIfHelps: string;
  readonly nextIfNot: string;
}

const EDITORIAL_METHOD_SOURCE = 'OCT-METHOD-2026';
const THERMAL_COMFORT_SOURCE = 'PMC-SLEEP-THERMAL-ENVIRONMENT-2012';

export const EXPERIMENTS = [
  {
    id: 'measure_first',
    plainLanguageName: 'Record one baseline night',
    patternFit: ['mixed_or_uncertain'],
    purpose: 'Get a clearer picture before changing the room or bed.',
    oneVariableToChange:
      'Keep your usual setup for one night. Record where you felt the heat, whether it came suddenly or gradually, and whether the room or another sleeper also felt hot.',
    keepConstant: [
      'Usual thermostat setting',
      'Usual bedding and sleepwear',
      'Usual fan or other cooling setup',
    ],
    steps: [
      'Keep the usual sleep setup for one night.',
      'If you wake hot, note whether the room, the bed, or mainly your body felt hot.',
      'In the morning, record the observation without trying to assign a medical cause.',
    ],
    whatToRecord: [
      'Whether heat arrived suddenly or built gradually',
      'Whether the bed or whole room felt hot',
      'Whether another sleeper was hot, comfortable, or cold',
      'Whether dampness or feeling cold afterward occurred, and how long each lasted',
    ],
    stopConditions: [
      'Stop the observation and use your normal comfort measures if remaining unchanged is uncomfortable.',
    ],
    safetyNote:
      'This baseline is optional. Do not remain uncomfortably hot or cold merely to preserve the observation.',
    evidenceLevel: 'editorial_observation_protocol',
    sourceIds: [EDITORIAL_METHOD_SOURCE],
    nextIfHelps:
      'Use the clearest new observation to choose a change to the room, bed, damp layer, or your side.',
    nextIfNot:
      'Keep the result uncertain and discuss repeated or concerning symptoms with a qualified healthcare professional.',
  },
  {
    id: 'observe_room_and_both_sleepers',
    plainLanguageName: 'Check the room and both sleepers for one night',
    patternFit: ['whole_room_heat', 'mixed_or_uncertain'],
    purpose: 'Find out whether the room and both sleepers feel hot at the same time.',
    oneVariableToChange:
      'Before making another cooling change, record the room conditions and how each sleeper felt.',
    keepConstant: ['Bedding layers', 'Personal cooling', 'Usual thermostat and fan settings'],
    steps: [
      'Use an existing temperature or humidity display only if one is already available.',
      'Record whether both sleepers feel hot when the room feels hot.',
      'Do not buy a sensor for this experiment.',
    ],
    whatToRecord: [
      'Approximate room temperature and humidity, if already available',
      'Whether each sleeper felt hot, comfortable, or cold',
      'Whether the heat stayed present rather than passing quickly',
    ],
    stopConditions: [
      'Stop if keeping the usual room setup leaves either sleeper uncomfortably hot or cold.',
    ],
    safetyNote:
      'Use ordinary safe room settings. This observes comfort; it does not test or treat the medical cause of an episode.',
    evidenceLevel: 'editorial_observation_protocol',
    sourceIds: [EDITORIAL_METHOD_SOURCE, THERMAL_COMFORT_SOURCE],
    nextIfHelps:
      'If both sleepers and the room were hot together, compare one modest whole-room adjustment next.',
    nextIfNot:
      'If only one sleeper was hot, try a change on that side instead of cooling the room further.',
  },
  {
    id: 'change_one_bed_layer',
    plainLanguageName: 'Change one removable bed layer',
    patternFit: ['bed_heat_build_up'],
    purpose: 'Test whether one layer around the sleeper is contributing to heat build-up.',
    oneVariableToChange:
      'Replace or remove only one nonessential, safely removable top layer on your side.',
    keepConstant: [
      'Thermostat setting',
      'Fan use',
      'Sleepwear',
      'The other sleeper’s bedding',
      'All other bed layers',
    ],
    steps: [
      'Choose the lightest nonessential removable top layer on your side.',
      'Remove or replace only that layer for one night.',
      'Restore it if the change makes you uncomfortably cold.',
    ],
    whatToRecord: [
      'Whether the bed still became warmer over time',
      'Number of heat-related awakenings',
      'Whether comfort improved without changing the room',
    ],
    stopConditions: [
      'Stop if you become uncomfortably cold.',
      'Do not remove a layer needed for mattress protection, hygiene, or manufacturer requirements.',
    ],
    safetyNote:
      'Do not remove a protective layer when doing so could damage the mattress or create a hygiene concern.',
    evidenceLevel: 'environmental_mechanism',
    sourceIds: [EDITORIAL_METHOD_SOURCE, THERMAL_COMFORT_SOURCE],
    nextIfHelps:
      'If improvement was consistent across the three nights, decide whether to keep this one-layer setup or compare one other variable.',
    nextIfNot:
      'Restore the layer and check the next removable layer or another part of the room or bed before replacing the mattress.',
  },
  {
    id: 'directed_side_airflow',
    plainLanguageName: 'Direct existing airflow across one side',
    patternFit: ['sudden_personal_heat', 'bed_heat_build_up'],
    purpose: 'Try a quick change on one side without cooling the whole room more.',
    oneVariableToChange:
      'Use an existing fan at the lowest setting that changes how it feels, directed across only your side.',
    keepConstant: [
      'Thermostat setting',
      'Bedding layers',
      'Sleepwear',
      'The other sleeper’s setup',
    ],
    steps: [
      'Use only a fan that is already available.',
      'Choose the lowest setting that changes how it feels.',
      'Aim airflow across your side rather than directly at the other sleeper.',
    ],
    whatToRecord: [
      'How quickly comfort changed',
      'Whether you became cold afterward',
      'Whether noise or airflow disturbed either sleeper',
    ],
    stopConditions: [
      'Stop if airflow causes discomfort, irritation, excessive cold, or sleep disruption.',
    ],
    safetyNote:
      'Respect noise sensitivity and respiratory comfort. Airflow may affect comfort without preventing the underlying episode.',
    evidenceLevel: 'environmental_mechanism',
    sourceIds: [EDITORIAL_METHOD_SOURCE, THERMAL_COMFORT_SOURCE],
    nextIfHelps:
      'If the same direction and setting helped consistently without unacceptable noise or cold, keep that familiar setup before comparing anything more involved.',
    nextIfNot:
      'Return to the usual setup and try a non-airflow local measure or measure first.',
  },
  {
    id: 'separate_top_covers',
    plainLanguageName: 'Use separate top covers for one night',
    patternFit: ['bed_heat_build_up', 'mixed_or_uncertain'],
    purpose: 'Separate insulation needs without changing the shared room.',
    oneVariableToChange: 'Use separate existing top covers for one night.',
    keepConstant: [
      'Thermostat setting',
      'Fan use',
      'Sleepwear',
      'Mattress and lower bed layers',
    ],
    steps: [
      'Choose existing covers that let each sleeper keep a comfortable amount of insulation.',
      'Keep the covers on their respective sides.',
      'Do not change anything else in the room or bed that night.',
    ],
    whatToRecord: [
      'Whether each sleeper stayed comfortable',
      'Whether heat still accumulated under your cover',
      'Whether either cover crossed into the other sleeper’s side',
    ],
    stopConditions: ['Stop if either sleeper becomes uncomfortably hot or cold.'],
    safetyNote:
      'Use familiar, breathable bedding and restore the shared setup if separate covers create discomfort or entanglement.',
    evidenceLevel: 'editorial_observation_protocol',
    sourceIds: [EDITORIAL_METHOD_SOURCE, THERMAL_COMFORT_SOURCE],
    nextIfHelps:
      'If both sleepers were consistently more comfortable, keep the same separate-cover arrangement or stop with what worked.',
    nextIfNot: 'Restore the shared cover and try a different change on one side.',
  },
  {
    id: 'prepare_one_dry_layer',
    plainLanguageName: 'Prepare one dry replacement layer',
    // Moisture recovery can be relevant alongside any primary environmental
    // pattern, but selection additionally requires a cold/shivery recovery
    // signal. Listing every pattern makes that modifier-only applicability
    // explicit to validators and downstream renderers.
    patternFit: [
      'whole_room_heat',
      'bed_heat_build_up',
      'sudden_personal_heat',
      'mixed_or_uncertain',
    ],
    purpose:
      'See whether changing one damp item affects comfort. It cannot show that a dry layer makes recovery faster.',
    oneVariableToChange:
      'After waking damp, replace only one damp sleepwear item or safely removable bedding layer with a dry equivalent.',
    keepConstant: [
      'Thermostat setting',
      'Fan use',
      'All dry bedding layers',
      'Any other comfort measures',
    ],
    steps: [
      'Place one dry replacement item within easy reach before sleep.',
      'Use it only if the corresponding item becomes damp.',
      'Record what happens to comfort and how long it takes to return.',
    ],
    whatToRecord: [
      'Dry, damp, or soaked',
      'Time needed to become comfortable',
      'Whether you became cold afterward',
    ],
    stopConditions: [
      'Stop if changing the item makes you too cold or creates an unsafe need to move around while unsteady.',
    ],
    safetyNote:
      'This is only for comfort after waking. It cannot prevent night sweats or explain their medical cause.',
    evidenceLevel: 'editorial_observation_protocol',
    sourceIds: [EDITORIAL_METHOD_SOURCE],
    nextIfHelps:
      'If the dry item felt better across the recorded nights, keep one nearby without treating that result as proof of a medical effect.',
    nextIfNot:
      'Return to the usual setup and check whether the room, bed, or local airflow gives you a clearer answer.',
  },
  {
    id: 'local_comfort_during_episode',
    plainLanguageName: 'Use one cooling step when heat begins',
    patternFit: ['sudden_personal_heat', 'mixed_or_uncertain'],
    purpose: 'Try one small cooling step without cooling the whole bedroom more.',
    oneVariableToChange:
      'Use one cooling step you already use safely, only when the heat begins.',
    keepConstant: ['Room temperature', 'Bedding', 'Sleepwear', 'The other sleeper’s setup'],
    steps: [
      'Choose one cooling step you already use safely that does not require a purchase.',
      'Use only that measure when the heat begins.',
      'Stop the measure when comfort returns rather than cooling the room further.',
    ],
    whatToRecord: [
      'How quickly comfort changed',
      'Whether you became cold afterward',
      'Whether the other sleeper was disturbed',
    ],
    stopConditions: ['Stop if the measure causes discomfort, irritation, or excessive cold.'],
    safetyNote:
      'Use only a cooling step you already know is safe. It may affect comfort without treating the underlying reason for an episode.',
    evidenceLevel: 'editorial_observation_protocol',
    sourceIds: [EDITORIAL_METHOD_SOURCE, THERMAL_COMFORT_SOURCE],
    nextIfHelps:
      'If the same step helped consistently without creating another problem, keep it as an optional comfort step and stop there.',
    nextIfNot:
      'Do not move straight to an expensive system. Record a baseline night or try a different change to the room, bed, or your side.',
  },
] as const satisfies readonly ExperimentDefinition[];

export function getExperiment(id: ExperimentId): ExperimentDefinition {
  const experiment = EXPERIMENTS.find((candidate) => candidate.id === id);
  if (!experiment) {
    throw new Error(`Unknown experiment: ${id}`);
  }
  return experiment;
}
