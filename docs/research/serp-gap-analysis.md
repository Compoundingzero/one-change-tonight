# SERP gap analysis

Research date: 2026-09-07

## Executive finding

The search gap is not another article about every possible cause of sweating or another ranked list of “cooling” products. It is a calm bridge between those two result sets: determine which environmental area is worth testing, change one reversible variable, and preserve a clear route to professional care.

Across the 25 query families, broad health queries commonly returned government or clinic explainers mixed with generic cause lists and forums. Bed and product queries skewed toward manufacturer pages, affiliate/editorial rankings, and anecdotal forums. Couples queries were rich in compromise advice but thin on one-sided, noise-aware experimentation. Exact mechanism queries had the weakest independent evidence and the heaviest commercial framing.

The product's strongest defensible contribution is therefore a transparent decision process—not a new medical explanation and not a product winner.

## Sampling method and limitations

The team ran one qualitative, non-personalized web-search sample for each required query family on 2026-09-07. We reviewed returned titles, snippets, page structures, and a subset of full pages. This is a manual intent sample, not keyword-volume research or a fixed record of Google rankings.

- No search volume, click-through rate, ranking position, or market size is claimed.
- “High,” “moderate,” and “low apparent recurrence” describe how repeatedly the theme and close variants appeared across the sample; they are not traffic estimates.
- Results can differ by location, language, device, history, and hour. The primary launch market must be rechecked in an incognito mobile browser.
- Search-result observations are dated snapshots. Medical statements are separately grounded in the authoritative sources in [the source register](./source-register.md).
- Recent forum results helped identify language and frustrations only. They are not health or product-performance evidence.

The normalized row-level observations are in [query-map.csv](./query-map.csv).

## Gap by intent cluster

| Cluster                             | Query IDs          | What currently dominates                                                                  | Recurring weakness                                                                                                            | Page job for One Change Tonight                                                                                                 |
| ----------------------------------- | ------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Cool-room contradiction             | Q01, Q04, Q05, Q06 | NHS/clinic definitions, broad cause lists, general sleep advice, mattress content, forums | Ambient room temperature is treated as the entire environment; users are left choosing between “just too hot” and a diagnosis | Separate room, bed, timing, moisture, and partner observations; allow mixed/uncertain; give one safe test and a care link       |
| Hot → cold sequence                 | Q02                | General medical explainers, thermoregulation pages, forums                                | Onset and recovery are collapsed; low-authority pages speculate about causes                                                  | Explain the observable sequence, identify damp recovery as a possible amplifier, and refuse causal inference                    |
| Bed heat build-up                   | Q07, Q08, Q13      | Mattress rankings, seller education, lifestyle advice, forums                             | Search encourages replacement before isolating removable layers; product terms substitute for mechanisms                      | Show the bed-layer stack and test the smallest safely removable layer first                                                     |
| Failed common fixes                 | Q09–Q12            | “Best” lists, repeated generic tips, brand explainers, forums                             | The failed attempt is ignored; the answer repeats the same intervention or sells an upgrade                                   | Treat non-response as useful evidence and route to the next distinct environmental question                                     |
| Partner mismatch and one-sided need | Q03, Q14–Q16, Q23  | Couples advice, bedding brands, premium systems, forums                                   | Gender stereotypes, thermostat compromise, and premature dual-zone recommendations; noise is rarely a first-class constraint  | Model two sleepers and shared versus local variables; begin with separate insulation; add noise and disturbance checks          |
| Mechanism and purchase evaluation   | Q17–Q22            | Manufacturers, commercial comparison sites, review publishers, owner forums               | Category definitions drift; conflicts and subscriptions are unevenly disclosed; medical effectiveness is implied              | Define mechanisms, show tradeoffs and uncertainty, gate premium fit behind observed need, and rank no products                  |
| Care preparation                    | Q24–Q25            | Government/clinic advice, symptom trackers, cause lists, videos                           | Fear-heavy lists, inconsistent specificity, and over-collection; environmental observations are rarely packaged for a visit   | Offer a concise local-only record, quote/paraphrase current authoritative care guidance, and link out rather than invent triage |

## What the current results do well

The site should not pretend competitors are uniformly poor. Several useful patterns deserve preservation:

- The [NHS night-sweats page](https://www.nhs.uk/symptoms/night-sweats/) gives a short definition and clear professional-care route.
- [ACOG's symptom tracker](https://www.acog.org/womens-health/health-tools/menopause-symptom-tracker) asks about frequency, duration, onset, and whether symptoms are worsening, then frames the record as preparation for an ob-gyn conversation.
- The [INTEGRIS cooling-sheets explainer](https://integrishealth.org/resources/on-your-health/2025/march/do-cooling-bed-sheets-really-work) explicitly distinguishes a temporary cool sensation from overnight behavior.
- Some 2026 mechanism comparisons explain air, water, and passive surfaces in plain language. Their commercial framing is the weakness, not necessarily their information architecture.
- Well-designed public tools such as [MyHealthfinder](https://odphp.health.gov/myhealthfinder/takegoodcare) explain why they ask sensitive questions and turn a short input set into a prioritized next-action list.

## Repeated answer failures

### 1. Cause inventory without decision support

Broad health pages can be medically responsible and still leave a 2 a.m. user with no small action. Secondary publishers often make this worse by listing many serious possibilities before establishing what “night sweats” means. One Change Tonight should answer the immediate environmental question first, show the medical boundary immediately afterwards, and reserve detailed cause education for authoritative outbound sources.

### 2. “Keep the room cool” as a closed loop

The sampled result set often repeats room-cooling advice even for “AC on” or “thermostat not helping” queries. This does not address a cool-room/warm-bed combination, a sudden episode, moisture after sweating, or a cold partner. The unique response is to hold the thermostat constant and test a smaller zone.

### 3. Product category collapse

“Cooling” is used for first-touch fabric sensation, breathability, moisture handling, under-cover airflow, circulated-water surfaces, and whole-room cooling. Search users are asked to compare prices before they understand that these mechanisms act on different areas. The site should define the affected area and mechanism before mentioning product categories.

### 4. Failed fix treated as a shopping signal

Queries about failed sheets, fans, and thermostats commonly lead to a more expensive recommendation. The product should instead treat the failure as evidence: what remained unchanged, what new discomfort appeared, and what variable was never isolated?

### 5. The second sleeper disappears

Couples results often advise compromise or make gender claims. A partner who is comfortable or cold is an environmental observation. It can make additional whole-room cooling a weaker first experiment. This is useful without implying a medical cause for either person.

### 6. Evidence types are blended

Manufacturer specifications, staff product tests, owner anecdotes, and medical guidance frequently appear on one page without a strong visual boundary. The site must label each source type. A specification can describe sound or maintenance claims; it cannot establish treatment of hot flashes or night sweats.

### 7. Noise and upkeep appear too late

“Quiet one-sided cooling” is narrow but high-value. Direct results were thin and dominated by seller/review language. “Whisper quiet” is meaningless without measurement distance, operating mode, room floor, and whether the sound character disturbed the partner. Maintenance, leak response, subscriptions, return terms, and room heat also belong before a premium recommendation.

## Page-level opportunity and consolidation

The 25 families map to 19 canonical landing pages. Six variants should consolidate because their intent can be fully satisfied on a stronger page:

- Q04 and Q05 consolidate into `/why/waking-sweaty-in-a-cold-room/`.
- Q08 consolidates into `/why/bed-hot-room-cool/`.
- Q16 consolidates into the inclusive `/why/hot-while-partner-is-cold/`.
- Q23 becomes a noise-sensitive section of `/guides/how-to-cool-one-side-of-a-bed/`.
- Closely related pages that do remain separate must have different jobs: Q09 troubleshoots a failed sheet; Q10 explains first-touch versus sustained behavior.

This is deliberate protection against doorway pages. Google's current generative-search guidance says not to create a separate page for every wording variation and says ordinary SEO/people-first principles remain the foundation ([Google](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)).

## Priority order

### P0: launch-defining

1. Q01 cold room but sweating
2. Q06 night sweats or overheated bedroom
3. Q03/Q16 hot sleeper with cold partner
4. Q07/Q08 bed heat build-up
5. Q12 thermostat did not help
6. Q24–Q25 clinician record and care boundary

These pages establish the product's distinctive room–bed–timing–moisture–partner framework and carry the highest trust/safety load.

### P1: failed fixes and mechanism education

Q09–Q11 and Q13 should capture people who already tried ordinary fixes. Q17, Q21, and Q22 then explain affected area, active/passive categories, and purchase readiness.

### P2: narrower commercial comparisons

Q18–Q20 and Q23 are valuable after the user has evidence of a persistent local need. Keep them neutral, specification-aware, and subordinate to the assessment and experiment loop.

## Content rules derived from the sample

Every query landing page should:

1. Answer the literal query in the first visible content block.
2. State the unresolved uncertainty in the same block.
3. Show what observations distinguish the relevant environmental branches.
4. Offer one safe, reversible change and name what must remain constant.
5. State “Do Not Buy Yet” before any category escalation.
6. Display the medical boundary and a current source list on health-adjacent pages.
7. Link to one broader model, one logical next question, the assessment, and the evidence page.
8. Avoid claiming a diagnosis, probability, treatment effect, clinical validation, product test, or medical review that did not occur.

## Monitoring plan

- Re-sample P0 query families quarterly and after material NHS, ACOG, or Menopause Society updates.
- Re-sample commercial/mechanism families every six months and quarterly when quoting current product specifications or policies.
- Use Search Console query/page data after production verification to decide whether a consolidated variant needs more on-page language—not automatically a new URL.
- Record screenshots/top-result categories, locale, device, and signed-in state in the next research cycle so SERP comparisons become reproducible.
- Never convert third-party SEO estimates into claimed demand without naming the tool, date, market, and limitations.
