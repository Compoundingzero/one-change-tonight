# Design assessment

Research date: 2026-09-07

## Design thesis

The experience should feel like a dim bedside instrument: quiet, finite, legible with one eye half open, and clear about what happens next. It should not resemble a clinical intake form, wellness dashboard, magazine listicle, or luxury-product configurator.

The most important interaction quality is cognitive steadiness. The user has interrupted sleep, may be damp or shivery, and may be trying not to wake a partner. Every screen should answer one question, show one next action, and make uncertainty safe.

## Audience-state requirements

| User state at ~2 a.m.                 | Design response                                                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Low attention and poor working memory | One question per screen; short labels; progress as “Question X of about Y”; no multi-column form                           |
| Bright light feels intrusive          | Low-brightness option available immediately; true dark palette; no white flash during hydration                            |
| Partner may be asleep                 | No audio, haptics, autoplay, pop-up, or urgent animation; tap targets work quietly one-handed                              |
| Hot now, possibly cold soon           | Result separates immediate comfort from damp/cold recovery and includes a stop condition                                   |
| Has tried ordinary fixes              | Reflect the failed attempt back as evidence; never repeat “lower the thermostat” without acknowledging non-response        |
| Worried about cause                   | State the medical boundary before the assessment and at result; link to current care guidance without a fear-heavy overlay |
| Wants a purchase answer               | Show the smallest reversible experiment and “Do Not Buy Yet” before any mechanism comparison                               |

## What adjacent tools teach

From the benchmark in [tool-landscape.md](./tool-landscape.md):

- NHS 111's up-front explanation of its job and adaptive questioning creates trust even when the outcome is serious.
- MyHealthfinder's “why we ask” pattern makes sensitive questions feel purposeful.
- ACOG's tracker creates a tangible clinician-conversation artifact without diagnosing.
- NCI's visible exclusions, caveats, and methodology show that limits belong beside a result, not buried in terms.
- Four-question shopping quizzes prove how quickly a card flow can feel useful, but their product-first logic is the wrong destination.
- Dense symptom PDFs are credible but poor for a one-handed nighttime interaction; a printable artifact is better as an output than an input.

## Current product strengths observed in the repository

The present implementation already supports the intended visual/interaction direction:

- The homepage opens with the exact contradiction (“Your room is cool. You are still waking hot.”) and embeds the first assessment question for fast value.
- The assessment uses native `fieldset`, `legend`, radio/checkbox inputs, a separate Continue action, Back navigation, and “I'm not sure” choices.
- Focus moves to the next question legend and then to the result heading, reducing keyboard disorientation.
- “Why this matters” is optional rather than competing with the answer choices.
- The result hierarchy puts interpretation, clues, uncertainty, one experiment, “Do Not Buy Yet,” premium fit, check-in, care reminder, and appointment notes in a sensible order.
- A low-brightness theme exists in the full tool, and `/awake-and-hot/` defaults to the night theme with only three questions.
- Touch controls exceed the WCAG 2.2 AA minimum target size in the main question cards; visible focus treatment is strong.
- Public content is statically rendered and the interactive application is isolated, helping speed and crawlability.
- The palette avoids the stereotypical pink/purple menopause visual language while remaining warm and humane.
- Mobile tables stack, two-column layouts collapse, reduced motion is respected, and print styling exists.

## Risks and recommended refinements

These are design/QA findings, not claims that automated or assistive-technology testing has passed.

### P0: verify before launch

1. **Prevent a light-theme flash.** The saved low-brightness preference is applied in a Preact effect. On a slow device, the tool may render light before switching. Apply the saved theme before first paint or ensure the night route's inline theme always wins during hydration.
2. **Test result announcements.** The entire result container uses `aria-live="polite"` while also programmatically focusing the result heading. A screen reader may announce too much twice. Prefer focused heading plus small scoped live statuses, then verify with VoiceOver and NVDA.
3. **Test hidden navigation discoverability.** On narrow screens the header hides Patterns and Evidence. That reduces clutter but makes trust content less discoverable. Consider a compact menu or retain Evidence if it can fit without crowding.
4. **Verify the 320px/200% zoom path.** Long labels, 3+ result timeline, two buttons, and the low-brightness/privacy utility row need manual reflow checks without horizontal scroll.
5. **Check color tokens in both themes.** Automated contrast and forced-colors testing is still required for text, borders, focus rings, disabled buttons, selected cards, safety panels, and chart/timeline state.
6. **Clarify the homepage start state.** Starting immediately at question one is excellent for time to value, but the primary “Find tonight's change” action is implicit. Test whether users understand that the card is the tool and whether a short CTA label above it improves orientation.

### P1: comprehension and error recovery

- On Back, an adaptive path can change after answer edits. Verify the visible step, saved answers, and focus target remain coherent when a prior answer removes a later question.
- For multiple-choice “previous attempts,” reinforce mutually exclusive states (“Nothing yet” and “I'm not sure”) through visible text, not logic alone.
- Avoid default selections in morning check-ins that can be mistaken for saved observations. A blank “Choose…” state would better prevent accidental data.
- The two print buttons currently invoke the same browser print action. Different labels imply different outputs; either generate distinct printable scopes or use one truthful “Print plan and notes” action.
- The “Premium mechanism fit” wording may feel like a commercial score even without links. Use plain outcomes such as “Not enough reason to compare powered cooling yet” and keep the caveat immediately visible.
- Ensure local-storage failure never destroys the in-progress result on navigation without warning; the existing status is useful but should be tested with storage disabled.

### P2: visual calm and content density

- Result pages are necessarily long. Add a compact first-screen summary (“Tonight / Keep the same / Tomorrow”) before secondary explanation on mobile.
- Keep the warm warning color for care and purchasing cautions; do not use it for ordinary informational panels or it will lose meaning.
- Avoid stock photos of distressed women. The current mechanism diagrams are more distinctive, inclusive, fast, and useful for image search when paired with text equivalents.
- Preserve a maximum reading measure around 43rem and do not shrink body text to fit more comparison columns.
- The monospace numeric marks in the four-part framework are a useful navigational motif; do not turn the interface into a data dashboard.

## Target mobile nighttime flow

1. **Landing:** one-line promise, “no account / stays in browser,” visible comfort-not-diagnosis boundary.
2. **Question:** progress; one plain-language question; 3–6 large answer cards; optional rationale; Back and Continue.
3. **Result first viewport:** restrained pattern label; one-sentence interpretation; one change; what stays constant.
4. **Result continuation:** clues, uncertainty, morning observations, stop conditions, “Do Not Buy Yet,” care reminder.
5. **Later:** three-night check-in and printable clinician note; neither should block tonight's action.

The emergency-adjacent phrase “seek urgent help if you feel seriously unwell” should remain brief and non-interactive. This product must not expand it into a bespoke red-flag questionnaire.

## Component behavior specification

| Component          | Required behavior                                                              | Accessibility / cognitive-load note                                                               |
| ------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Medical boundary   | Visible before first question and in results; compact version on search pages  | Do not use a dismissible modal; boundary must remain discoverable                                 |
| Progress           | Update after confirmed navigation only                                         | “About N” is honest for adaptive paths; announce once                                             |
| Answer card        | Native input remains focusable; selection never advances automatically         | Entire card is a label; selected state must not rely on color                                     |
| Why this matters   | Toggle short rationale; default collapsed                                      | Use `aria-expanded`; no tooltip-only information                                                  |
| Back / Continue    | Stable location; Continue disabled until an answer including “not sure” exists | Disabled state needs adequate contrast and adjacent instruction                                   |
| Result summary     | Focus heading on entry; display clues and uncertainty                          | Avoid a percentage, risk meter, or diagnostic confidence visual                                   |
| One Change Tonight | Visually strongest result block                                                | Pair change with constants, record, and stop conditions                                           |
| Do Not Buy Yet     | Appears before premium comparisons                                             | Central noncommission disclosure; no retailer buttons                                             |
| Morning check-in   | No prefilled observation masquerading as user input; up to three nights        | Labels remain sentence case; save confirmation is a scoped live status                            |
| Delete local data  | Explicit effect and immediate confirmation                                     | No dark pattern; consider confirmation only if recoverability is impossible and explain that fact |
| Print              | Output has title/date, observations, boundary, source links                    | One truthful print scope unless distinct scopes are implemented                                   |

## Accessibility acceptance checks

Target WCAG 2.2 AA and test, rather than infer, at minimum:

- keyboard-only start → uncertain answer → back → edit → result → save check-in → delete;
- VoiceOver Safari on iPhone and NVDA/Firefox or NVDA/Chrome on desktop;
- 320 CSS px width and 200% browser zoom;
- text spacing overrides without clipping;
- light, low-brightness, forced-colors, and reduced-motion settings;
- focus not obscured by viewport/UI; minimum 24×24 CSS px targets with sufficient spacing, while keeping the product's stronger ~44px design target;
- status messages for storage failure, save, and deletion;
- form grouping, selected state, disabled state, and dynamic focus order;
- printed plan with readable links and no clipped panels.

WCAG is a conformance framework, not a guarantee that a tired person can use the flow. Add a five-participant low-light mobile usability check focused on comprehension, target accuracy, and recall of the selected change/constant.

## Performance assessment

The architecture is favorable: static Astro content, system font stack, local CSS, SVG diagrams, and one Preact island. The likely performance risk is the assessment island on the homepage (`client:load`) competing with the first paint. Do not claim Core Web Vitals based on architecture alone.

Launch targets follow [web.dev's current guidance](https://web.dev/articles/vitals): at the 75th percentile of real visits, LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1. Before field data exists, test representative low-end mobile profiles and prevent layout movement when the assessment hydrates.

## Final design decision

Preserve the restrained editorial system and native form controls. Spend refinement effort on the first result viewport, low-brightness first paint, truthful print behavior, scoped announcements, and mobile trust navigation—not decorative personalization or additional dashboards.
