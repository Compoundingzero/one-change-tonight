# Final screen review

Date: 2026-09-07. This review covers the regenerated product screenshots after the fold, tracker, noncausal-language, link-label, and screenshot-focus corrections. The required views were regenerated against the deployed Railway preview and the live responsive and visual suites passed. It is a heuristic and automated review, not real-user, clinical, physical-device, or assistive-technology validation.

## Required release captures

| Capture                     | Final finding                                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `homepage-mobile-375.png`   | Pass. Privacy, the medical boundary, utilities, question heading, and the complete first answer fit the 375 × 812 initial viewport.             |
| `homepage-desktop-1440.png` | Pass. The exact-situation explanation and complete first question share the first viewport without becoming a dashboard.                        |
| `first-question.png`        | Pass. A single question, “I’m not sure,” Back, and deliberate Continue behavior are clear.                                                      |
| `partner-result.png`        | Pass. The local/shared split is respectful, specific, and subordinate to the experiment; neither sleeper is blamed.                             |
| `result-whole-room.png`     | Pass. Clues, uncertainty, one experiment, restraint, and tracker are ordered without a stray focus artifact.                                    |
| `result-bed-build-up.png`   | Pass. The removable-layer experiment is visually central and the surrounding copy does not imply medical cause.                                 |
| `result-mixed.png`          | Pass. The tool refuses a forced conclusion and records co-occurrence and duration without asking the user to attribute causality.               |
| `three-night-tracker.png`   | Pass. All three nights are marked complete, cold-afterwards observations are visible, and the next question no longer asks for two more nights. |
| `awake-and-hot-mobile.png`  | Pass. The low-brightness shortcut gives one immediate, reversible step, a stop condition, and local-only reminder controls.                     |
| `search-article-mobile.png` | Pass. The direct answer precedes the experiment and contextual CTA; related link labels render in full.                                         |

The other ten generated states were also inspected for clipping, overflow, stale focus, empty controls, brightness, and hierarchy. No material visual failure remained. Long result pages are intentional printable records, but the first experiment appears before the tracker and secondary explanation.

## Interaction and accessibility findings

- Automated regressions require the complete first answer above the fold at 320 × 700 and 375 × 812, and at desktop 1440 × 1000.
- “Question 1 of about 7” can become “about 8” after a branch-creating answer; “about” truthfully signals the adaptive path rather than a fixed inconsistency.
- Keyboard completion, result focus on transition and restoration, reduced motion, 200% zoom-equivalent reflow, high contrast, print variants, backtracking, uncertainty, storage restoration, and deletion passed browser tests.
- Seven representative axe scenarios found no serious or critical violations. This is not a claim of complete WCAG conformance or screen-reader validation.
- Network interception found no assessment, result, partner, experiment, or check-in value leaving the browser.

## Coherence and originality

The selected Inline First Question direction uses an original Room–Bed–Body–Partner model, shifted-bar mark, warm-paper/teal palette, restrained safety surface, and One Change Tonight experiment card. Cross-reference principles such as action-first entry, progressive disclosure, clear accepted-state feedback, and output prominence were translated to this health-adjacent context. No third-party screenshot, asset, source code, mascot, brand palette, typography pairing, or distinctive control composition appears in production.

The strongest remaining design risk is the length of a complete result, mitigated by a strict information order and separate print views. Further compression should be tested with real tired users rather than assumed to be better.
