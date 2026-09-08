# Decision logic and local-state audit

Reviewed: 2026-09-07

## Disposition

The core evaluator is pure and deterministic, input validation is strict, ties fall back to uncertainty, and the direct supplied fixtures are represented in unit tests. No P0 issue was found. The P1 findings below concern user-reachable inconsistencies, premium escalation under uncertainty, and retention/deletion behavior.

## Findings

### P0 — none

No nondeterministic or diagnostic execution path was found.

### P1 — a mixed/not-enough result can still recommend comparing premium active cooling

`determinePremiumFit()` at `src/lib/decision-engine/recommendations.ts:136-158` does not receive or gate on the primary pattern or clarity. `src/lib/decision-engine/engine.ts:56-60` therefore computes premium fit independently of a `mixed_or_uncertain` result.

Reproduction:

```text
wake=not_sure; partner=partner_cold; after=not_sure; location=not_sure;
whole-room effect=did_not_solve; attempts=lower_thermostat,open_window;
frequency=five_or_more_nights

primary=mixed_or_uncertain
clarity=not_enough_information
experiment=measure_first
premium=active_one_sided_system_may_be_worth_comparing
```

That conflicts with the conservative rule that insufficient information selects baseline measurement and with the supplied empty/uncertain fixture's “No premium recommendation” intent.

Acceptance criteria:

- Any `mixed_or_uncertain` or `not_enough_information` result must return `premium_active_cooling_not_yet_justified`.
- Non-default premium fit must require a clear environmental constraint.
- Add tests for mixed-by-uncertainty, mixed-by-conflict, and clear-pattern controls.

### P1 — hidden answers from a previous adaptive branch continue to affect the result

`src/components/assessment/AssessmentApp.tsx:135-148` replaces only the answer being edited. When the branch changes, it never removes the now-hidden discriminator. The branch is selected at `src/data/questions/questions.ts:185-204`, while the evaluator consumes every retained answer at `src/lib/decision-engine/engine.ts:36-60`.

A user who first answered the whole-room-effect branch, goes back, and changes the wake answer to `sudden_wave` will see `after_episode` instead, but the hidden whole-room answer remains. In a runtime reproduction, the same visible sudden-path answers produced:

```text
without hidden whole_room_cooling_effect:
  modifiers=one_sided_solution_needed,frequent_sleep_disruption
  premium=premium_active_cooling_not_yet_justified

with stale hidden value partner_became_too_cold:
  modifiers=one_sided_solution_needed,whole_room_cooling_has_failed,frequent_sleep_disruption
  premium=active_one_sided_system_may_be_worth_comparing
```

Acceptance criteria:

- When `selectPatternQuestion()` changes, remove the answer belonging to the inactive discriminator before evaluation and persistence.
- Define a canonical “answers active for this path” sanitizer and use it for scoring, saving, and result explanations.
- Add an end-to-end test: finish one branch, go back, switch the wake answer, finish the other branch, and assert that the hidden answer has no effect.

### P1 — the supplied sudden/premium pathway is unreachable through the adaptive UI

`src/data/questions/questions.ts:185-192` always chooses `after_episode` for a sudden or moisture-led wake, before checking recorded room-cooling attempts at `:194-200`. Premium comparison requires `whole_room_cooling_has_failed` at `src/lib/decision-engine/recommendations.ts:141-158`, but that modifier can only come from `whole_room_cooling_effect` (`src/lib/decision-engine/modifiers.ts:25-30`). The supplied sudden/partner-cold/premium fixture passes both discriminators directly to the engine, but a normal user never sees the whole-room-effect question on that route.

Acceptance criteria:

- Make the premium-relevant whole-room outcome observable on the sudden partner path while retaining the seven-plus-one cap, or redesign the input so failure/conflict is captured without an unreachable field.
- Add an integration test that completes the supplied sudden/premium fixture through UI-visible questions only.
- Ensure every public premium state has at least one reachable UI path.

### P1 — the strongest premium state has no UI path

The engine correctly requires `acceptsNoiseMaintenanceAndExpense` for the strongest state (`src/lib/decision-engine/recommendations.ts:178-191`), but `src/components/assessment/AssessmentApp.tsx:91-96,151-160` always calls `evaluateAssessment(answers)` without preferences. No post-result control collects that explicit acceptance. The third promised premium classification is therefore dead product behavior.

Acceptance criteria:

- Add a separate, optional post-result tradeoff acknowledgement, not a health question.
- Re-evaluate with the explicit preference only after user action.
- Add tests proving default cannot reach the strongest state and explicit acceptance can.

### P1 — moisture always overrides both pattern confidence and experiment fit

Any damp/clammy signal creates the modifier at `src/lib/decision-engine/modifiers.ts:6-15`. `selectExperiment()` then chooses `prepare_one_dry_layer` before checking mixed or clear primary pattern at `src/lib/decision-engine/recommendations.ts:41-55`. Exhaustive runtime evaluation found clear `whole_room_heat` results paired with the dry-layer experiment. This can make the headline say the shared room is the useful first question while the action tests something else; it also selects an experiment whose declared pattern fit excludes whole-room heat (`src/data/experiments/experiments.ts:211-214`).

Acceptance criteria:

- Require a recovery-specific signal (for example damp/clammy plus cold/recovery difficulty) before moisture supersedes the primary experiment, or present recovery as a secondary modifier without replacing a clear primary test.
- Ensure every selected experiment's `patternFit` includes the returned pattern or explicitly model modifier-only applicability.
- Add cases for clear whole-room+damp, clear bed+damp, damp-only uncertainty, and damp+cold recovery.

### P1 — morning check-ins can silently record a symptom-free night

`initialCheckIn()` preselects `0` awakenings, `dry`, no cold, under ten minutes, and no partner disturbance at `src/components/assessment/AssessmentApp.tsx:66-77`. The form can be saved without touching a field at `:328-340`, and `saveCheckIn()` persists those values at `:189-197`. That creates false observations and can contaminate the appointment memory aid or consistency summary.

Acceptance criteria:

- Use explicit unselected/unknown draft values and require deliberate confirmation for each recorded field, or provide a clearly labelled “no event occurred” action.
- Do not infer zero/dry/no from lack of interaction.
- Add a test that an untouched form cannot create a check-in.

### P1 — deletion failures are ignored and successful deletion immediately recreates a key

`deleteLocalState()` returns whether removal succeeded (`src/lib/storage/local-storage.ts:96-111`), but `deleteData()` ignores `outcome.deleted` at `src/components/assessment/AssessmentApp.tsx:177-183`. The autosave effect at `:121-129` then persists the returned blank state, so a successful deletion leaves `one-change-tonight:state:v1` present. A runtime simulation confirmed `deleteLocalState()` followed by the component's autosave pattern recreates that key. This contradicts “clears every ... storage key” at `src/data/core-pages.ts:143` and “clears ... immediately” at `src/components/assessment/AssessmentApp.tsx:369`. If removal throws, the UI also discards in-memory state without warning while the old sensitive state may remain restorable.

Acceptance criteria:

- Suppress autosave after explicit deletion until the user starts or changes a new plan.
- Check `outcome.deleted`, verify known keys are absent, and show a clear failure state if deletion did not complete.
- Reload after success and assert no current, legacy, or auxiliary key exists and no answers restore.
- Test a throwing `removeItem` implementation as well as the happy path.

### P1 — migration leaves a second legacy record behind

`src/lib/storage/local-storage.ts:53-56` uses `.find()` to choose one legacy key and `:69-72` removes only that one after migration. If both supported legacy keys exist, the second remains with its assessment data. A runtime reproduction left `one-change-tonight:state:v0` after successfully migrating the other legacy key.

Acceptance criteria:

- After a successful migration, remove every known legacy key, not only the selected source key.
- Add a fixture with both legacy keys populated and assert only the current key remains.
- Define deterministic precedence when current and multiple legacy records coexist.

### P2 — mixed results can still receive specific one-sided purchase guidance

`selectDoNotBuyGuidance()` checks the one-sided modifier at `src/lib/decision-engine/recommendations.ts:105-110` before applying the generic uncertainty fallback at `:129-133`. Thus an uncertain result may say “do not add stronger whole-room cooling” even when the engine cannot distinguish the next useful pattern.

Acceptance criteria:

- For `mixed_or_uncertain`, lead with measure-first guidance unless a safety rule independently requires otherwise.
- Add a mixed result with `partner_comfortable` and assert that no unearned pattern-specific conclusion appears.

### P2 — article observation tables assign meaning by array position, not content

`src/components/content/SearchArticle.astro:53-56` maps the first observation to room, the second to bed, and every later observation to timing/recovery. On mechanism and care articles those positions contain unrelated facts (noise, maintenance, clinician concerns), so the rendered “What to examine first” column is frequently false.

Acceptance criteria:

- Store the paired “first question” explicitly with each observation or omit the generated column.
- Render-test at least one care article, one product-mechanism article, and one partner article.

### P2 — “allows unanswered” is documented but not implemented in the UI

Every question declares `allowsUnanswered: true`, and `docs/DECISION_ENGINE.md:21` says every answer is optional. `src/components/assessment/AssessmentApp.tsx:199-200,256-260` disables Continue until a choice exists. “I'm not sure” is present, so uncertainty is available, but the stated skip behavior is not.

Acceptance criteria:

- Either add a skip action that removes the answer, or change the schema/documentation to say an explicit uncertainty selection is required.
- Test back/skip so old answers are removed rather than retained.

### P2 — coverage omits the highest-risk cross-module paths

The checked-in unit tests cover the six direct fixtures, validation, route length, fan/noise exclusion, single-key migration, expiry, and normal deletion. They do not cover mixed premium gating, adaptive branch changes, UI reachability of premium states, moisture-vs-primary precedence, untouched check-ins, deletion failure/autosave, or multiple legacy keys (`tests/unit/decision-engine.test.ts:11-198`; `tests/unit/questions.test.ts:16-79`; `tests/unit/storage.test.ts:73-145`).

Acceptance criteria:

- Add one regression test for every P1 reproduction above.
- Add property-style tests asserting identical input yields identical output and no mixed result produces a non-default premium state.

### P3 — mutually exclusive validation text omits one rejected case

`src/lib/decision-engine/validation.ts:101-110` rejects both `nothing_yet` and `not_sure` when combined with other attempts, but the message mentions only “Nothing yet.”

Acceptance criteria:

- Name both exclusive choices in the validation message and cover each with a test.

## Verified checks

- Pure/deterministic boundary: `evaluateAssessment()` has no storage, time, network, model, or random dependency (`src/lib/decision-engine/engine.ts:23-68`).
- Determinism red-team: all 5,400 combinations of the five pattern dimensions were evaluated twice; zero output differences occurred.
- Direct result distribution in that matrix: 1,106 whole-room, 1,205 bed build-up, 1,348 sudden personal heat, and 1,741 mixed/uncertain. All four outcomes are reachable.
- Tie behavior: score ties and gaps below two return `mixed_or_uncertain`; the stable lexical sort does not leak a tied winner (`src/lib/decision-engine/scoring.ts:264-283`).
- Information threshold: fewer than two informative pattern observations, three explicit pattern uncertainties, or a leading score below three return not-enough-information (`src/lib/decision-engine/scoring.ts:195-212,238-275`).
- Unknown input: unknown keys, invalid enum values, malformed multi-answer values, and exclusive attempt combinations fail validation (`src/lib/decision-engine/validation.ts:28-121`). A runtime unknown-key probe threw `InvalidAssessmentAnswersError`.
- Partner behavior: partner-also-hot increases the whole-room score; partner comfortable/cold creates a one-sided modifier; partner-too-cold also records failed whole-room cooling (`src/lib/decision-engine/scoring.ts:60-75`; `src/lib/decision-engine/modifiers.ts:17-30`).
- New/worsening status does not influence primary scoring; it only adds a care reminder modifier.
- Question definitions contain nine unique IDs, all have `not_sure`, and enumerated adaptive routes had no duplicate IDs and a maximum length of eight (seven primary plus noise).
- Storage normalization allowlists fields, caps check-ins at three unique nights, rejects invalid enums, applies a 90-day TTL, and drops unknown fields (`src/lib/storage/state.ts:82-166,215-234`).
- The standalone storage deletion function removes current, legacy, and auxiliary keys on the normal path (`src/lib/storage/local-storage.ts:96-111`); the integration findings above concern the caller and multi-key migration.

## Test note

The repository's `pnpm test` command could not be independently re-run in this shell because installed dependencies were absent (`vitest: command not found`). The deterministic matrix and storage reproductions above were executed from temporary bundled copies under `/private/tmp`; no product code was changed.
