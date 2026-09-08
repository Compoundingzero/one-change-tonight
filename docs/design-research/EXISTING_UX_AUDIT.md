# Existing UX audit

Date reviewed: 2026-09-07. Evidence comes from the current code structure and final screenshots; statements about behavior beyond those artifacts are marked for verification.

## What already works

The homepage behaves like a tool. At 375 px the brand is small, the headline and one-sentence promise are immediate, the local-only trust line is visible, and the first question is answerable without a separate start screen. The medical boundary is prominent but calm. On desktop the question card is centered rather than stretched, while the Room–Bed–Body–Partner explanation uses the additional width below it.

Question screens use a fieldset/legend, large radio-card targets, a distinct selected state, an explicit “I’m not sure,” Back and Continue, and a non-gamified “about” progress label. Continue remains visually disabled until a choice is made. This is materially closer to an understandable decision task than a quiz funnel.

The result hierarchy is coherent: pattern summary, clues, what it does not mean, the strongest bordered “One Change Tonight” output, Do Not Buy Yet, partner guidance when applicable, mechanism fit, the three-night check-in, care reminder, appointment note and print actions. The one-change card is the visual center and the copy repeatedly separates comfort from diagnosis or treatment.

The awake-and-hot state is the strongest nighttime view: near-black surface, restrained cyan, one immediate action, a stop condition, a private reminder and a delete-data action. It removes marketing and navigation clutter.

Search pages answer first, then provide observations, a small experiment, purchase restraint, limitations, contextual tool entry, next-question links, claim classification and sources. This supports human scanning and self-contained retrieval without hiding the tool behind SEO prose.

## Friction and risk

- On 375 px, the homepage safety block plus utility links make the first question begin lower than ideal. The question remains in the initial long capture, but a true first-viewport check should ensure at least its heading and first choice appear on common 700–844 px heights.
- The homepage currently shows “Question 1 of about 8” in one captured state while another shows “about 7.” Conditional totals are acceptable, but the wording must remain deterministic for the same state.
- Utility links above the card are visually similar and may compete with the question. “Delete local data” should remain available without becoming the dominant pre-task action.
- Result pages are long. The experiment card is placed correctly, but a sticky or explicit “Return to tonight’s change” link may help without turning the page into a dashboard.
- The partner result uses a two-column partner split and a premium-fit acceptance checkbox. On small screens, verify DOM order, label association and that premium language cannot be mistaken for a product recommendation.
- The system font stack names Inter without bundling it; the browser will normally fall through to a local UI font. This is fast, but typography should be documented as a system stack rather than implying a shipped Inter asset.
- Several very small all-caps eyebrow labels are legible in screenshots but should be rechecked at 200% zoom.

## Accessibility observations

Positive evidence: semantic fieldsets are present in CSS/code structure, radio controls remain visible, focus tokens are high contrast, reduced-motion rules exist, mobile tables have a planned stacked treatment, and print styles remove navigation. Final screenshots show no color-only selection state.

Verification still owned by QA: complete keyboard traversal, focus movement after question changes, live progress announcements, error association, 200% zoom, forced-colors behavior, and the full result/tracker at 320 px.

## Recommendation

Preserve the current “Inline First Question” direction. Refine vertical economy and result navigation only after behavioral tests; do not introduce a full-screen creative canvas, dashboard, mascot, gradient spectacle, dense inspector, or pre-assessment marketing gate.
