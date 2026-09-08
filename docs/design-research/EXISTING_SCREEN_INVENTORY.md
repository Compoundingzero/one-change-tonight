# Existing screen inventory

Snapshot: 2026-09-07.

| Surface                     | Implemented route/state | Evidence available                    | Notes                                                              |
| --------------------------- | ----------------------- | ------------------------------------- | ------------------------------------------------------------------ |
| Homepage                    | `/`                     | mobile and desktop screenshots        | Headline, privacy, medical boundary and first question lead.       |
| Tool entry                  | `/tool/`                | app code and e2e suite                | Dedicated assessment entry; behavior should match homepage island. |
| First question              | assessment initial      | `first-question.png`                  | Six options including uncertainty; Continue disabled initially.    |
| Selected answer             | assessment state        | `selected-answer.png`                 | Definite border, fill and radio state.                             |
| Uncertain answer            | assessment state        | `i-am-not-sure.png`                   | Explicit non-forcing path.                                         |
| Conditional question        | assessment state        | `conditional-question.png`            | Adaptive branch evidence.                                          |
| Validation error            | assessment state        | `error-state.png`                     | Error treatment captured; association remains a QA check.          |
| Restored state              | assessment state        | `restored-local-state.png`            | Local persistence captured.                                        |
| Whole-room result           | private result          | `result-whole-room.png`               | Experiment-centered result.                                        |
| Bed build-up result         | private result          | `result-bed-build-up.png`             | Removable-layer experiment path.                                   |
| Sudden personal-heat result | private result          | `result-sudden-personal.png`          | Non-diagnostic wording required.                                   |
| Mixed result                | private result          | `result-mixed.png`                    | Uncertainty-safe baseline observation plan.                        |
| Partner modifier            | private result          | `partner-result.png`                  | Cooperative two-sleeper split.                                     |
| New/worsening reminder      | result modifier         | `frequent-new-worsening-reminder.png` | Calm care reminder, not triage logic.                              |
| Three-night tracker         | result/local state      | empty, one-night and full screenshots | Short experiment sequence, not permanent dashboard.                |
| Awake-and-hot               | `/awake-and-hot/`       | mobile screenshot                     | Reduced low-brightness action path.                                |
| Search article              | catch-all content route | mobile screenshot                     | Direct answer, observations, experiment, limitation and sources.   |
| Core trust pages            | catch-all content route | route/data inventory                  | Evidence, sources, methods, privacy, policies and about/contact.   |
| Compare pages               | catch-all content route | content inventory                     | Static, semantic comparisons.                                      |
| 404                         | `/404`                  | route file                            | Status behavior owned by deployment QA.                            |

There are no committed low-fidelity concept routes. The selected direction is implemented directly; the three concepts are documented in `CONCEPT_EVALUATION.md` so discarded explorations do not leak into production.
