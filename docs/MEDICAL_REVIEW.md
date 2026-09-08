# Medical-boundary and source-integrity review

Reviewed: 2026-09-07

## Scope and disposition

This is an independent source-integrity and safety-language audit of the current repository. It is **not** a credentialed clinical review, so the public label “Not independently medically reviewed” must remain in place.

No P0 issue was found: the current copy does not diagnose menopause or another condition, prescribe treatment, ask for a medical history, calculate clinical risk, or invent a medical reviewer. The P1 items below should be resolved before treating the health-adjacent corpus as publication-ready.

## Sources checked

The public claims were checked against the authoritative sources already registered:

- [NHS: Night sweats](https://www.nhs.uk/symptoms/night-sweats/): distinguishes ordinary overheating from soaking night sweats despite a cool sleeping space; advises GP review when episodes regularly wake or worry the person and with the listed accompanying symptoms.
- [ACOG: The Menopause Years](https://www.acog.org/womens-health/faqs/the-menopause-years): describes a hot flash as a sudden feeling of heat rushing to the upper body and face, and states that night sweats may wake a person and affect the next day.
- [ACOG: What can I do to help with hot flashes?](https://www.acog.org/womens-health/experts-and-stories/ask-acog/what-can-i-do-to-help-with-hot-flashes): presents personal cooling as a comfort/management strategy and directs treatment decisions to healthcare professionals.
- [The Menopause Society: Hot Flashes](https://menopause.org/patient-education/menopause-topics/hot-flashes): supports sudden upper-body heat with sweating and chills; says cooling techniques have limited solid efficacy data or have failed to show significant benefit in trials.
- [The Menopause Society: Night Sweats MenoNote](https://menopause.org/wp-content/uploads/for-women/MenoNote-Night-Sweats.pdf): describes multiple non-menopause causes, says some causes may be life-threatening, identifies symptoms requiring evaluation, and later says most night sweats are not dangerous.
- [Okamoto-Mizuno and Mizuno, 2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3427038/): a narrative review supporting effects of thermal environment on sleep and the relevance of temperature and humidity in the clothing/bedding microclimate.

## Findings

### P0 — none

No output asserts a diagnosis, a probability of disease, a medication change, a cure, or a clinically validated treatment effect.

### P1 — decontextualized reassurance can read as a safety conclusion

`src/data/sources/sources.ts:80` records “Most cases are not caused by something dangerous,” and `src/components/content/SourceList.astro:14` renders that support statement verbatim. The source first says it is important to investigate because some causes may be life-threatening and describes professional assessment; the reassurance appears later in that context. Rendering only the reassuring clause on the source page can be read as a standalone conclusion about the reader.

Acceptance criteria:

- Remove the standalone reassurance or pair it with the source's investigation/evaluation context.
- Do not imply that the site has determined that a particular episode is benign.
- Preserve the calm tone and link directly to the MenoNote.

### P1 — public mechanism claims are not supported by the cited records

The registered NHS and 2012 thermal-environment review support broad environmental distinctions and a bedding microclimate. They do not substantiate the detailed category assertions about pumps, pads, reservoirs, tubing, leaks, apps, subscriptions, durability, or current product behavior found at:

- `src/content/comparisons/air-vs-water.md:4,7,16-18`
- `src/content/comparisons/fan-vs-pad.md:4,7,16-18`
- `src/content/comparisons/passive-vs-active.md:4,7,16-18`
- `src/content/comparisons/first-touch-vs-all-night.md:4,7`
- `src/content/comparisons/one-vs-dual-zone.md:4,7,16-18`
- `src/content/guides/costs-maintenance.md:4,7,16-18`
- `src/content/guides/cool-one-side.md:7,16-18`
- `src/content/guides/failed-cooling-sheets.md:4,7`
- `src/content/guides/failed-protector.md:4,7`
- `src/content/guides/failed-topper.md:4,7`
- `src/data/core-pages.ts:102-104`

Several pages properly disclose lack of physical testing, but their source lists still imply that the cited medical/review sources support each direct answer. This conflicts with the promise at `src/data/core-pages.ts:108-112,115-117` to distinguish medical evidence, environmental mechanism, manufacturer claim, and editorial interpretation.

Acceptance criteria:

- Create claim-level records for each material product/mechanism assertion, with claim type and exact supporting source IDs.
- Support stable engineering assertions with appropriate technical or manufacturer documentation, marking manufacturer material as such; otherwise label the statement as editorial/category observation and narrow it.
- Do not use NHS or menopause guidance as apparent support for product engineering claims.
- Ensure every source shown on a page supports a claim actually present on that page.

### P1 — source validation checks existence, not support, and can hide missing records

`scripts/validate-content.ts:22-41` verifies that markdown source IDs exist, but it does not identify health claims, compare claims with a support registry, check freshness, or detect manufacturer claims presented as independent evidence. It does not iterate `src/data/core-pages.ts` at all. `src/components/content/SourceList.astro:5` silently filters an unresolved source ID instead of surfacing a build error.

Acceptance criteria:

- Validate source IDs in markdown, core pages, experiments, and any structured claim records.
- Fail publication for a health claim without an authoritative source, a missing source ID, a stale medical review, or an unlabelled manufacturer claim.
- Make unresolved source IDs fail loudly rather than disappearing at render time.
- Add a negative fixture proving that each failure class is detected.

### P1 — the moisture/recovery hypothesis exceeds the recorded evidence

The sources support sweating, chills, humidity in a sleep microclimate, and thermal effects on sleep. They do not directly establish the repeated product claim that moisture itself prolongs post-episode discomfort or that swapping one dry item will shorten recovery. The claim is used at `src/data/core-pages.ts:95-99`, `src/content/guides/why-waking-hot-then-cold.md:4,7-8`, `src/content/guides/why-waking-sweaty-cold-room.md:7`, and `src/lib/decision-engine/explanation.ts:231-237`. The experiment is appropriately cautious at `src/data/experiments/experiments.ts:211-244`, but its only evidence is the internal editorial-method source.

Acceptance criteria:

- Either add an authoritative physiology/environmental source that directly supports the recovery mechanism, or label it consistently as an editorial hypothesis being observed rather than an established effect.
- Keep the existing statement that this does not explain or prevent the original episode.
- Do not state or imply that faster comfort is a health outcome.

### P2 — categorical negative efficacy wording is stronger than the sources

`src/content/guides/failed-fan.md:7` says a fan “does not lower the medical frequency of hot flashes”; `src/content/comparisons/fan-vs-pad.md:26` and `src/content/guides/separate-or-active.md:26` say mechanisms do not prevent an episode. The Menopause Society source supports “limited solid data” or failure to show significant benefit, not a universal proof of no effect.

Acceptance criteria:

- Prefer “is not established as a treatment or way to reduce episode frequency” and “this site does not evaluate prevention.”
- Preserve the distinction between comfort and treatment without turning absence/limits of evidence into a categorical efficacy claim.

### P2 — the care-specific page omits the authoritative accompanying-symptom criteria it invokes

`src/content/guides/seek-advice.md:7` refers to “certain other symptoms,” but `:10-18` never names them. NHS currently lists very high temperature or feeling hot/cold/shivery, cough or diarrhoea, and unexplained weight loss; the MenoNote also tells readers to seek evaluation for weight loss, fever, or swollen glands. A page titled “When Repeated Night Sweats Deserve Medical Advice” should not leave its cited criterion opaque.

Acceptance criteria:

- On this dedicated care page only, reproduce a concise, clearly attributed, current summary of the official non-emergency advice criteria.
- Keep `src/content/guides/seek-advice.md:14,26` clear that the page is not emergency triage and that seriously unwell readers should seek urgent help.
- Do not invent severity thresholds or an automated red-flag algorithm.

### P2 — source metadata and evidence-status fields are inaccurate or ambiguous

- `src/data/sources/sources.ts:37` records the NHS item as updated `2023-04-05`; the live page says last reviewed `2023-11-09` and next review due `2026-11-09`.
- `src/data/sources/sources.ts:78` labels the MenoNote as published in 2026, while the PDF itself exposes a 2025 copyright and no clear publication date. The year should be verified or omitted.
- `src/data/sources/sources.ts:36,47,57,67,77,88` marks government/patient-education pages and a narrative review as `primary: true`. If this means primary evidence, it is wrong; if it means authoritative first-party documentation, the field name is misleading.

Acceptance criteria:

- Correct dates from the source itself and distinguish publication, last review/update, and access date.
- Replace the boolean with an unambiguous evidence-status taxonomy (for example, primary study, evidence synthesis, professional guidance, first-party technical documentation, editorial method).
- Do not label a narrative review as primary research.

### P3 — displayed review dates can drift from article metadata

`src/components/content/SearchArticle.astro:27` renders `<ReviewStatus />` without the article's `published` and `reviewed` values, even though those values are declared at `:15` and passed into other metadata at `:21`. All current articles happen to share the default date, so there is no present false date, but future updates can silently display the wrong review status.

Acceptance criteria:

- Pass the article dates to `ReviewStatus`.
- Add a render test using non-default dates.

## Verified boundary checks

- Truthful status remains at `src/config/site.ts:33-34`: editorial evidence review only, not independently medically reviewed.
- The fixed full boundary at `src/components/safety/MedicalBoundary.astro:9` matches the supplied brief and avoids an improvised triage algorithm.
- The reduced overnight view states that it is not triage and offers only reversible comfort actions (`src/pages/awake-and-hot/index.astro:11`; `src/components/assessment/AwakeAndHot.tsx:15-19,47-48`).
- The engine returns only environmental patterns and omits weights, percentages, probabilities, diagnoses, and clinical confidence (`src/lib/decision-engine/types.ts:128-160,239-248`; `src/lib/decision-engine/engine.ts:46-68`).
- `change_status` only adds a care modifier and never affects pattern scores (`src/lib/decision-engine/modifiers.ts:43-45`; no rule in `src/lib/decision-engine/scoring.ts`).
- The app does not ask for age, medication, diagnosis, menstrual history, cancer history, or free-text health history.
- Core copy repeatedly states that environmental comfort does not establish cause or treatment, including `src/data/core-pages.ts:29-30,70,77,84-85,98-99,109-112,134-137`.
