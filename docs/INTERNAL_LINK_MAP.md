# Internal link map

Reviewed: 2026-09-07

## Linking objective

Every public search landing page should be useful alone and also make the next decision obvious. Links should follow the user's reasoning—not push them down a sales funnel:

`question → broader pattern → private assessment → one experiment → morning observation → next environmental question or appropriate care`

Use the exact canonical, trailing-slash routes below. Anchor text should describe the destination question. Do not create links containing assessment answers, result patterns, or health-adjacent state.

## Primary navigation and hubs

| Route                      | Role                                       | Required prominent outbound links                                                                                               | Required contextual inbound links                                                    |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `/`                        | Promise and fastest entry                  | Embedded assessment or `/tool/`; `/awake-and-hot/`; `/room-bed-body-partner/`; `/evidence/`; `/privacy/`                        | Brand/home link from every page                                                      |
| `/tool/`                   | Core private utility                       | `/methodology/`; `/medical-boundaries/`; `/privacy/`; `/three-night-experiment/`; result-relevant pattern/comparison/care pages | Every indexable query page; `/how-it-works/`; `/room-bed-body-partner/`; `/compare/` |
| `/awake-and-hot/`          | Reduced low-brightness, noindex night flow | `/tool/`; `/medical-boundaries/`; home                                                                                          | Homepage only; do not add to sitemap or broad sitewide nav                           |
| `/how-it-works/`           | Method overview                            | `/tool/`; `/room-bed-body-partner/`; `/three-night-experiment/`; `/methodology/`; `/privacy/`                                   | Header; homepage; result explanation                                                 |
| `/room-bed-body-partner/`  | Observation-model hub                      | All five pattern pages; `/tool/`; representative why/failed-fix guides                                                          | Homepage; all question-led guides; comparison hub                                    |
| `/three-night-experiment/` | Experiment loop hub                        | `/tool/`; `/methodology/`; `/guides/what-to-record-for-a-clinician/`; `/privacy/`                                               | Every query article's next-question block; result page                               |
| `/compare/`                | Neutral mechanism hub                      | All six comparison pages; costs/maintenance; active-worth-it; `/tool/`                                                          | Result premium-fit section; mechanism pages; homepage/evidence where relevant        |

## Question-led and failed-fix cluster

| Landing route                                     | Primary inbound anchors/sources                                                         | Required contextual outbound sequence                                                                                                                                         |
| ------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/why/waking-sweaty-in-a-cold-room/`              | Home feature; `/why/night-sweats-or-overheating/`; cold-room query variants Q01/Q04/Q05 | `/room-bed-body-partner/` (“separate room, bed, body, and partner observations”) → `/why/waking-hot-then-cold/` → `/tool/#cold-room` → `/guides/when-to-seek-medical-advice/` |
| `/why/waking-hot-then-cold/`                      | Cold-room guide; sudden-personal-heat pattern; moisture pattern                         | `/patterns/sudden-personal-heat/` → `/patterns/moisture-and-recovery/` → `/tool/#hot-then-cold` → care guide                                                                  |
| `/why/night-sweats-or-overheating/`               | Cold-room guide; medical-boundary page; care guide                                      | `/room-bed-body-partner/` → `/tool/` → `/guides/what-to-record-for-a-clinician/` → `/guides/when-to-seek-medical-advice/`                                                     |
| `/why/bed-hot-room-cool/`                         | Bed pattern; cold-room guide; failed protector/topper pages                             | `/patterns/bed-heat-build-up/` → `/failed-fixes/mattress-protector-trapping-heat/` → `/compare/first-touch-vs-all-night-cooling/` → `/tool/#bed-heat`                         |
| `/why/thermostat-not-helping/`                    | Cold-room guide; failed whole-room page; bed-vs-bedroom comparison                      | `/failed-fixes/whole-room-cooling-failed/` → `/compare/cooling-bed-vs-bedroom/` → partner pattern when applicable → `/tool/#failed-fix`                                       |
| `/why/hot-while-partner-is-cold/`                 | Home framework; couples guide; Q03/Q16 variants                                         | `/patterns/partner-temperature-mismatch/` → `/guides/different-sleep-temperatures/` → `/guides/how-to-cool-one-side-of-a-bed/` → `/tool/#partner-temperature`                 |
| `/failed-fixes/cooling-sheets-not-working/`       | Bed-heat guide; first-touch comparison                                                  | `/compare/first-touch-vs-all-night-cooling/` → `/patterns/bed-heat-build-up/` → `/tool/#failed-fix`                                                                           |
| `/failed-fixes/fan-not-helping/`                  | Thermostat-failed page; bed-fan comparison                                              | `/compare/cooling-bed-vs-bedroom/` → `/compare/bed-fan-vs-water-pad/` only after need is established → `/tool/#failed-fix`                                                    |
| `/failed-fixes/mattress-protector-trapping-heat/` | Bed-heat guide; cooling-sheets failed page                                              | `/patterns/bed-heat-build-up/` → `/why/bed-hot-room-cool/` → `/tool/#failed-fix`                                                                                              |
| `/failed-fixes/cooling-topper-still-hot/`         | Bed-heat and cooling-sheets pages                                                       | `/patterns/bed-heat-build-up/` → `/compare/passive-vs-active-bed-cooling/` → `/tool/#failed-fix`                                                                              |
| `/failed-fixes/whole-room-cooling-failed/`        | Thermostat-not-helping page; bed-vs-bedroom comparison                                  | `/why/thermostat-not-helping/` → `/patterns/partner-temperature-mismatch/` or bed pattern → `/tool/#failed-fix`                                                               |

## Pattern cluster

| Pattern route                             | Link to it from                                                               | Link from it to                                                                              |
| ----------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `/patterns/whole-room-heat/`              | `/room-bed-body-partner/`; night-sweats-vs-overheating; bed-vs-bedroom        | `/tool/`; `/compare/cooling-bed-vs-bedroom/`; `/three-night-experiment/`; care guide         |
| `/patterns/bed-heat-build-up/`            | `/room-bed-body-partner/`; bed-hot-room-cool; sheet/protector/topper failures | `/tool/`; layer-specific failed-fix page; first-touch comparison; `/three-night-experiment/` |
| `/patterns/sudden-personal-heat/`         | `/room-bed-body-partner/`; hot-then-cold; cold-room guide                     | `/tool/`; moisture pattern; care guide; `/evidence/`                                         |
| `/patterns/partner-temperature-mismatch/` | `/room-bed-body-partner/`; hot-partner-cold; thermostat failure               | `/tool/`; different-temperatures; one-side guide; one-vs-dual-zone                           |
| `/patterns/moisture-and-recovery/`        | `/room-bed-body-partner/`; hot-then-cold; cold-room guide                     | `/tool/`; clinician record; three-night experiment; care guide                               |

Every pattern page must say that the pattern is an environmental description, not a medical cause.

## Couples and one-sided cluster

| Route                                         | Link to it from                                                               | Link from it to                                                                                                                                  |
| --------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/guides/different-sleep-temperatures/`       | Hot-partner-cold guide; partner pattern; home/framework                       | `/guides/how-to-cool-one-side-of-a-bed/`; `/guides/separate-bedding-or-active-cooling/`; `/tool/#partner-temperature`                            |
| `/guides/how-to-cool-one-side-of-a-bed/`      | Hot-partner-cold; partner pattern; different-temperatures; quiet Q23 language | `/guides/separate-bedding-or-active-cooling/`; `/compare/one-zone-vs-dual-zone/`; `/compare/bed-fan-vs-water-pad/`; `/tool/#partner-temperature` |
| `/guides/separate-bedding-or-active-cooling/` | Different-temperatures; one-side guide; passive-vs-active                     | `/compare/passive-vs-active-bed-cooling/`; `/guides/is-active-bed-cooling-worth-it/`; `/tool/`                                                   |

The first linked action in this cluster must remain separate existing insulation, not powered dual-zone hardware.

## Mechanism and purchase-readiness cluster

| Route                                        | Required broader/back link                                               | Recommended next question                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `/compare/cooling-bed-vs-bedroom/`           | `/room-bed-body-partner/`                                                | `/compare/passive-vs-active-bed-cooling/`; `/tool/#mechanisms`                                |
| `/compare/passive-vs-active-bed-cooling/`    | `/compare/` and `/patterns/bed-heat-build-up/`                           | `/compare/first-touch-vs-all-night-cooling/`; `/guides/is-active-bed-cooling-worth-it/`       |
| `/compare/first-touch-vs-all-night-cooling/` | `/failed-fixes/cooling-sheets-not-working/`                              | `/compare/passive-vs-active-bed-cooling/`; `/tool/#mechanisms`                                |
| `/compare/air-vs-water-bed-cooling/`         | `/compare/passive-vs-active-bed-cooling/`                                | `/compare/bed-fan-vs-water-pad/`; `/guides/bed-cooling-costs-and-maintenance/`                |
| `/compare/bed-fan-vs-water-pad/`             | `/compare/air-vs-water-bed-cooling/`                                     | `/guides/bed-cooling-costs-and-maintenance/`; `/tool/#mechanisms`                             |
| `/compare/one-zone-vs-dual-zone/`            | `/guides/different-sleep-temperatures/`                                  | `/guides/is-active-bed-cooling-worth-it/`; `/guides/bed-cooling-costs-and-maintenance/`       |
| `/guides/is-active-bed-cooling-worth-it/`    | `/compare/passive-vs-active-bed-cooling/` and result premium-fit section | `/guides/bed-cooling-costs-and-maintenance/`; relevant air/water or zone comparison; `/tool/` |
| `/guides/bed-cooling-costs-and-maintenance/` | All purchase-near comparison pages                                       | `/compare/`; `/guides/is-active-bed-cooling-worth-it/`; `/editorial-policy/`                  |

Each commercial-adjacent page must link back to `/tool/` or a pattern page before linking deeper into another comparison. This preserves the rule “mechanism fit before product complexity.”

## Care and evidence cluster

| Route                                     | Link to it from                                                                   | Link from it to                                                                          |
| ----------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `/guides/what-to-record-for-a-clinician/` | Results; three-night experiment; moisture/cold-room pages; care guide             | `/guides/when-to-seek-medical-advice/`; `/sources/`; current ACOG tracker/visit guidance |
| `/guides/when-to-seek-medical-advice/`    | Every health-adjacent query/pattern page; results care reminder; medical boundary | `/guides/what-to-record-for-a-clinician/`; `/sources/`; NHS/ACOG/TMS authoritative pages |
| `/evidence/`                              | Header; every article; comparisons; result                                        | `/sources/`; `/methodology/`; `/editorial-policy/`; `/medical-boundaries/`               |
| `/sources/`                               | Evidence; every page's source module; footer/sitemap                              | Source URLs; `/corrections/`; `/editorial-policy/`                                       |
| `/methodology/`                           | Tool; how-it-works; evidence; results                                             | `/tool/`; `/evidence/`; decision-engine documentation when public-safe                   |
| `/medical-boundaries/`                    | Tool intro/result; care pages; footer                                             | Care guide; sources; contact/corrections                                                 |

External authoritative links should open normally in the same browsing context unless usability testing demonstrates a real need otherwise. Do not add `nofollow` to genuine editorial citations.

## Governance and owner pages

| Route                | Minimum inbound source                    | Key outbound                                                                   |
| -------------------- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| `/privacy/`          | Header, tool utility, footer              | Methodology; contact; local delete instructions                                |
| `/editorial-policy/` | Footer, sitemap                           | Sources; corrections; medical boundaries                                       |
| `/corrections/`      | Footer, source register, editorial policy | Contact; affected source/page links in each entry                              |
| `/about/`            | Footer or header/about context; evidence  | How it works; editorial policy; contact                                        |
| `/contact/`          | Footer, corrections, privacy              | Owner-approved channels only; warn against sending personal health information |
| `/terms/`            | Footer                                    | Medical boundaries; privacy; contact                                           |
| `/sitemap/`          | Footer                                    | Every public canonical route grouped by task, not alphabetically only          |

Do not index owner-placeholder details in production. Production validation must block launch until real organization/legal/contact/jurisdiction values are supplied.

## Anchor-text rules

- Prefer questions and outcomes: “Why can a cool room and warm bed coexist?”
- Avoid generic “Learn more,” “Click here,” and repeated exact-match keyword anchors.
- Use one concise anchor for each destination within a section; do not stack five near-identical links.
- Make the assessment anchor action-specific: “Find tonight's change,” with nearby “No account; answers stay in this browser.”
- Care anchors should name the action: “When to talk with a healthcare professional,” not alarmist wording.
- Product-comparison anchors name mechanisms and tradeoffs, never “best” or a brand winner.

## Orphan and depth targets

- Every indexable page: at least two contextual inbound links, excluding footer/sitemap.
- Every priority query landing page: reachable within two clicks from `/` through a relevant hub.
- Every narrow comparison: reachable within three clicks and only after a broad mechanism/need page.
- No page should depend solely on the XML or human sitemap for discovery.
- Run the built-site link checker after every route/frontmatter change; separately inspect that links resolve to the production canonical trailing-slash form.

## Link QA checklist

- No links to assessment-answer URLs or fragments except the generic context tokens already defined by the tool.
- Context fragments (`#cold-room`, `#failed-fix`, and similar) change introductory wording only and do not create canonical variants.
- No affiliate parameters, retailer links, redirect trackers, or shortened commercial URLs.
- External sources match the source register and have a review date.
- Links remain distinguishable without color and have meaningful accessible names.
- Mobile sticky/fixed elements do not obscure anchor targets or keyboard focus.
- Deleted or consolidated pages 301 to the closest canonical; internal links are updated rather than relying on redirects.
