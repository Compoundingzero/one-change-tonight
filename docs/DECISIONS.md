# Decision record

## Architecture

- Astro static output keeps public answers in initial HTML and limits hydration to two Preact tools.
- Astro 5 is pinned because the available Node 20 runtime does not meet Astro 7’s Node requirement.
- A tiny dependency-free static server supplies compression, caching, correct 404 status, and response security headers on Railway.

## Product

- The chosen interaction is an inline, single-question utility, not a dashboard, chatbot, quiz, or sprawling content portal.
- Rules are deterministic, typed, tested, and separate from UI components. Close scores and contradictory evidence resolve to uncertainty.
- “Measure first” and low-burden tests precede active cooling comparisons.
- Partner differences are modeled as a shared constraint, never a blame state.

## Trust

- Preview is the default deployment state. Production preflight is blocked on owner identity, contact, jurisdiction, and domain.
- Analytics and outbound browser connections are disabled by default.
- No affiliate system, prices, product rankings, fake reviewer, clinical-validation claim, or runtime language model exists.
