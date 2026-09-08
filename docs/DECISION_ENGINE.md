# Decision engine

## Purpose and boundary

The decision engine chooses the smallest useful sleep-environment experiment from a short set of observations. It describes environmental patterns only. It does not diagnose menopause or any other condition, predict a medical cause, recommend treatment, or calculate clinical risk.

The implementation is pure TypeScript under `src/lib/decision-engine/`. It has no access to the network, browser storage, time, randomness, UI components, or a language model. The public result deliberately omits raw weights, percentages, probability, and confidence scores.

## Inputs and adaptive path

All nine question definitions exist in `src/data/questions/questions.ts`, but no route shows all nine. Six stable primary questions are followed by one adaptive discriminator:

1. Wake experience
2. Co-sleeper state
3. Heat location
4. Previous attempts
5. Frequency
6. New or worsening status
7. Either after-episode experience or whole-room cooling effect

Noise sensitivity is the sole optional eighth screen and appears only when an airflow plan or sleeping-partner constraint is plausible. Sudden or damp waking prioritizes the after-episode question. Gradual, bed, or whole-room heat—or a recorded room-cooling attempt—prioritizes the whole-room-effect question. This resolves the brief's nine defined IDs against its hard maximum of seven primary screens plus one optional screen. Every answer is optional; an explicit “I’m not sure” is also available on every screen.

The engine accepts partial input because adaptive flows can legitimately omit a question. `validateAnswers()` rejects unknown keys, unsupported values, malformed multiple-choice data, and a combination of `nothing_yet` or `not_sure` with another previous attempt.

## Primary patterns

The engine scores three environmental hypotheses and uses `mixed_or_uncertain` as the conservative fallback:

- `whole_room_heat`
- `bed_heat_build_up`
- `sudden_personal_heat`
- `mixed_or_uncertain`

Weights indicate relative environmental fit only. They are not probabilities or medical evidence.

| Observation                              | Whole room | Bed build-up | Sudden personal heat |
| ---------------------------------------- | ---------: | -----------: | -------------------: |
| Heat developed gradually                 |         +2 |           +2 |                   -2 |
| Bed became hotter over time              |         -1 |           +4 |                   -2 |
| Whole bedroom felt hot                   |         +4 |           -2 |                   -2 |
| Sudden wave of heat                      |         -2 |           -2 |                   +5 |
| Woke damp or soaked                      |          0 |            0 |                   +1 |
| Partner also hot                         |         +3 |           -2 |                   -1 |
| Partner comfortable                      |         -1 |           +1 |                   +1 |
| Partner cold                             |         -2 |           +1 |                   +2 |
| Stayed hot afterwards                    |         +1 |           +1 |                   -1 |
| Heat did not ease                        |         +1 |           +1 |                   -1 |
| Became comfortable afterwards            |          0 |            0 |                   +1 |
| Became cold or shivery afterwards        |         -2 |            0 |                   +3 |
| Heat underneath or in mattress           |         -1 |           +4 |                   -1 |
| Heat under covers                        |          0 |           +3 |                   -1 |
| Heat in upper body, face, or chest       |         -2 |           -1 |                   +3 |
| Heat throughout room                     |         +4 |           -2 |                   -2 |
| Damp or clammy skin                      |          0 |            0 |                   +1 |
| Whole-room cooling helped a lot          |         +3 |           -1 |                   -2 |
| Whole-room cooling helped somewhat       |         +1 |           +1 |                    0 |
| Whole-room cooling did not solve it      |         -2 |            0 |                   +2 |
| Whole-room cooling made partner too cold |         -2 |            0 |                   +3 |
| Bedding/surface change already tried     |          0 |           +1 |                    0 |

The last rule is deliberately weak. “Tried” does not prove failure, and the assessment does not collect detailed outcome data for every prior attempt.

## Clarity rules

`determinePrimaryPattern()` returns `not_enough_information` when fewer than two pattern observations are informative, at least three pattern observations explicitly say “not sure,” the leading score is below 3, or the leading pattern lacks two independent supporting observations. It returns `mixed_pattern` when the two leading scores are fewer than 2 points apart, a material contradiction is present, or a putative leader has multiple strong rival observations. This prevents a single high-weight response from producing a falsely clear result.

The initial material-conflict rules are:

- Sudden onset together with room-wide heat and either strong room-cooling benefit or a hot partner.
- A whole-room-hot report while the partner was cold.
- Bed heat over time together with upper-body concentration and cold or shivery recovery.

These rules favor uncertainty over a forced conclusion. Any future threshold or weight change requires a documented fixture, editorial review, and regression tests.

## Modifiers

Modifiers are direct context flags, never diagnoses:

| Modifier                          | Trigger                                                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `moisture_may_prolong_discomfort` | A direct damp/soaked or damp/clammy observation **and** an explicit report of becoming cold or shivery afterwards. Dampness alone does not establish prolonged recovery. |
| `one_sided_solution_needed`       | Partner comfortable/cold, or whole-room cooling made the partner too cold.                                                                                               |
| `whole_room_cooling_has_failed`   | Whole-room cooling did not solve the problem or made the partner too cold.                                                                                               |
| `noise_sensitive_household`       | Quiet is “very important.”                                                                                                                                               |
| `frequent_sleep_disruption`       | Three or more affected nights per week.                                                                                                                                  |
| `new_or_worsening_pattern`        | User explicitly answers yes to the new/worsening question.                                                                                                               |

## Experiment selection

Every experiment changes or observes one variable, lists what stays constant, includes morning observations and stop conditions, requires no purchase, and distinguishes comfort from treatment. Selection order is deterministic:

1. The paired dampness-plus-cold-recovery signal selects `prepare_one_dry_layer` so recovery can be observed.
2. Mixed or insufficient information selects `measure_first`.
3. Whole-room heat selects `observe_room_and_both_sleepers`.
4. Bed heat selects `change_one_bed_layer`; a one-sided bed pattern after a prior surface change may select `separate_top_covers` if that has not been tried.
5. Sudden personal heat with a one-sided need selects `directed_side_airflow` only if a fan has not already been tried and quiet is not critical.
6. Other sudden-personal paths select `local_comfort_during_episode`.

`previous_attempts` records exposure, not verified failure. The engine avoids repeating an identical fan experiment, but it does not label other attempts as failures without supporting data.

The source IDs used by the experiment records are `editorial-one-variable-experiment-method` and `environmental-thermal-comfort-mechanisms`. The central source register must define those IDs before content validation is enabled.

## Do Not Buy Yet

The warning is specific to the selected situation:

- Bed build-up: test removable layers before replacing the mattress.
- One-sided need: do not escalate whole-room cooling first.
- Prior cooling-sheet use: distinguish first-touch coolness from continuous heat removal.
- Shared whole-room heat: do not pay for dual-zone control before testing the shared constraint.
- Mixed/uncertain: measure first before accepting active-system complexity.

No warning ranks a product or directs a purchase.

## Premium mechanism fit

The default is `premium_active_cooling_not_yet_justified`. An active one-sided system may be worth comparing only when all are true:

- Sleep disruption occurs at least three nights per week.
- A one-sided constraint exists.
- Whole-room cooling failed or made the partner too cold.
- At least two lower-burden approaches were tried.
- The room otherwise appears reasonable for the other sleeper.

The strongest state, `personal_or_dual_zone_active_system_fits_environmental_constraint`, additionally requires an explicit post-result acknowledgement of possible noise, maintenance, and expense. That acknowledgement is intentionally outside the seven-plus-one assessment. Even the strongest state describes mechanism fit and must not be rendered as an instruction to buy.

## Care reminder

The calm care reminder appears when the pattern is frequent, new or worsening, involved waking damp or soaked, or contains an explicit uncertain answer. The message is fixed and does not perform red-flag triage:

> This tool examines the sleep environment and what you can test for comfort. It cannot identify the medical cause of night sweats. New, worsening, frequent, severe, or concerning symptoms deserve a conversation with a qualified healthcare professional. Seek urgent help if you feel seriously unwell.

All results separately state that the environmental pattern cannot establish the medical cause and that comfort cooling does not treat the underlying reason for an episode.

## Test contract

Unit tests cover the supplied fixtures: clear sudden/one-sided, clear whole-room, clear bed build-up, moisture recovery, materially conflicting evidence, and empty answers. They also cover validation, clue-to-answer fidelity, sparse input, contradictory evidence, single-high-weight regressions, hidden weights, premium-tradeoff gating, the seven-plus-one route cap, uncertainty availability, fan-attempt exclusion, and prohibited probability-style output. An exhaustive semantic enumeration covers 24,696 representative answer combinations.

Changes to a score, tie threshold, conflict condition, modifier, experiment priority, premium gate, or care-reminder trigger require a test demonstrating the intended user-visible effect.
