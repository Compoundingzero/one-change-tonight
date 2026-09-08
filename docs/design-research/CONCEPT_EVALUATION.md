# Concept evaluation

This was an expert heuristic simulation, not real-user research. Three materially different concepts were evaluated before selecting the implemented direction. No discarded concept route is shipped.

## Concept A — Inline First Question

Homepage state: a small mark, one exact-situation headline, one sentence, local-only trust, concise medical boundary, then Question 1. Middle questions retain the same frame. “I’m not sure” is a full radio choice. Results move from pattern/clues to a dominant experiment card; partner mismatch adds a cooperative two-column split; Do Not Buy Yet is a visible sand callout; the three-night preview is a four-step line. Mobile is one column. Low-brightness uses near-black green and restrained cyan.

Core hypothesis: removing a start screen outweighs the vertical cost of placing trust and safety above the first question.

## Concept B — Threshold Workspace

Homepage state: one promise and a single “Find tonight’s change” button. The button enters a dedicated full-screen workspace with a minimal brand/Exit/theme header. Questions, uncertainty and results use the same semantics as A, but the experiment occupies almost the entire result viewport before clues. Partner guidance appears as a local/shared switch; Do Not Buy Yet follows the experiment; tracker preview appears after an explicit “Plan three nights” action. Mobile and low-brightness feel private and app-like.

Core hypothesis: a deliberate threshold reduces distraction and creates privacy. Cost: one extra action delays value and the homepage cannot demonstrate how the tool works.

## Concept C — Four-Layer Evidence Path

Homepage state: first question beside a quiet four-layer Room–Bed–Body–Partner strip. Each answer gradually highlights one layer; uncertainty leaves layers muted. Middle questions visibly add short observation chips. Result state turns the strip into the explanation, then presents the experiment; partner mismatch divides the fourth layer; Do Not Buy Yet and tracker follow. Mobile collapses the strip above each question; low-brightness reduces fills to outlines.

Core hypothesis: continuous visual causality increases understanding. Cost: it risks looking like a diagnostic score, adds motion/complexity and competes with the question at 375 px.

## Required-state coverage

| State                   | A                       | B                          | C                                     |
| ----------------------- | ----------------------- | -------------------------- | ------------------------------------- |
| Homepage/first question | Same viewport           | CTA then workspace         | Question plus live four-layer strip   |
| Middle question         | Stable card             | Full-screen card           | Card plus accumulating chips          |
| Uncertainty             | Full named answer       | Full named answer          | Leaves model intentionally unresolved |
| Result                  | Summary then experiment | Experiment-first workspace | Model explanation then experiment     |
| Partner mismatch        | Cooperative split       | Local/shared switch        | Partner layer divides                 |
| One Change Tonight      | Strong bordered card    | Near-full viewport output  | Card under framework                  |
| Do Not Buy Yet          | Visible after card      | Visible after card         | Visible after card                    |
| Three-night preview     | Four-step sequence      | Separate next-step reveal  | Four-layer-linked sequence            |
| Mobile                  | One column              | Full-screen one column     | Extra model height                    |
| Low brightness          | Token swap              | Most immersive             | Outlined model reduces glare          |

## Heuristic scoring (1–5)

| Criterion                        |   A |   B |   C |
| -------------------------------- | --: | --: | --: |
| Time to first answer             |   5 |   3 |   4 |
| 390 px clarity                   |   5 |   5 |   3 |
| One-handed use                   |   5 |   5 |   3 |
| Uncertainty without false result |   5 |   5 |   4 |
| Medical-boundary clarity         |   5 |   4 |   3 |
| Privacy reassurance              |   5 |   5 |   4 |
| Partner pathway                  |   5 |   4 |   5 |
| Output prominence                |   4 |   5 |   3 |
| Static/search usefulness         |   5 |   3 |   4 |
| Accessibility simplicity         |   5 |   5 |   3 |
| Total / 50                       |  49 |  43 |  36 |

## Task simulations

- **Dark bedroom, low patience:** A exposes an answer immediately. B adds a click. C asks the user to parse a model while tired.
- **Several “I’m not sure” answers:** all can return a baseline observation plan, but C visually suggests unresolved “missing” layers and therefore feels less complete. A communicates uncertainty in plain language.
- **User hot, partner cold, thermostat failed:** A reaches a one-sided modifier and cooperative split without presenting products. B also succeeds but delays the first clue. C explains the two sides well but risks overinterpretation.
- **Back and change an answer:** A/B use ordinary question history and preserved radio state. C additionally has to reverse animated model state, increasing failure surface.
- **Keyboard/screen reader:** A/B have direct fieldset/legend order. C requires a verbose text equivalent for every visual update.
- **Search landing entry:** A can answer the query then mount the same contextual first question. B tends to redirect to a generic workspace. C can contextualize but makes the page busier.

Concept A wins. One compatible idea from C is retained only as a quiet explanatory framework below the action and as a plain clue list in results. B informs the reduced header and low-brightness awake-and-hot page, not the main entry gate.
