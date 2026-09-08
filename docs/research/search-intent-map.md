# Search intent and content map

Research date: 2026-09-07

## The journey to support

The user's journey is not a simple informational-to-purchase funnel. The most important loop is:

`confusing awakening → environmental pattern → one reversible test → morning observation → repeat or change the question → clinician or mechanism comparison when appropriate`

The website should let a user enter at any query page, receive a useful answer without JavaScript, and move into that loop without being pushed toward a purchase.

## Intent stages

| Stage                       | Query families         | What the user needs now                                              | Best page job                                                        | Primary next step                                        |
| --------------------------- | ---------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| Contradiction / explanation | Q01, Q02, Q04–Q08, Q16 | A direct explanation of what observations can and cannot show        | Question-led guide with direct answer, uncertainty, and branch table | Relevant pattern page or `/tool/`                        |
| Failed fix                  | Q09–Q13                | Recognition that the attempt failed, not a repeat of the same advice | Failed-fix page that asks what remained unchanged                    | A different one-variable experiment                      |
| Shared-bed planning         | Q03, Q14, Q15, Q23     | Keep both sleepers comfortable and avoid noise/thermostat conflict   | Partner-pattern and one-sided how-to pages                           | Separate-layer test, then mechanism comparison if needed |
| Mechanism education         | Q17, Q19, Q21          | Stable definitions and affected-area tradeoffs                       | Neutral comparison page                                              | Assessment or narrower comparison                        |
| Commercial evaluation       | Q18, Q20, Q22, Q23     | Decide whether complexity and expense are justified                  | Purchase-readiness gate and tradeoff table, no rankings              | Costs/maintenance checklist; verify manufacturer facts   |
| Care preparation            | Q24, Q25               | Calm, authoritative guidance and a concise record                    | Care guide with visible source provenance                            | Qualified healthcare professional / printable note       |

## Canonical landing map

| Query IDs     | Canonical route                                   | Page type                     | Core promise                                                                                           | Consolidation rationale                                                             |
| ------------- | ------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Q01, Q04, Q05 | `/why/waking-sweaty-in-a-cold-room/`              | Question-led guide            | A cool room does not describe the bed microclimate or timing; test one variable without guessing cause | Same user problem and same useful response; separate URLs would be near-duplicates  |
| Q02           | `/why/waking-hot-then-cold/`                      | Question-led guide            | Separate the heat onset from damp/cold recovery                                                        | Distinct temporal intent and distinct experiment                                    |
| Q03, Q16      | `/why/hot-while-partner-is-cold/`                 | Question-led guide            | Partner state is evidence for a local rather than shared-room test                                     | Inclusive canonical answers gendered and non-gendered variants without stereotyping |
| Q06           | `/why/night-sweats-or-overheating/`               | Question-led guide            | Observe differences but do not diagnose the cause                                                      | High safety load and distinct “which is it?” intent                                 |
| Q07, Q08      | `/why/bed-hot-room-cool/`                         | Question-led guide            | Locate delayed warmth and test a removable layer before the mattress                                   | Mattress wording is a narrower expression of the same bed-build-up problem          |
| Q09           | `/failed-fixes/cooling-sheets-not-working/`       | Failed-fix guide              | Explain what sheets could affect and what the failure teaches                                          | User has already acted; troubleshooting is the page job                             |
| Q10           | `/compare/first-touch-vs-all-night-cooling/`      | Mechanism comparison          | First-touch sensation is not the same question as sustained heat movement                              | Requires a durable definition, not another failed-sheet page                        |
| Q11           | `/failed-fixes/fan-not-helping/`                  | Failed-fix guide              | Test reach, ambient dependence, moisture, timing, and noise                                            | Distinct failed mechanism                                                           |
| Q12           | `/why/thermostat-not-helping/`                    | Question-led failed-fix guide | Hold the room steady and test a smaller affected zone                                                  | Distinct whole-room non-response and partner implications                           |
| Q13           | `/failed-fixes/mattress-protector-trapping-heat/` | Component troubleshooting     | Safely isolate one removable layer                                                                     | Specific safety/utility caveats justify a page                                      |
| Q14, Q23      | `/guides/how-to-cool-one-side-of-a-bed/`          | How-to guide                  | Start with separate insulation; make noise a gating constraint                                         | Quietness is a modifier, not enough unique purpose for another landing page         |
| Q15           | `/guides/different-sleep-temperatures/`           | Couples planning guide        | Define what may differ on each side and what remains shared                                            | Broader than “one person is hot tonight”                                            |
| Q17           | `/compare/cooling-bed-vs-bedroom/`                | Mechanism comparison          | Match the intervention area to room/bed/partner observations                                           | Clear category-level comparison intent                                              |
| Q18           | `/compare/bed-fan-vs-water-pad/`                  | Mechanism comparison          | Compare under-cover airflow with contact-surface heat exchange                                         | Purchase-near, named-category intent                                                |
| Q19           | `/compare/air-vs-water-bed-cooling/`              | Mechanism comparison          | Compare ambient dependence, sensation, noise, upkeep, and side coverage                                | Broader technical comparison than Q18                                               |
| Q20           | `/compare/one-zone-vs-dual-zone/`                 | Mechanism comparison          | Pay for two active zones only when two active settings are needed                                      | Distinct configuration decision                                                     |
| Q21           | `/compare/passive-vs-active-bed-cooling/`         | Mechanism comparison          | Separate nonpowered layers from powered air/heat movement                                              | Foundational vocabulary page                                                        |
| Q22           | `/guides/is-active-bed-cooling-worth-it/`         | Decision guide                | Gate premium fit behind repeated observations and household burden                                     | “Worth it” requires a decision framework, not a winner                              |
| Q24           | `/guides/what-to-record-for-a-clinician/`         | Care-preparation guide        | Produce a short factual summary without a diagnostic score                                             | Concrete output and local/print privacy value                                       |
| Q25           | `/guides/when-to-seek-medical-advice/`            | Safety/care guide             | Use current authoritative wording and link to qualified care                                           | Highest safety intent; must stay distinct from environmental pages                  |

## Safety by intent

| Level         | Applies to                            | Required treatment                                                                                                                                                    |
| ------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Highest       | Q25                                   | Current authoritative care wording; no automated urgency logic; prominent link to care; independent medical review required before using a “medically reviewed” label |
| High          | Q01, Q02, Q04–Q06, Q11, Q12, Q16, Q24 | Direct non-diagnostic boundary near the answer; explain that environmental comfort does not establish or treat cause; source list visible                             |
| Medium-high   | Q18, Q19, Q22                         | No treatment/efficacy language; clearly label manufacturer specifications and lack of first-hand testing; include care bridge                                         |
| Medium        | Q03, Q07–Q10, Q13–Q15, Q17, Q21, Q23  | Avoid biological and material-performance overclaims; make uncertainty and stop conditions explicit                                                                   |
| Low-to-medium | Q20                                   | Household comfort framing; still avoid medical inference and unsupported “better” claims                                                                              |

## Entry-page contract

Every indexable search landing page should expose the following in server-rendered HTML:

- one-sentence direct answer;
- one-sentence uncertainty;
- “this fits / may not fit” observations;
- a visible room–bed–timing–moisture–partner decision table;
- one experiment with change, constants, morning record, and stop conditions;
- “Do Not Buy Yet” guidance;
- medical boundary and review status where health-adjacent;
- visible, descriptive links to a broader concept, next question, assessment, evidence, and relevant authoritative source.

This structure makes the page independently useful to a person, a classic crawler, and a retrieval system. It is not “AI chunking”; it is human-readable organization.

## Internal journey patterns

### Cold room, hot awakening

`/why/waking-sweaty-in-a-cold-room/` → `/room-bed-body-partner/` → `/tool/` → pattern result → `/three-night-experiment/`

Add a parallel care bridge from the landing page and result to `/guides/when-to-seek-medical-advice/` for new, worsening, frequent, severe, or concerning symptoms.

### Failed fix

`failed-fix page` → `what the failure rules down` → `/tool/#failed-fix` → `different experiment` → `/three-night-experiment/`

Only after a repeated local constraint remains should the result link to `/compare/`.

### Partner mismatch

`/why/hot-while-partner-is-cold/` → `/patterns/partner-temperature-mismatch/` → `/guides/how-to-cool-one-side-of-a-bed/` → `/compare/one-zone-vs-dual-zone/`

The free separate-cover experiment must appear before powered solutions.

### Mechanism comparison

`/compare/passive-vs-active-bed-cooling/` → `/guides/is-active-bed-cooling-worth-it/` → one of `/compare/air-vs-water-bed-cooling/`, `/compare/bed-fan-vs-water-pad/`, or `/compare/one-zone-vs-dual-zone/` → `/guides/bed-cooling-costs-and-maintenance/`

Each comparison should also link back to `/tool/` because the mechanism is only useful after the affected area is known.

### Care preparation

`/guides/when-to-seek-medical-advice/` ↔ `/guides/what-to-record-for-a-clinician/` → current authoritative external guidance.

Environmental tracking can support memory, but it must never be framed as a requirement to delay or qualify for care.

## Measurement without collecting answers

Use Search Console and Bing Webmaster Tools for query/page/impression/index coverage once the owner verifies the production site. Do not place assessment answers, result patterns, symptom frequency, experiment choices, or care flags in URLs, analytics events, logs, pixels, or third-party scripts.

Useful page-level measures that do not require health-answer telemetry include index coverage, canonical selection, Core Web Vitals, inbound query families, landing-page exits, and broken links. If the owner later enables analytics, a separate privacy review must approve a minimal event taxonomy before code changes.
