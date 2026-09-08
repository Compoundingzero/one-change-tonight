# Design-research baseline

Snapshot: 2026-09-07. This is a greenfield implementation, not a redesign of inherited product UI. The target directory was initially empty and was not a Git repository. At this snapshot it is an uncommitted Astro 5 project on `main`; all project files are untracked and there is no historical design to preserve.

## Current implementation

- Stack: Astro static output, strict TypeScript, Preact islands, plain CSS tokens, pnpm, Vitest, Playwright and axe-core.
- Public shells: `src/pages/index.astro`, `src/pages/tool/index.astro`, `src/pages/awake-and-hot/index.astro`, `src/pages/[...slug].astro`, XML sitemap, robots and 404.
- Interaction: `AssessmentApp.tsx` contains the private assessment/result/tracker flow; `AwakeAndHot.tsx` contains the reduced nighttime path.
- Logic: the decision engine is separated under `src/lib/decision-engine/`; storage code is under `src/lib/storage/`; questions and experiments are structured data.
- Design system: `src/styles/tokens.css`, `src/styles/global.css`, and assessment-specific CSS. The implemented palette is warm paper, near-black green ink, muted teal, and restrained sand; low-brightness mode replaces those with near-black green surfaces and pale cyan text.
- Content: a catch-all static content route draws from structured guide/comparison/core-page data. Health-adjacent claims and sources are structured separately.
- Tests: unit tests cover decision logic, experiments, storage and static serving. Playwright suites cover app behavior, accessibility, visual states and performance.
- Existing visual evidence: 20 final-state PNGs under `docs/design-research/screenshots/final/`, including the required homepage, question, result, tracker, awake-and-hot and search-page states.

## Build state at handoff

This document records structure, not a claim that every release check passed in this research subtask. The parent release track owns the authoritative build, typecheck, unit, end-to-end, accessibility, SEO and deployment results. No app files were changed by this research track.

## Preserve

Preserve the deterministic engine, local-only storage boundary, semantic fieldset/radio structure, visible safety notice, answer uncertainty path, responsive single-column question card, low-brightness mode, and the result order that puts the experiment ahead of deeper explanation. Do not replace those merely for visual novelty.

## Known baseline risks

- There is no recoverable Git checkpoint yet because there are no commits.
- The mobile homepage is long because it combines the first question with framework and trust content.
- The full result is necessarily long; hierarchy and jump behavior matter more than arbitrary shortening.
- Final screenshots prove selected visual states, not every keyboard, zoom, network, or screen-reader behavior.
